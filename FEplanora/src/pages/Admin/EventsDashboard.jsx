import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, Users, Trophy, Plus, CheckCircle } from "lucide-react";
import Logo from "../../assets/logo.png";
import API from "../../api";
import CreateEventModal from "../../Components/CreateEventModal";

export default function EventsDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [eventEdit, setEditEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data.data || []); // matches { success, data } format
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to fetch events");
    }
  };

  // Add new event
  const addEvent = async (formData) => {
    try {
      const { name, location, date } = formData;
      if (!name || !location || !date) {
        setError("Please fill in all required fields: name, location, date");
        return;
      }

      const res = await API.post("/events", { name, location, date });
      if (res.status === 201) {
        fetchEvents();
        setShowModal(false);
        setError("");
      }
    } catch (err) {
      console.error("Create event error:", err.response?.data || err);
      setError(err.response?.data?.error || "Failed to create event");
    }
  };

  // Update event
  const updateEvent = async (id, formData) => {
    try {
      const { name, location, date } = formData;
      const res = await API.put(`/events/${id}`, { name, location, date });
      if (res.status === 200) {
        fetchEvents();
        setShowModal(false);
        setEditEvent(null);
        setError("");
      }
    } catch (err) {
      console.error("Update event error:", err.response?.data || err);
      setError(err.response?.data?.error || "Failed to update event");
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Delete event error:", err);
      setError("Failed to delete event");
    }
  };

  // Open modal for editing
  const handleEdit = (event) => {
    setEditEvent(event);
    setShowModal(true);
  };

  // Logout
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-2xl">
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 mb-4">
            <img src={Logo} alt="PlanOra logo" className="h-12 w-auto drop-shadow-2xl" />
          </div>
          <span className="text-white text-2xl font-bold">PlanOra</span>
          <span className="text-slate-300 text-sm mt-1">Admin Dashboard</span>
        </div>

        <div className="px-6 mb-6">
          <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-slate-300 text-sm">Committee President</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 mb-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">Total Events</span>
            </div>
            <div className="text-3xl font-bold text-white">{events.length}</div>
            <div className="text-sm text-slate-300">{events.length} of {events.length} events</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto mx-6 mb-6 flex items-center justify-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm text-white hover:text-gray-100 transition-all duration-300 border border-white/20 hover:border-white/30"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
              <p className="text-slate-300 text-lg">Here are Your Events for ongoing projects</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-8 mt-4">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          </div>
        )}

        <div className="p-8">
          {/* Event section header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
            <button
              onClick={() => setShowModal(true)}
              data-testid="create-event-button"
              className="open-create-modal flex items-center gap-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New Event
            </button>
          </div>

          {/* Events list */}
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <Calendar className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">No events yet</h3>
              <p className="text-center text-gray-500">Create your first event to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <div
                  key={e._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 relative">
                    <div className="flex items-start justify-between mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3 line-clamp-2">{e.name}</h3>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(e.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm font-medium">Location</span>
                        <span className="text-slate-700 text-sm bg-slate-100 px-3 py-1 rounded-lg border">
                          {e.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(e)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl transition-all duration-300 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(e._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl transition-all duration-300 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <CreateEventModal
            onClose={() => setShowModal(false)}
            onCreate={addEvent}
            onUpdate={updateEvent}
            eventEdit={eventEdit}
          />
        )}
      </main>
    </div>
  );
}
