const clientController = require('../controllers/clientController');
const clientService = require('../services/clientService');

jest.mock('../services/clientService');

describe('clientController', () => {
  describe('getMyAppointments', () => {
    it('should return appointments', async () => {
      const req = { user: { userId: 'c1' }, query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      clientService.getMyAppointments.mockResolvedValue([{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }]);
      await clientController.getMyAppointments(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Appointments retrieved successfully', appointments: [{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }] });
    });
  });

  describe('requestAppointment', () => {
    it('should return available appointments', async () => {
      const req = { user: { userId: 'c1' }, body: { startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      clientService.requestAppointment.mockResolvedValue({ type: 'available_appointments', appointments: [{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }] });
      await clientController.requestAppointment(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Available appointments found', appointments: [{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }] });
    });
    it('should return nearest appointment if no exact match', async () => {
      const req = { user: { userId: 'c1' }, body: { startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      clientService.requestAppointment.mockResolvedValue({ type: 'nearest_appointment', appointment: { startTime: '2024-01-01T10:00:00Z', endTime: '2024-01-01T12:00:00Z' } });
      await clientController.requestAppointment(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'No appointments found in requested time range. Here is the nearest available appointment:', nearestAppointment: { startTime: '2024-01-01T10:00:00Z', endTime: '2024-01-01T12:00:00Z' } });
    });
    it('should handle service error', async () => {
      const req = { user: { userId: 'c1' }, body: { startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      clientService.requestAppointment.mockRejectedValue(new Error('fail'));
      await clientController.requestAppointment(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error requesting appointment', error: 'fail' });
    });
  });

  describe('confirmAppointment', () => {
    it('should confirm appointment', async () => {
      const req = { user: { userId: 'c1' }, body: { appointmentId: 'a1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      clientService.confirmAppointment.mockResolvedValue({ id: 'a1' });
      await clientController.confirmAppointment(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Appointment confirmed successfully', appointment: { id: 'a1' } });
    });
    it('should handle service error', async () => {
      const req = { user: { userId: 'c1' }, body: { appointmentId: 'bad' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      clientService.confirmAppointment.mockRejectedValue(new Error('fail'));
      await clientController.confirmAppointment(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error confirming appointment', error: 'fail' });
    });
  });
}); 