import "./Header.scss";
import logo from "../../assets/others/logo.png";
import profile_src from "../../assets/others/profile.jpg";
import { Suspense, lazy, useContext, useEffect, useState } from "react";
import { SharedContext } from "../../SharedContext";
import { RiMenu4Fill } from "react-icons/ri";
import { BiChevronLeft, BiSearchAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import { Search } from "../../Data/Data";
const ResMovie = lazy(() => import("../SearchResMovie/ResMovie"));

const Header = () => {
  const { mobileView, NavActive, setNavActive, setShowProfile } =
    useContext(SharedContext);
  const [ActivateSearch, setActivateSearch] = useState(false);
  const [SearchValue, setSearchValue] = useState("");

  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const header = document.querySelector(".app_header");
    const app = document.querySelector(".app main");

    function updateHeaderBgOnScroll() {
      if (app.scrollTop > 400) {
        header.classList.add("colorize");
      } else {
        header.classList.remove("colorize");
      }
    }

    updateHeaderBgOnScroll();
    app.addEventListener("scroll", updateHeaderBgOnScroll);
  }, []);

  useEffect(() => {
    const header = document.querySelector(".app_header");

    if (NavActive) {
      header.classList.add("nav_active");
    } else {
      header.classList.remove("nav_active");
    }
  }, [NavActive]);

  useEffect(() => {
    let ignore = false;

    if (SearchValue == "") {
      setSearchResult(null);
    } else {
      Search(SearchValue).then((data) => {
        if (!ignore) {
          setSearchResult(data);
        }
      });
    }

    return () => {
      ignore = true;
    };
  }, [SearchValue]);

  function handleClick() {
    setSearchValue("");
    setActivateSearch(false);
    setSearchResult([]);
  }

  return (
    <header className="app_header">
      <div className="logo field">
        {mobileView ? (
          <RiMenu4Fill
            className="menu_icon"
            onClick={() => {
              setNavActive(!NavActive);
            }}
          />
        ) : (
          <img src={logo} alt="logo" />
        )}

        <Link to="/">
          <h2>Cinewave</h2>
        </Link>
      </div>

      <>
        <div className={`search field ${ActivateSearch && "active"}`}>
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={SearchValue}
            disabled={!ActivateSearch}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />

          <button
            className="search_icon"
            disabled={SearchValue}
            onClick={() => {
              setActivateSearch((prev) => !prev);
            }}
          >
            {ActivateSearch ? (
              <BiChevronLeft className="icon" />
            ) : (
              <BiSearchAlt className="icon" />
            )}
          </button>
        </div>

        {searchResult && (
          <div className="search_res">
            <span>search results for `{SearchValue}`</span>

            <div className="res_movies_wrapper">
              {searchResult.length > 0 ? (
                <Suspense fallback={<Loading />}>
                  {searchResult?.map((res) => (
                    <ResMovie
                      key={res.id}
                      content={res}
                      onclick={handleClick}
                    />
                  ))}
                </Suspense>
              ) : (
                <h5>:&lt; No data found</h5>
              )}
            </div>
          </div>
        )}
      </>

      <div className="profile field">
        <img
          src={profile_src}
          alt="profile_img"
          onClick={() => {
            setShowProfile((prev) => !prev);
          }}
        />
      </div>
    </header>
  );
};

export default Header;
