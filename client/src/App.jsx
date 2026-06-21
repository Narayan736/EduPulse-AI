import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MarkAttendance from './pages/student/MarkAttendance';
import SubmitStandup from './pages/student/SubmitStandup';
import SubmitDemo from './pages/student/SubmitDemo';

// Instructor pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AttendanceView from './pages/instructor/AttendanceView';
import StandupReview from './pages/instructor/StandupReview';
import DemoReview from './pages/instructor/DemoReview';
import AnalyticsPage from './pages/instructor/AnalyticsPage';
import AIInsightsPage from './pages/instructor/AIInsightsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute roles={['student']}>
                <DashboardLayout>
                  <MarkAttendance />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/standup"
            element={
              <ProtectedRoute roles={['student']}>
                <DashboardLayout>
                  <SubmitStandup />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/demo"
            element={
              <ProtectedRoute roles={['student']}>
                <DashboardLayout>
                  <SubmitDemo />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Instructor routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute roles={['instructor']}>
                <DashboardLayout>
                  <InstructorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/attendance"
            element={
              <ProtectedRoute roles={['instructor']}>
                <DashboardLayout>
                  <AttendanceView />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/standups"
            element={
              <ProtectedRoute roles={['instructor']}>
                <DashboardLayout>
                  <StandupReview />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/demos"
            element={
              <ProtectedRoute roles={['instructor']}>
                <DashboardLayout>
                  <DemoReview />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/analytics"
            element={
              <ProtectedRoute roles={['instructor']}>
                <DashboardLayout>
                  <AnalyticsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/ai-insights"
            element={
              <ProtectedRoute roles={['instructor']}>
                <DashboardLayout>
                  <AIInsightsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
