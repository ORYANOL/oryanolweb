import React from 'react';
import { Link } from 'react-router-dom';

const SocialLinks = () => {
  return (
    <div className="social-links row">
      <div className="col">
        <a href="https://www.threads.net/@oryanol">
          {/* <i className="fab fa-twitter" ></i> */}
          <i class="fa-brands fa-square-threads" aria-label="Threads"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.facebook.com/oryanol/">
          <i className="fab fa-facebook" aria-label="Facebook"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.instagram.com/oryanol/">
          <i class="fa-brands fa-instagram" aria-label="Instagram"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.reddit.com/user/ORYANOL">
          <i className="fab fa-reddit" aria-label="Reddit"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.youtube.com/c/YannickOlivierOrounla">
          <i className="fab fa-youtube" aria-label="YouTube"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.linkedin.com/in/yannickolivierorounla/">
          <i className="fab fa-linkedin" aria-label="LinkedIn"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://oryanol.medium.com/">
          <i className="fab fa-medium" aria-label="Medium"></i>
        </a>
      </div>
      <div className="col">
        <Link to="/webtools">
          <i class="fa-solid fa-gear" aria-label="Web Tools"></i>
        </Link>
      </div>
    </div>
  );
};

export default SocialLinks;