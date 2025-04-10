import React, { useState, useEffect, useRef } from 'react';
import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/Secchi_2';
import Player from '@vimeo/player';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Secchi2() {
  const { currentUser } = useAuth();
  const hasSecchiRole = currentUser?.roles?.["Secchi Role"] ?? false;
  const navigate = useNavigate();
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
          setRetryCount(quizData["Secchi_2_RetryCount"] ?? 3);
          setModuleDisabled(quizData["Secchi_2_Disabled"] ?? false);
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
        Secchi_2_RetryCount: newRetryCount,
        Secchi_2_Disabled: isDisabled,
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

    if (newRetryCount === 0) {
      setModuleDisabled(true);
      updateQuizData(0, true);
    } else {
      updateQuizData(newRetryCount, false);
    }

    if (quizPassed) {
      navigate("/Secchi_3"); // Use navigate instead of window.location.href
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
                You do not have access to this module. Please contact{" "}
                <a href="mailto:stewards@lakestewardsme.org?subject=Access Request for Secchi Materials">
                    stewards@lakestewardsme.org
                </a>{" "}
                for assistance.
            </p>
        </div>
    );
  }

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Secchi Transparency Training Part 2</h1>
      {!showQuiz ? (
        <div className="video-container">
          <iframe
            ref={iframeRef}
            className="video-frame"
            src="https://player.vimeo.com/video/574049754?h=e307bbaa39&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="LSM Secchi Transparency Training Part 2"
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
          nextModule="Secchi_3" // Navigate to Secchi_3 after passing the quiz
          quizName="Secchi_2 Quiz"
        />
      )}
    </div>
  );
}
