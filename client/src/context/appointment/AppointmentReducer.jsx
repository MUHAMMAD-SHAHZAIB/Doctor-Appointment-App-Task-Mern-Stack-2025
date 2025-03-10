
const AppointmentReducer = (state, action) => {
  switch (action.type) {
    case "GET_APPOINTMENTS":
      return {
        ...state,
        appointments: action.payload,
        loading: false,
      };
    case "GET_APPOINTMENT":
      return {
        ...state,
        currentAppointment: action.payload,
        loading: false,
      };
    case "GET_DOCTOR_APPOINTMENTS":
      return {
        ...state,
        appointments: action.payload,
        loading: false,
      };
    case "GET_PATIENT_APPOINTMENTS":
      return {
        ...state,
        appointments: action.payload,
        loading: false,
      };
    case "CREATE_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
        loading: false,
      };
    case "UPDATE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment
        ),
        currentAppointment: action.payload,
        loading: false,
      };
    case "CANCEL_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((appointment) =>
          appointment._id === action.payload._id
            ? { ...appointment, status: "cancelled" }
            : appointment
        ),
        loading: false,
      };
    case "APPOINTMENT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    case "CLEAR_CURRENT":
      return {
        ...state,
        currentAppointment: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default AppointmentReducer;
