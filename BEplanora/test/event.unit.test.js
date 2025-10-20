import { Event } from '../models/Event.js';
import mongoose from 'mongoose';

describe('Event Model Unit Tests', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/planora_test';
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Event.deleteMany({});
  });

  // Test 1: Event Creation
  it('should create & save event successfully', async () => {
    const validEvent = new Event({
      name: 'Valid Event',
      date: new Date('2025-12-25'),
      location: 'Valid Location'
    });
    const savedEvent = await validEvent.save();
    
    expect(savedEvent._id).toBeDefined();
    expect(savedEvent.name).toBe(validEvent.name);
    expect(savedEvent.location).toBe(validEvent.location);
    expect(new Date(savedEvent.date)).toEqual(validEvent.date);
  });

  // Test 2: Validation
  it('should fail to save event without required fields', async () => {
    const eventWithoutRequiredField = new Event({
      name: 'Test Event'
      // missing date and location
    });

    let err;
    try {
      await eventWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.date).toBeDefined();
    expect(err.errors.location).toBeDefined();
  });
});