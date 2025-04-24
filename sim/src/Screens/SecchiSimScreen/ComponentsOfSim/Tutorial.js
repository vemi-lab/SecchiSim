import React from "react";

const Tutorial = () => {
    const styles = {
        container: {
            padding: '20px',
            backgroundColor: '#000',
            borderRadius: '8px',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 4px 10px rgba(255, 255, 255, 0.2)',
            fontFamily: 'Arial, sans-serif',
            color: '#fff',
            textAlign: 'center'
        },
        title: {
            color: 'white',
            fontSize: '2.5em',
            marginBottom: '20px'
        },
        subtitle: {
            color: '#fff',
            margin: '10px 0',
            fontSize: '1.5em'
        },
        text: {
            color: '#fff',
            margin: '10px 0',
            fontSize: '1.2em'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>How to Use the Secchi Disk Simulator</h1>
            <h2 style={styles.subtitle}>Controls</h2>
            <p style={styles.text}>The up and down arrows on your keyboard control the movement of the secchi disk.</p>
            <p style={styles.text}>The down arrow moves the disk further into the water, and the up arrow retrieves it.</p>
            <p style={styles.text}>Holding down the arrow keys will build up momentum; if you want to move it with precision, only tap the arrow keys.</p>
            <p style={styles.text}>Measure the depth at which the disk has just disappeared out of view. Click submit when you think the reading is accurate.</p>
            <p style={styles.text}>You will have three attempts to take a proper measurement.</p>
        </div>
    );  
};

export default Tutorial;