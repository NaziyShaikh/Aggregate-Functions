import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FileList() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/files');
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFiles();
    }, []);

    return (
        <ul>
            {files.map(file => (
                <li key={file._id}>{file.filename}</li>
            ))}
        </ul>
    );
}

export default FileList;