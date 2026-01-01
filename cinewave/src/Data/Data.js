import axios from "axios";
import { axiosInstance } from "./axios";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

// ---------- TMDB HELPERS ----------
function assertMediaType(mediaType) {
  return mediaType === "movie" || mediaType === "tv";
}

function resolveMediaType(mediaType, item) {
  return (
    mediaType ??
    item?.media_type ??
    (item?.first_air_date || item?.name || item?.original_name ? "tv" : "movie")
  );
}

// ---------- HOME / LISTS ----------
export async function Popular(mediaType) {
  if (!assertMediaType(mediaType)) {
    console.log("Invalid media type, supported media types are tv or movie");
    return [];
  }
  const response = await axiosInstance.get(
    `/${mediaType}/popular?api_key=${apiKey}&language=en-US&page=1`
  );
  return response.data.results;
}

export async function TopRated(mediaType) {
  if (!assertMediaType(mediaType)) {
    console.log("Invalid media type, supported media types are tv or movie");
    return [];
  }
  const response = await axiosInstance.get(
    `/${mediaType}/top_rated?api_key=${apiKey}&language=en-US&page=1`
  );
  return response.data.results;
}

export async function NowPlaying() {
  const response = await axiosInstance.get(
    `/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
  );
  return response.data.results;
}

export async function Trending() {
  const response = await axiosInstance.get(
    `/trending/all/week?api_key=${apiKey}&language=en-US&page=1`
  );
  return response.data.results;
}

export async function Upcoming() {
  const response = await axiosInstance.get(
    `/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
  );
  return response.data.results;
}

// TV Shows
export async function AiringToday() {
  const response = await axiosInstance.get(
    `/tv/airing_today?api_key=${apiKey}&language=en-US&page=1`
  );
  return response.data.results;
}

// ---------- GENRES ----------
export async function fetchGenres(mediaType) {
  if (!assertMediaType(mediaType)) {
    console.log("Invalid media type. Supported media types are: movie or tv");
    return [];
  }
  const response = await axiosInstance.get(
    `/genre/${mediaType}/list?api_key=${apiKey}`
  );
  return response.data.genres;
}

export async function fetchMoviesByGenre(genreId) {
  const response = await axiosInstance.get(
    `/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
  );
  return response.data.results;
}

export async function fetchSingleGenreMovies(genreId, mediaType, page = 1) {
  const source = axios.CancelToken.source();
  try {
    const response = await axiosInstance.get(
      `/discover/${mediaType}?api_key=${apiKey}&with_genres=${genreId}&page=${page}`,
      { cancelToken: source.token }
    );

    return {
      results: response.data.results,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Operation aborted");
    } else {
      source.cancel();
      console.log(`Unable to fetch ${mediaType}/${genreId} movies =>`, error);
    }
    return { results: [], totalPages: 1 };
  }
}

export async function fetchGenreMovies(mediaType) {
  const genres = await fetchGenres(mediaType);
  const data = {};
  const source = axios.CancelToken.source();

  for (const element of genres) {
    const response = await axiosInstance.get(
      `/discover/${mediaType}?api_key=${apiKey}&with_genres=${element.id}&page=1`,
      { cancelToken: source.token }
    );
    data[element.name] = response.data.results;
  }

  return data;
}

export async function getGenreList(ids, mediaType) {
  const genres = await fetchGenres(mediaType);
  return genres.filter((g) => ids.includes(g.id));
}

// ---------- DETAILS ----------
export async function MovieDetails(mediaType, id) {
  const response = await axiosInstance.get(`/${mediaType}/${id}?api_key=${apiKey}`);
  return response.data;
}

export async function MovieImages(mediaType, id) {
  const response = await axiosInstance.get(
    `/${mediaType}/${id}/images?api_key=${apiKey}`
  );
  return response.data;
}

export async function SimilarMovies(mediaType, id) {
  const response = await axiosInstance.get(
    `/${mediaType}/${id}/similar?api_key=${apiKey}`
  );
  return response.data.results;
}

export async function MovieCredits(mediaType, id) {
  const response = await axiosInstance.get(
    `/${mediaType}/${id}/credits?api_key=${apiKey}`
  );
  return response.data;
}

export async function WatchTrailer(mediaType, id) {
  const response = await axiosInstance.get(
    `/${mediaType}/${id}/videos?api_key=${apiKey}`
  );
  return response.data.results.find((data) => data.official);
}

// ---------- SEARCH ----------
export async function Search(queryString) {
  // Keeping your original behavior (movie search only)
  const response = await axiosInstance.get(
    `/search/movie?query=${encodeURIComponent(queryString)}&api_key=${apiKey}`
  );
  return response.data.results.slice(0, 8);
}

// ---------- FIRESTORE: FAVORITES ----------
export async function AddToFavorites(movie, mediaType) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userId = user.uid;
  const movieId = movie.id.toString();
  const resolvedType = resolveMediaType(mediaType, movie);

  const movieRef = doc(db, `favorites/${userId}/movies`, movieId);

  await setDoc(
    movieRef,
    { ...movie, media_type: resolvedType, addedAt: new Date() },
    { merge: true }
  );

  return true;
}

export async function RemoveFromFavorites(movie) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userId = user.uid;
  const movieId = movie.id.toString();

  const movieRef = doc(db, `favorites/${userId}/movies`, movieId);
  await deleteDoc(movieRef);

  return true;
}

export async function fetchFavorites() {
  const user = auth.currentUser;
  if (!user) return [];

  const userId = user.uid;
  const favoritesRef = collection(db, `favorites/${userId}/movies`);
  const querySnapshot = await getDocs(favoritesRef);

  return querySnapshot.docs.map((d) => d.data());
}

// ---------- FIRESTORE: BOOKMARKS ----------
export async function AddToBookmarks(movie, mediaType) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userId = user.uid;
  const resolvedType = resolveMediaType(mediaType, movie);
  const id = `${resolvedType}-${movie.id}`;

  const docRef = doc(db, `bookmarks/${userId}/movies`, id);

  // ✅ do NOT mutate "movie"
  await setDoc(
    docRef,
    { ...movie, media_type: resolvedType, addedAt: new Date() },
    { merge: true }
  );

  return true;
}

export async function RemoveFromBookmarks(movie, mediaType) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userId = user.uid;
  const resolvedType = resolveMediaType(mediaType, movie);
  const id = `${resolvedType}-${movie.id}`;

  const docRef = doc(db, `bookmarks/${userId}/movies`, id);
  await deleteDoc(docRef);

  return true;
}

export async function fetchBookmarks() {
  const user = auth.currentUser;
  if (!user) return [];

  const userId = user.uid;
  const bookmarksRef = collection(db, `bookmarks/${userId}/movies`);
  const querySnapshot = await getDocs(bookmarksRef);

  return querySnapshot.docs.map((d) => d.data());
}
