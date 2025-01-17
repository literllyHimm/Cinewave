import "./Nav.scss";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { SharedContext } from "../../../SharedContext";

const Nav = ({ Icon, title, link, index }) => {
  const { NavActive, setNavActive } = useContext(SharedContext);

  useEffect(() => {
    const currentNavIndex =
      Number(sessionStorage.getItem("currentNavIndex")) || 0;

    const navIcons = document.querySelectorAll(".nav_icons .nav_icon");
    const indicator = document.querySelector(".nav_icons .indicator");

    navIcons[currentNavIndex].classList.add("active");

    indicator.style.top =
      navIcons[currentNavIndex].getBoundingClientRect().top +
      navIcons[currentNavIndex].offsetHeight / 2 +
      "px";

    navIcons.forEach((it) => {
      it.addEventListener("click", () => {
        navIcons.forEach((it) => {
          it.classList.remove("active");
        });

        it.classList.add("active");
      });
    });
  }, []);

  function handleIndicator(e) {
    sessionStorage.setItem("currentNavIndex", index);

    if (NavActive) {
      setNavActive(!NavActive);
    }

    const indicator = document.querySelector(".nav_icons .indicator");

    const targetY = e.target.getBoundingClientRect().top;

    const targetHeight = e.target.offsetHeight;

    indicator.style.top = targetY + targetHeight / 2 + "px";
  }

  return (
    <Link to={link} className="nav_icon" onClick={handleIndicator}>
      <Icon className="icon" />
      <span className="nav_title">{title}</span>
    </Link>
  );
};

export default Nav;
