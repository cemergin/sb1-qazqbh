import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 bg-opacity-80 text-neon-green p-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} TechnoBeats Calendar. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer