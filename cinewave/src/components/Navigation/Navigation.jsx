import "./Navigation.scss";
import Nav from "./NavIcon/Nav";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";

import { RiMenu4Fill } from "react-icons/ri";
import { RiHome5Line } from "react-icons/ri";
import { FiStar } from "react-icons/fi";
import { BiLibrary } from "react-icons/bi";
import { MdOutlineMovie } from "react-icons/md";
import { PiTelevision } from "react-icons/pi";
import { MdOutlineFormatPaint } from "react-icons/md";
import { BiCategory } from "react-icons/bi"; // Genre List Icon

const Navigation = () => {
  const { NavActive, setNavActive, ThemeOptions, setThemeOptions } =
    useContext(SharedContext);

  // Toggle the theme options visibility
  const handleTheme = () => {
    setThemeOptions?.((prev) => !prev);
  };

  // Toggle the navigation menu
  const handleNavToggle = () => {
    setNavActive?.((prev) => !prev);
  };

  return (
    <nav className={`navigation ${NavActive ? "expand_nav" : ""}`}>
      {/* Menu Toggle */}
      <div className="menu_toggle" onClick={handleNavToggle}>
        <RiMenu4Fill className="menu_icon" />
        <h2>Cinewave</h2>
      </div>

      {/* Navigation Icons */}
      <div className="nav_icons">
        <div className="indicator"></div>

        <Nav Icon={RiHome5Line} title="Home" link="/" index={0} />
        <Nav Icon={MdOutlineMovie} title="Movies" link="movies" index={1} />
        <Nav Icon={PiTelevision} title="TV Shows" link="tv" index={2} />
        <Nav Icon={FiStar} title="Favorites" link="favorites" index={3} />
        <Nav Icon={BiLibrary} title="Library" link="library" index={4} />
        <Nav
          Icon={BiCategory}
          title="Genre Movies"
          link="GenrePage"
          index={5}
        />
      </div>

      {/* Theme Toggle */}
      <div className="theme_toggle">
        <div className="paint_icon" title="Change Theme" onClick={handleTheme}>
          <MdOutlineFormatPaint className="icon" />
        </div>

        <div className={`theme_colors ${ThemeOptions ? "show_options" : ""}`}>
          <div
            className="theme"
            data-theme="dark"
            style={{ "--custom-clr": "#101010" }}
            title="Dark Theme"
          />

          <div
            className="theme"
            data-theme="moonlight"
            style={{ "--custom-clr": "#0d1232" }}
            title="Moonlight"
          ></div>

          <div
            className="theme"
            data-theme="purple"
            style={{ "--custom-clr": "#1B182E" }}
            title="Purple Theme"
          ></div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
