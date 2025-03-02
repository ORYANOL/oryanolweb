import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="text-center">
        Designed and built by ORYANOL &copy; {currentYear}
      </p>
    </footer>
  );
};

export default Footer;