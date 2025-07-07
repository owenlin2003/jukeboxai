const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins for testing
  credentials: true
}));
app.use(express.json());

// Spotify OAuth Routes
app.get('/auth/login', (req, res) => {
  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-top-read',
    'user-modify-playback-state',
    'user-library-modify',
    'playlist-modify-public',
    'playlist-modify-private',
  ];

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`;
  
  res.json({ authUrl });
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not found' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }), 
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Redirect to frontend root with tokens
    res.redirect(`${process.env.FRONTEND_URL || 'http://127.0.0.1:3000/'}?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`);
    
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

// GPT Recommendation Route
app.post('/gpt/recommend', async (req, res) => {
  const { userInput } = req.body;
  
  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  try {
    const prompt = `Pretend you have great taste in music.
    Your task is to generate 10 similar songs based on the below songs.
    Output format: <song number>. "<song title>" by <artist> (<release year>).
    
    User's favorite songs:
    ${userInput}`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const answer = response.data.choices[0].message.content;
    const songs = answer.split('\n');

    const parsedSongs = songs
      .map((song, index) => {
        const regex = /^(\d+)\.\s"(.+)"\sby\s(.+)\s\((\d+)\)$/;
        const matches = song.match(regex);

        if (matches) {
          const [, , title, artist, releaseDate] = matches;
          return { id: index, title, artist, releaseDate };
        }

        return null;
      })
      .filter(Boolean);

    res.json({ songs: parsedSongs });
    
  } catch (error) {
    console.error('GPT API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jukebox AI Backend is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Jukebox AI Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://127.0.0.1:3000/'}`);
  console.log(`�� Spotify Client ID: ${process.env.SPOTIFY_CLIENT_ID ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🤖 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
}); 