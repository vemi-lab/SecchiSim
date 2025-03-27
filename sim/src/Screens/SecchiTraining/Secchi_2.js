import React, { useState, useEffect, useRef } from 'react';
import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/Secchi_2';
import Player from '@vimeo/player';

export default function Time() {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(null);

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

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Secchi Transparency Training Part 2</h1>      
      {!isVideoFinished ? (
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
      ) : (
        <Quiz data={{ ...QuizDataSecchi, quizName: "Secchi_1" }} watchAgain={handleWatchAgain} />

      )}
    </div>
  );
}
