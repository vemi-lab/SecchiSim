import React, { useState, useEffect, useRef } from 'react';
import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/DO_1'; 
import Player from '@vimeo/player';

export default function Time( ) {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const [moduleDisabled, setModuleDisabled] = useState(false);

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

  const restartVideo = () => {
    if (playerRef.current) {
      playerRef.current.setCurrentTime(0).then(() => {
        playerRef.current.play();
      });
    }
    setIsVideoFinished(false);
    setShowQuiz(false);
  };

  const handleWatchAgain = (quizPassed) => {
    if (!quizPassed) {
      if (retryCount >= 2) {
        setModuleDisabled(true);
      } else {
        setRetryCount(retryCount + 1);
        restartVideo();
      }
    }
  };

  if (moduleDisabled) {
    return (
      <div className="module-screen-container">
        <h1 className="screen-title">Module Disabled</h1>
        <p>
          You have reached the max attempts allowed for this quiz. 
          This module has been disabled.
          Please contact your organization for further assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Dissolved Oxygen Training Part 2</h1>
      {!showQuiz? (
        <div className='video-container'>
          <iframe
            ref={iframeRef}
            className='video-frame'
            src="https://player.vimeo.com/video/577630803?h=469ad9ecc5&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="LSM Dissolved Oxygen Training PArt 2"
          ></iframe>
        </div>
      ) : (
        <Quiz data={QuizDataSecchi} watchAgain={handleWatchAgain} />
      )}
    </div>
  );
}