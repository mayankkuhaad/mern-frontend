
const Loader = ({message}) => {
  return <div className="loading">
    <div></div>
    <p>{message || "Loading..."} </p>
  </div>;
};

export default Loader;