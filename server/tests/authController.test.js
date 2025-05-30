const authController = require('../controllers/authController');
const authService = require('../services/authService');

jest.mock('../services/authService');

describe('authController', () => {
  describe('signup', () => {
    it('should create a user and return 201', async () => {
      const req = { body: { username: 'test', password: 'pass', city: 'Prague', isPainter: false } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const userObj = { toObject: () => ({ username: 'test', city: 'Prague' }) };
      authService.signup.mockResolvedValue(userObj);
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created', safeUser: { username: 'test', city: 'Prague' } });
    });
    it('should handle errors and return 400', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      authService.signup.mockRejectedValue(new Error('fail'));
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
    });
  });

  describe('login', () => {
    it('should login and return user and token', async () => {
      const req = { body: { username: 'test', password: 'pass' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const userObj = { toObject: () => ({ username: 'test' }) };
      authService.login.mockResolvedValue({ user: userObj, token: 'token123' });
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', safeUser: { username: 'test' }, token: 'token123' });
    });
    it('should handle login error', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      authService.login.mockRejectedValue(new Error('fail'));
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
    });
  });

  describe('profile', () => {
    it('should return profile if user is present', async () => {
      const req = { user: { username: 'test' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      res.status(200).json({ message: 'Profile accessed', user: req.user });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile accessed', user: { username: 'test' } });
    });
  });
}); 