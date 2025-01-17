import { FiStar } from "react-icons/fi";
import { useLoaderData } from "react-router-dom";
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";
import "./Favorites.scss";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";

const Favorites = () => {
  const { mobileView } = useContext(SharedContext);
  const data = useLoaderData();
  console.log("Favorites data:", data);
  
  // Safeguard against null or undefined data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="page fav_page">
        <div className="placeholder">
          <FiStar className="placeholder_illustration" />
          <span className="placeholder_txt">Favorites collection is empty</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page fav_page">
      <MovieSection sectionTitle="✨ Favorites">
        {data.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            type={mobileView ? "small" : "medium"}
            link={`/${movie.media_type}/${movie.id}`}
            content={movie}
            toggle
          />
        ))}
      </MovieSection>
    </div>
  );
};

export default Favorites;
