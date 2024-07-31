import React, {useEffect} from 'react';
import { Card, Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import './CSS-disk-sim/Instructions.css';
import arrowBtn from './img-disk-sim/arrowBtn.png';

export default function Instructions() {
    const location = useLocation();
    const navigate = useNavigate();
    const { lakeType, fromTryItOut } = location.state || {};

    useEffect(() => {
        // Change background color of body when component mounts
        document.body.style.backgroundColor = '#34395d';

        // Reset background color of body when component unmounts
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handleContinue = () => {
        if (fromTryItOut) {
            navigate('/try-it-out');
        } else if (lakeType) {
            navigate(`/lake/${lakeType}`);
        } else {
            navigate('/try-it-out'); // Default navigation if no lakeType is provided
        }
    };

  return (
    <Container className="instructions-container">
        <Card className="mt-4">
            <Card.Body>
            <h1 className="text-center mb-4">How to Use the Secchi Disk Simulator</h1>
            <p className="text-center mb-2">
                The <span style={{ color: 'green' }}>up and down arrows</span> on your keyboard control the movement of the secchi disk.
            <br />
                The <span style={{ color: 'green' }}>down arrow</span> moves the disk further into the water, and the <span style={{ color: 'green' }}>up arrow</span> retrieves it.
            <br />
                <span style={{ color: 'green' }}>Holding down</span> the arrow keys will build up momentum. If you want to move it with <span style={{ color: 'green' }}>precision</span>, only tap the arrow keys.
            <br />
                Measure the depth at which the disk has just disappeared out of view. Click <span style={{ color: 'green' }}>submit</span> when you think the reading is accurate.
            <br />
                You will have <span style={{ color: 'green' }}>three attempts</span> to take a proper measurement.
            </p>

            <img src={arrowBtn} alt="arrow-control-panel" className="arrow-key-image" />

            <button className="btn btn-success" onClick={handleContinue}>Continue</button>

            </Card.Body>
        </Card>
    </Container>
  );
}
