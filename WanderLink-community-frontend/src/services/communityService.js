/**
 * WanderLink Community & Explore Service
 * Author: Person 3 (Community & Explore Developer)
 *
 * Integrates directly with Person 1's Spring Boot backend REST endpoints:
 * - GET  /api/accommodations
 * - GET  /api/food
 * - GET  /api/groups
 * - POST /api/groups/{id}/join
 * - GET  /api/guides (prepared contract with mock fallback)
 *
 * Provides realistic mock fallback when backend is offline for hackathon prototyping.
 */

import api from './api';
import {
  MOCK_ACCOMMODATIONS,
  MOCK_FOOD_EXPERIENCES,
  MOCK_LOCAL_GUIDES,
  MOCK_TRAVEL_GROUPS,
  MOCK_RECOMMENDED_BUDDIES,
} from '../data/communityMockData';

// Local storage keys for state persistence during demo
const STORAGE_JOINED_GROUPS_KEY = 'wanderlink_joined_groups';

const getStoredJoinedGroups = () => {
  try {
    const raw = localStorage.getItem(STORAGE_JOINED_GROUPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const storeJoinedGroup = (groupId) => {
  try {
    const joined = getStoredJoinedGroups();
    if (!joined.includes(groupId)) {
      joined.push(groupId);
      localStorage.setItem(STORAGE_JOINED_GROUPS_KEY, JSON.stringify(joined));
    }
  } catch (e) {
    console.error('Failed to store joined group in localStorage', e);
  }
};

/**
 * Normalizes accommodation response between backend DTO and frontend card
 */
const normalizeAccommodation = (item) => ({
  id: item.id,
  title: item.title || item.propertyName || item.name || 'Cozy Local Stay',
  propertyName: item.propertyName || item.title || item.name || 'Cozy Local Stay',
  hostName: item.hostName || item.host?.name || 'Local Host',
  hostAvatar: item.hostAvatar || item.host?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  location: item.location || item.city || 'India',
  city: item.city || item.location || 'India',
  pricePerNight: item.pricePerNight ?? item.price ?? 1500,
  price: item.price ?? item.pricePerNight ?? 1500,
  rating: item.rating ?? 4.8,
  reviewsCount: item.reviewsCount ?? 24,
  type: item.type || item.propertyType || 'Homestay',
  description: item.description || 'Authentic local stay with warm hospitality and scenic surroundings.',
  imageUrl: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  amenities: Array.isArray(item.amenities) ? item.amenities : ['Wi-Fi', 'Breakfast', 'Clean Linens'],
  contactPhone: item.contactPhone || item.contactNumber || '+91 98765 43210',
  contactEmail: item.contactEmail || 'stay@wanderlink.example',
  verified: Boolean(item.verified),
});

/**
 * Normalizes food experience response
 */
const normalizeFood = (item) => ({
  id: item.id,
  title: item.title || item.name || item.dishName || 'Homemade Specialty',
  name: item.name || item.title || item.dishName || 'Homemade Specialty',
  cuisine: item.cuisine || item.cuisineType || 'Local Traditional',
  providerName: item.providerName || item.cookName || item.chefName || item.hostName || 'Local Family Chef',
  location: item.location || item.city || 'India',
  city: item.city || item.location || 'India',
  price: item.price ?? 450,
  rating: item.rating ?? 4.9,
  reviewsCount: item.reviewsCount ?? 30,
  dietaryType: item.dietaryType || (item.isVegetarian ? 'Veg' : 'Non-Veg'),
  mealType: item.mealType || 'Meal Experience',
  description: item.description || 'Authentic home-style food cooked with love and generational family recipes.',
  imageUrl: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  includes: Array.isArray(item.includes) ? item.includes : ['Full Meal', 'Traditional Beverage', 'Sweet Dish'],
  contactPhone: item.contactPhone || '+91 98765 43210',
  verified: Boolean(item.verified),
});

/**
 * Normalizes local guide response
 */
const normalizeGuide = (item) => ({
  id: item.id,
  name: item.name || 'Certified Local Guide',
  location: item.location || item.city || 'India',
  city: item.city || item.location || 'India',
  languages: Array.isArray(item.languages) ? item.languages : ['English', 'Hindi'],
  experience: item.experience || (item.experienceYears ? `${item.experienceYears}+ Years Experience` : '5+ Years Experience'),
  experienceYears: item.experienceYears ?? 5,
  price: item.price ?? item.pricePerDay ?? 1800,
  pricePerDay: item.pricePerDay ?? item.price ?? 1800,
  rating: item.rating ?? 4.9,
  reviewsCount: item.reviewsCount ?? 45,
  avatar: item.avatar || item.profileImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
  specialties: Array.isArray(item.specialties) ? item.specialties : ['Heritage Walking Tours', 'Local Culture', 'Hidden Gems'],
  bio: item.bio || 'Passionate local storytelling and safe, insightful exploration of culture and nature.',
  phone: item.phone || item.contactPhone || '+91 98765 43210',
  verified: Boolean(item.verified),
});

/**
 * Normalizes travel group response
 */
const normalizeGroup = (item) => {
  const joinedIds = getStoredJoinedGroups();
  const isJoinedLocally = joinedIds.includes(item.id);
  const isJoined = Boolean(item.isJoined || item.joined || isJoinedLocally);

  return {
    id: item.id,
    name: item.name || item.groupName || 'WanderLink Travel Tribe',
    groupName: item.groupName || item.name || 'WanderLink Travel Tribe',
    destination: item.destination || item.city || 'India',
    city: item.city || item.destination || 'India',
    description: item.description || 'A community of solo wanderers connecting for shared adventures and cultural immersion.',
    memberCount: (item.memberCount ?? 50) + (isJoinedLocally && !item.isJoined ? 1 : 0),
    maxMembers: item.maxMembers ?? 150,
    category: item.category || item.activityType || 'Travel Tribe',
    upcomingTripDate: item.upcomingTripDate || item.dates || 'Upcoming Soon',
    dates: item.dates || item.upcomingTripDate || 'Upcoming Soon',
    imageUrl: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    isJoined: isJoined,
    organizer: item.organizer || 'Community Host',
  };
};

export const communityService = {
  /**
   * Fetch all accommodations
   * GET /api/accommodations
   */
  async getAccommodations(params = {}) {
    try {
      const response = await api.get('/accommodations', { params });
      if (response?.data && Array.isArray(response.data)) {
        return response.data.map(normalizeAccommodation);
      }
      if (response?.data?.content && Array.isArray(response.data.content)) {
        return response.data.content.map(normalizeAccommodation);
      }
      return MOCK_ACCOMMODATIONS.map(normalizeAccommodation);
    } catch (error) {
      console.info('[communityService] getAccommodations: falling back to mock data', error.message);
      let data = MOCK_ACCOMMODATIONS;
      if (params.destination && params.destination !== 'All') {
        const dest = params.destination.toLowerCase();
        data = data.filter(
          (item) => item.location.toLowerCase().includes(dest) || item.city.toLowerCase().includes(dest)
        );
      }
      return data.map(normalizeAccommodation);
    }
  },

  /**
   * Fetch local food experiences
   * GET /api/food
   */
  async getFoodListings(params = {}) {
    try {
      const response = await api.get('/food', { params });
      if (response?.data && Array.isArray(response.data)) {
        return response.data.map(normalizeFood);
      }
      if (response?.data?.content && Array.isArray(response.data.content)) {
        return response.data.content.map(normalizeFood);
      }
      return MOCK_FOOD_EXPERIENCES.map(normalizeFood);
    } catch (error) {
      console.info('[communityService] getFoodListings: falling back to mock data', error.message);
      let data = MOCK_FOOD_EXPERIENCES;
      if (params.destination && params.destination !== 'All') {
        const dest = params.destination.toLowerCase();
        data = data.filter(
          (item) => item.location.toLowerCase().includes(dest) || item.city.toLowerCase().includes(dest)
        );
      }
      return data.map(normalizeFood);
    }
  },

  /**
   * Fetch travel groups
   * GET /api/groups
   */
  async getTravelGroups(params = {}) {
    try {
      const response = await api.get('/groups', { params });
      if (response?.data && Array.isArray(response.data)) {
        return response.data.map(normalizeGroup);
      }
      if (response?.data?.content && Array.isArray(response.data.content)) {
        return response.data.content.map(normalizeGroup);
      }
      return MOCK_TRAVEL_GROUPS.map(normalizeGroup);
    } catch (error) {
      console.info('[communityService] getTravelGroups: falling back to mock data', error.message);
      let data = MOCK_TRAVEL_GROUPS;
      if (params.destination && params.destination !== 'All') {
        const dest = params.destination.toLowerCase();
        data = data.filter(
          (item) => item.destination.toLowerCase().includes(dest) || item.city.toLowerCase().includes(dest)
        );
      }
      return data.map(normalizeGroup);
    }
  },

  /**
   * Join a travel group
   * POST /api/groups/{id}/join
   */
  async joinTravelGroup(groupId) {
    storeJoinedGroup(groupId);
    try {
      const response = await api.post(`/groups/${groupId}/join`);
      return {
        success: true,
        groupId,
        data: response.data,
        message: response.data?.message || 'Successfully joined travel group!',
      };
    } catch (error) {
      console.info(`[communityService] joinTravelGroup(${groupId}): recorded locally for hackathon prototype`);
      return {
        success: true,
        groupId,
        simulated: true,
        message: 'Successfully joined the group! Welcome to the tribe.',
      };
    }
  },

  /**
   * Fetch local guides
   * GET /api/guides (with mock data separation per prompt specs)
   */
  async getLocalGuides(params = {}) {
    try {
      const response = await api.get('/guides', { params });
      if (response?.data && Array.isArray(response.data)) {
        return response.data.map(normalizeGuide);
      }
      if (response?.data?.content && Array.isArray(response.data.content)) {
        return response.data.content.map(normalizeGuide);
      }
      return MOCK_LOCAL_GUIDES.map(normalizeGuide);
    } catch (error) {
      console.info('[communityService] getLocalGuides: using mock data (endpoint not yet provided by backend)', error.message);
      let data = MOCK_LOCAL_GUIDES;
      if (params.destination && params.destination !== 'All') {
        const dest = params.destination.toLowerCase();
        data = data.filter(
          (item) => item.location.toLowerCase().includes(dest) || item.city.toLowerCase().includes(dest)
        );
      }
      return data.map(normalizeGuide);
    }
  },

  /**
   * Recommended buddies for Explore page discovery
   */
  async getRecommendedBuddies(params = {}) {
    let data = MOCK_RECOMMENDED_BUDDIES;
    if (params.destination && params.destination !== 'All') {
      const dest = params.destination.toLowerCase();
      data = data.filter(
        (b) => b.destination.toLowerCase().includes(dest) || b.city.toLowerCase().includes(dest)
      );
    }
    return Promise.resolve(data);
  },
};

export default communityService;
