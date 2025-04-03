import React, { useState, useEffect, useRef } from 'react';
import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/DO_1'; 
import Player from '@vimeo/player';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function Time() {
  const { currentUser, hasAccessToRole } = useAuth();

  // Check if the user has access to the DO role
  const hasAccess = hasAccessToRole("Dissolved Oxygen Role");

  // State and refs must be declared unconditionally
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [retryCount, setRetryCount] = useState(3);
  const [showQuiz, setShowQuiz] = useState(false);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const [moduleDisabled, setModuleDisabled] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchQuizData = async () => {
        const quizDocRef = doc(
          db,
          `users/${currentUser.email}/${new Date().getFullYear()}/Quizzes`
        );
        const quizDoc = await getDoc(quizDocRef);
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          setRetryCount(quizData["DO_1_RetryCount"] ?? 3);
          setModuleDisabled(quizData["DO_1_Disabled"] ?? false);
        }
      };
      fetchQuizData();
    }
  }, [currentUser]);

  const updateQuizData = async (newRetryCount, isDisabled) => {
    if (currentUser) {
      const quizDocRef = doc(
        db,
        `users/${currentUser.email}/${new Date().getFullYear()}/Quizzes`
      );
      await updateDoc(quizDocRef, {
        DO_1_RetryCount: newRetryCount,
        DO_1_Disabled: isDisabled,
      });
    }
  };

  useEffect(() => {
    if (iframeRef.current) {
      const player = new Player(iframeRef.current);
      playerRef.current = player;

      const handleEnded = () => {
        setIsVideoFinished(true);
        setShowQuiz(true);
      };

      player.on('ended', handleEnded);

      return () => {
        player.off('ended', handleEnded);
      };
    }
  }, [isVideoFinished]);

  const handleWatchAgain = (quizPassed) => {
    const newRetryCount = retryCount - 1;
    setRetryCount(newRetryCount);

    // Update Firestore with the new retry count
    if (newRetryCount === 0) {
      setModuleDisabled(true);
      updateQuizData(0, true);
    } else {
      updateQuizData(newRetryCount, false);
    }

    if (quizPassed) {
      // Navigate to the next module if the quiz is passed
      window.location.href = `/do_2`;
      return;
    }

    // Reset quiz state and navigate back to the video
    setShowQuiz(false);
    setIsVideoFinished(false);
    if (playerRef.current) {
      playerRef.current.setCurrentTime(0).then(() => {
        playerRef.current.play();
      });
    }
    setIsVideoFinished(false);
    setShowQuiz(false);
  };

  // Render access denied message if the user does not have access
  if (!hasAccess) {
    return (
      <div className="access-denied">
        <p>
          Access denied. You do not have permission to view this content. Please contact{" "}
          <a href="mailto:stewards@lakestewardsme.org" style={{ color: "#4B4E92", textDecoration: "underline" }}>
            stewards@lakestewardsme.org
          </a>{" "}
          for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Dissolved Oxygen Training Part 1</h1>
      {!showQuiz ? (
        <div className='video-container'>
          <iframe
            ref={iframeRef}
            className='video-frame'
            src="https://player.vimeo.com/video/577625886?h=9ef2eb463b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="LSM Dissolved Oxygen Training Part 1"
          ></iframe>
        </div>
      ) : moduleDisabled ? (
        <div className="quiz-locked-message">
          <p>
            You have reached the max attempts allowed for this quiz. 
            This module has been disabled.
            Please contact <a href="mailto:stewards@lakestewardsme.org?subject=Maximum Simulator Quiz DO 1 Reached" style={{ color: '#4B4E92', textDecoration: 'underline' }}>
            stewards@lakestewardsme.org</a> for further assistance.
          </p>
        </div>
      ) : (
        <Quiz 
          data={QuizDataSecchi}
          watchAgain={handleWatchAgain}
          nextModule={"/do_1"}
          quizName={"Dissolved_Oxygen 1 Quiz"}
        />
      )}
    </div>
  );
}