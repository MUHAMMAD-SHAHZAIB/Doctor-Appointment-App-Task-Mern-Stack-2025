
const DoctorReducer = (state, action) => {
  switch (action.type) {
    case "GET_DOCTORS":
      return {
        ...state,
        doctors: action.payload,
        loading: false,
      };
    case "GET_DOCTOR":
      return {
        ...state,
        currentDoctor: action.payload,
        loading: false,
      };
    case "GET_DOCTORS_BY_DEPARTMENT":
      return {
        ...state,
        doctors: action.payload,
        loading: false,
      };
    case "ADD_DOCTOR":
      return {
        ...state,
        doctors: [...state.doctors, action.payload],
        loading: false,
      };
    case "UPDATE_DOCTOR":
      return {
        ...state,
        doctors: state.doctors.map((doctor) =>
          doctor._id === action.payload._id ? action.payload : doctor
        ),
        currentDoctor: action.payload,
        loading: false,
      };
    case "UPDATE_AVAILABILITY":
      return {
        ...state,
        currentDoctor: action.payload,
        loading: false,
      };
    case "DELETE_DOCTOR":
      return {
        ...state,
        doctors: state.doctors.filter(
          (doctor) => doctor._id !== action.payload
        ),
        loading: false,
      };
    case "DOCTOR_ERROR":
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
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default DoctorReducer;
