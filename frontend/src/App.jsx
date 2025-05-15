import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import Programs from './Components/Programs/Programs';
import Title from './Components/Title/Title';
import About from './Components/About/About';
import Campus from './Components/Campus/Campus';
import Testimonals from './Components/Testimonals/Testimonals';
import Contact from './Components/Contact/Contact';
import Footer from './Components/Footer/Footer';
import FWHM from './Components/FWHM/FWHM';
import FWCal from './Components/FWCal/FWCal';
import Explore from './Components/Explore/Explore';
import ExploreNavbar from './Components/Navbar/ExploreNavbar'; // Custom navbar for /explore
import ExploreFacts from './Components/ExploreFacts/ExploreFacts'; 
import Scroll from './scroll.jsx'
import ChatBotWidget from './Components/Chatbot/ChatbotWidget.jsx';
import ExploreQuiz from './Components/ExploreQuiz/ExploreQuiz.jsx';
import FibreComparison from './Components/Explore/FiberComparison.jsx';





const App = () => {
  const [playState, setPlayState] = useState(false);
  const location = useLocation();

  const isExplorePage = location.pathname === '/explore';
  const isExploreFactsPage = location.pathname === '/explore-facts';
  const isExploreQuizPage = location.pathname ==='/explore-quiz'
  const isFiberComparisonPage = location.pathname === '/fiber-comparison'

  return (
    <>
      {/* Conditional navbar */}
      {isExplorePage || isExploreFactsPage || isExploreQuizPage || isFiberComparisonPage ? <ExploreNavbar /> : <Navbar />}
      <Scroll/>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Hero />
              <div className="container">
                <Title subtitle="Working" title="How FBGs Work?" />
                <Programs />
                <About setPlayState={setPlayState} />
                <FWHM setPlayState={setPlayState} />
                <FWCal setPlayState={setPlayState} />
                <Title subtitle="Let Us Read About" title="Some Interesting Facts.." />
                <Campus />
                <Title subtitle="Testimonals" title="What Users Say" />
                <Testimonals />
                <Title subtitle="Contact Us" title="Get in Touch" />
                <Contact />
              </div>
            </div>
          }
        />

        {/* Other Routes */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore-facts" element={<ExploreFacts />} /> 
        <Route path="/explore-quiz" element={<ExploreQuiz />} />
        <Route path="/fiber-comparison" element={<FibreComparison />} />

      </Routes>

      {/* Show footer only on homepage */}
      {!isExplorePage && !isExploreFactsPage && <Footer />}
      <ChatBotWidget />

    </>
  );
};

export default App;



