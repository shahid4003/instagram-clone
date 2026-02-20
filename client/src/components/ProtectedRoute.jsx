import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

const ProtectedRoute = ({ children, redirectTo = "/auth/signup" }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to={redirectTo} replace />;

  return children;
};

export default ProtectedRoute;
