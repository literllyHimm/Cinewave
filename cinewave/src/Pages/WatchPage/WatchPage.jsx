import "./WatchPage.scss";
import { FaChevronLeft } from "react-icons/fa";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";

const WatchPage = () => {
  const navigate = useNavigate();
  const data = useLoaderData();
  const { title } = useParams();

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="page watch">
      <header>
        <FaChevronLeft
          className="return action_icon"
          onClick={() => {
            navigate(-1);
          }}
        />

        <h3>{title}</h3>
      </header>

      <div className="video-container">
        <YouTube className="yt" videoId={data.key} opts={opts} loading="lazy" />
      </div>
    </div>
  );
};

export default WatchPage;
