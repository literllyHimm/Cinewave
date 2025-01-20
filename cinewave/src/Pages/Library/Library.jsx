import React, { useEffect, useState } from "react";
import { BiLibrary } from "react-icons/bi";
import { fetchFavorites, fetchBookmarks } from "../../Data/Data"; // ✅ Import fetch functions
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";
import "./Library.scss";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";

const Library = () => {
  const { mobileView } = useContext(SharedContext);
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLibraryData = async () => {
      setLoading(true);
      try {
        const favData = await fetchFavorites();
        const bookmarkData = await fetchBookmarks();
        setFavorites(favData);
        setBookmarks(bookmarkData);
      } catch (error) {
        console.error("🔥 Error fetching library data:", error);
      }
      setLoading(false);
    };

    getLibraryData();
  }, []);

  if (loading) return <div className="loading-screen">Loading Library...</div>;

  return (
    <div className="page library">
      {favorites.length > 0 && (
        <MovieSection sectionTitle="✨ Favorites">
          {favorites.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : "https://via.placeholder.com/200x300"
              }
              type={mobileView ? "small" : "medium"}
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
              toggle
            />
          ))}
        </MovieSection>
      )}

      {bookmarks.length > 0 && (
        <MovieSection sectionTitle="💫 Bookmarks">
          {bookmarks.map((movie) => (
            <Movie
              key={movie.id}
              movie_banner={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : "https://via.placeholder.com/200x300"
              }
              type={mobileView ? "small" : "medium"}
              link={`/${movie.media_type}/${movie.id}`}
              content={movie}
              toggle
            />
          ))}
        </MovieSection>
      )}

      {favorites.length === 0 && bookmarks.length === 0 && (
        <div className="placeholder">
          <BiLibrary className="placeholder_illustration" />
          <span className="placeholder_txt">Library is empty</span>
        </div>
      )}
    </div>
  );
};

export default Library;
