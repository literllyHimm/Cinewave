import { Suspense, lazy, useContext } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SharedContext } from "./SharedContext";
import Loading from "./components/Loading/Loading";

const App = lazy(() => import("./App"));
const Home = lazy(() => import("./Pages/Home/Home"));
const Movies = lazy(() => import("./Pages/Movies/Movies"));
const Favorites = lazy(() => import("./Pages/Favorites/Favorites"));
const Library = lazy(() => import("./Pages/Library/Library"));
const SingleMovie = lazy(() => import("./Pages/SingleMovie/SingleMovie"));
const TVShows = lazy(() => import("./Pages/TVShows/TVShows"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage/ErrorPage"));
const WatchPage = lazy(() => import("./Pages/WatchPage/WatchPage"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Register = lazy(() => import("./Pages/Register/Register"));
const Settings = lazy(() => import("./Pages/Setting/Setting"));
const SelectGenres = lazy(() => import("./Pages/Register/SelectGenres"));

import {
  AiringToday,
  MovieCredits,
  MovieDetails,
  MovieImages,
  NowPlaying,
  Popular,
  SimilarMovies,
  TopRated,
  Trending,
  Upcoming,
  WatchTrailer,
  fetchBookmarks,
  fetchFavorites,
  fetchGenres,
  fetchSingleGenreMovies,
} from "./Data/Data";

// 🔹 Private Route Component (Checks Authentication)
const PrivateRoute = ({ children }) => {
  const { user } = useContext(SharedContext);
  return user ? children : <Navigate to="/login" replace />;
};

// 🔹 Data Loader for Home Page
async function DataLoader() {
  try {
    const [
      popularMovies,
      topRatedMovies,
      nowPlaying,
      trending,
      upcoming,
      popularShows,
      topRatedShows,
      airingToday,
    ] = await Promise.all([
      Popular("movie"),
      TopRated("movie"),
      NowPlaying(),
      Trending(),
      Upcoming(),
      Popular("tv"),
      TopRated("tv"),
      AiringToday(),
    ]);

    return {
      popularMovies,
      topRatedMovies,
      nowPlaying,
      trending,
      upcoming,
      popularShows,
      topRatedShows,
      airingToday,
    };
  } catch {
    return null;
  }
}

// 🔹 Data Loader for Single Movie Page
async function SingleMovieLoader({ params }) {
  try {
    const [movieDetails, movieImages, similarMovies, cast] = await Promise.all([
      MovieDetails(params.mediaType, params.id),
      MovieImages(params.mediaType, params.id),
      SimilarMovies(params.mediaType, params.id),
      MovieCredits(params.mediaType, params.id),
    ]);

    return {
      movieDetails,
      movieImages,
      similarMovies,
      cast,
    };
  } catch {
    return null;
  }
}

// 🔹 Data Loader for Genre Movies Page
async function SingleGenreMoviesLoader({ params }) {
  try {
    let genres = await fetchGenres(params.mediaType);
    let genre = genres.find(
      (genre) => genre.name.toLowerCase() === params.genre.toLowerCase()
    );

    const genreId = genre.id;
    return await fetchSingleGenreMovies(genreId, params.mediaType);
  } catch {
    return null;
  }
}

// 🔹 Data Loader for Watch Trailer Page
async function WatchPageLoader({ params }) {
  try {
    return WatchTrailer(params.mediaType, params.id);
  } catch (error) {
    return error;
  }
}

// 🔹 Data Loader for Favorites
async function favoritesLoader() {
  try {
    const data = await fetchFavorites();
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return null;
  }
}

// 🔹 Data Loader for Library (Favorites & Bookmarks)
async function LibLoader() {
  try {
    const favData = await fetchFavorites();
    const bookmarkData = await fetchBookmarks();

    return { favData: favData || [], bookmarkData: bookmarkData || [] }; // ✅ Ensure it's always an object
  } catch (error) {
    console.error("Error loading Library data:", error);
    return { favData: [], bookmarkData: [] }; // ✅ Return an empty object to prevent undefined errors
  }
}


// 🔹 Define Routes
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    ),
    loader: DataLoader,
    errorElement: (
      <Suspense fallback={<Loading />}>
        <ErrorPage />
      </Suspense>
    ),
    id: "root",

    children: [
      { path: "/register", element: <Suspense fallback={<Loading />}><Register /></Suspense> },
      { path: "/login", element: <Suspense fallback={<Loading />}><Login /></Suspense> },

      // 🔒 Protected Routes
      { path: "/settings", element: <PrivateRoute><Suspense fallback={<Loading />}><Settings /></Suspense></PrivateRoute> },
      { path: "/favorites", element: <PrivateRoute><Suspense fallback={<Loading />}><Favorites /></Suspense></PrivateRoute> },
      { path: "/library", element: <PrivateRoute><Suspense fallback={<Loading />}><Library /></Suspense></PrivateRoute> },

      // Public Routes
      { index: true, element: <Suspense fallback={<Loading />}><Home /></Suspense> },
      { path: "movies", element: <Suspense fallback={<Loading />}><Movies /></Suspense> },
      { path: "tv", element: <Suspense fallback={<Loading />}><TVShows /></Suspense> },

      // ✅ Genre Movies Page (single correct route)
      {
        path: "/:mediaType/all/:genre",
        loader: SingleGenreMoviesLoader,
        
      },

      { path: "/select-genres", element: <Suspense fallback={<Loading />}><SelectGenres /></Suspense> },
      { path: "/:mediaType/:id", loader: SingleMovieLoader, element: <Suspense fallback={<Loading />}><SingleMovie /></Suspense> },
      { path: "/watch/:mediaType/:title/:id", loader: WatchPageLoader, element: <Suspense fallback={<Loading />}><WatchPage /></Suspense> },
    ]

  },
]);
