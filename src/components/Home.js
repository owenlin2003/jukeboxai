import React, { useState } from "react";
import "../styles/Home.css";
// Remove OpenAI import since we're using backend
// import OpenAI from "openai";  // ✅ new v4 way

import Playlist from "./Playlist";
import { Box, Button, Typography, Paper } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Backend API base URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

function Home({ token }) {
  const [inputValue, setInputValue] = useState("");
  const [generatedSongs, setGeneratedSongs] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    if (!clicked) {
      setClicked(true);
      fetchSongs();
    }
  };

  const getSongString = (songList) => {
    return songList
      .map((song, index) => {
        return `${index + 1}. "${song.title}" by ${song.artist} (${
          song.releaseDate
        })`;
      })
      .join("\n");
  };

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/gpt/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const parsedSongs = data.songs;

      if (parsedSongs && parsedSongs.length) {
        setGeneratedSongs(parsedSongs);
        setInputValue(
          inputValue +
            "\n\nHere are some similar songs:\n\n" +
            getSongString(parsedSongs)
        );
        // Scroll to results after a short delay
        setTimeout(() => {
          const resultsSection = document.querySelector('.results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      } else {
        setInputValue("No songs found");
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setInputValue("Error generating recommendations. Please try again.");
    } finally {
      setClicked(false);
    }
  };
  

  return (
    <div className="home-container">
      {/* Animated background elements */}
      <div className="floating-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
        <div className="floating-music-note note-1">♪</div>
        <div className="floating-music-note note-2">♫</div>
        <div className="floating-music-note note-3">♬</div>
      </div>

      {/* Header */}
      <div className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <MusicNoteIcon className="header-icon" />
            <Typography variant="h5" className="header-title">
              Jukebox AI
            </Typography>
          </div>
          <Typography variant="body2" className="header-subtitle">
            by Owen Lin
          </Typography>
        </div>
        <Button
          variant="contained"
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_refresh_token');
            localStorage.removeItem('spotify_expires_in');
            window.location.href = '/';
          }}
        >
          <ExitToAppIcon />
        </Button>
      </div>

              {/* Main content */}
        <div className="home-content">
          <div className={`input-section ${generatedSongs.length > 0 ? 'has-results' : ''}`}>
          <Paper elevation={0} className="input-card">
            <div className="input-header">
              <AutoAwesomeIcon className="input-icon" />
              <Typography variant="h6" className="input-title">
                Create Your Perfect Playlist
              </Typography>
            </div>
            
            <Typography variant="body2" className="input-subtitle">
              Tell us about your mood, favorite songs, or what you're feeling today
            </Typography>

            <TextField
              id="outlined-multiline-flexible"
              multiline
              maxRows={6}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="e.g., 'I'm feeling energetic and love rock music' or 'Songs like Bohemian Rhapsody and Hotel California'"
              className="dynamic-input"
              variant="outlined"
            />

            <LoadingButton
              variant="contained"
              className="generate-btn"
              onClick={handleButtonClick}
              loading={clicked}
              startIcon={!clicked && <QueueMusicIcon />}
            >
              {clicked ? 'Creating Magic...' : 'Generate Playlist'}
            </LoadingButton>
          </Paper>
        </div>

        {/* Results section */}
        <div className="results-section">
          {generatedSongs.length > 0 && (
            <Paper elevation={0} className="results-card">
              <div className="results-header">
                <Typography variant="h6" className="results-title">
                  🎵 Your Generated Playlist
                </Typography>
                <Typography variant="body2" className="results-subtitle">
                  {generatedSongs.length} songs ready for you
                </Typography>
              </div>
              <Playlist token={token} songs={generatedSongs} />
            </Paper>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
