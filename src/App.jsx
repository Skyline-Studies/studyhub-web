import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

// Import your pages
import Home from './pages/Home'
import Notes from './pages/Notes'
import Tasks from './pages/Tasks'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import Timetable from './pages/Timetable'

export default function App() {
  return (
    <>
      <Navbar />

      <div className="page">
        <h1>StudyHub</h1>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </div>
    </>
  )
}