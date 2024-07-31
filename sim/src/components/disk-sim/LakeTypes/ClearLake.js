import React from 'react';
import { Container, Card } from 'react-bootstrap'; // Example of correct imports
// import './ClearLake.css'; // Example of a CSS import

export default function ClearLake() {
    return (
        <Container>
            <Card>
                <Card.Body>
                    <h1 className='text-center mb-4'>Clear Lake</h1>
                </Card.Body>
            </Card>
        </Container>
    );
}
