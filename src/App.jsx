import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import IOWebTools from './pages/IOWebTools';
import ChargeCheck from './pages/ChargeCheck';
import './styles/main.css';

function App() {
  return (
    <ThemeProvider>
      <div id="app-container">
        <div className="container-fluid">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/webtools" element={<IOWebTools />} />
              <Route path="/chargecheck" element={<ChargeCheck />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;