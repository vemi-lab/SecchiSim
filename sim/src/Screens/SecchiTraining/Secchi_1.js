import React, { useState, useEffect, useRef } from 'react';
import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/Secchi_1'; 
import Player from '@vimeo/player';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function Secchi1() {
  const { currentUser } = useAuth();
  const hasSecchiRole = currentUser?.roles?.["Secchi Role"] ?? false;
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
          setRetryCount(quizData["Secchi_1_RetryCount"] ?? 3);
          setModuleDisabled(quizData["Secchi_1_Disabled"] ?? false);
        }
      };
      fetchQuizData();
    }
  }, [currentUser]);

  // Enable the quiz if the DO role is granted
  useEffect(() => {
    if (hasSecchiRole && moduleDisabled && retryCount > 0) {
      const enableQuiz = async () => {
        const quizDocRef = doc(
          db,
          `users/${currentUser.email}/${new Date().getFullYear()}/Quizzes`
        );
        await updateDoc(quizDocRef, {
          DO_1_Disabled: false,
        });
        setModuleDisabled(false);
      };
      enableQuiz();
    }
  }, [hasSecchiRole, moduleDisabled, retryCount, currentUser]);

  const updateQuizData = async (newRetryCount, isDisabled) => {
    if (currentUser) {
      const quizDocRef = doc(
        db,
        `users/${currentUser.email}/${new Date().getFullYear()}/Quizzes`
      );
      await updateDoc(quizDocRef, {
        Secchi_1_RetryCount: newRetryCount,
        Secchi_1_Disabled: isDisabled,
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
      window.location.href = "/Secchi_2";
      //newRetryCount;
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
  };

  if (!hasSecchiRole) {
    return (
      <div className="access-denied">
        <p>
          You have reached the max attempts allowed for this quiz. 
          This module has been disabled. <br />
          Please contact <a href="mailto:stewards@lakestewardsme.org?subject=Maximum Simulator Quiz Secchi 1 Reached" 
          style={{ color: '#4B4E92', textDecoration: 'underline' }}>
          stewards@lakestewardsme.org</a> for further assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Secchi Transparency Training Part 1</h1>
      {!showQuiz ? (
        <div className="video-container">
          <iframe
            ref={iframeRef}
            className="video-frame"
            src="https://player.vimeo.com/video/574034965?h=d4cc76976e&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="LSM Secchi Transparency Training Part 1"
          ></iframe>
        </div>
      ) : moduleDisabled ? (
        <div className="quiz-locked-message">
          <p>
            You have reached the max attempts allowed for this quiz. 
            This module has been disabled.
            Please contact <a href="mailto:stewards@lakestewardsme.org?subject=Maximum Simulator Quiz Secchi 1 Reached" style={{ color: '#4B4E92', textDecoration: 'underline' }}>
            stewards@lakestewardsme.org</a> for further assistance.</p>
        </div>
      ) : (
        <Quiz
          data={QuizDataSecchi}
          watchAgain={handleWatchAgain}
          nextModule="Secchi_2" // Navigate to Secchi_2 after passing the quiz
          quizName="Secchi_1 Quiz" // Correct quiz name for Firestore recording
        />
      )}
    </div>
  );
}