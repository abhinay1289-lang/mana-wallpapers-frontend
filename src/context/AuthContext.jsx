import { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";

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
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          if (token === 'mock-admin-token') {
            const user = {
              email: 'admin.wallpaper@gmail.com',
              role: 'ADMIN',
              name: 'Admin User',
            };
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                token: token,
                user: user,
              },
            });
          } else if (token === 'mock-buyer-token') {
            const user = {
              email: 'buyer.wallpaper@gmail.com',
              role: 'BUYER',
              name: 'Buyer User',
            };
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                token: token,
                user: user,
              },
            });
          }
          dispatch({ type: "SET_LOADING", payload: false });
        } catch (error) {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    if (credentials.email === 'admin.wallpaper@gmail.com' && credentials.password === '123456789') {
      const user = {
        email: 'admin.wallpaper@gmail.com',
        role: 'ADMIN',
        name: 'Admin User',
      };
      const accessToken = 'mock-admin-token';
      localStorage.setItem("token", accessToken);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: accessToken,
          user: user,
        },
      });
      return { data: { accessToken, ...user } };
    }

    if (credentials.email === 'buyer.wallpaper@gmail.com' && credentials.password === '123456789') {
      const user = {
        email: 'buyer.wallpaper@gmail.com',
        role: 'BUYER',
        name: 'Buyer User',
      };
      const accessToken = 'mock-buyer-token';
      localStorage.setItem("token", accessToken);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: accessToken,
          user: user,
        },
      });
      return { data: { accessToken, ...user } };
    }

    try {
      const response = await authService.login(credentials);
      const { accessToken, ...user } = response.data;

      localStorage.setItem("token", accessToken);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: accessToken,
          user: user,
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
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
