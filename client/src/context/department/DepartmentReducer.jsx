
const DepartmentReducer = (state, action) => {
  switch (action.type) {
    case "GET_DEPARTMENTS":
      return {
        ...state,
        departments: action.payload,
        loading: false,
      };
    case "GET_DEPARTMENT":
      return {
        ...state,
        currentDepartment: action.payload,
        loading: false,
      };
    case "ADD_DEPARTMENT":
      return {
        ...state,
        departments: [...state.departments, action.payload],
        loading: false,
      };
    case "UPDATE_DEPARTMENT":
      return {
        ...state,
        departments: state.departments.map((dept) =>
          dept._id === action.payload._id ? action.payload : dept
        ),
        loading: false,
      };
    case "DELETE_DEPARTMENT":
      return {
        ...state,
        departments: state.departments.filter(
          (dept) => dept._id !== action.payload
        ),
        loading: false,
      };
    case "DEPARTMENT_ERROR":
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

export default DepartmentReducer;
