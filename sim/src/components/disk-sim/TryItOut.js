import React , {useEffect} from 'react';
import { Card, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './CSS-disk-sim/TryItOut.css'; // Assuming you create a CSS file for styling

export default function TryItOut() {
    // const [selectedLakeType, setSelectedLakeType] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        // Change background color of body when component mounts
        document.body.style.backgroundColor = '#34395d';

        // Reset background color of body when component unmounts
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handleSelectLakeType = (lakeType) => {
        // setSelectedLakeType(lakeType);
        navigate('/instructions', { state: { lakeType } });
    };

    const handleInstructions = () => {
        navigate('/instructions', { state: { fromTryItOut: true } });
    }


    return (
        <Container className="tryitout-container">
            <Card className="mt-4">
                <Card.Body>
                    <h1 className='text-center mb-4'>Secchi Reading Simulator</h1>
                    <p className='text-center mb-2'>
                        Volunteers need to take only one qualifying reading for re-certification. Please select a lake type that is most similar to the lake that you monitor. (If you are not sure which lake is closest to the one you monitor, please select the Clear Lake)
                    </p>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Lake Type</th>
                                <th>Description</th>
                                <th>Completion Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><button className="btn btn-success" onClick={() => handleSelectLakeType('clear')}>Clear</button></td>
                                <td>Bluish color, with readings deeper than 4 meters</td>
                                <td className="text-danger">Incomplete</td>
                            </tr>
                            <tr>
                                <td><button className="btn btn-success" onClick={() => handleSelectLakeType('intermediate')}>Intermediate</button></td>
                                <td>Blue or green-brown, with readings between 4 and 7 meters</td>
                                <td className="text-danger">Incomplete</td>
                            </tr>
                            <tr>
                                <td><button className="btn btn-success" onClick={() => handleSelectLakeType('productive')}>Productive</button></td>
                                <td>Green Background, high algae content, readings shallower than 3 meters</td>
                                <td className="text-danger">Incomplete</td>
                            </tr>
                            <tr>
                                <td><button className="btn btn-success" onClick={() => handleSelectLakeType('dystrophic')}>Dystrophic</button></td>
                                <td>Dystrophic lakes have a distinct tea or rootbeer color with typically shallower Secchi readings</td>
                                <td className="text-danger">Incomplete</td>
                            </tr>
                            <tr>
                                <td><button className="btn btn-success" onClick={() => handleSelectLakeType('dystrophic-productive')}>Dystrophic Productive</button></td>
                                <td>Green-brown and murky, readings shallower than 3 meters</td>
                                <td className="text-danger">Incomplete</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="text-center mt-4">
                        <button className="btn btn-success mr-2" onClick={handleInstructions}>Instructions</button>
                        <Link to="/dashboard" className="btn btn-success">LSM Home</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

