const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
const password = process.argv[2];
const content = process.argv[3];

const url = `mongodb+srv://fullstackPart3:${password}@cluster0.egii1dr.mongodb.net/testNoteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "HTML is easy",
//   important: true,
// });

// note.save().then((result) => {
//   console.log("note saved!");
//   console.log(result);
//   mongoose.connection.close();
// });

if (process.argv.length === 3) {
  Note.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
} else {
  const note = new Note({
    content: content,
    important: true,
  });
  note.save().then((result) => {
    console.log("note saved!");
    console.log(result);
    mongoose.connection.close();
  });
}
