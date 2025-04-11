import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="errorContainer">
      <div className="errorCode">
        <p className="para1">4</p>
        <p className="para2">0</p>
        <p className="para3">4</p>
      </div>
      <div className="errorTitle">Page Not Found</div>
      <div className="errorDescription">
        We can't seem to find that page. It might have been removed or doesn't
        exist anymore.
      </div>
      <button className="action" onClick={() => navigate(-1)}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
