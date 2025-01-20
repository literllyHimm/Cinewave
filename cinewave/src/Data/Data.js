import axios from "axios";
import { axiosInstance } from "./axios";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db,auth } from "../firebase";

// Create your account on TMDB and obtain your API key
const apiKey = "9e9ae8b4151b5a20e5c95911ff07c4e4";

// Movies
export async function Popular(mediaType) {
  if (mediaType === "movie" || mediaType === "tv") {
    const response = await axiosInstance.get(
      `/${mediaType}/popular?api_key=${apiKey}&language=en-US&page=1`
    );
    return response.data.results;
  } else {
    console.log("Invalid media type, supported media types are tv or movie");
  }
}

export async function TopRated(mediaType) {
  if (mediaType === "movie" || mediaType === "tv") {
    const response = await axiosInstance.get(
      `/${mediaType}/top_rated?api_key=${apiKey}&language=en-US&page=1`
    );
    return response.data.results;
  } else {
    console.log("Invalid media type, supported media types are tv or movie");
  }
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

// Fetch Movie or TV Genres
export async function fetchGenres(mediaType) {
  if (mediaType === "movie" || mediaType === "tv") {
    const response = await axiosInstance.get(
      `/genre/${mediaType}/list?api_key=${apiKey}`
    );
    return response.data.genres;
  } else {
    console.log("Invalid media type. Supported media types are: movie or tv");
    return [];
  }
}

// Fetch movies for a specific genre
export async function fetchMoviesByGenre(genreId) {
  const response = await axiosInstance.get(
    `/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
  );
  return response.data.results;
}

// Fetch all movies for a particular genre
export async function fetchSingleGenreMovies(genreId, mediaType, page = 1) {
  const source = axios.CancelToken.source();

  try {
    let response = await axiosInstance.get(
      `/discover/${mediaType}?api_key=${apiKey}&with_genres=${genreId}&page=${page}`,
      { cancelToken: source.token }
    );

    return {
      results: response.data.results,
      totalPages: response.data.total_pages, // Store total pages from API
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


// Fetch all movies or TV shows for all genres
export async function fetchGenreMovies(mediaType) {
  let genres = await fetchGenres(mediaType);

  let data = {};
  const source = axios.CancelToken.source();

  for (const element of genres) {
    const response = await axiosInstance.get(
      `/discover/${mediaType}?api_key=${apiKey}&with_genres=${element.id}&page=1`,
      {
        cancelToken: source.token,
      }
    );
    data[element.name] = response.data.results;
  }

  return data;
}

// Fetch a movie's genre
export async function getGenreList(ids, mediaType) {
  let genres = await fetchGenres(mediaType);
  let list = [];

  for (let i = 0; i < genres.length; i++) {
    if (ids.includes(genres[i].id)) {
      list.push(genres[i]);
    }
  }

  return list;
}

// Single Movie Page
export async function MovieDetails(mediaType, id) {
  const response = await axiosInstance.get(
    `/${mediaType}/${id}?api_key=${apiKey}`
  );

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

// Watch page
export async function WatchTrailer(mediaType, id) {
  const response = await axiosInstance.get(
    `/${mediaType}/${id}/videos?api_key=${apiKey}`
  );

  return response.data.results.find((data) => data.official);
}

// Search Results
export async function Search(queryString) {
  const response = await axiosInstance.get(
    `/search/movie?query=${queryString}&api_key=${apiKey}`
  );

  return response.data.results.slice(0, 8);
}

// Add movie to favorites
export async function AddToFavorites(movie) {
  if (!auth.currentUser) {
    console.error("🔥 User not authenticated.");
    return;
  }

  const userId = auth.currentUser.uid;
  const movieId = movie.id.toString();

  try {
    console.log("🔥 Attempting to add:", movie);

    // ✅ Correct Firestore path for user-specific favorites
    const movieRef = doc(db, `favorites/${userId}/movies`, movieId);
    await setDoc(movieRef, { ...movie, addedAt: new Date() }, { merge: true });

    console.log("✅ Added to Favorites:", movie);
  } catch (error) {
    console.error("🔥 Error adding to favorites:", error);
  }
}

// 🔹 Fetch user's favorites from Firestore
export async function fetchFavorites() {
  if (!auth.currentUser) {
    console.error("🔥 User not authenticated.");
    return [];
  }

  const userId = auth.currentUser.uid;
  try {
    console.log("✅ Fetching favorites for user:", userId);
    
    const favoritesRef = collection(db, `favorites/${userId}/movies`);
    const querySnapshot = await getDocs(favoritesRef);

    const favorites = querySnapshot.docs.map(doc => doc.data());
    console.log("✅ Retrieved Favorites:", favorites);

    return favorites;
  } catch (error) {
    console.error("🔥 Error fetching favorites:", error);
    return [];
  }
}

// Bookmark movie
export async function AddToBookmarks(movie, mediaType) {
  const user = auth.currentUser;
  if (!user) {
    console.error("🔥 User not authenticated.");
    return;
  }

  const userId = user.uid;
  const id = `${mediaType}-${movie.id}`;
  movie.media_type = mediaType;

  try {
    const docRef = doc(db, `bookmarks/${userId}/movies`, id);
    await setDoc(docRef, movie);
    console.log("✅ Added to Bookmarks:", movie);
  } catch (err) {
    console.error("🔥 Error adding to bookmarks:", err);
  }
}


export async function RemoveFromBookmarks(movie, mediaType) {
  const id = `${mediaType}-${movie.id}`;

  try {
    const docRef = doc(db, "bookmarks", id);
    return await deleteDoc(docRef);
  } catch (err) {
    console.log("An error occurred", err);
  }
}

// Fetch bookmarks
export async function fetchBookmarks() {
  if (!auth.currentUser) {
    console.error("🔥 User not authenticated.");
    return [];
  }

  const userId = auth.currentUser.uid;
  try {
    console.log("✅ Fetching bookmarks for user:", userId);
    
    const bookmarksRef = collection(db, `bookmarks/${userId}/movies`);
    const querySnapshot = await getDocs(bookmarksRef);

    const bookmarks = querySnapshot.docs.map(doc => doc.data());
    console.log("✅ Retrieved Bookmarks:", bookmarks);

    return bookmarks;
  } catch (error) {
    console.error("🔥 Error fetching bookmarks:", error);
    return [];
  }
}

