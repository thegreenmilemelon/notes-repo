const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const Note = require("./models/note");

const app = express();

app.use(express.json());

app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body :date[web] :remote-addr"
  )
);
app.use(express.static("dist"));

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
