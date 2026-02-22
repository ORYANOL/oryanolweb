import React from 'react';
import { Link } from 'react-router-dom';

const SocialLinks = () => {
  return (
    <div className="social-links row">
      <div className="col">
        <a href="https://www.threads.net/@oryanol" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-square-threads" aria-label="Threads"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.facebook.com/oryanol/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook" aria-label="Facebook"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.instagram.com/oryanol/" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-instagram" aria-label="Instagram"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.reddit.com/user/ORYANOL" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-reddit" aria-label="Reddit"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.youtube.com/c/YannickOlivierOrounla" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-youtube" aria-label="YouTube"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://www.linkedin.com/in/yannickolivierorounla/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin" aria-label="LinkedIn"></i>
        </a>
      </div>
      <div className="col">
        <a href="https://oryanol.medium.com/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-medium" aria-label="Medium"></i>
        </a>
      </div>
      <div className="col">
        <Link to="/webtools">
          <i className="fa-solid fa-gear" aria-label="Web Tools"></i>
        </Link>
      </div>
    </div>
  );
};

export default SocialLinks;