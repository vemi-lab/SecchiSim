import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructionsScreen.css';
import lakeView from '../assets/frozenLake.jpg';
import simulator from '../assets/simulator.jpeg';
import instructions from '../assets/instructions.jpeg';
import material from '../assets/maerial.jpg';
import volunteers from '../assets/volunteers.jpg';
import sunset from '../assets/sunset.jpg';
import lake from '../assets/lake.jpg'
import userDark from '../assets/user-dark.png';
import userLight from '../assets/user-light.png';
import { useTheme } from "../contexts/ThemeContext";


export default function InstructionsScreen() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();  

  return (
    <div className="scroll-container">
      {/* Header with Settings Icon and Profile */}
      <div className="header">
        {/* <FiSettings className="setting-icon" /> */}
        <div onClick={() => navigate("/profile")} className="profile">
          <img src={darkMode ? userLight : userDark} alt="User Icon" />
        </div>
      </div>

      <section className="welcome-section scroll-section">
        <img src={lakeView} alt="Scenic lake" className="welcome-image" />
        <h1>Welcome to the Lake Stewards of Maine Secchi Simulator!</h1>
      </section>

      <section className='quote scroll-section'>
        <div>
          <p>
            This interactive tool is designed to help you understand water quality monitoring procedures,
            learn more about lakes, and practice using a Secchi disk for water clarity measurement.
             <br />It is an essential part of water quality monitoring and helps us assess the health of Maine's beautiful lakes.
          </p>
        </div>
        <div className='image-section'>
          <img src={sunset} alt="Split Screen" />
        </div>
      </section>

      <section className="functionality-section scroll-section">
        <h2>What You Can Do Here: </h2>
        <ul>
          <li> 
            <img src={simulator} alt="simulator" className="functionality-image" />
            <h3 style={{marginTop: '10px'}}>Secchi Simulator:</h3>
            Practice taking Secchi disk readings in a simulated lake environment.
            This will help you prepare for real-world monitoring.
          </li>
          <li>
            <img src={material} alt="Material" className="functionality-image" />
            <h3>Course Material:</h3>
            Access educational videos and resources to learn about water quality monitoring principles.
            After watching the videos, you'll be required to take a quiz as a component of certification.
          </li>
          <li>
            <img src={volunteers} alt="Volunteers" className="functionality-image" />
            <h3>Upcoming Trainings:</h3>
            Find information about upcoming in-person opportunities and workshops across the state of Maine.
          </li>
        </ul>
      </section>

      <section className="instructions-section scroll-section">
        <div className='image-section'>
          <img src={instructions} alt="Split Screen" />
        </div>
        <div style={{ padding: '50px'}}>
          <h2>How to Use the Simulator:</h2>
          <ol>
            <li>
              Navigate to the <span style={{ color: "#6F73B3", fontWeight: "bold" }}>Simulator</span> section using the navigation bar.
            </li>
            <li>
              Follow the on-screen instructions to lower the Secchi disk and
              record your readings. Your Secchi disc should always disappear
              – this is the point, where it has just disappeared, you want to take your reading at.
            </li>
            <li>
              Use the <span style={{ color: "#6F73B3", fontWeight: "bold" }}>Course Material</span> section to supplement your learning.
            </li>
            <li>
              Check the <span style={{ color: "#6F73B3", fontWeight: "bold" }}>Upcoming Trainings</span> section to find in-person
              opportunities.
            </li>
          </ol>
        </div>
      </section>

      <section className="welcome-section scroll-section">
        <img src={lake} alt="lake" className="welcome-image" />
        <div>
          <p>
            We encourage you to explore all the features of this website and become a valuable contributor to lake health monitoring in Maine.
            If you have questions, please email us at <a href="mailto:stewards@lakestewardsme.org" className='email'>
              stewards@lakestewardsme.org</a> or reach out to Tristan or Jonnie.
          </p>
        </div>
      </section>
    </div>
  );
}