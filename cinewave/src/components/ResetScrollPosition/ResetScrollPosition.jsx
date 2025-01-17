import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ResetScrollPosition = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const app = document.querySelector(".app main");

    app.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

export default ResetScrollPosition;
