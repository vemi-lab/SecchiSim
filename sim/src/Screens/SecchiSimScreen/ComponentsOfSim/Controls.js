/* ------ Controls File 

*/

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
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      
      setControlSize({
        buttonSize: isMobile ? 50 : isTablet ? 45 : 40,
        fontSize: isMobile ? 30 : isTablet ? 28 : 25,
        padding: isMobile ? 15 : isTablet ? 12 : 10,
        containerWidth: isMobile ? Math.min(width * 0.9, 400) : isTablet ? 350 : 300
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size setup
    
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
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="water-quality" style={{
        width: '100%',
        textAlign: 'center',
        marginBottom: `${controlSize.padding}px`
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
        width: 'fit-content'
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
        padding: `${controlSize.padding}px 0`
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
    </div>
  );
};

export default Controls;