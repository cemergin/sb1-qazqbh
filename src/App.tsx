import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import ConcertCalendar from './components/ConcertCalendar'
import EventPage from './components/EventPage'
import Footer from './components/Footer'
import WebGLBackground from './components/WebGLBackground'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col relative">
        <WebGLBackground />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={
              <>
                <h1 className="text-4xl font-bold mb-6 text-center text-neon-green">Berlin Techno Calendar</h1>
                <ConcertCalendar />
              </>
            } />
            <Route path="/event/:id" element={<EventPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App