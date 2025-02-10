import React, { useState, useEffect, useRef } from 'react';
import Quiz from './QuizScreen';
import './VideoScreen.css';
import QuizDataSecchi from '../data/QuizDataSecchi';
import Player from '@vimeo/player';

export default function Time() {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const iframe = document.querySelector('iframe');

    if (iframe) {
      const player = new Player(iframe);
      playerRef.current = player;

      player.on('ended', () => {
        setIsVideoFinished(true);
      });

      let currentTime = 0;
      player.on('timeupdate', (data) => {
        if (!isVideoFinished) { 
          if (data.seconds < currentTime || data.seconds > currentTime + 1) {
            player.setCurrentTime(currentTime);
          } else {
            currentTime = data.seconds;
          }
        }
      });

      return () => {
        player.off('ended');
        player.off('timeupdate');
        playerRef.current = null;
      };
    }
  }, [isVideoFinished]);


  return (
    <div className="module-screen-container">
      {!isVideoFinished ? (
        <div className='video-container'>
        <iframe className='video-frame'
          src="https://player.vimeo.com/video/168246148?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          title="LSM Secchi Transparency Training Part 1"
        ></iframe>
      </div>
      ) : (
        <Quiz data={QuizDataSecchi} />
      )}
    </div>
  );
}