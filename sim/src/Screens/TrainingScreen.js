import React from 'react';
import './TrainingScreen.css';

export default function TrainingScreen() {
  return (
      <div className="video-container">
        <iframe
          className='video-frame'
          src="https://lookerstudio.google.com/embed/reporting/5c1a4a70-ef70-4e71-9722-3847e75464e2/page/apkeE"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          title="Trainings"
        ></iframe>
      </div>
  );
}

