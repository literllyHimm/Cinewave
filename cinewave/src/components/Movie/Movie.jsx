import "./Movie.scss";
import { HiOutlineBookmark } from "react-icons/hi";
import MovieInfo from "./MovieInfo/MovieInfo";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";
import {
  AddToBookmarks,
  RemoveFromBookmarks,
  RemoveFromFavorites,
} from "../../Data/Data";

const Movie = ({ movie_banner, type, link = "", content, toggle, mode = "bookmarks", onRemoved }) => {
  const { setProcessing } = useContext(SharedContext);

  const title =
    content?.title ||
    content?.original_title ||
    content?.name ||
    content?.original_name ||
    "loading...";

  // safer parse
  const mediaTypeFromLink = link?.split("/")?.[1];
  const mediaType = mediaTypeFromLink || content?.media_type || (content?.first_air_date ? "tv" : "movie");

  async function handleClick(e) {
    e?.preventDefault?.(); // avoid Link navigation if button is over it
    e?.stopPropagation?.();

    setProcessing({ started: true, success: null });

    try {
      if (toggle) {
        // Removing
        if (mode === "favorites") {
          await RemoveFromFavorites(content);
        } else {
          await RemoveFromBookmarks(content, mediaType);
        }

        setProcessing({ started: true, success: true });
        onRemoved?.(); // ✅ update parent UI
        return;
      }

      // Adding (your current behavior adds to bookmarks)
      await AddToBookmarks(content, mediaType);
      setProcessing({ started: true, success: true });
    } catch (err) {
      console.error("Toggle error:", err);
      setProcessing({ started: true, success: false });
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
        {type === "wide" && <p className="desc">{content?.overview}</p>}

        <MovieInfo data={content} mediaType={mediaType} />
      </div>
    </div>
  );
};

export default Movie;
