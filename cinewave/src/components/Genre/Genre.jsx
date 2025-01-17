import "./Genre.scss";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const Genre = ({ banner, category, link }) => {
  return (
    <Link to={link} className={`genre ${category}`}>
      <img src={banner} alt="" />
      <span>{category}
      <FiArrowUpRight />
      </span>
    </Link>
  );
};

export default Genre;
