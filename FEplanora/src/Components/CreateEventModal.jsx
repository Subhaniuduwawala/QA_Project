import React, { useState, useEffect } from "react";

export default function CreateEventModal({ onClose, onCreate, onUpdate, eventEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (eventEdit) {
      setFormData({
        name: eventEdit.name || "",
        date: eventEdit.date ? eventEdit.date.split("T")[0] : "",
        location: eventEdit.location || "",
      });
    } else {
      setFormData({
        name: "",
        date: "",
        location: "",
      });
    }
  }, [eventEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, date, location } = formData;

    if (!name || !date || !location) {
      setError("Please fill in all required fields");
      return;
    }

    if (eventEdit && eventEdit._id) {
      onUpdate(eventEdit._id, formData);
    } else {
      onCreate(formData);
    }

    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl text-center font-semibold mb-4 text-indigo-700">
          {eventEdit ? "Edit Event" : "Create New Event"}
        </h2>

        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Event Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter event name"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Event Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location *</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter event location"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {eventEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}