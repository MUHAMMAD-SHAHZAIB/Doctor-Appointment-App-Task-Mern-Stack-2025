
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="container not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/">
          <Button text="Go to Home" variant="primary" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
