/* ------ Controls File 

*/


import React from 'react';
import { 
    CONSTANTS, 
    calculateWaterQuality, 
    calculateSecchiDepth 
} from '../utils/p5utils';

const Controls = ({ settings, onSettingChange, onDirectionClick, onDirectionRelease }) => {
  const waterQuality = calculateWaterQuality(calculateSecchiDepth(settings.turbidity));

  return (
    <div className="controls">
      
      <div className="water-quality">
        <h3>Attempts Left: 3</h3>
        <h4>Please begin</h4>
        {/* <p>Quality: {waterQuality.quality}</p>
        <p>Description: {waterQuality.description}</p> */}
      </div>

      <div className="arrow-controls" style={{
        display: 'grid',
        gridTemplateAreas: `
          '. up .'
          '. down .'
        `,
        gridTemplateColumns: 'repeat(3, 40px)',
        gap: '1px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '8px',
        margin: '20px auto',
        width: 'fit-content',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-70%)'
      }}>
        <button 
          onMouseDown={() => onDirectionClick('up')}
          onMouseUp={() => onDirectionRelease('up')}
          onMouseLeave={() => onDirectionRelease('up')}
          style={{
            gridArea: 'up',
            padding: '5px',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: '#2FA1D6',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            width: '100%',
            height: '100%'
          }}
        >↑</button>
        <button 
          onMouseDown={() => onDirectionClick('down')}
          onMouseUp={() => onDirectionRelease('down')}
          onMouseLeave={() => onDirectionRelease('down')}
          style={{
            gridArea: 'down',
            padding: '5px',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: '#2FA1D6',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            width: '100%',
            height: '100%'
          }}
        >↓</button>
      </div>
        
      <div className='buttons' style={{
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px' 
        }}>
         <button className='reset-button'
            onClick={() => onSettingChange('depth', 0)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#2FA1D6',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              width: '100%',
              height: '100%',
              flex: '1'
            }}
            >Reset</button>
     
         <button className='submit-button'
            onClick={() => onSettingChange('depth', 0)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#2FA1D6',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              width: '100%',
              height: '100%',
              flex: '1'
            }}
            >Submit</button>
      </div>
    </div>
  );
};

export default Controls; 