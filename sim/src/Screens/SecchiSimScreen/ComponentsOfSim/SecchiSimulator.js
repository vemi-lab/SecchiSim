import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import * as utils from '../utils/p5utils';

const SecchiSimulator = ({ settings, onSettingChange }) => {
  const canvasRef = useRef(null);
  const sketchRef = useRef(null);

  useEffect(() => {
    // Create new p5 instance
    sketchRef.current = new p5((p) => {
      p.setup = () => {
        const canvas = p.createCanvas(800, 600);
        canvas.parent(canvasRef.current);
        p.colorMode(p.RGB);
      };

      p.draw = () => {
        p.background(0);
        
        // Draw water
        utils.drawWater(p, p.width, p.height, settings.depth, utils.CONSTANTS.MAX_DEPTH);
        
        // Calculate visibility at current depth
        const visibility = utils.calculateVisibility(settings.depth, settings.turbidity);
        
        // Draw Secchi disk at current depth
        const diskY = p.map(settings.depth, 0, utils.CONSTANTS.MAX_DEPTH, 0, p.height);
        utils.drawSecchiDisk(p, p.width/2, diskY, visibility);
        
        // Draw depth markers
        utils.drawDepthMarkers(p, p.width, p.height, settings.depth, utils.CONSTANTS.MAX_DEPTH);
      };

      p.mouseDragged = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          const newDepth = utils.handleMouseInteraction(p, p.mouseY, p.height, utils.CONSTANTS.MAX_DEPTH);
          onSettingChange('depth', newDepth);
        }
      };

      p.mousePressed = p.mouseDragged;
    });

    // Cleanup function
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, []); // Empty dependency array since we handle updates through p5's draw loop

  return <div ref={canvasRef} className="secchi-simulator" />;
};

export default SecchiSimulator; 