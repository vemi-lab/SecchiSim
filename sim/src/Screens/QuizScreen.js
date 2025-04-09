import React, { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import './QuizScreen.css';

export default function QuizScreen({ data, watchAgain, nextModule, quizName }) {
  const allQuestions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctOptions, setCorrectOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const navigate = useNavigate();

  const { currentUser } = useAuth();

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
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < allQuestions.length && allQuestions[nextIndex].announcement) {
        setShowAnnouncement(true);
      } else if (nextIndex >= allQuestions.length) {
        setShowScoreModal(true);
      } else {
        setCurrentQuestionIndex(nextIndex);
        setSelectedOptions([]);
        setCorrectOptions([]);
        setIsSubmitted(false);
      }
    }
  };

  const handleContinueQuiz = () => {
    setShowAnnouncement(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedOptions([]);
    setCorrectOptions([]);
    setIsSubmitted(false);
  };

  const saveScoreToFirestore = async (attemptScore) => {
    if (currentUser) {
      const currentYear = new Date().getFullYear();
      const scoresDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Scores`);

      // Calculate the percentage score
      const totalQuestions = allQuestions.length;
      const percentageScore = Math.round((attemptScore / totalQuestions) * 100);

      // Fetch existing scores to calculate the next attempt number
      const scoresSnapshot = await getDoc(scoresDocRef);
      const scoresData = scoresSnapshot.exists() ? scoresSnapshot.data() : {};
      const attemptNumber = Object.keys(scoresData)
        .filter(key => key.startsWith(quizName))
        .length + 1; // Start counting attempts from 1

      const attemptKey = `${quizName} Attempt ${attemptNumber}`;
      await updateDoc(scoresDocRef, {
        [attemptKey]: percentageScore, // Save the percentage score
      });
    }
  };

  const handleQuizCompletion = async () => {
    setShowScoreModal(false);
    const passingScore = allQuestions.length / 2;
    const quizPassed = score > passingScore;

    // Save the score for the current attempt
    await saveScoreToFirestore(score);

    // Decrease retry count regardless of quiz result
    watchAgain(quizPassed);

    if (quizPassed) {
      navigate(`/${nextModule}`);
    }
  };

  return (
    <div className="quiz-container">
      {showAnnouncement ? (
        <div className='announcement-container'>
          {allQuestions[currentQuestionIndex + 1]?.announcement?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <button className="next-button" onClick={handleContinueQuiz}>
            Continue Quiz
          </button>
        </div>
      ) : (      
        <>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
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
            <p>Your Score: {score} / {allQuestions.length}</p>
            <button className="retry-button" onClick={handleQuizCompletion}>
              {score > allQuestions.length / 2 ? 'Continue' : 'Watch Video Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

