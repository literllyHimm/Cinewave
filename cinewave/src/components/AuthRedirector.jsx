import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SharedContext } from "../SharedContext";

const AuthRedirector = () => {
  const { user, shouldRedirect } = useContext(SharedContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && shouldRedirect) {
      navigate("/select-genres"); // ✅ Redirect inside a valid <Router> context
    }
  }, [user, shouldRedirect, navigate]);

  return null; // ✅ This component doesn't render anything
};

export default AuthRedirector;
