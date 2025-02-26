import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import p5 from 'p5';
import * as utils from '../utils/p5utils';

const SecchiSimulator = forwardRef(({ settings, onSettingChange }, ref) => {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);
  const [animationDepth, setAnimationDepth] = useState(settings.depth);
  const [diskPosition, setDiskPosition] = useState({ x: 400, y: 300 });

  const handleArrowClick = (direction) => {
    if (direction === 'up') {
      // Move disk closer (larger)
      const newDepth = Math.max(animationDepth - 0.5, utils.CONSTANTS.MIN_DEPTH);
      setAnimationDepth(newDepth);
      onSettingChange('depth', newDepth);
    } else if (direction === 'down') {
      // Move disk farther (smaller)
      const newDepth = Math.min(animationDepth + 0.5, utils.CONSTANTS.MAX_DEPTH);
      setAnimationDepth(newDepth);
      onSettingChange('depth', newDepth);
    } else if (direction === 'left') {
      setDiskPosition(prev => ({
        ...prev,
        x: Math.max(prev.x - 20, 100)
      }));
    } else if (direction === 'right') {
      setDiskPosition(prev => ({
        ...prev,
        x: Math.min(prev.x + 20, 700)
      }));
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
        utils.preload(p);
      };

      p.setup = () => {
        const canvas = p.createCanvas(800, 600);
        canvas.parent(canvasRef.current);
        p.colorMode(p.RGB);
        p.background(0, 20, 40); // Set dark blue background once
      };

      p.draw = () => {
        p.clear();
        p.background(0, 20, 40);
        
        // Draw water
        utils.drawWater(p, p.width, p.height, animationDepth, utils.CONSTANTS.MAX_DEPTH);
        
        // Calculate visibility based on depth and turbidity
        const visibility = utils.calculateVisibility(animationDepth, settings.turbidity);
        
        // Keep disk centered but change size based on depth
        const centerX = diskPosition.x;
        const centerY = p.height / 2; // Keep Y position fixed at center
        
        // Make disk size change more dramatically with depth
        const diskSize = p.map(animationDepth, 0, utils.CONSTANTS.MAX_DEPTH, 200, 20);
        
        // Draw depth scale
        p.push();
        p.stroke(255);
        p.strokeWeight(2);
        // Draw vertical line
        p.line(p.width - 50, 100, p.width - 50, p.height - 100);
        // Draw current depth indicator
        p.stroke(255, 0, 0);
        const depthY = p.map(animationDepth, 0, utils.CONSTANTS.MAX_DEPTH, 100, p.height - 100);
        p.line(p.width - 60, depthY, p.width - 40, depthY);
        // Draw depth labels
        p.noStroke();
        p.fill(255);
        p.textAlign(p.RIGHT, p.CENTER);
        for(let depth = 0; depth <= utils.CONSTANTS.MAX_DEPTH; depth += 1) {
          const y = p.map(depth, 0, utils.CONSTANTS.MAX_DEPTH, 100, p.height - 100);
          p.line(p.width - 55, y, p.width - 45, y);
          p.text(depth + 'm', p.width - 65, y);
        }
        p.pop();
        
        // Draw Secchi disk
        utils.drawSecchiDisk(p, centerX, centerY, visibility, diskSize);
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
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
          event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        
        if (event.key === 'ArrowUp') handleArrowClick('up');
        else if (event.key === 'ArrowDown') handleArrowClick('down');
        else if (event.key === 'ArrowLeft') handleArrowClick('left');
        else if (event.key === 'ArrowRight') handleArrowClick('right');
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

export default SecchiSimulator;