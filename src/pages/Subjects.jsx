import React, { useState, useEffect } from 'react'
import './subjects.css'


export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("subjects")
    if (saved) setSubjects(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects))
  }, [subjects])

  function addSubject(e) {
    e.preventDefault()
    if (!input.trim()) return

    setSubjects([...subjects, { id: Date.now(), name: input }])
    setInput("")
  }

  function deleteSubject(id) {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  return (
    <>


      <div className="container">
        <h2>Your Subjects</h2>

        <form className="subject-form" onSubmit={addSubject}>
          <input
            type="text"
            placeholder="Add a subject..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="add-btn">Add</button>
        </form>

        <ul className="subject-list">
          {subjects.map(s => (
            <li key={s.id} className="subject-item">
              {s.name}
              <button
                className="delete-btn"
                onClick={() => deleteSubject(s.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}