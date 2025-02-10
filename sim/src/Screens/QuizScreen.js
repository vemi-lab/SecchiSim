import React, { useState } from 'react';
import './QuizScreen.css';

const QuizScreen = ({ data }) => {
  const allQuestions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const validateAnswer = (selectedOption) => {
    const correct_option = allQuestions[currentQuestionIndex].correct_option;
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionsDisabled(true);
    if (selectedOption === correct_option) {
      setScore(score + 1);
    }
    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex === allQuestions.length - 1) {
      setShowScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionsDisabled(false);
      setShowNextButton(false);
    }
  };

  const restartQuiz = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionsDisabled(false);
    setShowNextButton(false);
  };

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
          }}
        ></div>
      </div>
      <div className="question-container">
        <div className="question-counter">
          {currentQuestionIndex + 1} / {allQuestions.length}
        </div>
        <div className="question-text">
          {allQuestions[currentQuestionIndex].question}
        </div>
        <div className="options-container">
          {allQuestions[currentQuestionIndex].options.map((option) => (
            <button
              key={option}
              onClick={() => validateAnswer(option)}
              disabled={isOptionsDisabled}
              className={`option-button ${
                option === correctOption
                  ? 'correct'
                  : option === currentOptionSelected
                  ? 'incorrect'
                  : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {showNextButton && (
          <button className="next-button" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
      {showScoreModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{score > allQuestions.length / 2 ? 'Congratulations!' : 'Oops!'}</h2>
            <p>
              Your Score: {score} / {allQuestions.length}
            </p>
            <button className="retry-button" onClick={restartQuiz}>
              Retry Quiz
            </button>
          </div>
        </div>
      )} 
    </div>
  );
};

export default QuizScreen;

