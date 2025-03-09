import React, { useContext } from 'react';
import SocialLinks from '../components/SocialLinks.jsx';
import { ThemeContext } from '../contexts/ThemeContext.jsx';
import profileImg from '/img/profile.png';
import TestProgressBar from '../components/TestProgressBar.jsx';

const Home = () => {
  const { toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className="row text-center">
      <div className="col-md-12">
        <div className="text-center">
          <img
            src={profileImg}
            alt="Profile image"
            className="profile-img rounded"
            onClick={toggleDarkMode}
          />
        </div>
        <div className="card-content description">
          <h2>Yannick Olivier Orounla</h2>
          <h4><small>Aerospace Engineer and Tech Enthusiast</small></h4>
        </div>
        <TestProgressBar />
        <SocialLinks />
      </div>
    </div>
  );
};

export default Home;