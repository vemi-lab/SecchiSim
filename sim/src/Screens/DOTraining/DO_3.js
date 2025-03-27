import React, { useState, useEffect, useRef } from 'react';
// import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/DO_3';
import DO_3_Quiz from './DO_3_Quiz';
import Player from '@vimeo/player';

export default function Time() {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0); // Initialize retryCount to 0
  const [moduleDisabled, setModuleDisabled] = useState(false); // Add missing state

  const restartVideo = () => { // Add missing function
    if (playerRef.current) {
      playerRef.current.setCurrentTime(0).then(() => {
        playerRef.current.play();
      });
    }
    // Reset any other states as needed
  };

  useEffect(() => {
    if (iframeRef.current) {
      const player = new Player(iframeRef.current);
      playerRef.current = player;

      // Get video duration when loaded
      player.getDuration().then((duration) => {
        durationRef.current = duration;
      });

      // Listen for video end
      const handleEnded = () => setIsVideoFinished(true);
      player.on('ended', handleEnded);

      // Prevent seeking
      const handleTimeUpdate = (data) => {
        if (!isVideoFinished && durationRef.current) {
          const { seconds } = data;

          // Ensure the current time is valid and within range
          if (seconds < currentTimeRef.current || seconds > currentTimeRef.current + 1) {
            if (currentTimeRef.current >= 0 && currentTimeRef.current < durationRef.current) {
              player.setCurrentTime(currentTimeRef.current).catch((error) => {
                console.warn("Error setting time:", error);
              });
            }
          } else {
            currentTimeRef.current = seconds;
          }
        }
      };

      player.on('timeupdate', handleTimeUpdate);

      return () => {
        player.off('ended', handleEnded);
        player.off('timeupdate', handleTimeUpdate);
        playerRef.current = null;
      };
    }
  }, [isVideoFinished]);

  const handleWatchAgain = async (quizPassed, score) => {
    if (!quizPassed) {
        if (retryCount >= 2) {
            setModuleDisabled(true);
        } else {
            setRetryCount(retryCount + 1); // Increment retry count on failure
            restartVideo();
        }
    } else {
        setRetryCount(0); // Reset retry count on success
    }
  };

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Dissolved Oxygen Training Part 3</h1>
      {!isVideoFinished ? (
        <div className='video-container'>
          <iframe
            ref={iframeRef}
            className='video-frame'
            src="https://player.vimeo.com/video/579556842?h=86de1e5a87&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="LSM Dissolved Oxygen Training Part 3"
          ></iframe>
        </div>
      ) : (
        <DO_3_Quiz data={QuizDataSecchi} />
      )}
    </div>
  );
}