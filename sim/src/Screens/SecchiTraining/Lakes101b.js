import React, { useState, useEffect, useRef } from 'react';
import {auth, db} from '../../firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import Quiz from '../QuizScreen';
import '../VideoScreen.css';
import QuizDataSecchi from '../../data/QuizDataSecchi';
import Player from '@vimeo/player';

export default function Time() {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(null);

  useEffect(() => {
      async function checkAccess() {
        if (!auth.currentUser) return;
        const userDocRef = doc(db, "users", auth.currentUser.email);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const hasSecchiVideos = userData.accessRoles?.["Secchi Videos"];
          const isCompleted = userData.completedCourses?.["ProgramOverview"];
  
          setUserHasAccess(hasSecchiVideos && !isCompleted);
          //check if all required videos and quizzes are completed
          const allSecchiVideosCompleted = ["ProgramOverview", "Lakes101a", "Lakes101b"]
            .every(course => userData.completedCourses?.[course]);
          const allQuizzesCompleted = userData.completedCourses?.["QuizDataSecchi"];


          //if basic videos and quizzes are compeleted, remove access
          if (allSecchiVideosCompleted && allQuizzesCompleted) {
            await updateDoc(userDocRef, {
              [`accessRoles.Secchi Videos`]: false,
              [`accessRoles.Quizzes`]: false
            });
          }
        }
        setLoading(false);
      }
  
      checkAccess();
    }, []);

  useEffect(() => {
    if (iframeRef.current) {
      const player = new Player(iframeRef.current);
      playerRef.current = player;

      // Get video duration when loaded
      player.getDuration().then((duration) => {
        durationRef.current = duration;
      });

      // Listen for video end
      const handleEnded = async () => {
        setIsVideoFinished(true);

        const userDocRef = doc(db, "users", auth.currentUser.email);
        await updateDoc(userDocRef, {
          "completedCourses.Lakes101b": true
        });
      }
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
  }, [isVideoFinished, userHasAccess]);

  if (loading) {
    return <p>Loading...</p>
  }

  if (!userHasAccess) {
    return <p>Access Denied. You have completed this course.</p>
  }

  return (
    <div className="module-screen-container">
      <h1 className="screen-title">LSM Secchi Transparency Training Part 3</h1>
      {!isVideoFinished ? (
        <div className='video-container'>
          <iframe
            ref={iframeRef}
            className='video-frame'
            src="https://player.vimeo.com/video/574056408?h=16a4375e79&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="LSM Secchi Transparency Training Part 3"
          ></iframe>
        </div>
      ) : (
        <Quiz data={QuizDataSecchi} />
      )}
    </div>
  );
}
