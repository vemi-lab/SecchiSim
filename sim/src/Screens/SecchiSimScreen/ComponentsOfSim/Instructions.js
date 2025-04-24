import React from "react";
import { Link } from "react-router-dom";

const Instructions = ({ setCurrentPage }) => {
  return (
    <div>
      <h1>Instructions</h1>
      <h2>
        Volunteers need to take only one qualifying reading for re-certification. 
        Please select a lake type that is most similar to the lake that you monitor. 
        (If you are not sure what lake is closest to the one you monitor please select the Clear Lake)
      </h2>
      <h3>
        Before you start, read the tutorial 
      </h3>

      {/* Link to navigate to the Tutorial */}
      <Link to="/secchi-sim/tutorial">
        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Tutorial</button>
      </Link>

      {/* Table with buttons */}
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Lake Type</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Completion Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
              <button onClick={() => setCurrentPage('clear')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Clear</button>
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Bluish color, with readings deeper than 4 meters
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Incomplete
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
              <button onClick={() => setCurrentPage('intermediate')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Intermediate</button>
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Blue or green-brown, with readings between 4 and 7 meters
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Incomplete
            </td>
           </tr>
           <tr>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
              <button onClick={() => setCurrentPage('productive')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Productive</button>
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Green Background, high algae content, readings shallower than 3 meters
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Incomplete
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
              <button onClick={() => setCurrentPage('dystrophic')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Dystrophic</button>
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Distinct tea or rootbeer color, readings shallower than 3 meters
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Incomplete
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
              <button onClick={() => setCurrentPage('dystrophicProductive')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Dystrophic Productive</button>
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Green-brown and murky, readings shallower than 3 meters
            </td>
            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                Incomplete
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Instructions;
