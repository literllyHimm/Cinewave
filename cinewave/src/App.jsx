import "./App.scss";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Navigation from "./components/Navigation/Navigation";
import { SharedProvider } from "./SharedContext"; // Import SharedProvider

import { Outlet, useNavigation } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import ResetScrollPosition from "./components/ResetScrollPosition/ResetScrollPosition";
import Loading from "./components/Loading/Loading";
import Process from "./components/Process/Process";

function App() {
  const [theme, settheme] = useState("dark");
  const [NavActive, setNavActive] = useState(false);
  const [ThemeOptions, setThemeOptions] = useState(false);
  const [ShowProfile, setShowProfile] = useState(false);
  const [processing, setProcessing] = useState({
    started: null,
    success: null,
  });

  const navigation = useNavigation();

  function toggle() {
    if (NavActive) {
      setNavActive(false);
    }

    if (ThemeOptions) {
      setThemeOptions(false);
    }

    if (ShowProfile) {
      setShowProfile(false);
    }
  }

  useEffect(() => {
    const themes = document.querySelectorAll(".theme_colors .theme");

    themes.forEach((it) => {
      it.addEventListener("click", () => {
        settheme(it.getAttribute("data-theme"));
      });
    });
  }, []);

  useEffect(() => {
    if (processing.success === true || processing.success === false) {
      setTimeout(() => {
        setProcessing({
          started: null,
          success: null,
        });
      }, 4000);
    }
  }, [processing]);

  return (
    <SharedProvider>
      <div
        className={`app ${theme}_theme ${(NavActive || ShowProfile || navigation.state === "loading") &&
          "drop_blinds"
          }`}
      >
        <Navigation />

        {navigation.state === "loading" && <Loading />}

        <main>
          <div className="blinds" onClick={toggle}></div>

          <Header />
          <Profile />

          {processing.started && <Process />}

          <ResetScrollPosition>
            <Outlet />
          </ResetScrollPosition>
        </main>
      </div>
    </SharedProvider>
  );
}

export default App;
