const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();
const express=require("express");
const bodyParser=require('body-parser');
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const app=express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.json()); // for JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // for form submissions


app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Ask Gemini</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="container">
          <h1>Ask From AI</h1>
          <form method="POST" action="/ApiContent">
            <input type="text" name="question" placeholder="Type your question" required />
            <br/>
            <button type="submit">Submit</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

app.post('/ApiContent', async (req, res) => {
  try {
    const question = req.body.question;
    const result = await generate(question);

    res.send(`
      <html>
        <head>
          <title>AI Response</title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <div class="container">
            <h1>AI Response</h1>
            <p><strong>Question:</strong> ${question}</p>
            <p><strong>Answer:</strong> ${result}</p>
            <a href="/">Ask another question</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});

async function generate(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

app.listen(3000,()=>{
  console.log("server is listning at port 3000")
})