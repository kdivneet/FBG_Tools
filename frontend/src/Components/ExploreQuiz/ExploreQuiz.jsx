import React from 'react';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import './ExploreQuiz.css';
import QuizEngine from './QuizEngine';

const ExploreQuiz = () => {
  return (
    <div className="quiz-container">
      <Particles
        id="tsparticles"
        options={{
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: 4,
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: 'random',
              random: true,
              straight: false,
              out_mode: 'out',
            },
            opacity: {
              value: 0.5,
            },
            color: {
              value: '#00bcd4', // Teal color particles for a glowing effect
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: 'repulse',
              },
            },
          },
        }}
      />
      <motion.div
        className="quiz-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="quiz-heading">🧠 Quiz: Test Your FBG Knowledge!</h1>
        <p className="quiz-subheading">Let’s see how much you’ve learned so far!</p>
        <QuizEngine />
      </motion.div>
    </div>
  );
};

export default ExploreQuiz;
