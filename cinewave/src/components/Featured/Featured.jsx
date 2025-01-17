import "./Featured.scss";

import { FiBookmark, FiStar } from "react-icons/fi";
import MovieInfo from "../Movie/MovieInfo/MovieInfo";
import { GoShare } from "react-icons/go";
import { BiShareAlt } from "react-icons/bi";
import CTAButtons from "../CTAButtons/CTAButtons";
import { useRouteLoaderData } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SharedContext } from "../../SharedContext";
import Loading from "../Loading/Loading";

const Featured = () => {
  const data = useRouteLoaderData("root");
  const { mobileView } = useContext(SharedContext);

  const [featured, setFeatured] = useState(
    JSON.parse(sessionStorage.getItem("featured")) || null
  );
  const [mediaType, setMediaType] = useState(
    sessionStorage.getItem("featuredMediaType")
  );

  function getFeaturedMovie() {
    const dataArr = Object.keys(data);

    const featuredIndex = Math.floor(Math.random() * dataArr.length);
    const featuredDataTitle = dataArr[featuredIndex];

    const featured = data[featuredDataTitle];

    const randomMovieIndex = Math.floor(Math.random() * featured.length);
    const randomMovie = featured[randomMovieIndex];

    sessionStorage.setItem("featured", JSON.stringify(randomMovie));

    setFeatured(randomMovie);

    let mediaType;

    switch (featuredDataTitle) {
      case "airingToday":
        mediaType = "tv";
        break;

      case "nowPlaying":
        mediaType = "movie";
        break;

      case "popularMovies":
        mediaType = "movie";
        break;

      case "popularShows":
        mediaType = "tv";
        break;

      case "topRatedMovies":
        mediaType = "movie";
        break;

      case "topRatedShows":
        mediaType = "tv";
        break;

      case "trending":
        mediaType = randomMovie.media_type;
        break;

      case "upcoming":
        mediaType = "movie";
        break;

      default:
        mediaType = "movie";
        break;
    }

    setMediaType(mediaType);
    sessionStorage.setItem("featuredMediaType", mediaType);
  }

  useEffect(() => {
    if (!featured) {
      getFeaturedMovie();
    }
  }, []);

  return (
    <div className="featured_section">
      {!featured && <Loading />}

      {mobileView ? (
        <img
          src={`https://image.tmdb.org/t/p/original${featured?.poster_path}`}
          alt=""
          className="featured_banner"
        />
      ) : (
        <img
          src={`https://image.tmdb.org/t/p/original${featured?.backdrop_path}`}
          alt=""
          className="featured_banner"
        />
      )}

      <div className="details">
        <h2 className="movie_title">
          {featured?.title ||
            featured?.name ||
            featured?.original_name ||
            featured?.original_title}
        </h2>

        <span className="movie_overview">{featured?.overview}</span>

        <div className="info_wrapper">
          {featured && <MovieInfo data={featured} mediaType={mediaType} />}

          <div className="quick_tools">
            <GoShare className="action_icon visit" title="Visit" />
            <BiShareAlt className="action_icon share" title="Share" />
            <FiBookmark className="action_icon favorite" title="Bookmark" />
            <FiStar className="action_icon star" title="Favorite" />
          </div>
        </div>

        <CTAButtons mediaType={mediaType} movie={featured} featured />
      </div>
    </div>
  );
};

export default Featured;
