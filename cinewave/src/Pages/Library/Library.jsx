import "./Library.scss";
import { BiLibrary } from "react-icons/bi";
import { useLoaderData } from "react-router-dom";
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";

const Library = () => {
  const { mobileView } = useContext(SharedContext);

  const data = useLoaderData();

  return (
    <div className="page library">
      {data.favData.length > 0 && (
        <MovieSection sectionTitle="✨ Favorites">
          {data.favData.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              type={mobileView ? "small" : "medium"}
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
              toggle
            />
          ))}
        </MovieSection>
      )}

      {data.bookmarkData.length > 0 && (
        <MovieSection sectionTitle="💫 Bookmarks">
          {data.bookmarkData.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              type={mobileView ? "small" : "medium"}
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
              toggle
            />
          ))}
        </MovieSection>
      )}

      {data.favData.length == 0 && data.bookmarkData.length == 0 && (
        <div className="placeholder">
          <BiLibrary className="placeholder_illustration" />
          <span className="placeholder_txt">Library is empty</span>
        </div>
      )}
    </div>
  );
};

export default Library;
