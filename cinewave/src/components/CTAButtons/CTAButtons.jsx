import "./CTAButtons.scss";
import { HiMiniPlay } from "react-icons/hi2";
import { TbStar } from "react-icons/tb";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import { AddToFavorites, fetchFavorites } from "../../Data/Data";
import { useContext, useState, useEffect } from "react";
import { SharedContext } from "../../SharedContext";

const CTAButtons = ({ mediaType, movie, featured }) => {
  const { setProcessing } = useContext(SharedContext);
  const [isFavorite, setIsFavorite] = useState(false); // Track favorite status

  // Check if the movie is already a favorite when the component mounts
  useEffect(() => {
    if (movie?.id) {
      async function checkIfFavorite() {
        try {
          const favorites = await fetchFavorites();
          const alreadyFavorite = favorites.some((fav) => fav.id === movie.id);
          setIsFavorite(alreadyFavorite);
        } catch (error) {
          console.error("Failed to check favorites:", error);
        }
      }

      checkIfFavorite();
    }
  }, [movie?.id]);

  const handleClick = async () => {
    if (isFavorite) return;

    setProcessing({
      started: true,
      success: null,
    });

    try {
      await AddToFavorites(movie, mediaType);
      setProcessing({
        started: true,
        success: true,
      });
      setIsFavorite(true);
    } catch (error) {
      setProcessing({
        started: true,
        success: false,
      });
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  if (!movie) {
    console.warn("CTAButtons: No movie data provided!");
    return null; // Safeguard: Render nothing if no movie data is provided
  }

  const title =
    movie?.title ||
    movie?.original_title ||
    movie?.name ||
    movie?.original_name;

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
        onClick={handleClick}
        className={`favorite-btn ${isFavorite && "added"}`}
        disabled={isFavorite} // Disable button if already a favorite
      >
        <TbStar className="icon" />
        <span>{isFavorite ? "Added" : "Add to Favorites"}</span>
      </button>
    </div>
  );
};

export default CTAButtons;
