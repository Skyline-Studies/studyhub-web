import React, { useEffect, useState } from 'react'
import './dashboard.css'


export default function Dashboard() {
  const [taskCount, setTaskCount] = useState(0)
  const [noteCount, setNoteCount] = useState(0)
  const [subjectCount, setSubjectCount] = useState(0)

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")
    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")

    setTaskCount(tasks.length)
    setNoteCount(notes.length)
    setSubjectCount(subjects.length)
  }, [])

  return (
    <>


      <div className="container">
        <h2>Dashboard</h2>

        <div className="dashboard-grid">
          <div className="dash-card">
            <h3>Tasks</h3>
            <p>{taskCount} total</p>
          </div>

          <div className="dash-card">
            <h3>Notes</h3>
            <p>{noteCount} total</p>
          </div>

          <div className="dash-card">
            <h3>Subjects</h3>
            <p>{subjectCount} total</p>
          </div>
        </div>
      </div>
    </>
  )
}