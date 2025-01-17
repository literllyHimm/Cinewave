import "./Movie.scss";
import { HiOutlineBookmark } from "react-icons/hi";
import MovieInfo from "./MovieInfo/MovieInfo";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";
import { AddToBookmarks, RemoveFromBookmarks } from "../../Data/Data";

const Movie = ({ movie_banner, type, link, content, toggle }) => {
  const { setProcessing } = useContext(SharedContext);

  let title =
    content?.title ||
    content?.original_title ||
    content?.name ||
    content?.original_name ||
    "loading...";

  const mediaType = link.split("/")[1];

  function handleClick() {
    setProcessing({
      started: true,
      success: null,
    });

    if (toggle) {
      RemoveFromBookmarks(content, mediaType)
        .then(() => {
          setProcessing({
            started: true,
            success: true,
          });
          location.reload();
        })
        .catch(() => {
          setProcessing({
            started: true,
            success: false,
          });
        });
    } else {
      AddToBookmarks(content, mediaType)
        .then(() => {
          setProcessing({
            started: true,
            success: true,
          });
        })
        .catch(() => {
          setProcessing({
            started: true,
            success: false,
          });
        });
    }
  }

  return (
    <div className={`movie ${type}`} title={title}>
      <Link to={link}>
        <img src={movie_banner} alt="" loading="lazy" />
      </Link>

      <div className="add_to_fav" title="Save for later" onClick={handleClick}>
        <HiOutlineBookmark className="icon" />
      </div>

      <div className="details">
        <span className="title">{title}</span>
        {type == "wide" && <p className="desc">{content?.overview}</p>}

        <MovieInfo data={content} mediaType={link.split("/")[1]} />
      </div>
    </div>
  );
};

export default Movie;
