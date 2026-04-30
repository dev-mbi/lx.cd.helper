const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(require("cors")());
app.use(express.static("public"));

app.post("/api/command", async (req, res) => {
  console.log("USER INPUT:", req.body.message);
  const userInput = req.body.message;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "system",
            content: "You are a Linux expert. Return command and explanation."
          },
          {
            role: "user",
            content: userInput
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`
        }
      }
    );

    const output = response.data.choices[0].message.content;
    res.json({ content: output });

  } catch (error) {
  console.log("FULL ERROR:", error.response?.data || error.message);

  res.json({
    content: "❌ Error: " + (error.response?.data?.error?.message || error.message)
  });
}
  }
);

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});