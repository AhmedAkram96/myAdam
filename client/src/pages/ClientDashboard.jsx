import React, { useEffect, useState } from 'react';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const SLOT_TIMES = [
  { start: '08:00', end: '10:00' },
  { start: '10:00', end: '12:00' },
  { start: '12:00', end: '14:00' },
  { start: '14:00', end: '16:00' },
  { start: '16:00', end: '18:00' },
  { start: '18:00', end: '20:00' },
];

const ClientDashboard = () => {
  const [tab, setTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalMsg, setModalMsg] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [foundSlot, setFoundSlot] = useState(null); // slot details from backend
  const user = getUser();

  useEffect(() => {
    fetchBookings(tab);
    // eslint-disable-next-line
  }, [tab]);

  const fetchBookings = async (tabType) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let url = '/api/client/appointments';
      if (tabType === 'upcoming') url += `?status=booked`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
      let appts = data.appointments || [];
      if (tabType === 'upcoming') {
        // Only show the nearest future booking
        const now = new Date();
        appts = appts
          .filter(b => new Date(b.startTime) > now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        appts = appts.length > 0 ? [appts[0]] : [];
      }
      setBookings(appts);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Step 1: Request slot
  const handleRequestSlot = async (e) => {
    e.preventDefault();
    setError('');
    setModalMsg('');
    setFoundSlot(null);
    if (!bookingDate || selectedSlot === null) {
      setError('Please select a date and a slot');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const { start, end } = SLOT_TIMES[selectedSlot];
      const startTime = new Date(`${bookingDate}T${start}`).toISOString();
      const endTime = new Date(`${bookingDate}T${end}`).toISOString();
      const res = await fetch('/api/client/appointments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startTime, endTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'No available painters');
      // Prefer exact match, fallback to nearest
      let slot = data.appointments?.[0] || data.nearestAppointment;
      if (!slot) throw new Error('No available appointment to confirm');
      setFoundSlot(slot);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  // Step 2: Confirm slot
  const handleConfirmSlot = async (e) => {
    e.preventDefault();
    setError('');
    setModalMsg('');
    if (!foundSlot?._id) {
      setError('No slot to confirm');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res2 = await fetch('/api/client/appointments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId: foundSlot._id }),
      });
      const data2 = await res2.json();
      if (!res2.ok) throw new Error(data2.message || 'Failed to confirm booking');
      setModalMsg('Booking done successfully');
      setBookingDate('');
      setSelectedSlot(null);
      setFoundSlot(null);
      setStep(1);
      fetchBookings(tab);
      // Auto-close modal after 4 seconds
      setTimeout(() => {
        closeModal();
      }, 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMsg('');
    setError('');
    setStep(1);
    setFoundSlot(null);
    setBookingDate('');
    setSelectedSlot(null);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="logo">Adam</h1>
        <div className="dashboard-user">
          <img className="dashboard-avatar" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'client'}`} alt="avatar" />
          <span>{user?.username ? `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}` : ''}</span>
        </div>
        <button className="add-slot-btn" onClick={() => { setShowModal(true); setModalMsg(''); setError(''); setStep(1); setFoundSlot(null); }}>
          <span style={{fontSize: '1.2em', marginRight: 6}}>+</span> Book a Painter
        </button>
      </div>
      <div className="dashboard-tabs">
        <button className={tab === 'upcoming' ? 'tab-active' : ''} onClick={() => setTab('upcoming')}>Upcoming</button>
        <button className={tab === 'bookings' ? 'tab-active' : ''} onClick={() => setTab('bookings')}>Bookings</button>
      </div>
      <div className="dashboard-slots-list">
        {loading ? <div>Loading...</div> : error ? <div className="auth-error">{error}</div> : (
          bookings.length === 0 ? <div>No bookings found.</div> : (
            bookings.map((b, i) => (
              <div className="slot-card" key={b._id || i}>
                <div>Date: {new Date(b.startTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                <div>Start time: {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div>End time: {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div style={{fontWeight: 700, marginTop: 6}}>{b.painterName || b.painter?.username}</div>
              </div>
            ))
          )
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {modalMsg ? (
              <div style={{textAlign: 'center', color: '#27ae60', fontWeight: 600, fontSize: '1.2rem', margin: '2rem 0'}}>
                {modalMsg}
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleRequestSlot}>
                <h2>Book a Painter</h2>
                <label>Date</label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />
                <label>Choose a time slot</label>
                <div className="slot-select-grid">
                  {SLOT_TIMES.map((slot, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className={selectedSlot === idx ? 'slot-btn slot-btn-selected' : 'slot-btn'}
                      onClick={() => setSelectedSlot(idx)}
                    >
                      {slot.start} – {slot.end}
                    </button>
                  ))}
                </div>
                {error && <div className="auth-error">{error}</div>}
                <div className="modal-actions">
                  <button type="button" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="auth-btn">Check Availability</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmSlot}>
                <h2>Confirm Booking</h2>
                <div style={{margin: '1.2rem 0', textAlign: 'center'}}>
                  <div>Date: {foundSlot && new Date(foundSlot.startTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  <div>Start time: {foundSlot && new Date(foundSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div>End time: {foundSlot && new Date(foundSlot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  {foundSlot && foundSlot.painter && (
                    <div style={{fontWeight: 700, marginTop: 6}}>{foundSlot.painter.username}</div>
                  )}
                  {/* Show message if not exact slot */}
                  {foundSlot && selectedSlot !== null && (() => {
                    const { start, end } = SLOT_TIMES[selectedSlot];
                    const reqStart = new Date(`${bookingDate}T${start}`).toISOString();
                    const reqEnd = new Date(`${bookingDate}T${end}`).toISOString();
                    if (foundSlot.startTime !== reqStart || foundSlot.endTime !== reqEnd) {
                      return <div style={{color: '#b71c1c', marginTop: 8}}>This is the nearest available slot to your request.</div>;
                    }
                    return null;
                  })()}
                </div>
                {error && <div className="auth-error">{error}</div>}
                <div className="modal-actions">
                  <button type="button" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="auth-btn">Confirm</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard; 