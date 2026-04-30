const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(require("cors")());
app.use(express.static("public"));

app.post("/api/command", async (req, res) => {
  const userInput = req.body.message;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a Linux expert. Give command + explanation."
          },
          {
            role: "user",
            content: userInput
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data.choices[0].message.content;
    res.json({ content: output });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.json({ content: "❌ Error getting response" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Running on http://localhost:3000");
});