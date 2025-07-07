// Backend API base URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5002/';

// Get Spotify login URL from backend
export const getSpotifyLoginUrl = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`);
    const data = await response.json();
    return data.authUrl;
  } catch (error) {
    console.error('Error getting Spotify login URL:', error);
    throw error;
  }
};

// Get token from URL parameters (after OAuth callback)
export const getTokenFromResponse = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const access_token = urlParams.get('access_token');
  const refresh_token = urlParams.get('refresh_token');
  const expires_in = urlParams.get('expires_in');

  if (access_token) {
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    return { access_token, refresh_token, expires_in };
  }

  return {};
};

// Create playlist using Spotify API
export const createPlaylist = async (
  token,
  playlistName,
  playlistDescription,
  trackIds
) => {
  const userResponse = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await userResponse.json();
  const userId = userData.id;

  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: playlistDescription,
        public: false,
      }),
    }
  );
  const playlistData = await playlistResponse.json();
  const playlistId = playlistData.id;

  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: trackIds.map((id) => `spotify:track:${id}`),
    }),
  });

  return playlistData;
};
