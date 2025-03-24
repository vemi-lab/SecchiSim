import React, { useState } from 'react';
import './QuizScreen.css';

const QuizScreen = ({ data }) => {
  const allQuestions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]); 
  const [correctOptions, setCorrectOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [score, setScore] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option) // Deselect if already selected
        : [...prevSelected, option] // Select if not already selected
    );
  };

  // Validate selections when "Next" is clicked
  const handleNext = () => {
    if (!isSubmitted) {
      const correct_options = allQuestions[currentQuestionIndex].correct_option;
      setCorrectOptions(correct_options);
      setIsSubmitted(true);

      // Check if the selected options match the correct options exactly
      const isCorrect =
        selectedOptions.length === correct_options.length &&
        selectedOptions.every((opt) => correct_options.includes(opt));

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
    } else {
      if (currentQuestionIndex === allQuestions.length - 1) {
        setShowScoreModal(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptions([]);
        setCorrectOptions([]);
        setIsSubmitted(false);
      }
    }
  };

  const restartQuiz = () => {
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptions([]);
    setCorrectOptions([]);
    setIsSubmitted(false);
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
          {allQuestions[currentQuestionIndex].options.map((option) => {
            let buttonClass = "";

            if (isSubmitted) {
              if (correctOptions.includes(option)) {
                buttonClass = selectedOptions.includes(option) ? "correct" : "unselected-correct"; 
              } else if (selectedOptions.includes(option)) {
                buttonClass = "incorrect";
              }
            } else if (selectedOptions.includes(option)) {
              buttonClass = "selected";
            }

            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={isSubmitted}
                className={`option-button ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        <button className="next-button" onClick={handleNext}>
          {isSubmitted ? 'Next' : 'Submit'}
        </button>
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