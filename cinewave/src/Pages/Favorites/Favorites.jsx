import React, { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { fetchFavorites } from "../../Data/Data"; // ✅ Import the fetch function
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";
import "./Favorites.scss";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";

const Favorites = () => {
  const { mobileView } = useContext(SharedContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFavorites = async () => {
      setLoading(true);
      try {
        const favData = await fetchFavorites();
        setFavorites(favData);
      } catch (error) {
        console.error("🔥 Error fetching favorites:", error);
      }
      setLoading(false);
    };

    getFavorites();
  }, []);

  if (loading) return <div className="loading-screen">Loading Favorites...</div>;

  return (
    <div className="page fav_page">
      {favorites.length > 0 ? (
        <MovieSection sectionTitle="✨ Favorites">
          {favorites.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/200x300"
              }
              type={mobileView ? "small" : "medium"}
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
              toggle
            />
          ))}
        </MovieSection>
      ) : (
        <div className="placeholder">
          <FiStar className="placeholder_illustration" />
          <span className="placeholder_txt">Favorites collection is empty</span>
        </div>
      )}
    </div>
  );
};

export default Favorites;
