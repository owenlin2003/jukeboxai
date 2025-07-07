import React from "react";
import "../styles/SongRow.css";
import { Typography, Box } from "@mui/material";

function SongRow({ track }) {
  return (
    <Box className="songRow" sx={{ 
      display: "flex", 
      alignItems: "center", 
      padding: "0.75rem", 
      marginBottom: "0.5rem",
      borderRadius: "8px",
      backgroundColor: "rgba(29, 185, 84, 0.05)",
      border: "1px solid rgba(29, 185, 84, 0.1)",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "rgba(29, 185, 84, 0.1)",
        transform: "translateX(4px)",
      }
    }}>
      <img 
        className="songRow__album" 
        src={track.album.images[0].url} 
        alt={track.name}
        style={{
          height: "50px",
          width: "50px",
          borderRadius: "8px",
          objectFit: "cover",
          marginRight: "1rem",
        }}
      />
      <div className="songRow__info" style={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#333",
            marginBottom: "0.25rem",
          }}
        >
          {track.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "rgba(0,0,0,0.6)",
            fontWeight: 400,
          }}
        >
          {track.artists.map((artist) => artist.name).join(", ")} • {track.album.name}
        </Typography>
      </div>
    </Box>
  );
}

export default SongRow;
