import React, { useState, useEffect, useRef } from 'react';
import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/Secchi_2';
import Player from '@vimeo/player';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function Time( ) {
  const {currentUser} = useAuth();
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

    // Update Firestore with the new retry count
    if (newRetryCount === 0) {
      setModuleDisabled(true);
      updateQuizData(0, true);
    } else {
      updateQuizData(newRetryCount, false);
    }

    if (quizPassed) {
      // Navigate to the next module if the quiz is passed
      window.location.href = `/Secchi_3`;
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


  if (moduleDisabled) {
    return (
      <div className="module-screen-container">
        <h1 className="screen-title">Module Disabled</h1>
        <p>
          You have reached the max attempts allowed for this quiz. 
          This module has been disabled.
          Please contact <a href="mailto:stewards@lakestewardsme.org?subject=Maximum Simulator Quiz Secchi 2 Reached" style={{ color: '#4B4E92', textDecoration: 'underline' }}>
          stewards@lakestewardsme.org</a> for further assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Secchi Transparency Training Part 2</h1>
      {!showQuiz ? (
        <div className='video-container'>
          <iframe
            ref={iframeRef}
            className='video-frame'
            src="https://player.vimeo.com/video/574049754?h=e307bbaa39&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="LSM Secchi Transparency Training Part 2"
          ></iframe>
        </div>
      ) : moduleDisabled ? (
        <div className="quiz-locked-message">
          <p>The quiz is locked as you have reached the maximum attempts.</p>
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
