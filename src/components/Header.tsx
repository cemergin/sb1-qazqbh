import React from 'react'
import { Music } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 bg-opacity-80 text-neon-green p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Music className="mr-2 h-8 w-8" />
          <span className="text-2xl font-bold">TechnoBeats</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-neon-yellow transition duration-300">Home</a></li>
            <li><a href="#" className="hover:text-neon-yellow transition duration-300">About</a></li>
            <li><a href="#" className="hover:text-neon-yellow transition duration-300">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header