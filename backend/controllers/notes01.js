const notesRouter = require("express").Router();
const Note = require("../models/note");

//using npm install express-async-errors
//to remove the frequest use of catch(error)
//so we only need to write the try block
//refer to notes.js

notesRouter.get("/", async (request, response) => {
  // try {
  const notes = await Note.find({});
  // The objects are retrieved from the database with the find method of the Note model.
  // The parameter of the method is an object expressing search conditions.
  // Since the parameter is an empty object{},
  // we get all of the
  // notes stored in the notes collection.
  response.json(notes);
  // }
  // catch (error) {
  //   next(error);
  // }
});

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id).then((note) => {
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  });
  // .catch((error) => next(error));
});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  // note
  //   // .save()
  //   // .then((savedNote) => {
  //   //   response.status(201).json(savedNote);
  //   // })
  //   // .catch((error) => next(error));

  try {
    const savedNote = await note.save();
    response.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", (request, response, next) => {
  // Note.findByIdAndDelete(request.params.id)
  //   .then(() => {
  //     response.status(204).end();
  //   })
  //   .catch((error) => next(error));

  try {
    Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
