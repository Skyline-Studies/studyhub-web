import React, { useState, useEffect } from 'react'
import './notes.css'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [input, setInput] = useState("")

  // Load notes from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("notes")
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function addNote(e) {
    e.preventDefault()
    if (!input.trim()) return

    setNotes([...notes, { id: Date.now(), text: input }])
    setInput("")
  }

  function deleteNote(id) {
    setNotes(notes.filter(note => note.id !== id))
  }

  return (
    <div className="container">
      <h2>Your Notes</h2>

      <form className="note-form" onSubmit={addNote}>
        <textarea
          placeholder="Write a note..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="add-btn">Add Note</button>
      </form>

      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul className="note-list">
          {notes.map(note => (
            <li key={note.id} className="note-item">
              <p>{note.text}</p>
              <button
                className="delete-btn"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}