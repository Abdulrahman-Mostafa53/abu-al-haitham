import os
import re
import json
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
        response = client.table(table_name).select("id, name, university_id, created_at, email, gender, nationality, date_of_birth, phone_number, national_id, cgpa, level, completed_credits, max_load, department:departments!department_id(*)").eq("session_token", session_token).execute()
    else:
        response = client.table(table_name).select("id, name, created_at, email, gender, phone_number, department:departments!department_id(*)").eq("session_token", session_token).execute()
    if response.data:
        return {"status": 1, "data": response.data[0]}
    return {"status": 0, "message": "Please log in first."}

def get_course(course_id):
    return client.table("courses").select("*").eq("id", course_id).execute().data[0]

def get_department(department_id):
    return client.table("departments").select("*").eq("id", department_id).execute().data[0]

def update_department(department_id, field, value):
    try:
        client.table("departments").update({
            str(field): value
        }).eq("id", int(department_id)).execute()
        return {"message": "Department data updated successfully."}, 200
    except:
        return {"message": "Error, cannot update department data."}, 500

def get_schedule(course_id, section=None):
    if section:
        return client.table("schedule").select("*, course:courses!course_id(code, name)").match({
            "course_id": int(course_id),
            "section": int(section)
        }).execute().data
    return client.table("schedule").select("*, course:courses!course_id(code, name)").eq("course_id", int(course_id)).execute().data

def update_schedule(course_id, section, field, value):
    try:
        client.table("schedule").update({
            str(field): value
        }).match({
            "course_id": int(course_id),
            "section": int(section)
        }).execute()
        return {"message": "Schedule updated successfully."}, 200
    except:
        return {"message": "Error, cannot update schedule."}, 500

def get_enrollment(student_id, course_id):
    return client.table("enrollments").select("""
    grade, section, exam_date, exam_location, exam_seat, enrollment_date,
    student:students!student_id(id, name, university_id, email),
    course:courses!course_id(id, code, name, credits)
    """).match({
        "student_id": int(student_id),
        "course_id": int(course_id)
    }).execute().data[0]

def get_student(student_id):
    return client.table("students").select("id, name, university_id, created_at, email, gender, nationality, date_of_birth, phone_number, national_id, cgpa, level, completed_credits, max_load, department:departments!department_id(*)").eq("id", student_id).execute().data[0]

def get_finished_courses(student_id):
    all_courses = client.table("enrollments").select("*").eq("student_id", student_id).execute()
    finished = []
    for course in all_courses.data:
        if (course["grade"] != "F" and course["grade"] != "FR" and course["grade"] != "FL" and course["grade"] != "W" and course["grade"] != "WF" and course["grade"]):
            finished.append(course["course_id"])
    return finished

def get_registrable_courses(student_id):
    student_data = get_student(student_id)
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
        id, code, name, type, credits,
        department:departments!department_id(code, name),
        schedule!course_id(*),
        professor:staff!professor_id(name, email)
    )
    """).eq("student_id", student_id).execute()
    return enrollments.data

def get_inprogress_courses(student_id):
    enrolled_courses = get_enrolled_courses(student_id)
    in_progress = []
    for course in enrolled_courses:
        if not course["grade"]:
            in_progress.append(course["course"])
    return in_progress

def update_enrollment(student_id, course_id, field, value):
    try:
        client.table("enrollments").update({
            str(field): value
        }).match({
            "student_id": int(student_id),
            "course_id": int(course_id)
        }).execute()
        return {"message": "Enrollment updated successfully."}, 200
    except:
        return {"message": "Error, cannot update enrollment."}, 500

def update_student(student_id, field, value):
    try:
        client.table("students").update({
            str(field): value
        }).eq("id", int(student_id)).execute()
        return {"message": "Student data updated successfully."}, 200
    except:
        return {"message": "Error, cannot update student data."}, 500

def update_student_progress(student_id):
    try:
        enrolled_courses = get_enrolled_courses(student_id)
        student = get_student(student_id)
        sum_credits = 0
        numerator = 0
        completed_credits = 0
        for enrollment in enrolled_courses:
            if (enrollment["grade"] and enrollment["grade"] != "W"):
                sum_credits += int(enrollment["course"]["credits"])
                course_grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F", "FR", "FL", "WF"]
                course_gpas = [4, 4, 3.7, 3.3, 3, 2.7, 2.3, 2, 1.7, 1.3, 1, 0, 0, 0, 0]
                numerator += enrollment["course"]["credits"] * course_gpas[course_grades.index(enrollment["grade"])]
                if (enrollment["grade"] not in ["WF", "F", "FR", "FL"]):
                    completed_credits += int(enrollment["course"]["credits"])
        cgpa = numerator / sum_credits
        percentage_of_progress = completed_credits / student["department"]["credit_hours"]
        if (percentage_of_progress >= 0 and percentage_of_progress < 0.25):
            level = 1
        elif (percentage_of_progress >= 0.25 and percentage_of_progress < 0.5):
            level = 2
        elif (percentage_of_progress >= 0.5 and percentage_of_progress < 0.75):
            level = 3
        else:
            level = 4
        if cgpa >= 3:
            max_load = 21
        elif cgpa >= 2 and cgpa < 3:
            max_load = 18
        else:
            max_load = 14
        update_student(student_id, "cgpa", cgpa)
        update_student(student_id, "level", level)
        update_student(student_id, "completed_credits", completed_credits)
        update_student(student_id, "max_load", max_load)
        return {"message": "Progress updated successfully"}, 200
    except:
        return {"message": "Error, cannot update progress"}, 500

def add_enrollment(student_id, course_id, section):
    try:
        client.table("enrollments").insert({
            "course_id": course_id,
            "student_id": student_id,
            "section": section
        }).execute()
        return make_response(jsonify({"message": "Enrolled successfully"}), 200)
    except:
        return make_response(jsonify({"message": "Error, couldn't register the course."}), 500)
    
def delete_enrollment(student_id, course_id, section):
    try:
        client.table("enrollments").delete().match({
            "student_id": student_id,
            "course_id": course_id,
            "section": section
        }).execute()
        return make_response(jsonify({"message": "Enrollment deleted successfully"}), 200)
    except:
        return make_response(jsonify({"message": "Error, couldn't delete the enrollment."}), 500)

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
                return make_response(jsonify({"message": "Username or password is incorrect."}), 401)
            else:
                return make_response(jsonify({"message": "Username or password is incorrect."}), 401)
        except:
            return make_response(jsonify({"message": "Error, maybe credentials params are not provided."}), 400)

class GetUserData(Resource):
    def post(self):
        is_logged_in_student = logged_in("students", request.cookies["session_token"])
        is_logged_in_staff = logged_in("staff", request.cookies["session_token"])
        is_logged_in_admin = logged_in("admins", request.cookies["session_token"])
        if is_logged_in_student["status"]:
            return make_response(jsonify(is_logged_in_student["data"]), 200)
        if is_logged_in_staff["status"]:
            return make_response(jsonify(is_logged_in_staff["data"]), 200)
        if is_logged_in_admin["status"]:
            return make_response(jsonify(is_logged_in_admin["data"]), 200)
        return make_response(jsonify({"message": "Please log in first."}), 401)

class GetEnrollments(Resource):
    def post(self):
        is_logged_in = logged_in("students", request.cookies["session_token"])
        if is_logged_in["status"]:
            return make_response(jsonify(get_enrolled_courses(is_logged_in["data"]["id"])), 200)
        return make_response(jsonify({"message": "Please log in first."}), 401)

class GetRegistrableCourses(Resource):
    def post(self):
        is_logged_in = logged_in("students", request.cookies["session_token"])
        if is_logged_in["status"]:
            return get_registrable_courses(is_logged_in["data"]["id"]), 200
        return make_response(jsonify({"message": "Please log in first."}), 401)

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
                inprogress_courses = get_inprogress_courses(is_logged_in["data"]["id"])
                inprogress_credits = 0
                target_course = get_course(course_id)
                for course in enrolled_courses:
                    enrolled_ids.append(course["course"]["id"])
                for course in registrable_courses:
                    registrable_ids.append(course["id"])
                for course in inprogress_courses:
                    inprogress_credits += int(course["credits"])
                if (course_id not in enrolled_ids) and (target_course["registrable"]) and (course_id in registrable_ids) and (int(target_course["credits"]) + inprogress_credits <= int(is_logged_in["data"]["max_load"])):
                    return add_enrollment(is_logged_in["data"]["id"], course_id, section)
                else:
                    return make_response(jsonify({"message": "Course is already registered or not registrable"}), 400)
            return make_response(jsonify({"message": "Please log in first."}), 401)
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
                return delete_enrollment(is_logged_in["data"]["id"], course_id, section)
            else:
                return make_response(jsonify({"message": "Course not registered or not registrable"}), 400)
        return make_response(jsonify({"message": "Please log in first."}), 401)

class GetAssignedCourses(Resource):
    def post(self):
        is_logged_in = logged_in("staff", request.cookies["session_token"])
        if is_logged_in["status"]:
            courses = client.table("courses").select("id, code, name, department:departments!department_id(code, name), credits, type, prerequisites, schedule!course_id(*)").eq("professor_id", is_logged_in["data"]["id"]).execute()
            for course in courses.data:
                enrolled_students = client.table("enrollments").select("section, grade, enrollment_date, student:students!student_id(id, name, university_id, department:departments!department_id(code, name), email, gender, nationality, phone_number)").eq("course_id", course["id"]).execute()
                course["enrolled_students"] = enrolled_students.data
            return make_response(jsonify(courses.data), 200)
        return make_response(jsonify({"message": "Please log in first."}), 401)

class UpdateEnrollment(Resource):
    def put(self):
        is_logged_in_staff = logged_in("staff", request.cookies["session_token"])
        is_logged_in_admin = logged_in("admins", request.cookies["session_token"])
        requestBody = request.get_json(silent=True) or request.values
        student_id = int(requestBody.get("student_id") or 0)
        course_id = int(requestBody.get("course_id") or 0)
        field = str(requestBody.get("field") or "")
        value = requestBody.get("value") or None
        try:
            if (is_logged_in_admin["status"]):
                response = update_enrollment(student_id, course_id, field, value)
                update_student_progress(student_id)
                return make_response(response)
            elif (is_logged_in_staff["status"]):
                if (field == "grade"):
                    response = update_enrollment(student_id, course_id, field, value)
                    update_student_progress(student_id)
                    return make_response(response)
                else:
                    return make_response({"message": "Not allowed"}, 401)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't update enrollment."}), 500)

class ModifyStudents(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id"))
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                return make_response(jsonify(get_student(student_id)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get student data"}), 500)
    def post(self):
        request_body = request.get_json(silent=True) or request.values
        data = {
            "university_id": int(request_body.get("university_id")),
            "name": str(request_body.get("name")),
            "email": str(request_body.get("email")),
            "password": str(request_body.get("password")),
            "gender": str(request_body.get("gender")),
            "nationality": str(request_body.get("nationality")),
            "date_of_birth": str(request_body.get("date_of_birth")),
            "phone_number": int(request_body.get("phone_number")),
            "national_id": int(request_body.get("national_id")),
            "department_id": int(request_body.get("department_id"))
        }
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                client.table("students").insert(data).execute()
                return make_response(jsonify({"message": "Student added successfully"}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't add student"}), 500)
    def put(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id"))
        field = str(request_body.get("field"))
        value = request_body.get("value")
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                return make_response(jsonify(update_student(student_id, field, value)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get student data"}), 500)
    def delete(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id"))
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                client.table("students").delete().match({
                    "id": student_id,
                }).execute()
                return make_response(jsonify({"message": "Student deleted successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't delete student"}), 500)

class GetAllStudents(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        department_id = int(request_body.get("department_id") or 0)
        level = int(request_body.get("level") or 0)
        if (department_id and level):
            search = {
                "department_id": department_id,
                "level": level
            }
        elif (department_id and not level):
            search = {
                "department_id": department_id
            }
        elif (level and not department_id):
            search = {
                "level": level
            }
        else:
            search = {}
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                if search:
                    all_students = client.table("students").select("id, name, university_id, created_at, email, gender, nationality, date_of_birth, phone_number, national_id, cgpa, level, completed_credits, max_load, department:departments!department_id(*)").match(search).execute()
                else:
                    all_students = client.table("students").select("id, name, university_id, created_at, email, gender, nationality, date_of_birth, phone_number, national_id, cgpa, level, completed_credits, max_load, department:departments!department_id(*)").execute()
                return make_response(jsonify(all_students.data), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get students data"}), 500)
        
class ModifyCourses(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        course_id = int(request_body.get("course_id"))
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                return make_response(jsonify(get_course(course_id)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get course data"}), 500)
    def post(self):
        request_body = request.get_json(silent=True) or request.values
        data = {
            "code": str(request_body.get("code")),
            "name": str(request_body.get("name")),
            "credits": int(request_body.get("credits")),
            "prerequisites": json.loads(request_body.get("prerequisites")),
            "professor_id": int(request_body.get("professor_id")),
            "department_id": int(request_body.get("department_id")),
            "type": str(request_body.get("type"))
        }
        print(data["prerequisites"])
        # try:
        is_logged_in = logged_in("admins", request.cookies["session_token"])
        if is_logged_in["status"]:
            client.table("courses").insert(data).execute()
            return make_response(jsonify({"message": "Course added successfully."}), 200)
        else:
            return make_response(jsonify({"message": "Please log in first."}), 401)
        # except:
        #     return make_response(jsonify({"message": "Error, could't add course"}), 500)
    def put(self):
        request_body = request.get_json(silent=True) or request.values
        course_id = int(request_body.get("course_id"))
        field = str(request_body.get("field"))
        value = request_body.get("value")
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                client.table("courses").update({
                    str(field): value
                }).eq("id", int(course_id)).execute()
                return make_response(jsonify({"message": "Course data updated successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get student data"}), 500)
    def delete(self):
        request_body = request.get_json(silent=True) or request.values
        course_id = int(request_body.get("course_id"))
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                client.table("courses").delete().match({
                    "id": course_id,
                }).execute()
                return make_response(jsonify({"message": "Course deleted successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get student data"}), 500)

class GetAllCourses(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        department_id = int(request_body.get("department_id") or 0)
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                if department_id:
                    all_courses = client.table("courses").select("*").match({"department_id": department_id}).execute()
                else:
                    all_courses = client.table("courses").select("*").execute()
                return make_response(jsonify(all_courses.data), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get students data"}), 500)

class ModifyProfessors(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        professor_id = int(request_body.get("professor_id"))
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                response = client.table("staff").select("id, name, created_at, email, gender, phone_number, department:departments!department_id(*)").eq("id", professor_id).execute()
                return make_response(jsonify(response.data[0]), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get professor data"}), 500)
    def post(self):
        request_body = request.get_json(silent=True) or request.values
        data = {
            "name": str(request_body.get("name")),
            "email": str(request_body.get("email")),
            "password": str(request_body.get("password")),
            "gender": str(request_body.get("gender")),
            "phone_number": int(request_body.get("phone_number")),
            "department_id": int(request_body.get("department_id"))
        }
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                client.table("staff").insert(data).execute()
                return make_response(jsonify({"message": "Professor added successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't add professor"}), 500)
    def put(self):
        request_body = request.get_json(silent=True) or request.values
        professor_id = int(request_body.get("professor_id"))
        field = str(request_body.get("field"))
        value = request_body.get("value")
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                client.table("staff").update({
                    str(field): value
                }).eq("id", professor_id).execute()
                return make_response(jsonify({"message": "Professor data updated successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't update professor data"}), 500)
    def delete(self):
        request_body = request.get_json(silent=True) or request.values
        professor_id = int(request_body.get("professor_id"))
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                client.table("staff").delete().match({
                    "id": professor_id,
                }).execute()
                return make_response(jsonify({"message": "Professor deleted successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't delete professor"}), 500)

class GetAllProfessors(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        department_id = int(request_body.get("department_id") or 0)
        if (department_id):
            search = {
                "department_id": department_id
            }
        else:
            search = {}
        try:
            is_logged_in = logged_in("admins", request.cookies["session_token"])
            if is_logged_in["status"]:
                if search:
                    all_professors = client.table("staff").select("id, name, created_at, email, gender, phone_number, department:departments!department_id(*)").match(search).execute()
                else:
                    all_professors = client.table("staff").select("id, name, created_at, email, gender, phone_number, department:departments!department_id(*)").execute()
                return make_response(jsonify(all_professors.data), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, could't get professors data"}), 500)

class ModifyDepartments(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        department_id = int(request_body.get("department_id") or request_body.get("id"))
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                return make_response(jsonify(get_department(department_id)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't get department data"}), 500)
    def post(self):
        request_body = request.get_json(silent=True) or request.values
        data = {
            "code": str(request_body.get("code")),
            "name": str(request_body.get("name")),
            "credit_hours": int(request_body.get("credit_hours"))
        }
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                client.table("departments").insert(data).execute()
                return make_response(jsonify({"message": "Department added successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't add department"}), 500)
    def put(self):
        request_body = request.get_json(silent=True) or request.values
        department_id = int(request_body.get("department_id") or request_body.get("id"))
        field = str(request_body.get("field"))
        value = request_body.get("value")
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                return make_response(jsonify(update_department(department_id, field, value)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't update department data"}), 500)
    def delete(self):
        request_body = request.get_json(silent=True) or request.values
        department_id = int(request_body.get("department_id") or request_body.get("id"))
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                client.table("departments").delete().match({
                    "id": department_id
                }).execute()
                return make_response(jsonify({"message": "Department deleted successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't delete department"}), 500)

class GetAllDepartments(Resource):
    def get(self):
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                all_departments = client.table("departments").select("*").execute()
                return make_response(jsonify(all_departments.data), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't get departments data"}), 500)

class ModifySchedule(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        course_id = int(request_body.get("course_id"))
        section = request_body.get("section")
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                return make_response(jsonify(get_schedule(course_id, section)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't get schedule data"}), 500)
    def post(self):
        request_body = request.get_json(silent=True) or request.values
        data = {
            "course_id": int(request_body.get("course_id")),
            "section": int(request_body.get("section")),
            "day": str(request_body.get("day")),
            "time_period": int(request_body.get("time_period")),
            "place": str(request_body.get("place"))
        }
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                client.table("schedule").insert(data).execute()
                return make_response(jsonify({"message": "Schedule added successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't add schedule"}), 500)
    def put(self):
        request_body = request.get_json(silent=True) or request.values
        course_id = int(request_body.get("course_id"))
        section = int(request_body.get("section"))
        field = str(request_body.get("field"))
        value = request_body.get("value")
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                return make_response(jsonify(update_schedule(course_id, section, field, value)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't update schedule"}), 500)
    def delete(self):
        request_body = request.get_json(silent=True) or request.values
        course_id = int(request_body.get("course_id"))
        section = request_body.get("section")
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                match_query = {"course_id": course_id}
                if section is not None:
                    match_query["section"] = int(section)
                client.table("schedule").delete().match(match_query).execute()
                return make_response(jsonify({"message": "Schedule deleted successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't delete schedule"}), 500)

class GetAllSchedules(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        course_id = int(request_body.get("course_id") or 0)
        day = request_body.get("day")
        section = int(request_body.get("section") or 0)
        search = {}
        if course_id:
            search["course_id"] = course_id
        if day:
            search["day"] = str(day)
        if section:
            search["section"] = section
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                if search:
                    all_schedules = client.table("schedule").select("*, course:courses!course_id(id, code, name)").match(search).execute()
                else:
                    all_schedules = client.table("schedule").select("*, course:courses!course_id(id, code, name)").execute()
                return make_response(jsonify(all_schedules.data), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't get schedules data"}), 500)

class ModifyEnrollments(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id"))
        course_id = int(request_body.get("course_id"))
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                return make_response(jsonify(get_enrollment(student_id, course_id)), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't get enrollment data"}), 500)
    def post(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id"))
        course_id = int(request_body.get("course_id"))
        data = {
            "student_id": student_id,
            "course_id": course_id,
            "section": int(request_body.get("section") or 1)
        }
        if request_body.get("grade") is not None:
            data["grade"] = str(request_body.get("grade"))
        if request_body.get("exam_date") is not None:
            data["exam_date"] = str(request_body.get("exam_date"))
        if request_body.get("exam_location") is not None:
            data["exam_location"] = str(request_body.get("exam_location"))
        if request_body.get("exam_seat") is not None:
            data["exam_seat"] = int(request_body.get("exam_seat"))
        if request_body.get("enrollment_date") is not None:
            data["enrollment_date"] = str(request_body.get("enrollment_date"))
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                client.table("enrollments").insert(data).execute()
                update_student_progress(student_id)
                return make_response(jsonify({"message": "Enrollment added successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't add enrollment"}), 500)
    def put(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id"))
        course_id = int(request_body.get("course_id"))
        field = str(request_body.get("field"))
        value = request_body.get("value")
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                response, status_code = update_enrollment(student_id, course_id, field, value)
                update_student_progress(student_id)
                return make_response(jsonify(response), status_code)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't update enrollment"}), 500)
    def delete(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id"))
        course_id = int(request_body.get("course_id"))
        section = request_body.get("section")
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                match_query = {
                    "student_id": student_id,
                    "course_id": course_id
                }
                if section is not None:
                    match_query["section"] = int(section)
                client.table("enrollments").delete().match(match_query).execute()
                update_student_progress(student_id)
                return make_response(jsonify({"message": "Enrollment deleted successfully."}), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't delete enrollment"}), 500)

class GetAllEnrollments(Resource):
    def get(self):
        request_body = request.get_json(silent=True) or request.values
        student_id = int(request_body.get("student_id") or 0)
        try:
            is_logged_in = logged_in("admins", request.cookies.get("session_token", ""))
            if is_logged_in["status"]:
                if student_id:
                    all_enrollments = client.table("enrollments").select("""
                        grade, section, exam_date, exam_location, exam_seat, enrollment_date,
                        student:students!student_id(id, name, university_id, email),
                        course:courses!course_id(id, code, name, credits)
                    """).eq("student_id", student_id).execute()
                else:
                    all_enrollments = client.table("enrollments").select("""
                        grade, section, exam_date, exam_location, exam_seat, enrollment_date,
                        student:students!student_id(id, name, university_id, email),
                        course:courses!course_id(id, code, name, credits)
                    """).execute()
                return make_response(jsonify(all_enrollments.data), 200)
            else:
                return make_response(jsonify({"message": "Please log in first."}), 401)
        except:
            return make_response(jsonify({"message": "Error, couldn't get enrollments data"}), 500)


api.add_resource(Login, "/login/<role>")
api.add_resource(GetUserData, "/getUserData")
api.add_resource(GetEnrollments, "/student/getEnrollments")
api.add_resource(GetRegistrableCourses, "/student/getRegistrableCourses")
api.add_resource(EditEnrolledCourses, "/student/editEnrolledCourses")
api.add_resource(GetAssignedCourses, "/staff/getAssignedCourses")
api.add_resource(UpdateEnrollment, "/updateEnrollment")
api.add_resource(GetAllStudents, "/admin/getAllStudents")
api.add_resource(ModifyStudents, "/admin/modifyStudents")
api.add_resource(ModifyCourses, "/admin/modifyCourses")
api.add_resource(GetAllCourses, "/admin/getAllCourses")
api.add_resource(ModifyProfessors, "/admin/modifyProfessors")
api.add_resource(GetAllProfessors, "/admin/getAllProfessors")
api.add_resource(ModifyDepartments, "/admin/modifyDepartments")
api.add_resource(GetAllDepartments, "/admin/getAllDepartments")
api.add_resource(ModifySchedule, "/admin/modifySchedule")
api.add_resource(GetAllSchedules, "/admin/getAllSchedules")
api.add_resource(ModifyEnrollments, "/admin/modifyEnrollments")
api.add_resource(GetAllEnrollments, "/admin/getAllEnrollments")

if __name__ == '__main__':
    app.run(debug=True, port=5000)