import React, { useState, useEffect } from "react";
import { getTokenFromResponse } from "../auth";
import Login from "./Login";
import Home from "./Home";

function App() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage first
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Check URL parameters for new token
      const tokenData = getTokenFromResponse();
      if (tokenData.access_token) {
        setToken(tokenData.access_token);
        // Store tokens
        localStorage.setItem('spotify_access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
        }
        if (tokenData.expires_in) {
          localStorage.setItem('spotify_expires_in', tokenData.expires_in);
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#121212',
        color: 'white'
      }}>
        Loading Jukebox AI...
      </div>
    );
  }

  return (
    <div className="App">
      {!token ? <Login /> : <Home token={token} />}
    </div>
  );
}

export default App;
