/* eslint-disable react/prop-types */
const Note = ({ note, toggleImportanceof }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportanceof}>{label}</button>
    </li>
  );
};

export default Note;
