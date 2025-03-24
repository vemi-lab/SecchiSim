import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import p5 from 'p5';
import * as utils from '../utils/p5utils';
import Controls from './Controls';

const Clear = forwardRef(({ settings, onSettingChange }, ref) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const [animationDepth, setAnimationDepth] = useState(settings.depth);
  const [diskPosition, setDiskPosition] = useState({ x: 400, y: 300 });
  const [waterImage, setWaterImage] = useState(null);
  const [velocity, setVelocity] = useState(0); // State for velocity
  const moveAmount = 0.1; // Movement speed

  // Define handleArrowClick and handleArrowRelease in the component scope
  const handleArrowClick = (direction) => {
    if (direction === 'up') {
      setVelocity(-moveAmount); // Move up
    } else if (direction === 'down') {
      setVelocity(moveAmount); // Move down
    }
  };

  const handleArrowRelease = () => {
    setVelocity(0); // Stop movement
  };

  // Expose handleArrowClick and handleArrowRelease to parent
  useImperativeHandle(ref, () => ({
    handleArrowClick,
    handleArrowRelease
  }));

  useEffect(() => {
    // Check if the component is mounted
    console.log('Clear component mounted');
    // Create new p5 instance
    sketchRef.current = new p5((p) => {
      p.preload = () => {
        // Load water image
        const img = p.loadImage('/clearLake.png');
        setWaterImage(img);
      };

      p.setup = () => {
        const canvas = p.createCanvas(800, 600);
        canvas.parent(canvasRef.current);
        p.colorMode(p.RGB);
        p.frameRate(60); // Set frame rate for smoother rendering
      };

      p.draw = () => {
        // Set background color to prevent black screen
        p.background(200, 220, 255); // Light blue background

        // Draw dark overlay
        p.push();
        p.noStroke();
        p.fill(0, 400);
        p.rect(0, 0, p.width, p.height);
        p.pop();

        // Create the circular cutout where we'll see the content
        const circleX = diskPosition.x / 1.5;
        const circleY = diskPosition.y;
        const circleDiameter = 450;

        p.push();
        p.erase();
        p.circle(circleX, circleY, circleDiameter);
        p.noErase();
        p.pop();

        // Draw content inside the cutout area
        p.push();
        p.clip(() => {
          p.circle(circleX, circleY, circleDiameter);
        });

        // Draw the background image
        if (waterImage) {
          p.image(waterImage, 0, 0, p.width, p.height);
        }

        // Update the animation depth based on velocity
        const newDepth = animationDepth + velocity;
        setAnimationDepth(Math.max(Math.min(newDepth, utils.CONSTANTS.MAX_DEPTH), utils.CONSTANTS.MIN_DEPTH)); // Clamp depth

        // Calculate visibility and draw floating disk
        const visibility = utils.calculateVisibility(animationDepth, settings.turbidity);
        const diskSize = p.map(animationDepth, 0, utils.CONSTANTS.MAX_DEPTH, 200, 20);
        utils.drawSecchiDisk(p, diskPosition.x / 1.5, diskPosition.y, visibility, diskSize);

        p.pop();
       
        // Draw depth scale
        p.push();
        p.stroke(255);
        p.strokeWeight(2);
        p.line(p.width - 50, 100, p.width - 50, p.height - 100);
        p.stroke(255, 0, 0);
        const depthY = p.map(animationDepth, 0, utils.CONSTANTS.MAX_DEPTH, 100, p.height - 100);
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
          setAnimationDepth(newDepth); // Update animation depth
        }
      };

      p.mousePressed = p.mouseDragged;

      // Key event listeners for arrow keys
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
    };
  }, [settings.turbidity, diskPosition, animationDepth, velocity]);

  return (
    <div className="clear-lake-container">
      <button onClick={() => navigate('/secchi-sim')} style={{ marginBottom: '20px' }}>Back to Simulator</button>
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