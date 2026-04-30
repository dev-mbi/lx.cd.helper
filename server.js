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
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-V4-Pro:novita",
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
    console.error(error.message);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});