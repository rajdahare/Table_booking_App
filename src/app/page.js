"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [date, setDate] = useState("");
  const today = new Date().toISOString().split('T')[0];
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [guests, setGuests] = useState("")
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://booking-server-xz6c.onrender.com/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const response = await axios.delete(`https://booking-server-xz6c.onrender.com/api/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error('Error deleting the booking:', error);
    }
  }

  const fetchAvailableSlots = async (selectedDate) => {
    try {
      const response = await axios.get(`https://booking-server-xz6c.onrender.com/api/slots?date=${selectedDate}`);
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("https://booking-server-xz6c.onrender.com/api/bookings", {
        date,
        time: selectedSlot,
        guests,
        name,
        contact,
      });
      setMessage("Booking successful!");
      setDate("");
      setSlots([]);
      setSelectedSlot("");
      setGuests("");
      setName("");
      setContact("");

      fetchBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating booking.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="text-3xl font-semibold text-center text-black">Restaurant Table Booking</h1>
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg mt-10">
      <form onSubmit={handleBooking} style={{ marginBottom: '20px' }}>
        <div className="flex gap-4 max-w-sm mx-auto p-4 mt-5">
          <label htmlFor="date" className=" mt-3 text-lg font-semibold text-black text-center">
            Date:
          </label>
          <input id="date" type="date" value={date} required min={today}
            onChange={(e) => {
              setDate(e.target.value);
              fetchAvailableSlots(e.target.value);
            }}
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
          />
        </div>

        {slots.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-black text-center mb-4">Available Slots</h2>
            <div className="flex flex-wrap gap-5 ml-10">
              {slots.map((slot) => (
                <div
                  key={slot.time}
                  onClick={() => {
                    if (slot.available > 0) {
                      setSelectedSlot(slot.time);
                    }
                  }}
                  className={`p-4 border rounded-lg shadow-md text-center cursor-pointer transition-transform transform hover:scale-105 
                    ${selectedSlot === slot.time ? "bg-blue-500 text-white" : (slot.available > 0 ? "bg-white border-gray-300 text-gray-800" : "bg-red-400 cursor-not-allowed")}`}
                >
                  <p className="text-sm font-medium">{slot.time}</p>
                  <p className="text-xs">
                    {slot.available > 0 ? `${slot.available} Available` : "Not Available"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSlot && (
          <>
            {/* <div>
              <label className="mt-3 block text-sm font-medium text-white">Guests Number:</label>
              Guest Numbers : <input type="number" value={guests} required
  
                onChange={(e) => setGuests(e.target.value)}
               
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Name:</label>
              Name : <input type="text" value={name} required
               
                onChange={(e) => setName(e.target.value)}
                
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Contact:</label>
              Contact : <input type="text" value={contact} required
                
               
                onChange={(e) => setContact(e.target.value)}
               
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Book Now
            </button> */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-semibold text-center text-gray-800 ">Booking form</h2>
              <div className="mb-4 mt-2 flex gap-10">
                <label className="mt-3 block text-md font-medium text-black ">Guests Number :</label>
                
                <input
                  type="number"
                  value={guests}
                  placeholder='enter guest number'
                  required
                  onChange={(e) => setGuests(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 flex gap-20">
                <label className="mt-3 block text-md font-medium text-black">Name :</label>
                
                <input
                  type="text"
                  value={name}
                  placeholder='enter name'
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 flex gap-20">
                <label className="mt-3 block text-md font-medium text-black">Contact :</label>
                
                <input
                  type="text"
                  value={contact}
                  placeholder='enter contact number'
                  required
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Book Now
              </button>
            </div>

          </>
        )}
      </form>
      <div className="relative">
        {message && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-700 py-2 px-6 rounded-full shadow-lg mb-4">
            {message}
          </div>
        )}

        <div className="bg-gray-300 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800 underline">Bookings</h2>
          {bookings.length === 0 ? (
            <div className="flex justify-center items-center">
              <span className="text-lg font-medium text-gray-800">
                No bookings available.
              </span>
            </div>
          ) : (
            <ul>
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="mt-2 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-800">
                      {booking.date} at {booking.time}
                    </span>
                    <span className="text-sm text-gray-600">{booking.guests} guests</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-700">{booking.name}</p>
                    <button
                      onClick={() => {
                        deleteBooking(booking.id);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;