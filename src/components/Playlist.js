import React, { useState } from "react";

import {
  Modal,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { createPlaylist } from "../auth.js";
import SongRow from "./SongRow.js";

function Playlist({ token, songs }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [trackIds, setTrackIds] = useState([]);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [tracks, setTracks] = useState([]);

  const handleOpen = () => {
    setPlaylistCreated(true);
    setOpen(true);
    fetchSongs();
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setPlaylistName("");
    setPlaylistDescription("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await createPlaylist(
      token,
      playlistName,
      playlistDescription,
      trackIds
    );
    // console.log("response\n", response);

    if (response.status === 201 || response.status === 200) {
      setPlaylistCreated(true);
    }
    setPlaylistCreated(true);
    handleClose();
  };

  const fetchSongs = async () => {
    setLoading(true);
    // console.log("songs\n", songs);

    // filter out songs that are null or undefined
    songs = songs.filter((song) => song !== null && song !== undefined);

    // Perform fetches for each song and update `songs` with the track objects
    const _tracks = await Promise.all(
      songs.map(async (song) => {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=track:${song.title}%20artist:${song.artist}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        // console.log(`song ${song.title}`, data);
        return data.tracks.items.length > 0 ? data.tracks.items[0] : null;
      })
    );
    // remove null values from tracks
    const __tracks = _tracks.filter(
      (track) => track !== null && track !== undefined
    );
    // console.log("tracks\n", __tracks);
    setTracks(__tracks);
    setTrackIds(__tracks.map((track) => track.id));
    setLoading(false);
    // return tracks;
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        disabled={playlistCreated}
        className="create-playlist-btn"
        sx={{
          background: playlistCreated 
            ? "rgba(255, 255, 255, 0.2)" 
            : "linear-gradient(45deg, #1DB954, #1ed760)",
          color: "white",
          fontWeight: 700,
          fontSize: "1rem",
          padding: "0.8rem 1.5rem",
          borderRadius: "50px",
          textTransform: "none",
          letterSpacing: "0.02em",
          boxShadow: playlistCreated 
            ? "none" 
            : "0 8px 20px rgba(29, 185, 84, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            background: playlistCreated 
              ? "rgba(255, 255, 255, 0.2)" 
              : "linear-gradient(45deg, #1ed760, #1DB954)",
            transform: playlistCreated ? "none" : "translateY(-2px) scale(1.02)",
            boxShadow: playlistCreated 
              ? "none" 
              : "0 15px 30px rgba(29, 185, 84, 0.5)",
          },
          "&:disabled": {
            background: "rgba(255, 255, 255, 0.2)",
            color: "rgba(255, 255, 255, 0.6)",
            boxShadow: "none",
          },
        }}
      >
        {playlistCreated ? "✅ Playlist Created" : "🎵 Create Spotify Playlist"}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          zIndex: 9999,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "95%", sm: "80%", md: "60%" },
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "2rem",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "24px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
              <CircularProgress size={60} sx={{ color: "#1DB954" }} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Box sx={{ textAlign: "center", mb: "1rem" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#1DB954",
                    mb: "0.5rem",
                  }}
                >
                  🎵 Create Spotify Playlist
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)" }}>
                  Give your playlist a name and description
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: "1rem" }}>
                <TextField
                  required
                  label="Playlist Name"
                  variant="outlined"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  sx={{ flex: 1 }}
                  fullWidth
                />
                <TextField
                  required
                  label="Playlist Description"
                  variant="outlined"
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  sx={{ flex: 1 }}
                  fullWidth
                />
              </Box>
              
              <Box sx={{ mt: "1rem" }}>
                <Typography variant="h6" sx={{ mb: "1rem", color: "#1DB954", fontWeight: 600 }}>
                  Tracks ({tracks.length})
                </Typography>
                <Box sx={{ maxHeight: "300px", overflow: "auto", border: "1px solid #e0e0e0", borderRadius: "12px", p: "1rem" }}>
                  {tracks.map((track, index) => (
                    <SongRow key={index} track={track} />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", gap: "1rem", justifyContent: "flex-end", mt: "1rem" }}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    borderColor: "#666",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#333",
                      color: "#333",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    background: "linear-gradient(45deg, #1DB954, #1ed760)",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(45deg, #1ed760, #1DB954)",
                    },
                  }}
                >
                  Create Playlist
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </>
  );
}

export default Playlist;
