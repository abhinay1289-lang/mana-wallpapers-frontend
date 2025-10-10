import { createContext, useContext, useReducer, useEffect } from "react";
import globalObject from '../components/common/global-variables'
import { useDispatch } from "react-redux";
import { getAllcategoriesStructure } from "../store/thunks/wallpaperThunk";

const AuthContext = createContext();


const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [state] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(getAllcategoriesStructure()).then((res) => {
          globalObject.categories = res.payload.data;
        });
    }
    };
    initAuth();
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
