// Test script for GPT recommendation endpoint
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testGPTEndpoint() {
  try {
    const response = await fetch('http://localhost:5001/gpt/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: "I love 'Bohemian Rhapsody' by Queen and 'Hotel California' by Eagles"
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ GPT endpoint test successful!');
    console.log('📝 Generated songs:', data.songs.length);
    console.log('🎵 First song:', data.songs[0]);
    
  } catch (error) {
    console.error('❌ GPT endpoint test failed:', error.message);
  }
}

testGPTEndpoint(); 