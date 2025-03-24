import React from 'react';
import './InstructionsScreen.css';
import lakeView from '../assets/secchi.png';

export default function InstructionsScreen() {
  return (
    <div className="instructions-container">
      <div className="welcome-section">
        <img src={lakeView} alt="Scenic lake view" className="hero-image" />
        <h1>Welcome to the Lake Stewards of Maine Secchi Simulator!</h1>
        <p>
          This interactive tool is designed to help you understand and practice
          using a Secchi disk for water clarity measurement.
        </p>
      </div>

      <div className="content-box">
        <p>
          It's an essential part of water quality monitoring and helps us assess the health of
          Maine's beautiful lakes.
        </p>
        <div className="functionality-section">
          <h2>What You Can Do Here:</h2>
          <ul>
            <li>
              <strong>Secchi Simulator:</strong> Practice taking Secchi disk readings
              in a simulated lake environment. This will help you prepare for
              real-world monitoring.
            </li>
            <li>
              <strong>Course Material:</strong> Access educational videos and resources
              to learn about water quality monitoring principles and Secchi disk
              usage. After watching the videos, you'll be able to take a quiz.
            </li>
            <li>
              <strong>Upcoming Trainings:</strong> Find information about upcoming
              in-person trainings and workshops across the state of Maine.
            </li>
          </ul>
        </div>

        <div className="instructions-section">
          <h2>How to Use the Simulator:</h2>
          <ol>
            <li>
              Navigate to the "Simulator" section using the navigation bar.
            </li>
            <li>
              Follow the on-screen instructions to lower the Secchi disk and
              record your readings.
            </li>
            <li>
              Use the "Course Material" section to supplement your learning.
            </li>
            <li>
              Check the "Upcoming Trainings" section to find in-person
              opportunities.
            </li>
          </ol>
          <p>
            We encourage you to explore all the features of this website and
            become a valuable contributor to lake health monitoring in Maine.
          </p>
        </div>
      </div>
    </div>
  );
}
