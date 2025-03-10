import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import p5 from 'p5';
import * as utils from '../utils/p5utils';

const Clear = forwardRef(({ settings, onSettingChange }, ref) => {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const [animationDepth, setAnimationDepth] = useState(settings.depth);
  const [diskPosition, setDiskPosition] = useState({ x: 400, y: 300 });
  const [waterImage, setWaterImage] = useState(null);

  const handleArrowClick = (direction) => {
    if (direction === 'up') {
      // Move disk closer (larger)
      const newDepth = Math.max(animationDepth - 0.05 , utils.CONSTANTS.MIN_DEPTH);
      setAnimationDepth(newDepth);
      onSettingChange('depth', newDepth);
    } else if (direction === 'down') {
      // Move disk farther (smaller)
      const newDepth = Math.min(animationDepth + 0.05 , utils.CONSTANTS.MAX_DEPTH);
      setAnimationDepth(newDepth);
      onSettingChange('depth', newDepth);
    }
  };

  // Expose handleArrowClick to parent
  useImperativeHandle(ref, () => ({
    handleArrowClick
  }));

  useEffect(() => {
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
        
      };

      p.draw = () => {
        p.clear();
         
        // First draw the dark overlay
        p.push();
        p.noStroke();
        p.fill(0, 400);
        p.rect(0, 0, p.width, p.height);
        
        // Create the circular cutout where we'll see the content
        const circleX = diskPosition.x / 1.5;
        const circleY = diskPosition.y;
        const circleDiameter = 450;
        
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

        // Calculate visibility and draw floating disk
        const visibility = utils.calculateVisibility(animationDepth, settings.turbidity);
        const diskSize = p.map(animationDepth, 0, utils.CONSTANTS.MAX_DEPTH, 200, 20);
        utils.drawSecchiDisk(p, diskPosition.x / 1.5, diskPosition.y, visibility, diskSize);

        p.pop();

        // Draw measuring tape
       

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
        for(let depth = 0; depth <= utils.CONSTANTS.MAX_DEPTH; depth += 1) {
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
    });

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, [settings.turbidity, animationDepth, diskPosition]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        
        if (event.key === 'ArrowUp') handleArrowClick('up');
        else if (event.key === 'ArrowDown') handleArrowClick('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animationDepth, diskPosition]);

  return (
    <div className="secchi-simulator-container" style={{ position: 'relative', width: '800px', height: '600px' }}>
      <div ref={canvasRef} className="secchi-simulator" style={{ outline: 'none' }} />
    </div>
  );
});

export default Clear; 