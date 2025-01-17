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
import { db } from "../firebase";

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
export async function fetchSingleGenreMovies(genreId, mediaType) {
  const source = axios.CancelToken.source();

  try {
    let allResults = [];
    for (let i = 1; i <= 3; i++) {
      const response = await axiosInstance.get(
        `/discover/${mediaType}?api_key=${apiKey}&with_genres=${genreId}&page=${i}`,
        { cancelToken: source.token }
      );
      allResults = allResults.concat(response.data.results);
    }
    return allResults;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Operation aborted");
    } else {
      source.cancel();
      console.log(`Unable to fetch ${mediaType}/${genreId} movies =>`, error);
    }
    return [];
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
export async function AddToFavorites(movie, mediaType) {
  const id = `${mediaType}-${movie.id}`;

  movie.media_type = movie.media_type || mediaType;

  try {
    const docRef = doc(db, "favorites", id);
    return await setDoc(docRef, movie);
  } catch (err) {
    console.log("An error occurred", err);
  }
}

// Fetch favorites
export async function fetchFavorites() {
  const data = await getDocs(collection(db, "favorites"));
  const fav = [];
  data.forEach((doc) => {
    fav.push(doc.data());
  });
  return fav;
}

// Bookmark movie
export async function AddToBookmarks(movie, mediaType) {
  const id = `${mediaType}-${movie.id}`;

  movie.media_type = movie.media_type || mediaType;

  try {
    const docRef = doc(db, "bookmarks", id);
    return await setDoc(docRef, movie);
  } catch (err) {
    console.log("An error occurred", err);
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
  const data = await getDocs(collection(db, "bookmarks"));
  const fav = [];
  data.forEach((doc) => {
    fav.push(doc.data());
  });
  return fav;
}
