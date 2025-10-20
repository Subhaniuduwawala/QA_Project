import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, Users, Trophy, Plus, CheckCircle } from "lucide-react";
import Logo from "../../assets/logo.png";
import API from "../../api";
import CreateEventModal from "../../Components/CreateEventModal";
import styles from "./EventsDashboard.module.css";

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
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <img src={Logo} alt="PlanOra logo" className={styles.logo} />
          </div>
          <span className={styles.dashboardTitle}>PlanOra</span>
          <span className={styles.dashboardSubtitle}>Admin Dashboard</span>
        </div>

        <div className={styles.profileCard}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-slate-300 text-sm">Committee President</div>
            </div>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">Total Events</span>
          </div>
          <div className="text-3xl font-bold text-white">{events.length}</div>
          <div className="text-sm text-slate-300">{events.length} of {events.length} events</div>
        </div>

        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <div className={styles.mainHeader}>
          <div className="flex items-center gap-3">
            <div className={styles.headerAccent}></div>
            <div>
              <h1 className={styles.pageTitle}>My Dashboard</h1>
              <p className={styles.pageSubtitle}>Here are Your Events for ongoing projects</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage}>{error}</div>
          </div>
        )}

        <div className={styles.contentArea}>
          {/* Event section header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Events</h2>
            <button
              onClick={() => setShowModal(true)}
              data-testid="create-event-button"
              className={styles.createButton}
            >
              <Plus className="w-5 h-5" />
              Create New Event
            </button>
          </div>

          {/* Events list */}
          {events.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>No events yet</h3>
              <p className={styles.emptyStateText}>Create your first event to get started</p>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {events.map((e) => (
                <div key={e._id} className={styles.eventCard}>
                  <div className={styles.cardHeader}>
                    <div className="flex items-start justify-between mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    </div>
                    <h3 className={styles.cardTitle}>{e.name}</h3>
                    <div className={styles.cardDate}>
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(e.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardInfo}>
                      <span className={styles.cardLabel}>Location</span>
                      <span className={styles.cardValue}>{e.location}</span>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        onClick={() => handleEdit(e)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(e._id)}
                        className={styles.deleteButton}
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
