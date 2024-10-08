import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar as CalendarIcon, Clock, MapPin, ArrowLeft, Ticket, PlusCircle } from 'lucide-react'

interface Concert {
  id: number
  artist: string
  date: Date
  venue: string
  time: string
  genre: string
  description: string
  ticketUrl: string
}

const concerts: Concert[] = [
  { id: 1, artist: "Berghain Resident", date: new Date(2024, 5, 15), venue: "Berghain", time: "23:59", genre: "Techno", description: "Experience the legendary Berghain sound with our resident DJ.", ticketUrl: "https://www.berghain.berlin/en/tickets/" },
  { id: 2, artist: "Techno Collective", date: new Date(2024, 6, 2), venue: "Tresor", time: "00:00", genre: "Industrial Techno", description: "A night of relentless beats and industrial soundscapes.", ticketUrl: "https://tresorberlin.com/tickets/" },
  { id: 3, artist: "Minimal Master", date: new Date(2024, 7, 10), venue: "Watergate", time: "01:00", genre: "Minimal Techno", description: "Dive into the hypnotic world of minimal techno.", ticketUrl: "https://water-gate.de/tickets/" },
  { id: 4, artist: "Industrial Noise", date: new Date(2024, 5, 20), venue: "Kit Kat Club", time: "22:00", genre: "Experimental", description: "Push the boundaries of sound with this experimental set.", ticketUrl: "https://kitkatclub.org/tickets/" },
  { id: 5, artist: "Acid Techno Live", date: new Date(2024, 6, 25), venue: "://about blank", time: "02:00", genre: "Acid Techno", description: "Get ready for a mind-bending journey through acid techno.", ticketUrl: "https://aboutparty.net/tickets/" },
]

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const concert = concerts.find(c => c.id === Number(id))

  if (!concert) {
    return <div className="text-neon-green">Event not found</div>
  }

  const handleAddToCalendar = () => {
    const eventDetails = encodeURIComponent(`${concert.artist} at ${concert.venue}`);
    const startTime = encodeURIComponent(concert.date.toISOString());
    const endTime = encodeURIComponent(new Date(concert.date.getTime() + 3 * 60 * 60 * 1000).toISOString()); // Assuming 3-hour duration
    const location = encodeURIComponent(concert.venue);
    const details = encodeURIComponent(concert.description);

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventDetails}&dates=${startTime}/${endTime}&details=${details}&location=${location}&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 shadow-lg rounded-lg overflow-hidden p-6">
      <Link to="/" className="text-neon-green hover:text-neon-yellow flex items-center mb-4">
        <ArrowLeft className="mr-2" /> Back to Calendar
      </Link>
      <h1 className="text-4xl font-bold mb-4 text-neon-yellow">{concert.artist}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-neon-green flex items-center mb-2">
            <CalendarIcon className="mr-2" /> {concert.date.toLocaleDateString()}
          </p>
          <p className="text-neon-green flex items-center mb-2">
            <Clock className="mr-2" /> {concert.time}
          </p>
          <p className="text-neon-green flex items-center mb-2">
            <MapPin className="mr-2" /> {concert.venue}
          </p>
          <p className="text-neon-green mb-4">Genre: {concert.genre}</p>
          <div className="flex space-x-4 mt-6">
            <a
              href={concert.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neon-green text-gray-900 px-4 py-2 rounded-md flex items-center hover:bg-neon-yellow transition duration-300"
            >
              <Ticket className="mr-2" /> Buy Tickets
            </a>
            <button
              onClick={handleAddToCalendar}
              className="bg-neon-yellow text-gray-900 px-4 py-2 rounded-md flex items-center hover:bg-neon-green transition duration-300"
            >
              <PlusCircle className="mr-2" /> Add to Calendar
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-neon-green">Event Description</h2>
          <p className="text-gray-300">{concert.description}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-neon-green">Comments</h2>
        {/* Add a comment system here in the future */}
        <p className="text-gray-300">Comments coming soon!</p>
      </div>
    </div>
  )
}

export default EventPage