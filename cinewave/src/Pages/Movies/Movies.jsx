import { useEffect, useState } from "react";
import Movie from "../../components/Movie/Movie";
import { MdOutlineMovie } from "react-icons/md";
import { useRouteLoaderData } from "react-router-dom";
import { fetchGenreMovies } from "../../Data/Data";
import MovieSection from "../../components/MovieSection/MovieSection";
import Loading from "../../components/Loading/Loading";

const Movies = () => {
  const { topRatedMovies, trending, popularMovies } =
    useRouteLoaderData("root");
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenreMovies("movie")
      .then((data) => {
        setLoading(false);
        setMovies(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  return (
    <div className="page movies_page">
      <div className="page_header">
        <MdOutlineMovie />
        Movies
      </div>

      {loading && <Loading />}

      <MovieSection>
        {trending?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="wide"
            link={`/${movie.media_type}/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Popular Movies">
        {popularMovies?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Top Rated Movies">
        {topRatedMovies?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection
        sectionTitle="Movies > Adventure"
        link="/movie/all/adventure"
      >
        {movies.Adventure?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Action" link="/movie/all/action">
        {movies.Action?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection
        sectionTitle="Movies > Animation"
        link="/movie/all/animation"
      >
        {movies.Animation?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="small"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Comedy" link="/movie/all/comedy">
        {movies.Comedy?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Crime" link="/movie/all/crime">
        {movies.Crime?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Horror" link="/movie/all/horror">
        {movies.Horror?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="small"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Family" link="/movie/all/family">
        {movies.Family?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="wide"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Fantasy" link="/movie/all/fantasy">
        {movies.Fantasy?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Music" link="/movie/all/music">
        {movies.Music?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="small"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Mystery" link="/movie/all/mystery">
        {movies.Mystery?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Drama" link="/movie/all/drama">
        {movies.Drama?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="small"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection
        sectionTitle="Movies > Science Fiction"
        link="/movie/all/science fiction"
      >
        {movies["Science Fiction"]?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > War" link="/movie/all/war">
        {movies.War?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > Thriller" link="/movie/all/thriller">
        {movies.Thriller?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Movies > TV Movie" link="/movie/all/tv movie">
        {movies["TV Movie"]?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="wide"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>
    </div>
  );
};

export default Movies;
