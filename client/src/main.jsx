import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Import Context Providers
import AuthState from "./context/auth/AuthState";
import DepartmentState from "./context/department/DepartmentState";
import DoctorState from "./context/doctor/DoctorState";
import AppointmentState from "./context/appointment/AppointmentState";
import AlertState from "./context/alert/AlertState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertState>
      <AuthState>
        <DepartmentState>
          <DoctorState>
            <AppointmentState>
              <App />
            </AppointmentState>
          </DoctorState>
        </DepartmentState>
      </AuthState>
    </AlertState>
  </StrictMode>
);
