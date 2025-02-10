import React, { useState, useEffect, useRef } from 'react';
import Quiz from './QuizScreen';
import Player from '@vimeo/player';

export default function VideoScreen({ videoUrl, quizData, title }) {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Initialize Vimeo Player & Listen for Events
  useEffect(() => {
    if (!videoRef.current) return; // Ensure the iframe exists before initializing
    const player = new Player(videoRef.current);
    playerRef.current = player;

    console.log("Vimeo Player Initialized!");

    // Prevent Fast-Forwarding
    player.on('timeupdate', (data) => {
      setCurrentTime(data.seconds);
      if (data.seconds > currentTime + 1) {
        console.log("Attempted fast-forward detected! Resetting time...");
        player.setCurrentTime(currentTime);
      }
    });

    // Detect Video End
    player.on('ended', () => {
      console.log("Video Finished!");
      setIsVideoFinished(true);
    });

    return () => {
      player.off('timeupdate');
      player.off('ended');
      playerRef.current = null;
    };
  }, [videoUrl, currentTime]); // Depend on `videoUrl` and `currentTime` for updates

  return (
    <div className="module-screen-container">
      <h2>{title}</h2>
      {!isVideoFinished ? (
        <div className="video-container">
          <iframe
            ref={videoRef}
            className="video-frame"
            src={videoUrl}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title={title}
          ></iframe>
        </div>
      ) : (
        <Quiz data={quizData} />
      )}
    </div>
  );
}

