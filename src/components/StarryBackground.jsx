// components/StarryBackground.jsx
import React, { useEffect } from 'react';
import '../styles/StarryBackground.css';

const StarryBackground = () => {
    useEffect(() => {
        const createStars = () => {
            const starsContainer = document.querySelector('.stars-container');
            if (!starsContainer) return;

            // Clear any existing stars
            starsContainer.innerHTML = '';

            // Create regular stars
            const starsCount = 80;

            for (let i = 0; i < starsCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';

                // Random size between 1 and 3 pixels
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;

                // Random position
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                star.style.left = `${posX}%`;
                star.style.top = `${posY}%`;

                // Random animation delay
                const delay = Math.random() * 5;
                const duration = Math.random() * 3 + 2;
                star.style.animation = `twinkle ${duration}s infinite ${delay}s`;

                starsContainer.appendChild(star);
            }

            // Create shooting stars
            for (let i = 0; i < 3; i++) {
                const shootingStar = document.createElement('div');
                shootingStar.className = 'shooting-star';

                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                shootingStar.style.left = `${posX}%`;
                shootingStar.style.top = `${posY}%`;

                const delay = Math.random() * 15;
                shootingStar.style.animationDelay = `${delay}s`;

                // Random rotation between 0 and 45 degrees
                const rotation = Math.random() * 45;
                shootingStar.style.transform = `rotate(${rotation}deg)`;

                starsContainer.appendChild(shootingStar);
            }
        };

        // Create stars when component mounts
        createStars();

        // Recreate stars when window is resized
        window.addEventListener('resize', createStars);

        // Cleanup
        return () => {
            window.removeEventListener('resize', createStars);
        };
    }, []);

    return (
        <div className="night-sky-container">
            <div className="stars-container"></div>
            <div className="star-fade-overlay"></div>
        </div>
    );
};

export default StarryBackground;