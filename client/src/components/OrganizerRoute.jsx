import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const OrganizerRoute = () => {
  const { currentUser } = useSelector(state => state.user);

  if (!currentUser || currentUser.role !== "organizer") {
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Outlet />;
};

export default OrganizerRoute;
