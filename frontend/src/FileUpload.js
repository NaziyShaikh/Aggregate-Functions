import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileUpload.css'; // Make sure to import the CSS file

const FileUpload = () => {
  const [data, setData] = useState({ field1: '', field2: '' });
  const [aggregatedData, setAggregatedData] = useState([]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/data', data);
      fetchAggregatedData(); // Fetch aggregated data after submitting
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const fetchAggregatedData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/aggregate');
      setAggregatedData(response.data);
    } catch (error) {
      console.error('Error fetching aggregated data:', error);
    }
  };

  const handleRefresh = () => {
    fetchAggregatedData(); // Call the fetch function to refresh data
    setData({ field1: '', field2: '' }); // Reset input fields
  };

  useEffect(() => {
    fetchAggregatedData(); // Fetch aggregated data on component mount
  }, []);

  return (
    <div className="file-upload-container">
      <h2 className="upload-heading">File Upload Here</h2>
      <form onSubmit={handleSubmit}>
        <input name="field1" type="number" value={data.field1} onChange={handleChange} placeholder="Field 1" required />
        <input name="field2" type="text" value={data.field2} onChange={handleChange} placeholder="Field 2" required />
        <button type="submit">Submit</button>
      </form>

      <button onClick={handleRefresh} className="refresh-button">Refresh</button>

      <h2>Aggregated Data</h2>
      <ul>
        {aggregatedData.map((item, index) => (
          <li key={index}>
            {item._id}: Count = {item.count}, Average = {item.average}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;