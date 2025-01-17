import "./Cast.scss";

const Cast = ({ profile, name }) => {
  return (
    <div className="cast">
      <img src={profile} alt="" />

      <span className="name">{name}</span>
    </div>
  );
};

export default Cast;
