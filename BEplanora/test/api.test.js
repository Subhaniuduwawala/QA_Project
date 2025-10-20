import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import { Event } from '../models/Event.js';

describe('Event API Tests', () => {
  // Setup before running tests
  beforeAll(async () => {
    // Connect to test database
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/planora_test';
    await mongoose.connect(mongoURI);
  });

  // Clean up after tests
  afterAll(async () => {
    await Event.deleteMany({});
    await mongoose.connection.close();
  });

  // Clean up after each test
  afterEach(async () => {
    await Event.deleteMany({});
  });

  // Test 1: Create Event API
  describe('POST /api/events', () => {
    it('should create a new event with valid data', async () => {
      const eventData = {
        name: 'Test Event',
        date: '2025-12-25',
        location: 'Test Location'
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(eventData.name);
      expect(response.body.data.location).toBe(eventData.location);
    });

    it('should return error for invalid event data', async () => {
      const invalidData = {
        name: '', // Empty name should fail validation
        date: '2025-12-25',
        location: 'Test Location'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // Test 2: Get Events API
  describe('GET /api/events', () => {
    it('should return all events', async () => {
      // First create some test events
      const testEvents = [
        { name: 'Event 1', date: '2025-12-25', location: 'Location 1' },
        { name: 'Event 2', date: '2025-12-26', location: 'Location 2' }
      ];

      await Event.insertMany(testEvents);

      const response = await request(app)
        .get('/api/events');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBe(2);
    });

    it('should handle database errors gracefully', async () => {
      // Simulate database error by closing connection
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/events');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);

      // Reconnect for other tests
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planora_test');
    });
  });
});