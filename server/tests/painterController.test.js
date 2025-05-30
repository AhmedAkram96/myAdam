const painterController = require('../controllers/painterController');
const painterService = require('../services/painterService');

jest.mock('../services/painterService');

describe('painterController', () => {
  describe('submitAvailability', () => {
    it('should add slots and return 201', async () => {
      const req = { user: { userId: 'p1' }, body: { appointments: [{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }] } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      painterService.submitAvailability.mockResolvedValue({ addedAppointments: req.body.appointments });
      await painterController.submitAvailability(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'All appointments added successfully', appointments: req.body.appointments });
    });
    it('should handle missing appointments', async () => {
      const req = { user: { userId: 'p1' }, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await painterController.submitAvailability(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it('should handle service error', async () => {
      const req = { user: { userId: 'p1' }, body: { appointments: [{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }] } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      painterService.submitAvailability.mockRejectedValue(new Error('fail'));
      await painterController.submitAvailability(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating appointments', error: 'fail' });
    });
  });

  describe('getPainterAppointments', () => {
    it('should return appointments', async () => {
      const req = { user: { userId: 'p1' }, query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      painterService.getPainterAvailability.mockResolvedValue([{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }]);
      await painterController.getPainterAppointments(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Appointments retrieved successfully', appointments: [{ startTime: '2024-01-01T08:00:00Z', endTime: '2024-01-01T10:00:00Z' }] });
    });
    it('should handle service error', async () => {
      const req = { user: { userId: 'p1' }, query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      painterService.getPainterAvailability.mockRejectedValue(new Error('fail'));
      await painterController.getPainterAppointments(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching appointments', error: 'fail' });
    });
  });
}); 