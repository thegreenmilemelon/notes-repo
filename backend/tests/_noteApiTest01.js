const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const Note = require("../models/note");

const api = supertest(app);

// beforeEach(async () => {
//   await Note.deleteMany({});

//   let noteObject = new Note(helper.initalNotes[0]);
//   await noteObject.save();

//   noteObject = new Note(helper.initalNotes[1]);
//   await noteObject.save();
// });

// beforeEach(async () => {
//the foreach function iterates and save asynchronoulsy
//but the beforeeach functin doesnt wait for each save operation to finish before continuing
// so use for...of like
/////////////////////
/////////////////////
// beforeEach(async () => {
//   await Note.deleteMany({})

//   for (let note of helper.initialNotes) {
//     let noteObject = new Note(note)
//     await noteObject.save()
//   }
// })
//or
//Promise.all

//////////////////////
//////////////////////
//   await Note.deleteMany({});
//   console.log("cleared");

//   helper.initalNotes.forEach(async (note) => {
//     let noteObject = new Note(note);
//     await noteObject.save();
//     console.log("saved");
//   });
//   console.log("done");
// });

beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = helper.initalNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});
test("notes are returned as json", async () => {
  console.log("entered test");
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two notes", async () => {
  const response = await api.get("/api/notes");

  assert.strictEqual(response.body.length, helper.initalNotes.length);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((e) => e.content);
  assert(contents.includes("HTML is easy"));
});

test("a valid note can be added ", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // const response = await api.get("/api/notes");

  // const contents = response.body.map((r) => r.content);

  // assert.strictEqual(response.body.length, initalNotes.length + 1);

  const notesAtEnd = await helper.notesInDb();
  assert.strictEqual(notesAtEnd.length, helper.initalNotes.length + 1);

  const contents = notesAtEnd.map((n) => n.content);
  assert(contents.includes("async/await simplifies making async calls"));
});

test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api.post("/api/notes").send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();
  assert.strictEqual(notesAtEnd.length, helper.initalNotes.length);
});
test("a specific note can be viewed", async () => {
  const notesAtStart = await helper.notesInDb();

  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(resultNote.body, noteToView);
});

test("a note can be deleted", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();

  const contents = notesAtEnd.map((r) => r.content);
  assert(!contents.includes(noteToDelete.content));

  assert.strictEqual(notesAtEnd.length, helper.initalNotes.length - 1);
});

after(async () => {
  await mongoose.connection.close();
});
