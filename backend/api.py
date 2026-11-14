import os
import re
from flask import Flask, request, make_response, jsonify
from flask_restful import Resource, Api
from supabase import create_client
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app, origins=[re.compile(r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$")], supports_credentials=True)
app.url_map.strict_slashes = False
load_dotenv()
client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_PUBLISHABLE_KEY"))


def logged_in(table_name, session_token):
    if table_name == "students":
        response = client.table(table_name).select("id, name, university_id, created_at, email, gender, nationality, date_of_birth, phone_number, national_id, department:departments!department_id(*)").eq("session_token", session_token).execute()
    else:
        response = client.table(table_name).select("id, name, created_at, email, gender, phone_number, department:departments!department_id(*)").eq("session_token", session_token).execute()
    if response.data:
        return {"status": 1, "data": response.data[0]}
    return {"status": 0, "message": "Please log in first."}

def get_finished_courses(student_id):
    all_courses = client.table("enrollments").select("*").eq("student_id", student_id).execute()
    finished = []
    for course in all_courses.data:
        if (course["grade"] != "F" and course["grade"] != "FR" and course["grade"] != "FL" and course["grade"] != "W" and course["grade"] != "WF" and course["grade"]):
            finished.append(course["course_id"])
    return finished

def get_registrable_courses(student_id):
    student_data = client.table("students").select("id, name, university_id, created_at, email, gender, nationality, date_of_birth, phone_number, national_id, department:departments!department_id(*)").eq("id", student_id).execute().data[0]
    finished_courses = get_finished_courses(student_id)
    all_dept_courses = client.table("courses").select("*").match({
        "department_id": student_data["department"]["id"],
        "registrable": True
    }).execute().data
    registrable_courses = []
    for course in all_dept_courses:
        if course["id"] not in finished_courses:
            registrable = True
            if course["prerequisites"]:
                for prerequisite in course["prerequisites"]:
                    if int(prerequisite) not in finished_courses:
                        registrable = False
                if registrable:
                    registrable_courses.append(course)
            else:
                registrable_courses.append(course)
    return registrable_courses

def get_enrolled_courses(student_id):
    enrollments = client.table("enrollments").select("""
    grade, section, exam_date, exam_location, exam_seat, enrollment_date,
    course:courses!course_id(
        id, code, name, type,
        department:departments!department_id(code, name),
        schedule!course_id(*),
        professor:staff!professor_id(name, email)
    )
    """).eq("student_id", student_id).execute()
    return enrollments.data

def get_course(course_id):
    return client.table("courses").select("*").eq("id", course_id).execute().data[0]


class Login(Resource):
    def post(self, role):
        requestBody = request.get_json(silent=True) or request.values
        university_id = int(requestBody.get("university_id") or 0)
        email = str(requestBody.get("email") or "")
        password = str(requestBody.get("password") or "")
        try:
            if (role == "student"):
                response = client.table("students").select("*").eq("university_id", university_id).execute()
            elif (role == "staff"):
                response = client.table("staff").select("*").eq("email", email).execute()
            elif (role == "admin"):
                response = client.table("admins").select("*").eq("email", email).execute()
            else:
                return make_response(jsonify({"message": f"Invalid type \"{role}\""}), 400)
            
            if response.data:
                if (password == response.data[0]["password"]):
                    token = make_response(jsonify({"message": "session_token cookie is sent successfully."}), 200)
                    token.set_cookie("session_token", response.data[0]["session_token"])
                    return token
                return make_response(jsonify({"message": "Username or password is incorrect."}), 400)
            else:
                return make_response(jsonify({"message": "Username or password is incorrect."}), 400)
        except:
            return make_response(jsonify({"message": "Error, maybe credentials params are not provided."}), 400)

class GetStudentData(Resource):
    def post(self):
        is_logged_in = logged_in("students", request.cookies["session_token"])
        if is_logged_in["status"]:
            return make_response(jsonify(is_logged_in["data"]), 200)
        return make_response(jsonify({"message": "Please log in first."}), 400)

class GetEnrollments(Resource):
    def post(self):
        is_logged_in = logged_in("students", request.cookies["session_token"])
        if is_logged_in["status"]:
            return make_response(jsonify(get_enrolled_courses(is_logged_in["data"]["id"])), 200)
        return make_response(jsonify({"message": "Please log in first."}), 400)

class GetRegistrableCourses(Resource):
    def post(self):
        is_logged_in = logged_in("students", request.cookies["session_token"])
        if is_logged_in["status"]:
            return get_registrable_courses(is_logged_in["data"]["id"]), 200
        return make_response(jsonify({"message": "Please log in first."}), 400)

class EditEnrolledCourses(Resource):
    def post(self):
        requestBody = request.get_json(silent=True) or request.values
        course_id = int(requestBody.get("course_id"))
        section = int(requestBody.get("section"))
        try:
            is_logged_in = logged_in("students", request.cookies["session_token"])
            if is_logged_in["status"]:
                enrolled_courses = get_enrolled_courses(is_logged_in["data"]["id"])
                enrolled_ids = []
                registrable_courses = get_registrable_courses(is_logged_in["data"]["id"])
                registrable_ids = []
                course = get_course(course_id)
                for course in enrolled_courses:
                    enrolled_ids.append(course["course"]["id"])
                for course in registrable_courses:
                    registrable_ids.append(course["id"])
                print(registrable_ids)
                if course_id not in enrolled_ids and course["registrable"] and course_id in registrable_ids:
                    try:
                        client.table("enrollments").insert({
                            "course_id": course_id,
                            "student_id": is_logged_in["data"]["id"],
                            "section": section
                        }).execute()
                        return make_response(jsonify({"message": "Enrolled successfully"}), 200)
                    except:
                        return make_response(jsonify({"message": "Error, couldn't register the course."}), 500)
                else:
                    return make_response(jsonify({"message": "Course is already registered or not registrable"}), 400)
            return make_response(jsonify({"message": "Please log in first."}), 400)
        except:
            return make_response(jsonify({"message": "Error, maybe course_id and section params are not provided."}), 400)
    
    def delete(self):
        requestBody = request.get_json(silent=True) or request.values
        course_id = int(requestBody.get("course_id"))
        section = int(requestBody.get("section"))
        is_logged_in = logged_in("students", request.cookies["session_token"])
        if is_logged_in["status"]:
            enrolled_courses = get_enrolled_courses(is_logged_in["data"]["id"])
            enrolled_ids = []
            for course in enrolled_courses:
                enrolled_ids.append(course["course"]["id"])
            if course_id in enrolled_ids and get_course(course_id)["registrable"]:
                try:
                    client.table("enrollments").delete().match({
                        "student_id": is_logged_in["data"]["id"],
                        "course_id": course_id,
                        "section": section
                    }).execute()
                    return make_response(jsonify({"message": "Enrollment deleted successfully"}), 200)
                except:
                    return make_response(jsonify({"message": "Error, couldn't delete the enrollment."}), 500)
            else:
                return make_response(jsonify({"message": "Course not registered or not registrable"}), 400)
        return make_response(jsonify({"message": "Please log in first."}), 400)

class GetAssignedCourses(Resource):
    def post(self):
        is_logged_in = logged_in("staff", request.cookies["session_token"])
        if is_logged_in["status"]:
            courses = client.table("courses").select("id, code, name, department:departments!department_id(code, name), credits, type, prerequisites").eq("professor_id", is_logged_in["data"]["id"]).execute()
            for course in courses.data:
                enrolled_students = client.table("enrollments").select("section, grade, enrollment_date, student:students!student_id(id, name, university_id, department:departments!department_id(code, name), email, gender, nationality, phone_number)").eq("course_id", course["id"]).execute()
                course["enrolled_students"] = enrolled_students.data
            return make_response(jsonify(courses.data), 200)
        return make_response(jsonify({"message": "Please log in first."}), 400)

api.add_resource(Login, "/login/<role>")
api.add_resource(GetStudentData, "/student/getData")
api.add_resource(GetEnrollments, "/student/getEnrollments")
api.add_resource(GetRegistrableCourses, "/student/getRegistrableCourses")
api.add_resource(EditEnrolledCourses, "/student/editEnrolledCourses")
api.add_resource(GetAssignedCourses, "/staff/getAssignedCourses")

if __name__ == '__main__':
    app.run(debug=True, port=5000)