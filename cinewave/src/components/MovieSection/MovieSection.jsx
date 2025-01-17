import "./MovieSection.scss";
import { Link } from "react-router-dom";
import { HiArrowNarrowRight } from "react-icons/hi";

const MovieSection = ({ sectionTitle, link, children }) => {
  return (
    <section className="movie_section">
      {sectionTitle && (
        <header>
          <span className="section_title">{sectionTitle}</span>
          {link && (
            <Link to={link}>
              <HiArrowNarrowRight className="action_icon more" />
            </Link>
          )}
        </header>
      )}

      <div className="movies_wrapper">{children}</div>
    </section>
  );
};

export default MovieSection;
