import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { useUser } from "./Utils";

const ProtectedRoute = ({ children, requiredRole }) => {
  // const { isAuthenticated, isLoading, user } = useAuth();
  const user = useUser();

  // const location = useLocation();

  // if (isLoading) {
  //   return (
  //     <Box className="flex justify-center items-center min-h-64">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  if (user?.role === "BUYER") {
    // If seller tries to access a restricted route
    return <Navigate to="/home" />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    // If the role doesn't match, redirect to their dashboard
    return (
      <Navigate to={user?.role === "BUYER" ? "/home" : "/admin/analytics"} />
    );
  }
  return children;
};

export default ProtectedRoute;
