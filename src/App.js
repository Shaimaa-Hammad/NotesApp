import react, { useState, useEffect } from 'react';

import './App.css';
import Preview from './components/Preview';
import Message from './components/Message';
import NotesContainer from './components/Notes/NotesContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (Array.isArray(storedNotes)) {
      setNotes(storedNotes);
    } else {
      setNotes([]); // Initialize as an empty array if not found or not an array
    }
  }, []);

  useEffect(() => {
    if (validationErrors.length !== 0) {
      setTimeout(() => setValidationErrors([]), 3000);
    }
  }, [validationErrors]);

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const validate = () => {
    const errors = [];

    if (title.trim() === '') {
      errors.push('Title is required.');
    }

    if (content.trim() === '') {
      errors.push('Content is required.');
    }

    // Update the state with the validation errors
    setValidationErrors(errors);

    return errors.length === 0; // Return true if there are no errors, false otherwise
  };

  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  };

  const changeTitleHandler = (event) => (
    setTitle(event.target.value)
  );

  const changeContentHandler = (event) => (
    setContent(event.target.value)
  );

  const saveNoteHandler = () => {
    if (!validate()) return;

    const newNote = {
      id: new Date(),
      title: title,
      content: content
    };

    const updatedNotes = [...notes, newNote];

    setNotes(updatedNotes);

    saveToLocalStorage('notes', updatedNotes);

    setCreating(false);

    setSelectedNote(newNote.id);

    setTitle('');

    setContent('');
  };

  const selectNoteHandler = (input) => {
    setSelectedNote(input);
    setEditing(false);
  };

  const editNoteHandler = () => {
    const note = notes.find((note) => selectedNote === note.id);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  };

  const deleteNoteHandler = () => {
    if (selectedNote) {
      // Filter out the selected note from the notes array
      const updatedNotes = notes.filter((note) => note.id !== selectedNote);

      // Update the state with the filtered notes array
      setNotes(updatedNotes);

      saveToLocalStorage('notes', updatedNotes);

      // Clear the selectedNote, title, and content fields
      setSelectedNote(null);
      setTitle('');
      setContent('');
      setEditing(false);
    }
  };


  const updateNoteHandler = () => {
    if (!validate()) return;

    // Find the index of the selected note in the notes array
    const noteIndex = notes.findIndex((note) => selectedNote === note.id);

    if (noteIndex !== -1) {
      // Create a copy of the notes array
      const updatedNotes = [...notes];

      // Update the selected note with the new title and content
      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        title,
        content,
      };

      // Update the state with the modified notes array
      setNotes(updatedNotes);

      saveToLocalStorage('notes', updatedNotes);

      // Reset the editing mode and clear the title and content fields
      setEditing(false);
      setTitle('');
      setContent('');
    }
  };


  const getAddNote = () => {
    return (
      <NoteForm
        NoteForm='Add new Note'
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitClicked={saveNoteHandler}
        submitText='Save'
      />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title='There are no notes!' />
    }

    if (!selectedNote) {
      return <Message title='Please, choose a note' />
    }

    const note = notes.find(note => note.id === selectedNote);

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p> {note.content} </p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <NoteForm
          NoteForm='Edit Note'
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitClicked={updateNoteHandler}
          submitText='Edit'
        />
      );
    };

    return (
      <div>
        {!editing && (
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
              <i className="fa fa-trash" />
            </a>
          </div>
        )}
        {noteDisplay}
      </div>
    );
  }

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map(note =>
            <Note
              key={note.id}
              title={note.title}
              noteClicked={() => selectNoteHandler(note.id)}
              active={selectedNote === note.id}
            />)}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
      {validationErrors.length !== 0 && <Alert validationMessages={validationErrors} />}
    </div>
  );
}

export default App;
