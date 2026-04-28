// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// File that stores notes (inside the container this will be /app/notes.json)
const FILE = path.join(__dirname, "notes.json");

let notes = [];

// Load existing notes.json if present and valid
if (fs.existsSync(FILE)) {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    if (raw && raw.trim().length) {
      notes = JSON.parse(raw);
      if (!Array.isArray(notes)) notes = [];
    }
  } catch (err) {
    console.error("Could not read or parse notes.json — starting with empty notes:", err);
    notes = [];
  }
}

// POST /add — add a note
app.post("/add", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Both 'title' and 'content' are required." });
  }

  const note = {
    id: Date.now(),
    title,
    content,
  };

  notes.push(note);
  try {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing notes.json:", err);
    return res.status(500).json({ error: "Failed to save note" });
  }

  res.json({ message: "Note added", note, notes });
});

// GET /all — return all notes
app.get("/all", (req, res) => {
  res.json(notes);
});

// Start server (PORT env override allowed)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Note-Taking API running on port ${PORT}`));
