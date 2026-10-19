import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

// Common Components
import { DemoBanner } from './components/common/DemoBanner.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { AiAssistantBot } from './components/common/AiAssistantBot.jsx';

// Pages
import { HomePage } from './pages/HomePage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { WorkerDetailPage } from './pages/WorkerDetailPage.jsx';
import { JoinWorkerPage } from './pages/JoinWorkerPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage.jsx';
import { WorkerProfileEditPage } from './pages/WorkerProfileEditPage.jsx';
import { WorkerEnquiriesPage } from './pages/WorkerEnquiriesPage.jsx';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage.jsx';
import { CustomerEnquiryDetailPage } from './pages/CustomerEnquiryDetailPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { SafetyPrivacyPage } from './pages/SafetyPrivacyPage.jsx';
import { TrustSafetyCenterPage } from './pages/TrustSafetyCenterPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <DemoBanner />
            <Navbar />
            <main className="flex-grow flex flex-col">
              <Routes>
                {/* Public Discovery Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/workers/:id" element={<WorkerDetailPage />} />
                <Route path="/join" element={<JoinWorkerPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/safety-and-privacy" element={<SafetyPrivacyPage />} />
                <Route path="/trust-and-safety" element={<TrustSafetyCenterPage />} />

                {/* Protected Worker Routes */}
                <Route
                  path="/worker/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['worker']}>
                      <WorkerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/worker/profile/edit"
                  element={
                    <ProtectedRoute allowedRoles={['worker']}>
                      <WorkerProfileEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/worker/enquiries"
                  element={
                    <ProtectedRoute allowedRoles={['worker']}>
                      <WorkerEnquiriesPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Customer Routes */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/enquiries/:id"
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'worker', 'admin']}>
                      <CustomerEnquiryDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <AiAssistantBot />
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
