/* ------ Controls File ------ */

import React, { useState, useEffect, useCallback } from 'react';
// import avatar from '../../../assets/avatar.jpg';

import { 
    CONSTANTS, 
    calculateWaterQuality, 
    calculateSecchiDepth 
} from '../utils/p5utils';

const Controls = ({ 
  settings, 
  onSettingChange, 
  onDirectionClick, 
  onDirectionRelease,
  onAttemptSubmit,
  retryCount
}) => {
  const waterQuality = calculateWaterQuality(calculateSecchiDepth(settings.turbidity));
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [message, setMessage] = useState("Please begin");
  const [controlSize, setControlSize] = useState({
    buttonSize: 40,
    fontSize: 25,
    padding: 10,
    containerWidth: 300
  });

  // Handle window resize for responsive controls
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isLandscape = width > height;
      const baseSize = isLandscape ? height : width;
      const scale = isLandscape ? 0.2 : 0.9; 
      
      setControlSize({
        buttonSize: isMobile ? 40 : isTablet ? 35 : 30, 
        fontSize: isMobile ? 24 : isTablet ? 22 : 20, 
        padding: isMobile ? 12 : isTablet ? 10 : 8, 
        containerWidth: Math.min(baseSize * scale, isLandscape ? 250 : 400)
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent default arrow key behavior
  useEffect(() => {
    const preventArrowScroll = (e) => {
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventArrowScroll);
    return () => window.removeEventListener('keydown', preventArrowScroll);
  }, []);

  // Touch event handlers with proper passive event handling
  const handleTouchStart = useCallback((direction) => (e) => {
    onDirectionClick(direction);
  }, [onDirectionClick]);

  const handleTouchEnd = useCallback((direction) => (e) => {
    onDirectionRelease(direction);
  }, [onDirectionRelease]);

  return (
    <div className="controls" style={{
      width: `${controlSize.containerWidth}px`,
      margin: '0 auto',
      padding: `${controlSize.padding}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: `${controlSize.padding}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxHeight: window.innerWidth > window.innerHeight ? '85vh' : 'auto',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <div className="arrow-controls" style={{
        display: 'grid',
        gridTemplateAreas: `
          '. up .'
          '. down .'
        `,
        gridTemplateColumns: `repeat(3, ${controlSize.buttonSize}px)`,
        gap: `${controlSize.padding/2}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: `${controlSize.padding}px`,
        borderRadius: '8px',
        margin: `${controlSize.padding}px auto`,
        width: 'fit-content',
        flex: '0 0 auto'
      }}>
        <button 
          onMouseDown={(e) => {
            e.preventDefault();
            onDirectionClick('up');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            onDirectionRelease('up');
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            onDirectionRelease('up');
          }}
          onTouchStart={handleTouchStart('up')}
          onTouchEnd={handleTouchEnd('up')}
          style={{
            gridArea: 'up',
            padding: `${controlSize.padding/2}px`,
            fontSize: `${controlSize.fontSize}px`,
            cursor: 'pointer',
            backgroundColor: '#2FA1D6',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            width: '100%',
            height: '100%',
            minHeight: `${controlSize.buttonSize}px`,
            touchAction: 'manipulation',
            userSelect: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            ':hover': {
              backgroundColor: '#2589b6',
              transform: 'translateY(-1px)'
            },
            ':active': {
              transform: 'translateY(1px)'
            }
          }}
        >↑</button>
        <button 
          onMouseDown={(e) => {
            e.preventDefault();
            onDirectionClick('down');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            onDirectionRelease('down');
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            onDirectionRelease('down');
          }}
          onTouchStart={handleTouchStart('down')}
          onTouchEnd={handleTouchEnd('down')}
          style={{
            gridArea: 'down',
            padding: `${controlSize.padding/2}px`,
            fontSize: `${controlSize.fontSize}px`,
            cursor: 'pointer',
            backgroundColor: '#2FA1D6',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            width: '100%',
            height: '100%',
            minHeight: `${controlSize.buttonSize}px`,
            touchAction: 'manipulation',
            userSelect: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            ':hover': {
              backgroundColor: '#2589b6',
              transform: 'translateY(-1px)'
            },
            ':active': {
              transform: 'translateY(1px)'
            }
          }}
        >↓</button>
      </div>

      <div className='buttons' style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: `${controlSize.padding}px`,
        padding: `${controlSize.padding}px 0`,
        flex: '0 0 auto'
      }}>
        <button className='submit-button'
          onClick={(e) => {
            e.preventDefault();
            onDirectionRelease();
            onAttemptSubmit();
          }}
          disabled={retryCount === 0}
          style={{
            padding: `${controlSize.padding}px`,
            cursor: retryCount === 0 ? 'not-allowed' : 'pointer',
            backgroundColor: '#2FA1D6',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            flex: '1',
            maxWidth: '45%',
            opacity: retryCount === 0 ? 0.5 : 1,
            fontSize: `${controlSize.fontSize * 0.7}px`,
            touchAction: 'manipulation',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            ':hover': {
              backgroundColor: retryCount === 0 ? '#2FA1D6' : '#2589b6',
              transform: retryCount === 0 ? 'none' : 'translateY(-1px)'
            },
            ':active': {
              transform: retryCount === 0 ? 'none' : 'translateY(1px)'
            }
          }}
        >Submit</button>
      </div>

      <div className="water-quality" style={{
        width: '100%',
        textAlign: 'center',
        marginTop: `${controlSize.padding}px`,
        flex: '1 1 auto'
      }}>
        <h4 style={{
          fontSize: `${controlSize.fontSize * 0.8}px`,
          margin: `${controlSize.padding/2}px 0`,
          color: '#ffffff'
        }}>Secchi Disk Simulator</h4>
        <h3 style={{
          fontSize: `${controlSize.fontSize}px`,
          margin: `${controlSize.padding/2}px 0`,
          color: '#ffffff'
        }}>Attempts Left: {retryCount}</h3>
        <h4 style={{
          fontSize: `${controlSize.fontSize * 0.8}px`,
          margin: `${controlSize.padding/2}px 0`,
          color: '#ffffff'
        }}>{message}</h4>
        <h4 style={{
          fontSize: `${controlSize.fontSize * 0.8}px`,
          margin: `${controlSize.padding/2}px 0`,
          color: '#ffffff'
        }}>Current Depth: {settings.depth.toFixed(2)} Meters</h4>
      </div>
    </div>
  );
};

export default Controls;