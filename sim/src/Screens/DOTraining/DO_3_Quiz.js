import React, { useState } from 'react';
import './DO_3_Quiz.css';

const QuizScreen = ({ data }) => {
  const allQuestions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctOptions, setCorrectOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // Define at which questions to insert announcements
  const announcementIndices = [10]; // Add more indices if you want more announcements

  const handleOptionSelect = (option) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };

  const handleNext = () => {
    if (!isSubmitted) {
      const correct_options = allQuestions[currentQuestionIndex].correct_option;
      setCorrectOptions(correct_options);
      setIsSubmitted(true);

      const isCorrect =
        selectedOptions.length === correct_options.length &&
        selectedOptions.every((opt) => correct_options.includes(opt));

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
    } else {
      if (announcementIndices.includes(currentQuestionIndex + 1)) { // Check for announcement at the NEXT question index
        setShowAnnouncement(true);
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
    }
  };

  const handleContinueQuiz = () => {
    setShowAnnouncement(false);
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedOptions([]); // Reset selected options
    setCorrectOptions([]); // Reset correct options
    setIsSubmitted(false); // Reset submission state
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
      {showAnnouncement ? (
        <div className="announcement-container">
          <h2>DO Profiles</h2>
          <p>In order for your data to be certified, ALL submitted temperature and dissolved oxygen (DO) 
            field sheets must include Quality Assurance (QA) duplicate temperature and dissolved oxygen readings.</p>
          <p>
          For quality assurance purposes, duplicate temperature and DO readings are required for every profile that 
          you take (entered in boxes in the lower right corner of your field sheet. The number of duplicate sets required 
          will be dependent on the number of original readings recorded. A minimum of one set of duplicate temperature 
          and DO readings is always required – even if you have only taken 1 original set.  The requirement is for one 
          set of duplicates FOR every 10 readings. The following illustrates this requirement:
            1-10 original readings (0-9 meters on data form): 1 set of “dupes” required; 11-20 original 
            readings (10-15 meters & additional blanks on form): 2 sets of dupes; 21-30 originals: 3 sets of dupes; et cetera.
          </p>
          <p>
          Duplicate readings should always be taken at depths where the temperature and DO is stable 
          (attempt to minimize the difference from one meter to the next). Choosing the correct depths 
          is particularly critical when the lake is thermally stratified during the summer, as is the 
          case in the practice profile below.
          </p>
          <p>
          Duplicate readings should be close in value to the originals (maximum variation +/- 0.3 degrees C, 
          and +/- 0.3 mg/l). Duplicate readings may take longer to stabilize than the originals.
          </p>
          <button className="next-button" onClick={handleContinueQuiz}>Continue Quiz</button>
        </div>
      ) : (
        <>
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
            {allQuestions[currentQuestionIndex].image && (
              <div className="question-image">
                <img
                  src={allQuestions[currentQuestionIndex].image}
                  alt="Question visual"
                />
              </div>
            )}
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
        </>
      )}
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