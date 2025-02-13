import React from 'react';
import { 
    CONSTANTS, 
    calculateWaterQuality, 
    calculateSecchiDepth 
} from '../utils/p5utils';

const Controls = ({ settings, onSettingChange }) => {
  const waterQuality = calculateWaterQuality(calculateSecchiDepth(settings.turbidity));

  return (
    <div className="controls">
      <div className="control-group">
        <label>
          Depth:
          <input 
            type="range"
            min={CONSTANTS.MIN_DEPTH}
            max={CONSTANTS.MAX_DEPTH}
            step="0.1"
            value={settings.depth}
            onChange={(e) => onSettingChange('depth', Number(e.target.value))}
          />
          <span>{settings.depth.toFixed(1)}m</span>
        </label>
      </div>
      
      <div className="control-group">
        <label>
          Turbidity:
          <input 
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={settings.turbidity}
            onChange={(e) => onSettingChange('turbidity', Number(e.target.value))}
          />
          <span>{settings.turbidity.toFixed(1)}</span>
        </label>
      </div>

      <div className="water-quality">
        <h3>Water Quality</h3>
        <p>Quality: {waterQuality.quality}</p>
        <p>Description: {waterQuality.description}</p>
      </div>
    </div>
  );
};

export default Controls; 