import React from "react";

const Tutorial = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#333', textAlign: 'center', fontSize: '2em', marginBottom: '20px' }}>How to Use the Secchi Disk Simulator</h1>
            <h2 style={{ color: '#555', margin: '10px 0' }}>The up and down arrows on your keyboard control the movement of the secchi disk.</h2>
            <h2 style={{ color: '#555', margin: '10px 0' }}>The down arrow moves the disk further into the water, and the up arrow retrieves it.</h2>
            <h2 style={{ color: '#555', margin: '10px 0' }}>Holding down the arrow keys will build up momentum; if you want to move it with precision, only tap the arrow keys.</h2>
            <h2 style={{ color: '#555', margin: '10px 0' }}>Measure the depth at which the disk has just disappeared out of view. Click submit when you think the reading is accurate.</h2>
            <h2 style={{ color: '#555', margin: '10px 0' }}>You will have three attempts to take a proper measurement.</h2>
        </div>
    );  
};

export default Tutorial;