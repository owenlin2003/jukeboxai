import React, { useState } from "react";
import "../styles/Home.css";
// Remove OpenAI import since we're using backend
// import OpenAI from "openai";  // ✅ new v4 way

import Playlist from "./Playlist";
import { Box, Button, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

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
    <div className="Home">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <QueueMusicIcon
          sx={{
            fontSize: "2rem",
            color: "white",
          }}
        />
        <Typography
          sx={{
            fontSize: "1rem",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Jukebox AI by Owen Lin
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100vw",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "30vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: "2rem",
          }}
        >
          <TextField
            id="outlined-multiline-flexible"
            label="Playlist AI"
            multiline
            maxRows={10}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="let us know some of your favorite songs and we'll generate some similar ones for you!"
            sx={{
              width: "75%",
              color: "white",
              // backgroundColor: "white",
              // borderRadius: "15px",
            }}
            InputLabelProps={{
              style: {
                color: "orange",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            width: "[90%, 70%, 50%]",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "2rem",
          }}
        >
          <LoadingButton
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "15px",
              mr: "2rem",
            }}
            onClick={handleButtonClick}
            // stop loading after 10 seconds
            loading={clicked}
          >
            {" "}
            Generate Songs
          </LoadingButton>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "red",
                color: "white",
              },
              borderRadius: "15px",
              // mt: "2rem",
            }}
            onClick={() => {
              // Clear stored tokens
              localStorage.removeItem('spotify_access_token');
              localStorage.removeItem('spotify_refresh_token');
              localStorage.removeItem('spotify_expires_in');
              // Redirect to login page
              window.location.href = '/';
            }}
          >
            <ExitToAppIcon />
          </Button>
        </Box>
        <Box>
          {generatedSongs.length > 0 && (
            <Playlist token={token} songs={generatedSongs} />
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Home;
