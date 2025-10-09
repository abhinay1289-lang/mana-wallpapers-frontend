import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
  // const { isAuthenticated, isLoading, user } = useAuth();
  const { userType } = useSelector((state) => state.auth);

  // const location = useLocation();

  // if (isLoading) {
  //   return (
  //     <Box className="flex justify-center items-center min-h-64">
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  if (userType === "BUYER") {
    // If seller tries to access a restricted route
    return <Navigate to="/home" />;
  }
  if (requiredRole && userType !== requiredRole) {
    // If the role doesn't match, redirect to their dashboard
    return (
      <Navigate to={userType === "BUYER" ? "/home" : "/admin/analytics"} />
    );
  }
  console.log("kehdwcencwe");

  return children;
};

export default ProtectedRoute;
