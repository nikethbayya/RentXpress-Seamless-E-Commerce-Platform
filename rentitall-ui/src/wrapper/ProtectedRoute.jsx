import {Navigate, useLocation} from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const location = useLocation();

    if (!location.state?.allowed) {
        return <Navigate to="/home" replace />;
    }

    return children;
}