import { Link } from "react-router-dom";
import "./ResMovie.scss";

const ResMovie = ({ content, onclick }) => {
  const title = content?.title || content?.original_title;

  return (
    <Link to={`/movie/${content?.id}`}>
      <div className="res_movie" onClick={onclick}>
        <img
          src={`https://image.tmdb.org/t/p/original${content.poster_path}`}
          alt=""
          className="poster"
        />

        <div className="details">
          <span className="title">{title || "Loading..."}</span>

          <div className="info">
            <span>{new Date(content?.release_date).getFullYear()}</span>
            <span>{Number(content?.vote_average).toPrecision(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResMovie;
