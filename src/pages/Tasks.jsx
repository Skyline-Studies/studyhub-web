import React, { useState, useEffect } from 'react'
import './tasks.css'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState("")

  // Load tasks from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("tasks")
    if (saved) {
      setTasks(JSON.parse(saved))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()
    if (!input.trim()) return

    setTasks([...tasks, { id: Date.now(), text: input }])
    setInput("")
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="container">
      <h2>Your Tasks</h2>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="New task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              <span>{task.text}</span>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
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