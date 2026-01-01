import "./CTAButtons.scss";
import { HiMiniPlay } from "react-icons/hi2";
import { TbStar } from "react-icons/tb";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import { AddToFavorites, RemoveFromFavorites, fetchFavorites } from "../../Data/Data";
import { useContext, useState, useEffect } from "react";
import { SharedContext } from "../../SharedContext";

const CTAButtons = ({ mediaType, movie, featured }) => {
  const { setProcessing } = useContext(SharedContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkIfFavorite() {
      if (!movie?.id) return;

      try {
        const favorites = await fetchFavorites();
        const alreadyFavorite = favorites.some((fav) => String(fav.id) === String(movie.id));
        if (mounted) setIsFavorite(alreadyFavorite);
      } catch (error) {
        console.error("Failed to check favorites:", error);
      }
    }

    checkIfFavorite();
    return () => {
      mounted = false;
    };
  }, [movie?.id]);

  const handleFavoriteClick = async () => {
    if (!movie?.id || favLoading) return;

    setFavLoading(true);
    setProcessing({ started: true, success: null });

    try {
      if (isFavorite) {
        await RemoveFromFavorites(movie);
        setIsFavorite(false);
      } else {
        await AddToFavorites(movie); // matches your Data.js signature :contentReference[oaicite:1]{index=1}
        setIsFavorite(true);
      }

      setProcessing({ started: true, success: true });
    } catch (error) {
      console.error("Favorite toggle error:", error);
      setProcessing({ started: true, success: false });
    } finally {
      setFavLoading(false);
    }
  };

  if (!movie) return null;

  const title =
    movie?.title ||
    movie?.original_title ||
    movie?.name ||
    movie?.original_name ||
    "";

  return (
    <div className="cta_buttons">
      {featured ? (
        <Link to={`/${mediaType}/${movie?.id}`}>
          <button>
            <MdArrowOutward className="icon play" />
            <span>More info</span>
          </button>
        </Link>
      ) : (
        <Link to={`/watch/${mediaType}/${title}/${movie?.id}`}>
          <button>
            <HiMiniPlay className="icon play" />
            <span>Watch Trailer</span>
          </button>
        </Link>
      )}

      <button
        onClick={handleFavoriteClick}
        className={`favorite-btn ${isFavorite ? "added" : ""}`}
        disabled={favLoading}
      >
        <TbStar className="icon" />
        <span>
          {favLoading ? "Saving..." : isFavorite ? "Remove Favorite" : "Add to Favorites"}
        </span>
      </button>
    </div>
  );
};

export default CTAButtons;
