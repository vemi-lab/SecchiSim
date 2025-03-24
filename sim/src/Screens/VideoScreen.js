import React, { useState, useEffect, useRef } from 'react';
import Quiz from './QuizScreen';
import Player from '@vimeo/player';
import DO_data from '../data/DO_1'

export default function VideoScreen({ videoUrl, quizData, title }) {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const durationRef = useRef(null); 

  useEffect(() => {
    if (!videoRef.current) return; // Ensure the iframe exists before initializing
    const player = new Player(videoRef.current);
    playerRef.current = player;

    console.log("Vimeo Player Initialized!");

    // Fetch video duration to prevent invalid seeks
    player.getDuration().then((duration) => {
      durationRef.current = duration;
    }).catch((error) => {
      console.error("Error fetching video duration:", error);
    });

    // Prevent Fast-Forwarding
    const handleTimeUpdate = (data) => {
      if (!isVideoFinished && durationRef.current) {
        const { seconds } = data;

        if (seconds > currentTime + 1 || seconds < currentTime) {
          console.log("Attempted fast-forward detected! Resetting time...");
          if (currentTime >= 0 && currentTime < durationRef.current) {
            player.setCurrentTime(currentTime).catch((error) => {
              console.warn("Error setting time:", error);
            });
          }
        } else {
          setCurrentTime(seconds);
        }
      }
    };

    // Detect Video End
    const handleEnded = () => {
      console.log("Video Finished!");
      setIsVideoFinished(true);
    };

    player.on('timeupdate', handleTimeUpdate);
    player.on('ended', handleEnded);

    return () => {
      player.off('timeupdate', handleTimeUpdate);
      player.off('ended', handleEnded);
      playerRef.current = null;
    };
  }, [videoUrl, isVideoFinished, currentTime]);
  return (
    <div className="module-screen-container">
      <h2 className="title-overlay">{title}</h2>
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
        <Quiz data={DO_data} />

      )}
    </div>
  );
}