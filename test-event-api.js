import API from './FEplanora/src/api.js';

// Test event creation and editing functionality
async function testEventOperations() {
  try {
    console.log('Testing event operations...');

    // First, login to get token
    console.log('1. Logging in...');
    const loginResponse = await API.post('/admin/login', {
      email: 'admin@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('Login successful, token received');

    // Set token in localStorage for API calls
    localStorage.setItem('adminToken', token);

    // Test creating an event
    console.log('2. Creating event...');
    const createResponse = await API.post('/events', {
      name: 'Test Event',
      location: 'Test Location',
      date: '2025-12-25'
    });
    console.log('Event created:', createResponse.data);

    const eventId = createResponse.data._id;

    // Test fetching events
    console.log('3. Fetching events...');
    const fetchResponse = await API.get('/events');
    console.log('Events fetched:', fetchResponse.data.length, 'events');

    // Test updating the event
    console.log('4. Updating event...');
    const updateResponse = await API.put(`/events/${eventId}`, {
      name: 'Updated Test Event',
      location: 'Updated Location',
      date: '2025-12-26'
    });
    console.log('Event updated:', updateResponse.data);

    // Test deleting the event
    console.log('5. Deleting event...');
    await API.delete(`/events/${eventId}`);
    console.log('Event deleted successfully');

    console.log('All tests passed!');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testEventOperations();