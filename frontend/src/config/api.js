// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_CONFIG.BASE_URL}/user/login`,
    REGISTER: `${API_CONFIG.BASE_URL}/user/register`,
    PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
  },
  
  // Event endpoints
  EVENTS: {
    BASE: `${API_CONFIG.BASE_URL}/api/event`,
    BY_ORGANIZER: (id) => `${API_CONFIG.BASE_URL}/api/event/${id}`,
    BY_CATEGORY: (id) => `${API_CONFIG.BASE_URL}/api/event/category/${id}`,
    BY_CITY: (id) => `${API_CONFIG.BASE_URL}/api/event/city/${id}`,
    ALL_EVENTS: `${API_CONFIG.BASE_URL}/api/event/all/events`,
    ALL_CATEGORY: `${API_CONFIG.BASE_URL}/api/event/all/category`,
    BY_DATE: `${API_CONFIG.BASE_URL}/api/event/by-date/all`,
    TOP: `${API_CONFIG.BASE_URL}/api/event/top`,
    ONGOING: `${API_CONFIG.BASE_URL}/api/ongoingevents`,
    UPCOMING: `${API_CONFIG.BASE_URL}/api/upcomingevents`,
    USER_INTEREST: (id) => `${API_CONFIG.BASE_URL}/api/userinterestevents/${id}`,
  },
  
  // Show endpoints
  SHOWS: {
    CREATE: (id) => `${API_CONFIG.BASE_URL}/api/event/show/${id}`,
    GET_ALL: (id) => `${API_CONFIG.BASE_URL}/api/event/show/${id}`,
    BY_CITY: (eventId, venueName) => `${API_CONFIG.BASE_URL}/api/shows/city/${eventId}/${venueName}`,
  },
  
  // Seat endpoints
  SEATS: {
    FETCH: (id) => `${API_CONFIG.BASE_URL}/api/show/seats/${id}`,
  },
  
  // Booking endpoints
  BOOKING: {
    HOLD: `${API_CONFIG.BASE_URL}/api/booking/hold`,
    CANCEL_HOLD: `${API_CONFIG.BASE_URL}/api/booking/cancel/hold`,
    CREATE_PAYMENT: `${API_CONFIG.BASE_URL}/api/booking/create-payment`,
    CAPTURE_PAYMENT: `${API_CONFIG.BASE_URL}/api/booking/capture-payment`,
    ORGANIZER_BOOKINGS: (id) => `${API_CONFIG.BASE_URL}/api/organizerbookings/${id}`,
    USER_BOOKINGS: (id) => `${API_CONFIG.BASE_URL}/api/userbookings/${id}`,
    EVENTWISE_EARNING: (id) => `${API_CONFIG.BASE_URL}/api/eventwiseearning/${id}`,
  },
  
  // Review endpoints
  REVIEWS: {
    CREATE: `${API_CONFIG.BASE_URL}/api/reviews`,
    GET: (id) => `${API_CONFIG.BASE_URL}/api/reviews/${id}`,
  },
  
  // Like endpoints
  LIKES: {
    GET_LIKED: (id) => `${API_CONFIG.BASE_URL}/api/likedevents/${id}`,
    LIKE: `${API_CONFIG.BASE_URL}/api/likeevent`,
    UNLIKE: `${API_CONFIG.BASE_URL}/api/unlikeevent`,
  },
  
  // PDF endpoints
  PDF: {
    GENERATE: `${API_CONFIG.BASE_URL}/api/generate-pdf`,
    GENERATE_TICKET: `${API_CONFIG.BASE_URL}/api/generate-ticket`,
  },
  
  // Admin endpoints
  ADMIN: {
    BASE: `${API_CONFIG.BASE_URL}/api/admin`,
    USERS: `${API_CONFIG.BASE_URL}/api/admin/users`,
    ORGANIZERS: `${API_CONFIG.BASE_URL}/api/admin/organizers`,
    GET_USER: (id) => `${API_CONFIG.BASE_URL}/api/user/${id}`,
    PLANS: {
      CREATE: `${API_CONFIG.BASE_URL}/api/admin/plan`,
      GET_ALL: `${API_CONFIG.BASE_URL}/api/admin/get-plans`,
      GET_BY_ID: (id) => `${API_CONFIG.BASE_URL}/api/admin/get-plan/${id}`,
      SET_INACTIVE: (id) => `${API_CONFIG.BASE_URL}/api/admin/inactiveplan/${id}`,
      SET_ACTIVE: (id) => `${API_CONFIG.BASE_URL}/api/admin/activeplan/${id}`,
    },
    SUBSCRIPTION: {
      CREATE: `${API_CONFIG.BASE_URL}/api/admin/organizer/create-subscription`,
      CAPTURE: `${API_CONFIG.BASE_URL}/api/admin/organizer/capture-subscription`,
      CURRENT_PLAN: (id) => `${API_CONFIG.BASE_URL}/api/admin/organizer/current-plan/${id}`,
    },
  },
};

// Socket configuration
export const SOCKET_CONFIG = {
  URL: API_CONFIG.SOCKET_URL,
  OPTIONS: {
    transports: ['websocket'],
  },
};

export default API_CONFIG;
