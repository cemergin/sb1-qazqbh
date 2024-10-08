import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Filter, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Concert {
  id: number
  artist: string
  date: Date
  venue: string
  time: string
  genre: string
  description: string
}

const initialConcerts: Concert[] = [
  { id: 1, artist: "Berghain Resident", date: new Date(2024, 5, 15), venue: "Berghain", time: "23:59", genre: "Techno", description: "Experience the legendary Berghain sound with our resident DJ." },
  { id: 2, artist: "Techno Collective", date: new Date(2024, 6, 2), venue: "Tresor", time: "00:00", genre: "Industrial Techno", description: "A night of relentless beats and industrial soundscapes." },
  { id: 3, artist: "Minimal Master", date: new Date(2024, 7, 10), venue: "Watergate", time: "01:00", genre: "Minimal Techno", description: "Dive into the hypnotic world of minimal techno." },
  { id: 4, artist: "Industrial Noise", date: new Date(2024, 5, 20), venue: "Kit Kat Club", time: "22:00", genre: "Experimental", description: "Push the boundaries of sound with this experimental set." },
  { id: 5, artist: "Acid Techno Live", date: new Date(2024, 6, 25), venue: "://about blank", time: "02:00", genre: "Acid Techno", description: "Get ready for a mind-bending journey through acid techno." },
]

const ConcertCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 1));
  const [concerts, setConcerts] = useState<Concert[]>(initialConcerts);
  const [filteredConcerts, setFilteredConcerts] = useState<Concert[]>(initialConcerts);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [venueFilter, setVenueFilter] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getConcertsForDate = (date: Date) => {
    return filteredConcerts.filter(concert => 
      concert.date.getDate() === date.getDate() &&
      concert.date.getMonth() === date.getMonth() &&
      concert.date.getFullYear() === date.getFullYear()
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 1) {
      const venueMatches = Array.from(new Set(concerts.map(c => c.venue))).filter(v => 
        v.toLowerCase().includes(value.toLowerCase())
      );
      const genreMatches = Array.from(new Set(concerts.map(c => c.genre))).filter(g => 
        g.toLowerCase().includes(value.toLowerCase())
      );
      const artistMatches = Array.from(new Set(concerts.map(c => c.artist))).filter(a => 
        a.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions([...venueMatches, ...genreMatches, ...artistMatches]);
    } else {
      setSuggestions([]);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    let result = concerts;
    if (searchTerm) {
      result = result.filter(concert => 
        concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concert.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concert.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (venueFilter) {
      result = result.filter(concert => concert.venue.toLowerCase().includes(venueFilter.toLowerCase()));
    }
    if (genreFilter) {
      result = result.filter(concert => concert.genre.toLowerCase().includes(genreFilter.toLowerCase()));
    }
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter(concert => 
        concert.date.getFullYear() === filterDate.getFullYear() &&
        concert.date.getMonth() === filterDate.getMonth() &&
        concert.date.getDate() === filterDate.getDate()
      );
    }
    setFilteredConcerts(result);
  }, [concerts, searchTerm, venueFilter, genreFilter, dateFilter]);

  return (
    <div className="bg-gray-800 bg-opacity-80 shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-gray-700 bg-opacity-80 p-4">
        <button onClick={prevMonth} className="text-neon-green hover:text-neon-yellow">&lt; Prev</button>
        <h2 className="text-2xl font-bold text-neon-green">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="text-neon-green hover:text-neon-yellow">Next &gt;</button>
      </div>
      <div className="p-4 bg-gray-700 bg-opacity-50">
        <h3 className="text-lg font-bold text-neon-yellow mb-2">Search and Filters</h3>
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events, venues, or genres"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-600 text-neon-green p-2 rounded"
            />
            <Search className="absolute right-3 top-2.5 text-neon-green" />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-gray-700 mt-1 rounded-md shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-neon-green"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Venue"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="bg-gray-600 text-neon-green p-2 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Genre"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-gray-600 text-neon-green p-2 rounded flex-1"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-600 text-neon-green p-2 rounded flex-1"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-neon-yellow">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 bg-gray-700 bg-opacity-50 rounded-md"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1);
          const concertsOnDate = getConcertsForDate(date);
          return (
            <div key={index} className="h-24 bg-gray-700 bg-opacity-50 rounded-md p-1 overflow-hidden">
              <div className="text-right text-sm text-gray-400">{index + 1}</div>
              {concertsOnDate.map(concert => (
                <Link to={`/event/${concert.id}`} key={concert.id} className="block">
                  <div className="text-xs bg-neon-green bg-opacity-30 rounded p-1 mt-1 truncate text-neon-yellow">
                    {concert.artist}
                  </div>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4">
        <h3 className="text-xl font-bold text-neon-green mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {filteredConcerts.map(concert => (
            <Link to={`/event/${concert.id}`} key={concert.id} className="block">
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition duration-300">
                <div>
                  <h4 className="text-lg font-semibold text-neon-yellow">{concert.artist}</h4>
                  <p className="text-sm text-neon-green flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" /> {concert.venue}
                  </p>
                  <p className="text-sm text-neon-green mt-1">{concert.genre}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neon-green flex items-center justify-end">
                    <CalendarIcon className="h-4 w-4 mr-1" /> {concert.date.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-neon-green flex items-center justify-end mt-1">
                    <Clock className="h-4 w-4 mr-1" /> {concert.time}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConcertCalendar