import "./SingleMovie.scss";
import Movie from "../../components/Movie/Movie";
import Cast from "../../components/CastProfile/Cast";

import { BiShareAlt, BiStar } from "react-icons/bi";
import { GoShare } from "react-icons/go";
import { FiBookmark, FiChevronsDown, FiChevronsUp } from "react-icons/fi";
import { PiArrowLeftBold } from "react-icons/pi";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import MovieInfo from "../../components/Movie/MovieInfo/MovieInfo";
import CTAButtons from "../../components/CTAButtons/CTAButtons";

const SingleMovie = () => {
  const navigate = useNavigate();

  const [expandOverview, setexpandOverview] = useState(false);

  const data = useLoaderData();
  const params = useParams();

  const title =
    data.movieDetails.title ||
    data.movieDetails.original_title ||
    data.movieDetails.name ||
    data.movieDetails.original_name;

  return (
    <div className="single_movie_page">
      <div className="movie_banner">
        <img
          src={`https://image.tmdb.org/t/p/original${data.movieDetails.backdrop_path}`}
          alt=""
        />
      </div>

      <header>
        <PiArrowLeftBold
          className="return action_icon"
          onClick={() => {
            navigate(-1);
          }}
        />

        <h2 className="movie_title" title={title}>
          {title}
        </h2>

        <div className="tools">
          <BiStar className="action_icon" />
          <GoShare className="action_icon" />
          <BiShareAlt className="action_icon" />
          <FiBookmark className="action_icon" />
        </div>
      </header>

      <div className="slide_container">
        {data.movieImages.backdrops.map((img) => (
          <div className="slide" key={img.file_path}>
            <img
              src={`https://image.tmdb.org/t/p/original${img.file_path}`}
              alt=""
            />
          </div>
        ))}
      </div>

      <div className="details_section">
        <div className="overview_section">
          <p className="section_title">Overview</p>

          <span className={`movie_overview ${expandOverview && "expand"}`}>
            {data.movieDetails.overview}
            <div
              className="show_more"
              onClick={() => {
                setexpandOverview((prev) => !prev);
              }}
            >
              {expandOverview ? (
                <>
                  Collapse
                  <FiChevronsUp />
                </>
              ) : (
                <>
                  Expand
                  <FiChevronsDown />
                </>
              )}
            </div>
          </span>

          <MovieInfo data={data.movieDetails} mediaType={params.mediaType} />

          <CTAButtons mediaType={params.mediaType} movie={data.movieDetails} />
        </div>

        <div className="cast_section">
          <p className="section_title">Cast</p>

          <div className="casts">
            <div className="wrapper">
              {data.cast.cast.map((cast) => (
                <Cast
                  key={cast.cast_id || Math.random() * 1000000}
                  profile={`https://image.tmdb.org/t/p/original${cast.profile_path}`}
                  name={cast.original_name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="more_info">
          <div className="similar_movies">
            <p className="section_title">Similar</p>

            <div className="wrapper">
              {data.similarMovies.map((movie) => {
                return (
                  <Movie
                    key={movie.id}
                    movie_banner={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    type="medium"
                    link={`/${params.mediaType}/${movie.id}`}
                    content={movie}
                  />
                );
              })}
            </div>
          </div>

          <div className="more_data">
            <p className="section_title">Info</p>

            <div className="content">
              <div className="data">
                <div className="key">Release Date</div>
                <span>-</span>
                <div className="val" title={data.movieDetails.release_date}>
                  {data.movieDetails.release_date}
                </div>
              </div>

              <hr />

              {params.mediaType == "tv" && (
                <>
                  <div className="data">
                    <div className="key">Seasons</div>
                    <span>-</span>

                    <div
                      className="val"
                      title={data.movieDetails.number_of_seasons}
                    >
                      {data.movieDetails.number_of_seasons}
                    </div>
                  </div>

                  <hr />

                  <div className="data">
                    <div className="key">Episodes</div>
                    <span>-</span>

                    <div
                      className="val"
                      title={data.movieDetails.number_of_episodes}
                    >
                      {data.movieDetails.number_of_episodes}
                    </div>
                  </div>
                </>
              )}

              <hr />

              <div className="data">
                <div className="key">Total Votes</div>
                <span>-</span>

                <div className="val" title={data.movieDetails.vote_count}>
                  {data.movieDetails.vote_count}
                </div>
              </div>

              <hr />

              <div className="data">
                <div className="key">Rating</div>
                <span>-</span>

                <div className="val" title={data.movieDetails.vote_average}>
                  {data.movieDetails.vote_average}
                </div>
              </div>

              <hr />

              <div className="data">
                <div className="key">Budget</div>
                <span>-</span>

                <div className="val" title={data.movieDetails.budget}>
                  {data.movieDetails.budget}
                </div>
              </div>

              <hr />

              <div className="data">
                <div className="key">Revenue</div>
                <span>-</span>

                <div className="val" title={data.movieDetails.revenue}>
                  {data.movieDetails.revenue}
                </div>
              </div>
              <hr />

              <div className="data">
                <div className="key">Popularity</div>
                <span>-</span>

                <div className="val" title={data.movieDetails.popularity}>
                  {data.movieDetails.popularity}
                </div>
              </div>
              <hr />

              <div className="data">
                <div className="key">Production Companies</div>
                <span>-</span>

                <div
                  className="val"
                  title={data.movieDetails.production_companies
                    .map((company) => {
                      return company.name;
                    })
                    .join(",")}
                >
                  {data.movieDetails.production_companies
                    .map((company) => {
                      return company.name;
                    })
                    .join(",")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMovie;
