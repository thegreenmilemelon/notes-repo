const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };

const app = express();

app.use(express.json());

// app.use(requestLogger);

app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body :date[web] :remote-addr"
  )
);
app.use(express.static("dist"));

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

app.get("/", (request, response) => {
  response.send("<h1>Hello also changes to new World!</h1>"); //res.send(data): sends plain text data
  //the event handler function is called when the server receives a request
  //the functiom app.get() is an event handler
  //it accepts two parameters
  //request handles incoming requests
  //response define how the request is responded to like
  //res.send(data): sends plain text data
  //res.json(data): sends JSON data

  //app.get or this route defines an event hadner
  //that handles HTTP GET requests made to the '/' path of the application
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  console.log("what is params: ", request.params);
  console.log("id: ", id);
  const note = notes.find((note) => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id);
    return note.id === parseInt(id);
  });
  console.log("note: ", note);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "The note with the specified ID does not exist";
    response.status(404).end();
  }

  //res.json(data): sends JSON data
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

const generateID = () => {
  const maxID = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxID + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateID(),
  };

  notes = notes.concat(note);
  response.json(note);
});

// app.use(unknownEndpoint);
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
