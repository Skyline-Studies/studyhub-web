import React, { useState, useEffect } from 'react'
import './timetable.css'

export default function Timetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const [timetable, setTimetable] = useState({})
  const [input, setInput] = useState("")
  const [selectedDay, setSelectedDay] = useState("Monday")

  // Load from storage
  useEffect(() => {
    const saved = localStorage.getItem("timetable")
    if (saved) setTimetable(JSON.parse(saved))
  }, [])

  // Save to storage
  useEffect(() => {
    localStorage.setItem("timetable", JSON.stringify(timetable))
  }, [timetable])

  function addEntry(e) {
    e.preventDefault()
    if (!input.trim()) return

    setTimetable(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), input]
    }))

    setInput("")
  }

  function deleteEntry(day, index) {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }))
  }

  return (
    <>

      <div className="container">
        <h2>Your Timetable</h2>

        <form className="timetable-form" onSubmit={addEntry}>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map(d => <option key={d}>{d}</option>)}
          </select>

          <input
            type="text"
            placeholder="Add class or event..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button className="add-btn">Add</button>
        </form>

        <div className="timetable-grid">
          {days.map(day => (
            <div key={day} className="timetable-day">
              <h3>{day}</h3>

              {(timetable[day] || []).length === 0 ? (
                <p className="empty">No entries.</p>
              ) : (
                <ul>
                  {timetable[day].map((entry, i) => (
                    <li key={i}>
                      {entry}
                      <button
                        className="delete-btn"
                        onClick={() => deleteEntry(day, i)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}