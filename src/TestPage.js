import React, { useEffect, useState } from 'react';

function TestPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const url = 'http://localhost:3001/api/user'; // Ensure this is correct
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json(); // This line throws if response is not valid JSON
          setUser(data);
          setError('');
      } catch (error) {
          console.error('Failed to fetch user data:', error);
          setError(error.message || 'Failed to fetch data');
      } finally {
          setLoading(false);
      }
  };
  
    
    fetchUserData();
  }, []);

  return (
    <div>
      <h1>User Information</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Age: {user.age}</p>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
}

export default TestPage;