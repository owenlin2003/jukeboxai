import React, { useState } from "react";
import { getSpotifyLoginUrl } from "../auth";
import "../styles/Login.css";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authUrl = await getSpotifyLoginUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated background elements */}
      <div className="floating-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      {/* Main content */}
      <div className="login-content">
        {/* Logo and branding */}
        <div className="brand-section">
          <div className="logo-container">
            <MusicNoteIcon className="logo-icon" />
            <div className="logo-text">
              <Typography variant="h3" className="brand-name">
                Jukebox
              </Typography>
              <Typography variant="h6" className="brand-tagline">
                AI
              </Typography>
            </div>
          </div>
          
          <Typography variant="h4" className="hero-title">
            Find Your Perfect
          </Typography>
          <Typography variant="h4" className="hero-title highlight">
            Mood Music
          </Typography>
          
          <Typography variant="body1" className="hero-subtitle">
            Powered by AI • Connected to Spotify
          </Typography>
          
          <Typography variant="body2" className="creator-text">
            Created by Owen Lin
          </Typography>
        </div>

        {/* Login section */}
        <div className="login-section">
          <div className="login-card">
            <Typography variant="h6" className="login-title">
              Ready to explore?
            </Typography>
            
            <Typography variant="body2" className="login-description">
              Connect your Spotify account to get personalized music recommendations
            </Typography>

            <Button 
              variant="contained" 
              className="spotify-login-btn"
              onClick={handleLogin}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            >
              {isLoading ? 'Connecting...' : 'Connect with Spotify'}
            </Button>

            <Typography variant="caption" className="login-note">
              We'll only access your public playlists and listening history
            </Typography>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Login;
