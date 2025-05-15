import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './QuizCard.css'

const QuizCard = ({ questionData, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(option === questionData.answer);
  };

  return (
    <motion.div
      className="quiz-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {questionData.question}
      </motion.h2>
      <motion.ul
        className="options-list"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {questionData.options.map((opt, index) => (
          <motion.li
            key={index}
            className={`option ${selected === opt ? 'selected' : ''}`}
            onClick={() => handleSelect(opt)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {opt}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default QuizCard;
