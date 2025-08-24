import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginRegister/LoginPage';
import RegisterPage from './pages/LoginRegister/RegisterPageTest';
import { useEffect } from 'react';
import AuthTest from './components/AuthTest';
import DoctorLayout from './components/doctor/DoctorLayout';
import Dashboard from './pages/doctor/dashboard/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import CompleteProfile from './pages/SetupProfile/CompleteProfile';
import './App.css';

// 👇 Add these imports for the sub-pages
import Appointments from './pages/doctor/appointments/Appointments';
import Patients from './pages/doctor/patients/Patients';
import Chat from './pages/doctor/chat/Doctorchat';

import Analytics from './pages/doctor/Analytics/Analytics';

import MyClinic from './pages/doctor/myclinic/MyClinic';
import Invitations from './pages/doctor/Invitations';
import Profile from './pages/doctor/profile/DoctorProfile';
import Availability from './pages/doctor/availability/Availability';

// Admin imports

import AdminLayoutRoute from './components/admin/AdminLayoutRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPatients from './pages/admin/Patients';
import AdminDoctors from './pages/admin/doctor/Doctors';
import AdminAppointments from './pages/admin/Appointments';
import AdminMessages from './pages/admin/Messages';
import AdminClinics from './pages/admin/Clinics';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';

import PatientLayout from './components/patient/PatientLayout';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/Appointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import PatientAnalytics from './pages/patient/Analytics/Analytics';


import PatientDiagnostics from './pages/patient/Diagnostics';

import PatientChat from './pages/patient/Patientchat';
import PatientProfile from './pages/patient/PatientProfile';
import SymptomChecker from './components/SymptomChecker';

// Helper component to redirect SPA routes to backend endpoints
const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Catch auth routes if they accidentally hit the SPA and redirect to backend */}
          <Route path="/auth/google" element={<ExternalRedirect to="http://localhost:5000/auth/google" />} />
          <Route path="/auth/google/callback" element={<div style={{ padding: 24 }}><h2>Authentication in progress...</h2><p>You can close this tab and return to the previous window.</p></div>} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/setup-profile/complete" element={<CompleteProfile />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />

        {/* Nested route under Doctor layout */}
        <Route path="/doctor" element={<DoctorLayout />}> 
          <Route index element={<Dashboard />} /> {/* 👈 shows at /doctor */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-clinic" element={<MyClinic />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="patients" element={<Patients />} />
          <Route path="chat" element={<Chat />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="invitations" element={<Invitations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="availability" element={<Availability />} />
        </Route>

        {/* Admin routes with layout */}
        <Route path="/admin" element={<AdminLayoutRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="clinics" element={<AdminClinics />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="diagnostics" element={<PatientDiagnostics />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          {/* Keep /patient/doctors as a direct route (renders the same component as /patient/medical-records) */}
          <Route path="doctors" element={<MedicalRecords />} />
          
          <Route path="chat" element={<PatientChat />} />
          
          <Route path="analytics" element={<PatientAnalytics />} />
          
          <Route path="profile" element={<PatientProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;