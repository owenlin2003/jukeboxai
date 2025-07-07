# Jukebox AI 🎵

A modern, AI-powered music recommendation app built from scratch by **Owen Lin**. This full-stack application combines Spotify's vast music library with OpenAI's GPT technology to create personalized music recommendations based on your mood and favorite songs.

## ✨ What This Does

- **🎯 Finds Your Vibe**: Tell me what you're feeling or what songs you love, and I'll find similar stuff that matches your mood
- **🔐 Works with Your Spotify**: Just log in with your Spotify account and I can see what you're into
- **🤖 Smart Recommendations**: Uses AI to understand what makes your favorite songs tick and suggests similar ones
- **🎨 Looks Good**: Clean, modern interface that doesn't get in the way of finding great music
- **📱 Works Everywhere**: Whether you're on your phone, tablet, or computer, it just works
- **⚡ Fast**: Get recommendations instantly - no waiting around

## 🏗️ Technical Architecture

- **Frontend**: React.js with Material-UI components
- **Backend**: Node.js with Express.js server
- **AI Integration**: OpenAI GPT-3.5 Turbo API
- **Music API**: Spotify Web API
- **Styling**: Modern CSS with animations and glass morphism effects

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Spotify Developer Account
- OpenAI API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/jukeboxai.git
cd jukeboxai
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5002/auth/callback
OPENAI_API_KEY=your_openai_api_key
PORT=5002
FRONTEND_URL=http://127.0.0.1:3000
NODE_ENV=development
```

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
# In a new terminal, from the root directory
npm install
```

Create a `.env` file in the root directory:
```env
REACT_APP_BACKEND_URL=http://localhost:5002
```

Start the frontend:
```bash
npm start
```

### 4. Spotify App Configuration
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://127.0.0.1:5002/auth/callback` to Redirect URIs
4. Copy Client ID and Client Secret to your backend `.env` file

## 🎯 How It Works

1. **User Authentication**: Secure OAuth flow with Spotify
2. **Music Analysis**: AI analyzes your favorite songs and listening patterns
3. **Mood Detection**: GPT understands the emotional context of your music
4. **Recommendation Generation**: Creates personalized song suggestions
5. **Playlist Creation**: Option to create Spotify playlists with recommendations

## 📁 Project Structure

```
jukeboxai/
├── src/                    # Frontend React application
│   ├── components/         # React components (Login, Home, Playlist)
│   ├── auth.js            # Authentication and API utilities
│   └── styles/            # CSS styling files
├── server/                # Backend Node.js server
│   ├── server.js          # Express server with API endpoints
│   ├── package.json       # Backend dependencies
│   └── .env              # Backend environment configuration
├── .env                   # Frontend environment variables
├── package.json           # Frontend dependencies
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `GET /auth/login` - Generate Spotify OAuth URL
- `GET /auth/callback` - Handle OAuth callback and token exchange

### AI Recommendations
- `POST /gpt/recommend` - Generate music recommendations using GPT
- `GET /health` - Server health check

## 🎨 Design Philosophy

This project was designed with a focus on:
- **User Experience**: Intuitive, engaging interface
- **Performance**: Fast, responsive interactions
- **Security**: Secure handling of API keys and user data
- **Scalability**: Clean architecture for future enhancements

## 🛠️ Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
npm start  # Runs on http://localhost:3000
```

### Environment Variables
Make sure to set up all required environment variables in both frontend and backend `.env` files.

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Update environment variables for production
- Ensure CORS is properly configured

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar platforms
- Update backend URL in environment variables
- Configure build settings for React app

### Spotify App Updates
- Update redirect URIs in Spotify Developer Dashboard
- Ensure production URLs are properly configured

## 🤝 Contributing

This is a personal project created by Owen Lin. Feel free to fork and modify for your own use!

## 📝 License

This project is created and maintained by Owen Lin. Feel free to use this code for learning and personal projects.

## 🙏 Acknowledgments

- Spotify for their comprehensive music API
- OpenAI for their powerful GPT technology
- The React and Node.js communities for excellent documentation and tools

---

**Created with ❤️ by Owen Lin**

*Building the future of music discovery, one recommendation at a time.*

---

## 🎵 Latest Updates

- **v1.1.1**: Fixed playlist modal positioning and enhanced UI responsiveness
- **v1.1.0**: Enhanced UI animations and improved user experience
- **v1.0.0**: Initial release with core music recommendation features
