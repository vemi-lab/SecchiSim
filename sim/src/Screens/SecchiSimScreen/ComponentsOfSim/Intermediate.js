import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import p5 from 'p5';
import * as utils from '../utils/p5utils';
import Controls from './Controls';

const Clear = forwardRef(({ settings, onSettingChange }, ref) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const velocityRef = useRef(0);
  const lastUpdateRef = useRef(Date.now());
  const depthRef = useRef(settings.depth);
  const [animationDepth, setAnimationDepth] = useState(settings.depth);
  const [diskPosition, setDiskPosition] = useState({ x: 400, y: 300 });
  const moveAmount = 0.03; // Reduced movement speed for slower velocity
  const frameRef = useRef();

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
    sketchRef.current = new p5((p) => {

      p.preload = () => {
        // Load water image before setup and assign to p instance
        p.waterImage = p.loadImage('/intermediateLake.png');
      };

      p.setup = () => {
        const canvas = p.createCanvas(800, 600);
        canvas.parent(canvasRef.current);
        p.colorMode(p.RGB);
        p.frameRate(60);
      };

      p.draw = () => {
        // Clear background first
        p.background(200, 220, 255);

        // Draw background image if loaded
        if (p.waterImage) { 
          p.push();
          p.tint(255); // Full opacity for background
          p.image(p.waterImage, 0, 0, p.width, p.height);
          p.pop();
        }

        // Draw dark overlay
        p.push();
        p.noStroke();
        p.fill(0, 400); // Changed from 150 to 400 for full black
        p.rect(0, 0, p.width, p.height);
        p.pop();

        const circleX = diskPosition.x/1.3;
        const circleY = diskPosition.y;
        const circleDiameter = 400;

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

        // Calculate visibility using the ref value
        const visibility = utils.calculateVisibility(depthRef.current, settings.turbidity);
        const diskSize = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, 200, 20);
        
        // Change mapping so the disk moves further right as depth increases
        let diskX = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, diskPosition.x / 1.5, p.width + 400);
        
        // New: map y position so the disk moves at an angle.
        // Here the disk moves from its initial y to initial y plus 100 pixels as depth increases.
        let diskY = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, diskPosition.y, diskPosition.y + 150);
        
        // Draw the disk using the new x and y values
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

          // Only update state if we've moved a significant amount
          if (Math.abs(targetDepth - animationDepth) > 0.01) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
              setAnimationDepth(targetDepth);
              onSettingChange('depth', targetDepth);
            });
          }
        }

        p.pop();

        p.push();
        // Static depth indicator bar (no floating offset)
        p.stroke(255);
        p.strokeWeight(2);
        p.line(p.width - 50, 100, p.width - 50, p.height - 100);
        p.stroke(255, 0, 0);
        const depthY = p.map(depthRef.current, 0, utils.CONSTANTS.MAX_DEPTH, 100, p.height - 100);
        p.line(p.width - 60, depthY, p.width - 40, depthY);
        p.noStroke();
        p.fill(255);
        p.textAlign(p.RIGHT, p.CENTER);
        for (let depth = 0; depth <= utils.CONSTANTS.MAX_DEPTH; depth += 1) {
          const y = p.map(depth, 0, utils.CONSTANTS.MAX_DEPTH, 100, p.height - 100);
          p.line(p.width - 55, y, p.width - 45, y);
          p.text(depth + 'm', p.width - 65, y);
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
  }, [settings.turbidity, diskPosition]); // Remove animationDepth dependency

  return (
    <div className="clear-lake-container">
      {/* <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>Back to Simulator</button> */}
      <div className="simulation-area">
        <div className="canvas-wrapper" style={{ position: 'relative', width: '800px', height: '600px' }}>
          <div ref={canvasRef} className="secchi-simulator" style={{ outline: 'none' }} />
        </div>
        <div className="controls-wrapper" style={{ marginLeft: '20px' }}>
          <Controls 
            settings={settings}
            onSettingChange={onSettingChange}
            onDirectionClick={handleArrowClick}
            onDirectionRelease={handleArrowRelease}
            simulatorRef={ref}
          />
        </div>
      </div>
      <style jsx>{`
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
          align-items: flex-start; /* Align items at the top */
        }
        .canvas-wrapper {
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
        }
        .controls-wrapper {
          display: flex;
          flex-direction: column; /* Stack controls vertically */
          width: 200px; /* Set a fixed width for the controls */
        }
      `}</style>
    </div>
  );
});

export default Clear;