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

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'booked', label: 'Booked' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'finished', label: 'Finished' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PainterDashboard = () => {
  const [tab, setTab] = useState('slots');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [slotDate, setSlotDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const user = getUser();

  useEffect(() => {
    if (tab === 'slots') {
      fetchSlots();
    } else if (tab === 'bookings') {
      fetchSlots('booked');
    }
    // eslint-disable-next-line
  }, [tab, statusFilter, dateFilter]);

  const fetchSlots = async (statusOverride) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let url = '/api/painter/appointments';
      const params = [];
      const status = statusOverride !== undefined ? statusOverride : statusFilter;
      if (status) params.push(`status=${status}`);
      if (dateFilter) params.push(`startTime=${dateFilter}`);
      if (params.length > 0) url += '?' + params.join('&');
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch slots');
      setSlots(data.appointments || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSlotToggle = (idx) => {
    setSelectedSlots((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError('');
    if (!slotDate || selectedSlots.length === 0) {
      setError('Please select a date and at least one slot');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const appointments = selectedSlots.map(idx => {
        const { start, end } = SLOT_TIMES[idx];
        const startTime = new Date(`${slotDate}T${start}`).toISOString();
        const endTime = new Date(`${slotDate}T${end}`).toISOString();
        return { startTime, endTime };
      });
      const res = await fetch('/api/painter/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointments }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add slot');
      setShowModal(false);
      setSlotDate('');
      setSelectedSlots([]);
      fetchSlots();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="logo">Adam</h1>
        <div className="dashboard-user">
          <img className="dashboard-avatar" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'painter'}`} alt="avatar" />
          <span>{user?.username ? `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}${user?.isPainter ? ' (Painter)' : ''}` : ''}</span>
        </div>
        <button className="add-slot-btn" onClick={() => setShowModal(true)}>
          <span style={{fontSize: '1.2em', marginRight: 6}}>+</span> Add a slot
        </button>
      </div>
      <div className="dashboard-tabs">
        <button className={tab === 'bookings' ? 'tab-active' : ''} onClick={() => setTab('bookings')}>Bookings</button>
        <button className={tab === 'slots' ? 'tab-active' : ''} onClick={() => setTab('slots')}>All Slots</button>
      </div>
      {tab === 'slots' && (
        <>
          <div className="dashboard-filters">
            <label>Status:
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
            <label>Start Date:
              <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            </label>
          </div>
          <div className="dashboard-slots-list">
            {loading ? <div>Loading...</div> : error ? <div className="auth-error">{error}</div> : (
              slots.length === 0 ? <div>No slots found.</div> : (
                slots.map((slot, i) => (
                  <div className="slot-card" key={slot._id || i}>
                    <div>Date: {new Date(slot.startTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div>Start time: {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div>End time: {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className={slot.status === 'available' ? 'slot-status-available' : 'slot-status-booked'}>
                      <span className="slot-status-dot" />
                      {slot.status === 'available' ? 'Available' : 'Booked'}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </>
      )}
      {tab === 'bookings' && (
        <div className="dashboard-slots-list">
          {loading ? <div>Loading...</div> : error ? <div className="auth-error">{error}</div> : (
            slots.length === 0 ? <div>No bookings found.</div> : (
              slots.map((slot, i) => (
                <div className="slot-card" key={slot._id || i}>
                  <div>Date: {new Date(slot.startTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  <div>Start time: {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div>End time: {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className='slot-status-booked'>
                    <span className="slot-status-dot" />
                    Booked
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleAddSlot}>
              <h2>Add Slots</h2>
              <label>Date</label>
              <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} required />
              <label>Choose time slots</label>
              <div className="slot-select-grid">
                {SLOT_TIMES.map((slot, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={selectedSlots.includes(idx) ? 'slot-btn slot-btn-selected' : 'slot-btn'}
                    onClick={() => handleSlotToggle(idx)}
                  >
                    {slot.start} – {slot.end}
                  </button>
                ))}
              </div>
              {error && <div className="auth-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="auth-btn">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainterDashboard; 