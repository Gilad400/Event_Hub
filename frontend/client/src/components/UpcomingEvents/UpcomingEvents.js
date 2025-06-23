import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UpcomingEvents.css";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get today's date and the date 7 days from now
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json`,
          {
            params: {
              countryCode: "IL",
              startDateTime: today.toISOString(),
              endDateTime: nextWeek.toISOString(),
              apikey: "rJl9LnZCTj5lHVrGDbdObgTiRRmlnSdk", // Replace with your actual TicketMaster API key
            },
          }
        );

        // Log the response to check if it's correct
        console.log(response.data);

        // Check if events data exists and set the events
        if (response.data._embedded?.events) {
          setEvents(response.data._embedded.events);
        } else {
          setError("No events found.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="events-container">
      {events.map((event) => (
        <div key={event.id} className="event-card">
          <img
            src={event.images[0]?.url || "https://via.placeholder.com/150"}
            alt={event.name}
            className="event-image"
          />
          <h3 className="event-name">{event.name}</h3>
          <p className="event-date">
            {new Date(event.dates.start.dateTime).toLocaleString()}
          </p>
          <p className="event-location">{event._embedded?.venues[0]?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UpcomingEvents;
