import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/notes">Notes</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/subjects">Subjects</Link>
      <Link to="/timetable">Timetable</Link>

      {/* External HTML app */}
      <a
        href="listify/index.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Listify (Cloud lists)
      </a>
    </nav>
  )
}