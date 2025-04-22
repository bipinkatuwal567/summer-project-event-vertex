import { Navigate, Outlet } from "react-router-dom";

const OrganizerRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "organizer") {
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Outlet />;
};

export default OrganizerRoute;
