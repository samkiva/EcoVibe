// server.js
const express = require('express'); // Express handles HTTP server routes. ✅ Good choice for simplicity.
const axios = require('axios'); // Axios makes HTTP requests easier than fetch. ✅ Fine.
const cors = require('cors'); // Needed so frontend can communicate with backend without CORS errors. ✅ Correct.
require('dotenv').config(); // Load API keys from .env. ✅ Secure practice.

const app = express();
const PORT = 3000;

app.use(cors()); // Enables cross-origin requests. ✅ Correct.
app.use(express.json()); // Allows parsing JSON bodies. ✅ Necessary for POST requests.

// AI endpoint
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) { // Validate input. ✅ Correct.
    return res.status(400).json({ response: 'No message provided' });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY; // Environment variable. ✅ Safe.
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

    const response = await axios.post(
      endpoint,
      {
        model: 'gpt-4o-mini', // Free model, sufficient for basic AI assistant. ✅ Good choice.
        messages: [{ role: 'user', content: userMessage }] // Correct OpenRouter format. ✅
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check response exists before accessing deeply nested properties
    const aiReply = response.data?.choices?.[0]?.message?.content || "I couldn't generate a response.";

    res.json({ response: aiReply });

  } catch (error) {
    console.error('Error from OpenRouter API:', error.message);
    res.status(500).json({ response: 'Error connecting to AI backend.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// End of server.js