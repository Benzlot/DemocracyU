import React, { useState, useEffect } from 'react';
import { getDirectory } from '../services/votingService';

const DirectoryPage = () => {
  const [directory, setDirectory] = useState([]);

  useEffect(() => {
    async function fetchDirectory() {
      const data = await getDirectory();
      setDirectory(data);
    }
    fetchDirectory();
  }, []);

  return (
    <div>
      <h1>Student Directory</h1>
      <ul>
        {directory.map(student => (
          <li key={student.id}>
            {student.name} - {student.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectoryPage;
