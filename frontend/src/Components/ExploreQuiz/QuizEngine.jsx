import React, { useState } from 'react';
import { motion } from 'framer-motion';
import quizData from './quizData';
import QuizCard from './QuizCard';
import './QuizEngine.css'

const QuizEngine = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);

    if (currentIndex < quizData.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
    } else {
      setTimeout(() => setShowResult(true), 500);
    }
  };

  return (
    <div className="quiz-engine">
      {!showResult ? (
        <>
          <p className="progress">
            Question {currentIndex + 1} of {quizData.length}
          </p>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuizCard questionData={quizData[currentIndex]} onAnswer={handleAnswer} />
          </motion.div>
        </>
      ) : (
        <motion.div
          className="result-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut", repeat: 1, repeatDelay: 0.5 }}
        >
          <h2>🎉 Congratulations!</h2>
          <p>You scored {score} out of {quizData.length}!</p>
        </motion.div>
      )}
    </div>
  );
};

export default QuizEngine;
