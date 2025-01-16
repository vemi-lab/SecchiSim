import React from 'react';
import './VideoScreen.css';

export default function VideoScreen() {
  return (
    <div className="container">
      <div className="scroll-view">
        <p>
          Here you will find the video for the corresponding module.
          Once the video is watched (advancing will be disabled) the quiz for the module will be displayed
        </p>
      </div>
    </div>
  );
}