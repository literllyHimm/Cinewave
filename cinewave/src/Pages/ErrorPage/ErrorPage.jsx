import "./ErrorPage.scss";
import { Link } from "react-router-dom";
import err_404 from "../../assets/others/err_404.svg";
import { TbReload } from "react-icons/tb";
import { HiArrowLeft } from "react-icons/hi";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <img src={err_404} alt="" />

      <h3>An error occurred</h3>
      <p>You might want to check your network connection</p>

      <div className="btn_wrapper">
        <Link to="/">
          <button>
            <HiArrowLeft />
            Return
          </button>
        </Link>

        <button onClick={() => location.reload()}>
          <TbReload />
          Reload
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
