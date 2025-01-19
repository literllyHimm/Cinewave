import "./Library.scss";
import { BiLibrary } from "react-icons/bi";
import { useLoaderData } from "react-router-dom";
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";

const Library = () => {
  const { mobileView } = useContext(SharedContext);
  const data = useLoaderData() || {}; // ✅ Ensure `data` is always an object

  const favData = data.favData || []; // ✅ Default to empty array if undefined
  const bookmarkData = data.bookmarkData || []; // ✅ Default to empty array if undefined

  return (
    <div className="page library">
      {favData.length > 0 && (
        <MovieSection sectionTitle="✨ Favorites">
          {favData.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : "https://via.placeholder.com/200x300" // ✅ Prevent missing images
              }
              type={mobileView ? "small" : "medium"}
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
              toggle
            />
          ))}
        </MovieSection>
      )}

      {bookmarkData.length > 0 && (
        <MovieSection sectionTitle="💫 Bookmarks">
          {bookmarkData.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : "https://via.placeholder.com/200x300" // ✅ Prevent missing images
              }
              type={mobileView ? "small" : "medium"}
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
              toggle
            />
          ))}
        </MovieSection>
      )}

      {favData.length === 0 && bookmarkData.length === 0 && (
        <div className="placeholder">
          <BiLibrary className="placeholder_illustration" />
          <span className="placeholder_txt">Library is empty</span>
        </div>
      )}
    </div>
  );
};

export default Library;
