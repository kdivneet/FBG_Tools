import React from 'react';
import './ExploreFacts.css';
import { motion } from 'framer-motion';

const facts = [
  {
    title: 'Precision Sensing',
    detail:
      'FBGs can detect microstrain changes as small as 1 microstrain (με), which makes them perfect for structural health monitoring.',
  },
  {
    title: 'Temperature Sensitivity',
    detail:
      'A typical FBG can detect temperature changes as small as 0.1°C, enabling use in critical environments like nuclear reactors or medical diagnostics.',
  },
  {
    title: 'Multiplexing Power',
    detail:
      'Multiple FBGs can be written into a single fiber line, allowing complex distributed sensing networks with just one cable!',
  },
  {
    title: 'Non-Intrusive Sensing',
    detail:
      'Being passive and immune to EMI, FBGs can work in MRI machines or high-voltage environments safely.',
  },
  {
    title: 'Small but Mighty',
    detail:
      'Despite being a few millimeters long, FBGs can offer insights into strain, temperature, pressure, vibration, and more—all in real-time.',
  },
];

const ExploreFacts = () => {
  return (
    <div className="explore-facts">
      <div className="facts-container">
        {facts.map((fact, index) => (
          <motion.div
            className="fact-card"
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <h3>{fact.title}</h3>
            <p>{fact.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExploreFacts;
