import Movie from "../../components/Movie/Movie";
import { PiTelevision } from "react-icons/pi";
import { useRouteLoaderData } from "react-router-dom";
import MovieSection from "../../components/MovieSection/MovieSection";
import { useEffect, useState } from "react";
import { fetchGenreMovies } from "../../Data/Data";
import Loading from "../../components/Loading/Loading";

const TVShows = () => {
  const { popularShows, airingToday, topRatedShows } =
    useRouteLoaderData("root");
  const [tv, setTv] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenreMovies("tv")
      .then((data) => {
        setLoading(false);
        setTv(data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div className="page tv">
      <div className="page_header">
        <PiTelevision />
        TV Shows
      </div>

      {loading && <Loading />}

      <MovieSection>
        {popularShows?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="wide"
            link={`/tv/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Top Rated Shows">
        {topRatedShows?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/tv/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Airing Today">
        {airingToday?.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="wide"
            link={`/tv/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection
        sectionTitle="TV > Action & Adventure"
        link="/tv/all/Action & Adventure"
      >
        {tv["Action & Adventure"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="long"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Animation" link="/tv/all/Animation">
        {tv["Animation"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="medium"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Comedy" link="/tv/all/Comedy">
        {tv["Comedy"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="small"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Crime" link="/tv/all/Crime">
        {tv["Crime"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="medium"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Documentary" link="/tv/all/Documentary">
        {tv["Documentary"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="wide"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Drama" link="/tv/all/Drama">
        {tv["Drama"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="long"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Family" link="/tv/all/Family">
        {tv["Family"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="medium"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Kids" link="/tv/all/Kids">
        {tv["Kids"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="small"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Mystery" link="/tv/all/Mystery">
        {tv["Mystery"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="long"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > News" link="/tv/all/News">
        {tv["News"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="wide"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Reality" link="/tv/all/Reality">
        {tv["Reality"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="medium"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection
        sectionTitle="TV > Sci-Fi & Fantasy"
        link="/tv/all/Sci-Fi & Fantasy"
      >
        {tv["Sci-Fi & Fantasy"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="wide"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Soap" link="/tv/all/Soap">
        {tv["Soap"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="wide"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Talk" link="/tv/all/Talk">
        {tv["Talk"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="medium"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection
        sectionTitle="TV > War & Politics"
        link="/tv/all/War & Politics"
      >
        {tv["War & Politics"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            type="long"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="TV > Western" link="/tv/all/Western">
        {tv["Western"]?.map((tv) => (
          <Movie
            key={tv.id}
            movie_banner={`https://image.tmdb.org/t/p/original${tv.poster_path}`}
            type="small"
            link={`/tv/${tv.id}`}
            content={tv}
          />
        ))}
      </MovieSection>
    </div>
  );
};

export default TVShows;
