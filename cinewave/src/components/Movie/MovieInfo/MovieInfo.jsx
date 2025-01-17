import { useEffect, useState } from "react";
import "./MovieInfo.scss";
import { getGenreList } from "../../../Data/Data";
import { TbStar } from "react-icons/tb";
import { BiCollection } from "react-icons/bi";

const MovieInfo = ({ data, mediaType }) => {
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    if (data && mediaType) {
      if (data.genres) {
        // data.genres is only available in single movie page
        setGenreList(data.genres);
      } else {
        getGenreList(data.genre_ids, mediaType).then((data) => {
          setGenreList(data);
        });
      }
    }
  }, []);

  return (
    <div className="movie_info">
      <span>
        {new Date(data?.release_date || data?.first_air_date).getFullYear() ||
          "_"}
      </span>

      <div className="info rating">
        <TbStar className="icon" />
        <span>
          {data?.vote_average ? Number(data?.vote_average).toPrecision(2) : "_"}
        </span>
      </div>

      <div className="info genre_list">
        <BiCollection className="icon" />
        <span>{genreList.map((g) => g.name).join(", ")}</span>
      </div>
    </div>
  );
};

export default MovieInfo;
