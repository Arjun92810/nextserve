# NextServe API Architecture

## Overview
This document details the API architecture of NextServe, explaining how different parts of our system communicate and interact.

## API Types

### 1. REST APIs
Our primary API interface for standard operations.

#### Endpoints

##### Court Management
- `GET /api/courts` - List all courts
- `GET /api/courts/:id` - Get court details
- `GET /api/courts/availability` - Check court availability
- `POST /api/courts` - Create new court
- `PUT /api/courts/:id` - Update court details
- `DELETE /api/courts/:id` - Remove court

##### Booking Management
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

##### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/matches` - Get match history
- `POST /api/users/preferences` - Update preferences

#### Example Implementation
```typescript
// Court Availability Endpoint
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const availability = await getCourtAvailability();
      res.status(200).json(availability);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### 2. Real-time APIs
WebSocket-based APIs for instant updates.

#### Subscriptions
- Court availability updates
- Booking notifications
- Chat messages
- Match status changes

#### Example Implementation
```typescript
// Real-time Court Updates
const subscription = supabase
  .from('courts')
  .on('UPDATE', (payload) => {
    updateCourtAvailability(payload.new);
  })
  .subscribe();
```

### 3. External APIs
Third-party service integrations.

#### Google Maps Integration
```typescript
const getCourtLocation = async (address) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
  );
  return response.json();
};
```

#### Payment Processing
```typescript
const processPayment = async (booking) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: booking.amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });
  return paymentIntent;
};
```

## API Security

### Authentication
- JWT-based authentication
- Role-based access control
- API key management

### Rate Limiting
- Request throttling
- IP-based limits
- User-based quotas

### Data Validation
- Input sanitization
- Schema validation
- Error handling

## API Documentation
- OpenAPI/Swagger documentation
- Postman collections
- API testing guides

## Best Practices
1. Use appropriate HTTP methods
2. Implement proper error handling
3. Follow REST conventions
4. Maintain versioning
5. Document all endpoints

## Monitoring and Analytics
- Request logging
- Performance metrics
- Error tracking
- Usage analytics 