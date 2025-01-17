import Featured from "../../components/Featured/Featured";
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";

import dune from "../../assets/movies/dune.png";
import fav from "../../assets/movies/fav.gif";
import Genre from "../../components/Genre/Genre";

import action from "../../assets/genre/action.png";
import adventure from "../../assets/genre/adventure.png";
import animated from "../../assets/genre/animated.png";
import comedy from "../../assets/genre/comedy.png";
import scifi from "../../assets/genre/sci-fi.png";
import war from "../../assets/genre/war.png";
import fantasy from "../../assets/genre/fantasy.png";
import crime from "../../assets/genre/crime.png";
import drama from "../../assets/genre/drama.jpg";
import family from "../../assets/genre/family.jpg";
import horror from "../../assets/genre/horror.jpg";
import music from "../../assets/genre/music.jpg";
import mystery from "../../assets/genre/mystery.jpg";
import tvmovie from "../../assets/genre/tvmovie.jpg";
import thriller from "../../assets/genre/thriller.jpg";

import { useRouteLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBookmarks, fetchFavorites } from "../../Data/Data";

const Home = () => {
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const data = useRouteLoaderData("root");

  useEffect(() => {
    fetchFavorites()
      .then((data) => setFavorites(data.slice(0, 6)))
      .catch((err) => {
        console.log("An error occurred while fetching favorites", err);
        alert("Unable to fetch favorites");
      });

    fetchBookmarks()
      .then((data) => setBookmarks(data.slice(0, 6)))
      .catch((err) => {
        console.log("An error occurred while fetching favorites", err);
        alert("Unable to fetch favorites");
      });
  }, []);

  return (
    <>
      <Featured />

      <MovieSection sectionTitle="Popular Movies" link="/movies">
        {data.popularMovies.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Genres">
        <Genre link={"/movie/all/action"} banner={action} category="Action" />
        <Genre
          link={"/movie/all/Animation"}
          banner={animated}
          category="Animation"
        />
        <Genre
          link={"/movie/all/Adventure"}
          banner={adventure}
          category="Adventure"
        />
        <Genre link={"/movie/all/Comedy"} banner={comedy} category="Comedy" />
        <Genre
          link={"/movie/all/Science Fiction"}
          banner={scifi}
          category="Science Fiction"
        />
        <Genre link={"/movie/all/War"} banner={war} category="War" />
        <Genre
          link={"/movie/all/Fantasy"}
          banner={fantasy}
          category="Fantasy"
        />
        <Genre link={"/movie/all/Crime"} banner={crime} category="Crime" />
        <Genre link={"/movie/all/Drama"} banner={drama} category="Drama" />
        <Genre link={"/movie/all/Family"} banner={family} category="Family" />
        <Genre link={"/movie/all/Horror"} banner={horror} category="Horror" />
        <Genre link={"/movie/all/Music"} banner={music} category="Music" />
        <Genre
          link={"/movie/all/Mystery"}
          banner={mystery}
          category="Mystery"
        />
        <Genre
          link={"/movie/all/TV Movie"}
          banner={tvmovie}
          category="TV Movie"
        />
        <Genre
          link={"/movie/all/Thriller"}
          banner={thriller}
          category="Thriller"
        />
      </MovieSection>

      <MovieSection sectionTitle="✨ My Favorites Collection" link="/favorites">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              type="medium"
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
            />
          ))
        ) : (
          <div className="fav_wrapper">
            <img src={fav} alt="" className="fav_gif" />
          </div>
        )}
      </MovieSection>

      <MovieSection sectionTitle="Top Rated Movies">
        {data.topRatedMovies.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Now Playing">
        {data.nowPlaying.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="wide"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Trending Movies" link="/movies">
        {data.trending.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/${movie.media_type}/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Upcoming Movies" link="/movies">
        {data.upcoming.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/movie/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="💫 My Bookmarks Collection" link="/library">
        {bookmarks.length > 0 ? (
          bookmarks.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              type="medium"
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
            />
          ))
        ) : (
          <div className="fav_wrapper">
            <img src={fav} alt="" className="fav_gif" />
          </div>
        )}
      </MovieSection>

      <MovieSection sectionTitle="Popular TV Shows" link="/tv">
        {data.popularShows.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="long"
            link={`/tv/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Top Rated Shows" link="/tv">
        {data.topRatedShows.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            type="medium"
            link={`/tv/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>

      <MovieSection sectionTitle="Airing-Today TV Shows" link="/tv">
        {data.airingToday.map((movie) => (
          <Movie
            key={movie.id}
            movie_banner={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            type="wide"
            link={`/tv/${movie.id}`}
            content={movie}
          />
        ))}
      </MovieSection>
    </>
  );
};

export default Home;
