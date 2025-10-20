import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { Event } from '../models/Event.js';

describe('API Tests', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/planora_test';
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    await Admin.deleteMany({});
    await Event.deleteMany({});
    await mongoose.connection.close();
  });

  // Clean up after each test
  afterEach(async () => {
    await Admin.deleteMany({});
    await Event.deleteMany({});
  });

  // Admin Signup Tests
  describe('POST /api/admin/signup', () => {
    it('should create a new admin with valid data', async () => {
      const adminData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      const response = await request(app)
        .post('/api/admin/signup')
        .send(adminData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(adminData.email);
      expect(response.body.data.firstName).toBe(adminData.firstName);
      expect(response.body.data.lastName).toBe(adminData.lastName);
      expect(response.body.data.password).toBeUndefined(); // Password should not be returned
    });

    it('should return error for duplicate email', async () => {
      const adminData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      // First signup
      await request(app)
        .post('/api/admin/signup')
        .send(adminData);

      // Duplicate signup
      const response = await request(app)
        .post('/api/admin/signup')
        .send(adminData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email already exists');
    });
  });

  // Create Event Tests
  describe('POST /api/events', () => {
    let adminToken;

    beforeEach(async () => {
      // Create an admin and get token
      const adminData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };

      const signupResponse = await request(app)
        .post('/api/admin/signup')
        .send(adminData);

      const loginResponse = await request(app)
        .post('/api/admin/login')
        .send({
          email: adminData.email,
          password: adminData.password
        });

      adminToken = loginResponse.body.token;
    });

    it('should create a new event with valid data and admin token', async () => {
      const eventData = {
        name: 'Tech Conference 2025',
        date: '2025-12-25',
        location: 'Convention Center'
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(eventData.name);
      expect(response.body.data.location).toBe(eventData.location);
      expect(new Date(response.body.data.date)).toEqual(new Date(eventData.date));
    });

    it('should return error for invalid event data', async () => {
      const invalidEventData = {
        name: '', // Empty name should fail validation
        date: '2025-12-25',
        location: 'Convention Center'
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidEventData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('name');
    });
  });
});