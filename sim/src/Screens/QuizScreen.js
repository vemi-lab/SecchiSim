import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './QuizScreen.css';

const QuizScreen = ({ data, watchAgain }) => {
  const allQuestions = data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctOptions, setCorrectOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  //check user access and revoke roles if needed
  useEffect(() => {
    async function checkAccess() {
      if (!auth.currentUser) return;
      const userDocRef = doc(db, "users", auth.currentUser.email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const allSecchiVideosCompleted = ["ProgramOverview", "Lakes101a", "Lakes101b"]
          .every(course => userData.completedCourses?.[course]);
        const allQuizzesCompleted = userData.completedCourses?.["QuizDataSecchi"];

        //if all Secchi Videos & Quizzes are completed, remove access
        if (allSecchiVideosCompleted && allQuizzesCompleted) {
          await updateDoc(userDocRef, {
            [`accessRoles.Secchi Videos`]: false,
            [`accessRoles.Quizzes`]: false
          });
        }

        setUserHasAccess(userData.accessRoles?.["Quizzes"] && !userData.completedCourses?.["QuizDataSecchi"]);
      }
      setLoading(false);
    }

    checkAccess();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };

  // Validate selections when "Next" is clicked
  const handleNext = async () => {
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
      if (currentQuestionIndex === allQuestions.length - 1) {
        setShowScoreModal(true);

        const userDocRef = doc(db, "users", auth.currentUser.email);
        await updateDoc(userDocRef, {
          ['completedCourses.QuizDataSecchi']: true
        });

        //re-check access
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const allSecchiVideosCompleted = ["ProgramOverview", "Lakes101a", "Lakes101b"]
            .every(course => userData.completedCourses?.[course]);
          const allQuizzesCompleted = userData.completedCourses?.["QuizDataSecchi"];

          if (allSecchiVideosCompleted && allQuizzesCompleted) {
            await updateDoc(userDocRef, {
              [`accessRoles.Secchi Videos`]: false,
              [`accessRoles.Quizzes`]: false
            });
          }
        }

      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptions([]);
        setCorrectOptions([]);
        setIsSubmitted(false);
      }
    }
  };

  const handleQuizCompletion = () => {
    setShowScoreModal(false);
    const passingScore = allQuestions.length / 2;
    const quizPassed = score > passingScore;
    watchAgain(quizPassed);
  };

  if (loading){
    return <p>Loading...</p>
  }

  if (!userHasAccess) {
    return <p>Access denied. You have completed this quiz.</p>;
  }

  return (
    <div className="quiz-container">
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
            <p>Your Score: {score} / {allQuestions.length}</p>
            <button className="retry-button" onClick={handleQuizCompletion}>
              {score > allQuestions.length / 2 ? 'Continue' : 'Watch Video Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
