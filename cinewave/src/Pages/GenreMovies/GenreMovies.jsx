import { Link, useLoaderData, useParams } from "react-router-dom";
import "./GenreMovies.scss";
import { MdOutlineMovie } from "react-icons/md";
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";
import { PiTelevision } from "react-icons/pi";

const GenreMovies = () => {
  const params = useParams();
  const data = useLoaderData();

  const title = params.mediaType == "movie" ? "Movie" : "TV";
  const Icon =
    params.mediaType == "movie" ? <MdOutlineMovie /> : <PiTelevision />;
  const link = params.mediaType == "movie" ? "movies" : "tv";

  return (
    <div className="page genre_movies">
      <div className="page_header">
        {Icon}
        <Link to={`/${link}`}>{title}</Link>
        &gt; {params.genre.slice(0, 1).toUpperCase()}
        {params.genre.slice(1)}
      </div>

      <MovieSection>
        {data.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="small"
            link={`/${movie.media_type || params.mediaType}/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>
    </div>
  );
};

export default GenreMovies;
