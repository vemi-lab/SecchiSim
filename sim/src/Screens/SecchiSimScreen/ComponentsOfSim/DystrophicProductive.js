import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import p5 from 'p5';
import * as utils from '../utils/p5utils';
import { LAKE_CONFIGS } from '../utils/lakeConfigs';
import Controls from './Controls';
import { collection, addDoc, doc, getDoc, updateDoc, setDoc, serverTimestamp, runTransaction, arrayUnion, deleteField } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";

const DystrophicProductive = forwardRef(({ settings, onSettingChange }, ref) => {
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
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [userRoles, setUserRoles] = useState(null);
  const lakeConfig = LAKE_CONFIGS.DYSTROPHIC_PRODUCTIVE;

  // Add navigation effect at the component level
  useEffect(() => {
    if (moduleDisabled && !showPopup) {
      const timer = setTimeout(() => {
        navigate('/secchi-sim');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [moduleDisabled, navigate, showPopup]);

  const [targetDepth] = useState(() => {
    // Generate random target depth within the lake's configured range
    const min = lakeConfig.targetRange.min;
    const max = lakeConfig.targetRange.max;
    return Number((Math.random() * (max - min) + min).toFixed(2));
  });

  // Add useEffect to load retry count and module state from Firebase
  useEffect(() => {
    const loadUserAttempts = async () => {
      if (!currentUser) return;
      
      try {
        const currentYear = new Date().getFullYear().toString();
        const quizDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Quizzes`);
        const quizDoc = await getDoc(quizDocRef);
        
        if (quizDoc.exists()) {
          const data = quizDoc.data();
          // Get retry count or default to 3 if not set
          const remainingRetries = data.DystrophicProductive_RetryCount ?? 3;
          setRetryCount(remainingRetries);
          
          // Check if module is disabled
          const isDisabled = data.DystrophicProductive_Disabled ?? false;
          setModuleDisabled(isDisabled);
          
          // If no retries left, disable the module
          if (remainingRetries <= 0) {
            setModuleDisabled(true);
          }
        }
      } catch (error) {
        console.error("Error loading user attempts:", error);
      }
    };

    loadUserAttempts();
  }, [currentUser]);

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
        p.waterImage = p.loadImage('/dystrophicLake.png');
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
        const circleX = p.width * 0.4; 
        const circleY = p.height * 0.5; 
        const circleDiameter = Math.min(p.width, p.height) * 0.6;

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
          p.tint(255, utils.calculateVisibility(depthRef.current, settings.turbidity, targetDepth) * 255);
          p.image(p.waterImage, 0, 0, p.width, p.height);
          p.pop();
        }

        // Calculate visibility using the ref value
        const visibility = utils.calculateVisibility(depthRef.current, settings.turbidity, targetDepth);
        
        // Make disk size responsive to canvas size
        const maxDiskSize = Math.min(p.width, p.height) * 0.3;
        const minDiskSize = Math.min(p.width, p.height) * 0.03;
        const diskSize = p.map(depthRef.current, 0, lakeConfig.maxDepth, maxDiskSize, minDiskSize);
        
        // Calculate responsive disk position
        const startX = p.width * 0.3;
        const endX = p.width * 1.2;
        const startY = p.height * 0.5;
        const endY = p.height * 0.75;
        
        let diskX = p.map(depthRef.current, 0, lakeConfig.maxDepth, startX, endX);
        let diskY = p.map(depthRef.current, 0, lakeConfig.maxDepth, startY, endY);
        
        // Draw the disk 
        utils.drawSecchiDisk(p, diskX, diskY, visibility, diskSize);

        // Update depth using animation frame timing
        if (velocityRef.current !== 0) {
          const targetDepth = Math.max(
            Math.min(
              depthRef.current + velocityRef.current,
              lakeConfig.maxDepth
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
        const depthY = p.map(depthRef.current, 0, lakeConfig.maxDepth, depthBarTop, depthBarBottom);
        p.line(depthBarRight - 10, depthY, depthBarRight + 10, depthY);
        
        p.noStroke();
        p.fill(255);
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(Math.max(12, p.width * 0.015));
        
        for (let depth = 0; depth <= lakeConfig.maxDepth; depth += 1) {
          const y = p.map(depth, 0, lakeConfig.maxDepth, depthBarTop, depthBarBottom);
          p.line(depthBarRight - 5, y, depthBarRight + 5, y);
          p.text(depth + 'm', depthBarRight - 15, y);
        }
        p.pop();
      };

      p.mouseDragged = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          const newDepth = utils.handleMouseInteraction(p, p.mouseY, p.height, lakeConfig.maxDepth);
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
      setCurrentMessageIndex(0);
      setShowPopup(true);
      return;
    }

    if (retryCount <= 0 || moduleDisabled) {
      setPopupMessage("You have no attempts remaining. Please try again next year.");
      setCurrentMessageIndex(0);
      setShowPopup(true);
      return;
    }

    try {
      const currentYear = new Date().getFullYear().toString();
      const quizDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Quizzes`);
      const scoresDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Scores`);

      // Get the current depth from the ref and round to 2 decimal places
      const currentDepth = Number(parseFloat(depthRef.current).toFixed(2));
      
      // Calculate absolute difference from target depth
      const TOLERANCE = 0.10; // ±0.10 meters tolerance
      const difference = Math.abs(currentDepth - targetDepth);
      const isPassed = difference <= TOLERANCE;
      const newRetryCount = retryCount - 1;
      
      const attemptData = {
        depth: currentDepth,
        targetDepth: targetDepth,
        difference: difference,
        passed: isPassed,
        lakeType: "DystrophicProductive",
        date: new Date().toISOString()
      };

      await runTransaction(db, async (transaction) => {
        const quizDoc = await transaction.get(quizDocRef);
        const scoresDoc = await transaction.get(scoresDocRef);

        if (!quizDoc.exists()) {
          // Create initial quiz document if it doesn't exist
          transaction.set(quizDocRef, {
            DystrophicProductive_RetryCount: 3,
            DystrophicProductive_Disabled: false,
            lastUpdated: new Date().toISOString()
          });
        }

        const scoresData = scoresDoc.exists() ? scoresDoc.data() : {};
        
        const attemptKeys = Object.keys(scoresData)
          .filter(key => key.startsWith('DystrophicProductive_Attempt_'))
          .sort((a, b) => {
            const numA = parseInt(a.split('_')[2]);
            const numB = parseInt(b.split('_')[2]);
            return numA - numB;
          });
        
        const nextAttemptNumber = attemptKeys.length > 0 
          ? parseInt(attemptKeys[attemptKeys.length - 1].split('_')[2]) + 1 
          : 1;

        // Always update retry count and check if module should be disabled
        const shouldDisableModule = isPassed || newRetryCount <= 0;
        
        // Prepare quiz updates
        const quizUpdates = {
          DystrophicProductive_RetryCount: newRetryCount,
          DystrophicProductive_Disabled: shouldDisableModule,
          lastUpdated: new Date().toISOString()
        };

        // Handle target depth based on pass/fail
        if (isPassed) {
          quizUpdates.DystrophicProductive_TargetDepth = deleteField();
        } else {
          quizUpdates.DystrophicProductive_TargetDepth = targetDepth;
        }

        // Update quiz document
        transaction.set(quizDocRef, quizUpdates, { merge: true });

        // Update scores document
        transaction.set(scoresDocRef, {
          ...scoresData,
          [`DystrophicProductive_Attempt_${nextAttemptNumber}`]: attemptData,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      });

      // Update local state
      setRetryCount(newRetryCount);
      
      if (isPassed) {
        setModuleDisabled(true);
        setPopupMessage(`Congratulations! You've successfully completed the Dystrophic Productive Lake module with a depth of ${currentDepth}m! You may attempt this module again next year to maintain your certification.`);
        setShowPopup(true);
      } else if (newRetryCount <= 0) {
        setModuleDisabled(true);
        setPopupMessage(`Incorrect. The target depth was ${targetDepth}m. You have no attempts remaining. Please try again next year.`);
        setShowPopup(true);
      } else {
        const depthHint = currentDepth > targetDepth ? "too deep" : "too shallow";
        setPopupMessage(`Incorrect. You're ${depthHint}. You have ${newRetryCount} ${newRetryCount === 1 ? 'attempt' : 'attempts'} remaining. Try again!`);
        setShowPopup(true);
      }

    } catch (error) {
      console.error("Error saving attempt: ", error);
      setPopupMessage("There was an error saving your attempt. Please try again.");
      setShowPopup(true);
    }
  };

  const PopupOverlay = () => {
    const handleContinue = (e) => {
      e.preventDefault();
      e.stopPropagation();

      setShowPopup(false);
      
      if (moduleDisabled) {
        // Let the useEffect handle navigation after popup is closed
        return;
      }
      
      // For failed attempts with remaining tries, reset the simulation
      velocityRef.current = 0;
      cancelAnimationFrame(frameRef.current);
      
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
          <button 
            onClick={handleContinue}
            className="continue-btn"
            type="button"
          >
            {moduleDisabled ? 'Finish' : 'Continue'}
          </button>
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
          }
          .popup-message {
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            max-width: 80%;
            width: 400px;
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
          }
          .continue-btn:hover {
            background: #3a3b7a;
            transform: translateY(-1px);
          }
          .continue-btn:active {
            transform: translateY(0);
            background: #2d2e5e;
          }
          `}
        </style>
      </div>
    );
  };

  if (moduleDisabled && !showPopup) {
    return (
      <div className="module-locked">
        <p style={{ padding: '50px' }}>
          You have reached the max attempts allowed for this module. 
          Try again next year
        </p>
      </div>
    );
  }

  return (
    <div className="clear-lake-container">
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

export default DystrophicProductive;