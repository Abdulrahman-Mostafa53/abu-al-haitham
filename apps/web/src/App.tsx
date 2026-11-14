import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PortalLayout from "./components/layout/PortalLayout";
import { AuthProvider } from "./features/auth/AuthProvider";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import AlertsPage from "./pages/AlertsPage";
import AuthPage from "./pages/AuthPage";
import CoursesPage from "./pages/CoursesPage";
import GradesPage from "./pages/GradesPage";
import ProfilePage from "./pages/ProfilePage";
import SchedulePage from "./pages/SchedulePage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<AuthPage />} />

              {/* everything below requires a signed-in user */}
              <Route element={<ProtectedRoute />}>
                <Route element={<PortalLayout />}>
                  <Route index element={<Navigate to="/profile" replace />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="grades" element={<GradesPage />} />
                  <Route path="schedule" element={<SchedulePage />} />
                  <Route path="alerts" element={<AlertsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
