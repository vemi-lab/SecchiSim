import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import p5 from 'p5';
import * as utils from '../utils/p5utils';
import Controls from './Controls';
import { collection, addDoc, doc, getDoc, updateDoc, setDoc, serverTimestamp, runTransaction, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";

const Clear = forwardRef(({ settings, onSettingChange }, ref) => {
  const navigate = useNavigate();
  const { currentUser, fetchUserRoles } = useAuth();
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const velocityRef = useRef(0);
  const depthRef = useRef(settings.depth);
  const [animationDepth, setAnimationDepth] = useState(settings.depth);
  const [diskPosition, setDiskPosition] = useState({ x: 400, y: 300 });
  const [retryCount, setRetryCount] = useState(3);
  const [moduleDisabled, setModuleDisabled] = useState(false);
  const moveAmount = 0.03;
  const frameRef = useRef();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [userRoles, setUserRoles] = useState(null);

  const handleArrowClick = (direction) => {
    if (direction === 'up') {
      velocityRef.current = -moveAmount;
    } else if (direction === 'down') {
      velocityRef.current = moveAmount;
    }
  };

  const handleArrowRelease = () => {
    velocityRef.current = 0;
  };

  useImperativeHandle(ref, () => ({
    handleArrowClick,
    handleArrowRelease
  }));

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setCanvasSize({
          width: window.innerWidth - 40, 
          height: Math.min(window.innerHeight * 0.6, 600)
        });
      } else {
        setCanvasSize({ width: 800, height: 600 });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    sketchRef.current = new p5((p) => {

      p.preload = () => {
        p.waterImage = p.loadImage('/clearLake.png');
      };

      p.setup = () => {
        if (canvasRef.current) {
          const canvas = p.createCanvas(canvasSize.width, canvasSize.height);
          canvas.parent(canvasRef.current);
          p.colorMode(p.RGB);
          p.frameRate(60);
        }
      };

      p.draw = () => {
        if (!canvasRef.current) return;
        
        // Clear background first
        p.background(200, 220, 255);

        // Draw background image if loaded
        if (p.waterImage) { 
          p.push();
          p.tint(255); 
          p.image(p.waterImage, 0, 0, p.width, p.height);
          p.pop();
        }

        // Draw dark overlay
        p.push();
        p.noStroke();
        p.fill(0, 400); 
        p.rect(0, 0, p.width, p.height);
        p.pop();

        // Calculate responsive circle position and size
        const circleX = p.width * 0.4; // Position at 40% of canvas width
        const circleY = p.height * 0.5; // Center vertically
        const circleDiameter = Math.min(p.width, p.height) * 0.6; // Scale circle based on smallest canvas dimension

        p.push();
        p.erase();
        p.circle(circleX, circleY, circleDiameter);
        p.noErase();
        p.pop();
        p.push();
        p.clip(() => {
          p.circle(circleX, circleY, circleDiameter);
        });

        // Draw the background image
        if (p.waterImage) {
          p.image(p.waterImage, 0, 0, p.width, p.height);
        }

        // Draw image inside cutout with visibility
        if (p.waterImage) {
          p.push();
          p.tint(255, utils.calculateVisibility(depthRef.current, settings.turbidity) * 255);
          p.image(p.waterImage, 0, 0, p.width, p.height);
          p.pop();
        }

        // Calculate visibility 
        const visibility = utils.calculateVisibility(depthRef.current, settings.turbidity);
        
        // Make disk size responsive to canvas size
        const maxDiskSize = Math.min(p.width, p.height) * 0.3;
        const minDiskSize = Math.min(p.width, p.height) * 0.03;
        const diskSize = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, maxDiskSize, minDiskSize);
        
        // Calculate responsive disk position
        const startX = p.width * 0.3;
        const endX = p.width * 1.2;
        const startY = p.height * 0.5;
        const endY = p.height * 0.75;
        
        let diskX = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, startX, endX);
        let diskY = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, startY, endY);
        
        // Draw the disk 
        utils.drawSecchiDisk(p, diskX, diskY, visibility, diskSize);

        // Update depth using animation frame timing
        if (velocityRef.current !== 0) {
          const targetDepth = Math.max(
            Math.min(
              depthRef.current + velocityRef.current,
              utils.CONSTANTS.MAX_DEPTH
            ),
            utils.CONSTANTS.MIN_DEPTH
          );
          
          depthRef.current = targetDepth;

          if (Math.abs(targetDepth - animationDepth) > 0.01) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
              setAnimationDepth(targetDepth);
              onSettingChange('depth', targetDepth);
            });
          }
        }

        p.pop();

        // Draw depth indicator with responsive positioning
        const depthBarWidth = Math.min(50, p.width * 0.06);
        const depthBarRight = p.width - depthBarWidth;
        const depthBarTop = p.height * 0.15;
        const depthBarBottom = p.height * 0.85;
        const textOffset = depthBarWidth + 15;

        p.push();
        p.stroke(255);
        p.strokeWeight(Math.max(1, p.width * 0.002));
        p.line(depthBarRight, depthBarTop, depthBarRight, depthBarBottom);
        
        p.stroke(255, 0, 0);
        const depthY = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, depthBarTop, depthBarBottom);
        p.line(depthBarRight - 10, depthY, depthBarRight + 10, depthY);
        
        p.noStroke();
        p.fill(255);
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(Math.max(12, p.width * 0.015)); // Responsive text size
        
        for (let depth = 0; depth <= utils.CONSTANTS.MAX_DEPTH; depth += 1) {
          const y = p.map(depth, 0, utils.CONSTANTS.MAX_DEPTH, depthBarTop, depthBarBottom);
          p.line(depthBarRight - 5, y, depthBarRight + 5, y);
          p.text(depth + 'm', depthBarRight - 15, y);
        }
        p.pop();
      };

      p.mouseDragged = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          const newDepth = utils.handleMouseInteraction(p, p.mouseY, p.height, utils.CONSTANTS.MAX_DEPTH);
          onSettingChange('depth', newDepth);
          setAnimationDepth(newDepth);
        }
      };

      p.mousePressed = p.mouseDragged;

      p.keyPressed = () => {
        if (p.keyCode === p.UP_ARROW) {
          handleArrowClick('up');
        } else if (p.keyCode === p.DOWN_ARROW) {
          handleArrowClick('down');
        }
      };

      p.keyReleased = () => {
        handleArrowRelease();
      };
    });

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
      cancelAnimationFrame(frameRef.current);
    };
  }, [settings.turbidity, diskPosition, canvasSize]); 

  const handleAttemptSubmit = async () => {
    if (!currentUser) {
      setPopupMessage("Please log in to save your attempts.");
      setShowPopup(true);
      return;
    }

    if (retryCount <= 0) {
      setPopupMessage("You have no attempts remaining.");
      setShowPopup(true);
      return;
    }

    try {
      const currentYear = new Date().getFullYear().toString();
      const quizDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Quizzes`);
      const scoresDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Scores`);

      // Get the current depth from the ref
      const currentDepth = Number(parseFloat(depthRef.current).toFixed(2));
      console.log("Submitting attempt with depth:", currentDepth); 

      //  if the attempt was successful (depth equals 1.00)
      const isPassed = Math.abs(currentDepth - 1.00) < 0.01;
      const newRetryCount = retryCount - 1;
      
      const attemptData = {
        depth: currentDepth,
        lakeType: "Clear",
        passed: isPassed,
        date: new Date().toISOString()
      };

      await runTransaction(db, async (transaction) => {
        const quizDoc = await transaction.get(quizDocRef);
        const scoresDoc = await transaction.get(scoresDocRef);

        if (!quizDoc.exists()) {
          throw new Error("Quiz document does not exist!");
        }

        const scoresData = scoresDoc.exists() ? scoresDoc.data() : {};
        
        const attemptKeys = Object.keys(scoresData)
          .filter(key => key.startsWith('Clear_Attempt_'))
          .sort((a, b) => {
            const numA = parseInt(a.split('_')[2]);
            const numB = parseInt(b.split('_')[2]);
            return numA - numB;
          });
        
        console.log("Current attempt keys:", attemptKeys); 
        const nextAttemptNumber = attemptKeys.length > 0 
          ? parseInt(attemptKeys[attemptKeys.length - 1].split('_')[2]) + 1 
          : 1;
        console.log("Next attempt number:", nextAttemptNumber); 

        //  updates
        const quizUpdates = {
          "Clear_RetryCount": newRetryCount,
          "Clear_Disabled": isPassed || newRetryCount === 0,
          lastUpdated: new Date().toISOString()
        };

        transaction.update(quizDocRef, quizUpdates);
        transaction.set(scoresDocRef, {
          ...scoresData,
          [`Clear_Attempt_${nextAttemptNumber}`]: attemptData,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      });

      //  update local state
      setRetryCount(newRetryCount);
      
      console.log("Attempt saved successfully");

      if (isPassed) {
        setModuleDisabled(true);
        setPopupMessage("Congratulations! You've passed the module!");
        setShowPopup(true);
        setTimeout(() => {
          navigate('/secchi-sim');
        }, 3000);
      } else if (newRetryCount === 0) {
        setPopupMessage("Incorrect attempt. This was your last try.");
        setShowPopup(true);
        setTimeout(() => {
          setPopupMessage("You've used all attempts. Unfortunately, you did not pass this module. Please contact stewards@lakestewardsme.org for assistance.");
          setShowPopup(true);
          setTimeout(() => {
            setModuleDisabled(true);
            navigate('/secchi-sim');
          }, 3000);
        }, 3000);
      } else {
        setPopupMessage(`Incorrect. You have ${newRetryCount} ${newRetryCount === 1 ? 'attempt' : 'attempts'} remaining. Try again!`);
        setShowPopup(true);
      }

    } catch (error) {
      console.error("Error saving attempt: ", error);
      
      if (error.code === 'permission-denied') {
        setPopupMessage("Your session may have expired. Please log out and log back in.");
      } else if (error.code === 'unavailable') {
        setPopupMessage("Unable to connect to the server. Please check your internet connection.");
      } else if (error.code === 'not-found') {
        setPopupMessage("Unable to find your data. Please try again.");
      } else {
        setPopupMessage("There was an error saving your attempt. Please try again.");
      }
      setShowPopup(true);
    }
  };

  const PopupOverlay = () => {
    const handleContinue = (e) => {
      e.preventDefault();
      e.stopPropagation();

      velocityRef.current = 0;
      cancelAnimationFrame(frameRef.current);
      
      setShowPopup(false);
      setPopupMessage("");
      
      const initialDepth = 0;
      setAnimationDepth(initialDepth);
      depthRef.current = initialDepth;
      onSettingChange('depth', initialDepth);
    };

    return (
      <div 
        className="popup-container" 
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <div className="popup-message">
          <h2>{popupMessage}</h2>
          {(moduleDisabled || popupMessage.includes("Congratulations")) ? (
            <p>Redirecting to simulator home...</p>
          ) : (
            <button 
              onClick={handleContinue}
              className="continue-btn"
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              Try Again
            </button>
          )}
        </div>
        <style>
          {`
          .popup-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            pointer-events: all;
          }
          .popup-message {
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            max-width: 80%;
            width: 400px;
            pointer-events: all;
          }
          .popup-message h2 {
            margin-bottom: 20px;
            color: ${popupMessage.includes("Congratulations") ? '#027759' : moduleDisabled ? '#AA4A44' : '#4B4E92'};
            font-size: 1.5rem;
          }
          .continue-btn {
            padding: 12px 24px;
            background: #4B4E92;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s ease;
            margin-top: 15px;
            user-select: none;
            position: relative;
            overflow: hidden;
            pointer-events: all;
          }
          .continue-btn:hover {
            background: #3a3b7a;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(75, 78, 146, 0.2);
          }
          .continue-btn:active {
            transform: translateY(0);
            background: #2d2e5e;
            box-shadow: 0 1px 4px rgba(75, 78, 146, 0.2);
          }
          .continue-btn:focus {
            outline: none;
            box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(75, 78, 146, 0.4);
          }
          `}
        </style>
      </div>
    );
  };

  if (moduleDisabled) {
    return (
      <div className="module-locked">
        <p>
          You have reached the max attempts allowed for this module. 
          Please contact try again next year
        </p>
      </div>
    );
  }

  return (
    <div className="clear-lake-container">
      {/* <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>Back to Simulator</button> */}
      <div className="simulation-area">
        <div className="canvas-wrapper" style={{ 
          position: 'relative', 
          width: canvasSize.width, 
          height: canvasSize.height 
        }}>
          <div ref={canvasRef} className="secchi-simulator" style={{ width: '100%', height: '100%', outline: 'none' }} />
        </div>
        <div className="controls-wrapper">
          <Controls 
            settings={settings}
            onSettingChange={onSettingChange}
            onDirectionClick={handleArrowClick}
            onDirectionRelease={handleArrowRelease}
            retryCount={retryCount}
            onAttemptSubmit={handleAttemptSubmit}
            simulatorRef={ref}
          />
        </div>
      </div>
      {showPopup && <PopupOverlay />}
      <style>
        {`
        .clear-lake-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 20px;
        }
        .simulation-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .canvas-wrapper {
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .controls-wrapper {
          width: 100%;
          max-width: 400px;
        }
        @media (min-width: 768px) {
          .simulation-area {
            flex-direction: row;
            align-items: flex-start;
          }
          .controls-wrapper {
            margin-left: 20px;
            width: 200px;
          }
        }
        `}
      </style>
    </div>
  );
});

export default Clear;