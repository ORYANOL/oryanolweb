import React, { useState, useEffect } from "react";
import "../styles/TestProgressBar.css";

function TestProgressBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [yearProgress, setYearProgress] = useState(0);

  //update time
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  //update year progress
  useEffect(() => {
    const now = currentTime;
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOftheYear = new Date(now.getFullYear(), 11, 31);
    const elapsed = now - startOfYear;
    const total = endOftheYear - startOfYear;
    setYearProgress(elapsed / total);
  }, [currentTime]);

  const currentYear = currentTime.getFullYear();
  const progressPercentage = (yearProgress * 100).toFixed(0) + "%";

  return (
    <div className="progress-container">
      <p className="year-progress-label">
        {currentYear} is <span className="year-progress-pct">{progressPercentage}</span> complete
      </p>
      <div className="new-progress-bar">
        <div
          className="new-progress-bar-fill"
          style={{ width: progressPercentage }}
        >
          <span className="material-symbols-outlined plane-icon">flight</span>
        </div>
        <div className="progress-percentage">{`${progressPercentage} of ${currentYear}`}</div>
      </div>
    </div>
  );
}

export default TestProgressBar;
