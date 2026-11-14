import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Community & Explore Pages (Person 3)
import Explore from './pages/community/Explore';
import Accommodation from './pages/community/Accommodation';
import FoodExperiences from './pages/community/FoodExperiences';
import LocalGuides from './pages/community/LocalGuides';
import TravelGroups from './pages/community/TravelGroups';

// Reusable components developed by Person 3
import BuddyCard from './components/community/BuddyCard';
import SectionHeading from './components/community/SectionHeading';
import EmptyState from './components/community/EmptyState';
import { MOCK_RECOMMENDED_BUDDIES } from './data/communityMockData';

// Lucide React Icons
import {
  Compass,
  Home,
  Utensils,
  Award,
  Users,
  Sparkles,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Info,
  ShieldCheck,
  Building,
  Tag,
  X,
  Check,
  Filter,
  ChevronRight,
  Plane,
  Heart,
} from 'lucide-react';

/* ==========================================================================
   1. LOCALSTORAGE & DEMO AUTHENTICATION UTILITIES
   ========================================================================== */

const STORAGE_USERS_KEY = 'wanderlink_users';
const STORAGE_CURRENT_USER_KEY = 'wanderlink_user';
const STORAGE_TOKEN_KEY = 'wanderlink_token';
const STORAGE_TRIPS_KEY = 'wanderlink_trips';
const STORAGE_ACTIVITIES_KEY = 'wanderlink_activities';
const STORAGE_CONNECTED_COUNT_KEY = 'wanderlink_connected_count';

// Default seed users for immediate prototype testing
const DEFAULT_USERS = [
  {
    id: 'user-demo-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@travelcircle.com',
    phone: '+91 98765 43210',
    password: 'password123',
    location: 'Mumbai, India',
    role: 'Traveler',
    bio: 'Passionate backpacker, photographer, and coastal cuisine lover.',
    joinedDate: 'November 2026',
  },
];

// Default initial trips for the demo user
const DEFAULT_TRIPS = [
  {
    id: 'trip-101',
    userId: 'user-demo-1',
    title: 'Winter Coastal Expedition & Scuba',
    startingLocation: 'Mumbai',
    destination: 'Goa',
    departureDate: '2026-11-25',
    returnDate: '2026-11-30',
    budget: 18000,
    travelers: 2,
    travelStyle: 'Backpacking',
    interests: ['Adventure', 'Beaches', 'Food', 'Photography'],
    languages: 'English, Hindi',
    description:
      'Backpacking through scenic beaches of North and South Goa, scuba diving at Grand Island, and savoring authentic coastal curries.',
    status: 'Upcoming',
    createdAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'trip-102',
    userId: 'user-demo-1',
    title: 'Himalayan Autumn Trail & Old Manali',
    startingLocation: 'Delhi',
    destination: 'Manali',
    departureDate: '2026-10-12',
    returnDate: '2026-10-18',
    budget: 24000,
    travelers: 3,
    travelStyle: 'Adventure',
    interests: ['Trekking', 'Nature', 'Photography'],
    languages: 'English, Hindi',
    description:
      'Autumn trekking to Jogini waterfall and Solang Valley with stays in traditional wooden eco-cottages.',
    status: 'Completed',
    createdAt: '2026-10-01T08:30:00.000Z',
  },
];

// Default recent activities
const DEFAULT_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Created new trip: Winter Coastal Expedition',
    destination: 'Goa',
    time: '2 hours ago',
    type: 'trip',
  },
  {
    id: 'act-2',
    title: 'Connected with travel buddy Aarav Mehta',
    destination: 'Goa',
    time: 'Yesterday',
    type: 'buddy',
  },
  {
    id: 'act-3',
    title: 'Explored Heritage Haveli stays in Jaipur',
    destination: 'Jaipur',
    time: '3 days ago',
    type: 'explore',
  },
  {
    id: 'act-4',
    title: 'Booked Homestay canoe tour in Kerala',
    destination: 'Kerala',
    time: '5 days ago',
    type: 'experience',
  },
];

// Initialize default storage data safely without overwriting user changes
const initDefaultStorage = () => {
  try {
    if (!localStorage.getItem(STORAGE_USERS_KEY)) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_TRIPS_KEY)) {
      localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(DEFAULT_TRIPS));
    }
    if (!localStorage.getItem(STORAGE_ACTIVITIES_KEY)) {
      localStorage.setItem(STORAGE_ACTIVITIES_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
    }
    if (!localStorage.getItem(STORAGE_CONNECTED_COUNT_KEY)) {
      localStorage.setItem(STORAGE_CONNECTED_COUNT_KEY, '4');
    }
  } catch (err) {
    console.error('Failed to initialize localStorage demo data:', err);
  }
};

initDefaultStorage();

// User storage helpers
const getUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

const saveUser = (newUser) => {
  const users = getUsers();
  const updated = [...users, newUser];
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
  return newUser;
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setCurrentUserSession = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(STORAGE_TOKEN_KEY, `demo-token-${user.id}`);
    localStorage.setItem('token', `demo-token-${user.id}`); // For axios interceptor in api.js
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem('token');
  }
  window.dispatchEvent(new Event('authChange'));
};

// Trips storage helpers
const getTrips = () => {
  try {
    const raw = localStorage.getItem(STORAGE_TRIPS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TRIPS;
  } catch {
    return DEFAULT_TRIPS;
  }
};

const saveTrip = (newTrip) => {
  const trips = getTrips();
  const updated = [newTrip, ...trips];
  localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(updated));
  return newTrip;
};

const deleteTrip = (tripId) => {
  const trips = getTrips();
  const updated = trips.filter((t) => t.id !== tripId);
  localStorage.setItem(STORAGE_TRIPS_KEY, JSON.stringify(updated));
  return updated;
};

// Activity log helpers
const getActivities = () => {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ACTIVITIES;
  } catch {
    return DEFAULT_ACTIVITIES;
  }
};

const logActivity = (title, destination = 'General', type = 'info') => {
  try {
    const activities = getActivities();
    const newAct = {
      id: `act-${Date.now()}`,
      title,
      destination,
      time: 'Just now',
      type,
    };
    const updated = [newAct, ...activities.slice(0, 9)];
    localStorage.setItem(STORAGE_ACTIVITIES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error logging activity:', e);
  }
};

const getConnectedCount = () => {
  try {
    const count = localStorage.getItem(STORAGE_CONNECTED_COUNT_KEY);
    return count ? parseInt(count, 10) : 4;
  } catch {
    return 4;
  }
};

const incrementConnectedCount = () => {
  const next = getConnectedCount() + 1;
  localStorage.setItem(STORAGE_CONNECTED_COUNT_KEY, next.toString());
  return next;
};

// Format currency
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/* ==========================================================================
   2. PROTECTED ROUTE WRAPPER
   ========================================================================== */

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

/* ==========================================================================
   3. POPULAR DESTINATIONS DATA
   ========================================================================== */

const POPULAR_DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Sun-kissed beaches, heritage villas & coastal flavors',
    imageUrl:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    category: 'Beaches & Nightlife',
    bestTime: 'Nov - Feb',
    staysCount: '45+ Stays',
    buddiesCount: '80+ Buddies',
  },
  {
    id: 'manali',
    name: 'Manali',
    tagline: 'Snow-capped peaks, pine valleys & Himalayan eco-cottages',
    imageUrl:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    category: 'Mountains & Treks',
    bestTime: 'Oct - Mar',
    staysCount: '32+ Stays',
    buddiesCount: '65+ Buddies',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tagline: 'Tranquil backwaters, traditional houseboats & spice feasts',
    imageUrl:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    category: 'Backwaters & Nature',
    bestTime: 'Sep - Mar',
    staysCount: '28+ Stays',
    buddiesCount: '54+ Buddies',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    tagline: 'Majestic forts, royal pink havelis & vibrant textile bazaars',
    imageUrl:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    category: 'Royal Heritage',
    bestTime: 'Oct - Mar',
    staysCount: '38+ Stays',
    buddiesCount: '72+ Buddies',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    tagline: 'The City of Pearls, Charminar history & iconic dum biryani',
    imageUrl:
      'https://images.unsplash.com/photo-1605335198086-4f40f31627ea?auto=format&fit=crop&w=800&q=80',
    category: 'Culinary & Culture',
    bestTime: 'Oct - Mar',
    staysCount: '22+ Stays',
    buddiesCount: '41+ Buddies',
  },
];

/* ==========================================================================
   4. HOMEPAGE COMPONENT (Route: `/`)
   ========================================================================== */

const HomePage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Search Bar State
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const dest = searchDestination.trim();
    if (dest) {
      logActivity(`Explored destination search for ${dest}`, dest, 'search');
      navigate(`/explore?destination=${encodeURIComponent(dest)}`);
    } else {
      navigate('/explore');
    }
  };

  const handleBuddyConnect = (buddy) => {
    incrementConnectedCount();
    logActivity(`Connected with ${buddy.name}`, buddy.destination, 'buddy');
    showNotification(`Connected with ${buddy.name}! Added to your travel circle.`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4.1 HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Background Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
            alt="Scenic travel adventure landscape"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Subtle gradient overlay to ensure strong text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/75 to-stone-900/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs md:text-sm font-semibold backdrop-blur-md shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Travel Together. Experience Culture.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto drop-shadow-sm">
            Travel Together.{' '}
            <span className="text-amber-400 underline decoration-emerald-500/80 decoration-wavy decoration-2">
              Discover More.
            </span>
          </h1>

          <p className="text-stone-200 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Connect with like-minded travelers, discover hidden destinations and experience local
            cultures with TravelCircle.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm md:text-base bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-950/30 transition-all hover:scale-102 active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
            </Link>

            <Link
              to="/buddy-matches"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm md:text-base bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-lg shadow-amber-950/20 transition-all hover:scale-102 active:scale-98"
            >
              <Users className="w-4 h-4" />
              <span>Find Travel Buddies</span>
            </Link>

            {currentUser ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm md:text-base bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm md:text-base bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            )}
          </div>

          {/* Stat Pills */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-stone-300 text-xs sm:text-sm">
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-white">5+</span>
              <span className="text-stone-400">Popular Destinations</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-white">1,200+</span>
              <span className="text-stone-400">Travel Companions</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-white">350+</span>
              <span className="text-stone-400">Local Stays & Guides</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-white">96%</span>
              <span className="text-stone-400">Compatibility Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4.2 DESTINATION SEARCH BAR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 relative z-20">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-xl border border-stone-200/80 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-3.5"
        >
          {/* Destination Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              placeholder="Where do you want to go? (e.g. Goa, Manali, Kerala, Jaipur)"
              className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 placeholder-stone-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
            />
          </div>

          {/* Travel Date */}
          <div className="w-full md:w-56 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 active:scale-95 transition-all shadow-sm shadow-emerald-950/20 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Experiences</span>
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3 px-2 text-xs text-stone-600">
          <span className="font-semibold text-stone-700">Popular Searches:</span>
          {['Goa', 'Manali', 'Kerala', 'Jaipur', 'Hyderabad'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setSearchDestination(city);
                navigate(`/explore?destination=${city}`);
              }}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* 4.3 POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Popular Destinations"
          subtitle="Discover India's most enchanting destinations handpicked for travelers, local food lovers, and adventure seekers."
          badge="Curated Picks"
          viewAllLink="/explore"
          viewAllText="Explore all destinations"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => navigate(`/explore?destination=${dest.name}`)}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-stone-800 backdrop-blur-xs shadow-xs">
                  {dest.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-900/80 text-white backdrop-blur-xs">
                  {dest.bestTime}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg group-hover:text-emerald-800 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>{dest.staysCount}</span>
                  <span className="text-emerald-800 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4.4 FIND TRAVEL BUDDIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Find Compatible Travel Partners"
          subtitle="Never travel alone unless you want to. Match with verified travelers heading to your destination with shared schedules and budgets."
          badge="Traveler Matching"
          viewAllLink="/buddy-matches"
          viewAllText="View all travel buddies"
        />

        {/* Explain matching mechanism */}
        <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Match Scoring Algorithm</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Connect with travelers based on destination dates, budget tier, travel style, and shared interests.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Verified Profiles</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                All community profiles have verified contact badges and transparent traveler biographies.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Shared Travel Costs</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Split car rentals, villa homestays, and tour guide fees while creating lifelong memories.
              </p>
            </div>
          </div>
        </div>

        {/* Buddy Cards Reusing Person 3's Reusable BuddyCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_RECOMMENDED_BUDDIES.map((buddy) => (
            <BuddyCard key={buddy.id} buddy={buddy} onConnect={handleBuddyConnect} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/buddy-matches"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold shadow-xs transition-all"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Browse More Travel Companions</span>
          </Link>
        </div>
      </section>

      {/* 4.5 EXPLORE LOCAL COMMUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Explore Local Communities"
          subtitle="TravelCircle connects you with resident hosts, authentic homestays, culinary artisans, and passionate native guides."
          badge="Community First"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Accommodations */}
          <Link
            to="/accommodation"
            className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Local Accommodations
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Stay at Portuguese villas in Goa, pine eco-cottages in Manali, or heritage havelis in Jaipur hosted by locals.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <span>View Accommodations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Food Experiences */}
          <Link
            to="/food"
            className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Food Experiences
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Taste authentic seafood thalis, Rajasthani royal feasts, and home-cooked Kerala banana leaf banquets.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <span>Explore Food Experiences</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Local Guides */}
          <Link
            to="/local-guides"
            className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-teal-800 transition-colors">
                Native Guides
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Discover hidden waterfalls, historical stories, and offbeat trails with certified local storytellers.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-800">
              <span>Meet Local Guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Travel Groups */}
          <Link
            to="/groups"
            className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-sky-800 transition-colors">
                Travel Groups
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Join active travel tribes for weekend treks, scuba expeditions, cultural walks, and bike tours.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-sky-800">
              <span>Join Travel Groups</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4.6 HOW TRAVELCIRCLE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="How TravelCircle Works"
          subtitle="Plan, match, and travel in three simple steps."
          badge="Easy & Seamless"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs relative">
            <span className="w-10 h-10 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-sm shadow-emerald-900/20">
              1
            </span>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Create your profile</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Register your account in seconds. Set your preferred travel style, budget tier, languages, and interests.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs relative">
            <span className="w-10 h-10 rounded-full bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-sm shadow-amber-900/20">
              2
            </span>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Find buddies & destinations</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Match with compatible travelers heading to the same destinations, and discover local homestays and food.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs relative">
            <span className="w-10 h-10 rounded-full bg-teal-800 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-sm shadow-teal-900/20">
              3
            </span>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Travel together & explore</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Coordinate your itinerary, split costs, support native community hosts, and share authentic travel memories.
            </p>
          </div>
        </div>
      </section>

      {/* 4.7 CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-600/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Start Your Next Adventure
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Experience Travel Like Never Before?
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Join thousands of conscious travelers discovering hidden India. Find compatible partners, support local
              hosts, and create memories that last forever.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {currentUser ? (
                <Link
                  to="/create-trip"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Plan a New Trip</span>
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account</span>
                </Link>
              )}

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Community</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ==========================================================================
   5. AUTHENTICATION MODULE (Login & Registration)
   ========================================================================== */

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const users = getUsers();
      const trimmedEmail = email.trim().toLowerCase();
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
      );

      if (foundUser) {
        setCurrentUserSession(foundUser);
        logActivity(`Signed in to TravelCircle dashboard`, 'User Session', 'auth');
        setSuccessMessage(`Welcome back, ${foundUser.name}! Redirecting to dashboard...`);

        setTimeout(() => {
          const redirectTo = location.state?.from?.pathname || '/dashboard';
          navigate(redirectTo, { replace: true });
        }, 800);
      } else {
        setErrorMessage(
          'Invalid email or password. Please verify your credentials or register a new account.'
        );
      }
    }, 400);
  };

  const handleDemoFill = () => {
    setEmail('alex.morgan@travelcircle.com');
    setPassword('password123');
    setErrors({});
    setErrorMessage(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-md p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Sign In to TravelCircle
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Access your trips, buddy connections, and saved community stays
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo Fast-Login Pill */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-amber-900 block">Demo Traveler Credentials</span>
            <span className="text-amber-700 text-[11px]">alex.morgan@travelcircle.com</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="you@example.com"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                errors.email
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700'
              }`}
            />
            {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="Enter your password"
                className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.password
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-800 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-rose-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 active:scale-98 transition-all shadow-sm shadow-emerald-950/20 cursor-pointer disabled:opacity-70"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          Don't have a TravelCircle account?{' '}
          <Link to="/register" className="font-bold text-emerald-800 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    role: 'Traveler',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const roles = ['Traveler', 'Local Host', 'Local Guide'];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.location.trim()) {
      errs.location = 'Your home location is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const existingUsers = getUsers();
      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (emailExists) {
        setErrorMessage('An account with this email address already exists. Please sign in instead.');
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        location: formData.location.trim(),
        role: formData.role,
        joinedDate: 'Just now',
      };

      saveUser(newUser);
      setCurrentUserSession(newUser);
      logActivity(`Created new ${newUser.role} account`, newUser.location, 'auth');
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 450);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-md p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Create TravelCircle Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Join conscious travelers and local communities across India
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Maya Sharma"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                errors.name ? 'border-rose-400' : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
              }`}
            />
            {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="maya@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.email ? 'border-rose-400' : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 00000"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.phone ? 'border-rose-400' : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.phone && <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                    errors.password ? 'border-rose-400' : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-600 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.confirmPassword
                    ? 'border-rose-400'
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-rose-600 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Your Location (City, State) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru, Karnataka"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                errors.location ? 'border-rose-400' : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
              }`}
            />
            {errors.location && <p className="text-rose-600 text-xs mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Select Your Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    formData.role === r
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 active:scale-98 transition-all shadow-sm shadow-emerald-950/20 cursor-pointer disabled:opacity-70 mt-2"
          >
            {submitting ? 'Creating account...' : 'Complete Registration'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-800 hover:underline">
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   6. MAIN DASHBOARD MODULE (Route: `/dashboard`)
   ========================================================================== */

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser() || DEFAULT_USERS[0];

  const [trips, setTrips] = useState(getTrips);
  const [activities, setActivities] = useState(getActivities);
  const [connectedCount, setConnectedCount] = useState(getConnectedCount);
  const [filterTab, setFilterTab] = useState('all'); // all, upcoming, completed

  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Re-read trips from localStorage when navigating back
  useEffect(() => {
    setTrips(getTrips());
    setActivities(getActivities());
    setConnectedCount(getConnectedCount());
  }, []);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    if (filterTab === 'upcoming') {
      return trips.filter((t) => t.status === 'Upcoming');
    }
    if (filterTab === 'completed') {
      return trips.filter((t) => t.status === 'Completed');
    }
    return trips;
  }, [trips, filterTab]);

  const upcomingTrips = useMemo(() => trips.filter((t) => t.status === 'Upcoming'), [trips]);
  const completedTrips = useMemo(() => trips.filter((t) => t.status === 'Completed'), [trips]);

  const handleDeleteTrip = (id) => {
    const updated = deleteTrip(id);
    setTrips(updated);
    logActivity(`Deleted trip plan`, 'Dashboard', 'delete');
    setActivities(getActivities());
    setDeleteConfirmationId(null);
    showToast('Trip removed successfully.');
  };

  const handleConnectBuddy = (buddy) => {
    const nextCount = incrementConnectedCount();
    setConnectedCount(nextCount);
    logActivity(`Connected with ${buddy.name}`, buddy.destination, 'buddy');
    setActivities(getActivities());
    showToast(`Connected with ${buddy.name}! Added to your travel circle.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 6.1 WELCOME SECTION */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-950">
              {user.role || 'Traveler'}
            </span>
            <span className="text-xs text-stone-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {user.location || 'India'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}!
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Ready to plan your next journey? Connect with travel partners, explore authentic local
            stays, or organize a new group itinerary.
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Trip</span>
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </Link>
        </div>
      </div>

      {/* 6.2 DASHBOARD SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 block leading-none">{trips.length}</span>
            <span className="text-xs text-stone-500 font-medium">Total Trips</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 block leading-none">
              {upcomingTrips.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">Upcoming Trips</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 block leading-none">
              {completedTrips.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">Completed Trips</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-stone-900 block leading-none">{connectedCount}</span>
            <span className="text-xs text-stone-500 font-medium">Connected Travelers</span>
          </div>
        </div>
      </div>

      {/* 6.3 QUICK ACTIONS BAR */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider pl-2">
          Quick Actions
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Trip</span>
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Destinations</span>
          </Link>
          <Link
            to="/buddy-matches"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Find Travel Buddies</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('my-trips-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>View My Trips</span>
          </button>
        </div>
      </div>

      {/* 6.4 MY TRIPS & UPCOMING TRIPS SECTION */}
      <div id="my-trips-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              My Travel Plans
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Manage your created trips, check dates, and invite travel companions
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({trips.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'upcoming'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Upcoming ({upcomingTrips.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'completed'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Completed ({completedTrips.length})
            </button>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <EmptyState
            title="No trips found in this category"
            description="You don't have any trips listed here. Create a new trip plan to get started!"
            icon={Compass}
            actionLabel="Create a New Trip"
            onAction={() => navigate('/create-trip')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        trip.status === 'Completed'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {trip.status}
                    </span>

                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      {formatINR(trip.budget)}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base md:text-lg group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {trip.title}
                  </h3>

                  <div className="mt-2 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                      <span className="font-medium text-stone-800">
                        {trip.startingLocation} → {trip.destination}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span>
                        {trip.departureDate} to {trip.returnDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span>{trip.travelers} Traveler(s)</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {trip.travelStyle && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {trip.travelStyle}
                      </span>
                    )}
                    {trip.interests?.slice(0, 2).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800"
                      >
                        #{item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedTripDetails(trip)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmationId(trip.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6.5 SUGGESTED DESTINATIONS */}
      <div className="space-y-4">
        <SectionHeading
          title="Suggested Destinations for You"
          subtitle="Explore trending hubs with verified local guides and homestays."
          badge="Recommendations"
          viewAllLink="/explore"
          viewAllText="Explore all"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_DESTINATIONS.slice(0, 4).map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigate(`/explore?destination=${dest.name}`)}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="h-36 relative overflow-hidden">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800">
                  {dest.category}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {dest.name}
                </h4>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">{dest.tagline}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                  <span>Explore Stays & Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6.6 TRAVEL BUDDY RECOMMENDATIONS (REUSING PERSON 3'S BUDDYCARD) */}
      <div className="space-y-4">
        <SectionHeading
          title="Recommended Travel Companions"
          subtitle="Fellow explorers with compatible schedules and matching interests."
          badge="Community Matches"
          viewAllLink="/buddy-matches"
          viewAllText="View all buddies"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_RECOMMENDED_BUDDIES.map((buddy) => (
            <BuddyCard key={buddy.id} buddy={buddy} onConnect={handleConnectBuddy} />
          ))}
        </div>
      </div>

      {/* 6.7 RECENT DEMO ACTIVITY */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Recent Platform Activity</h3>
            <p className="text-xs text-stone-500">Live logs from your TravelCircle actions</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            Live Feed
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {activities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                  {act.type === 'trip' ? (
                    <Compass className="w-4 h-4" />
                  ) : act.type === 'buddy' ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <span className="font-semibold text-stone-800 block">{act.title}</span>
                  <span className="text-[11px] text-stone-500">{act.destination}</span>
                </div>
              </div>
              <span className="text-stone-600 font-medium text-[11px] flex-shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6.8 TRIP DETAILS MODAL */}
      {selectedTripDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedTripDetails(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {selectedTripDetails.status}
              </span>
              <h2 className="text-xl font-black text-stone-900 mt-2">
                {selectedTripDetails.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl text-xs">
              <div>
                <span className="text-stone-500 block">From:</span>
                <span className="font-bold text-stone-800">{selectedTripDetails.startingLocation}</span>
              </div>
              <div>
                <span className="text-stone-500 block">To Destination:</span>
                <span className="font-bold text-emerald-800">{selectedTripDetails.destination}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Departure Date:</span>
                <span className="font-semibold text-stone-800">{selectedTripDetails.departureDate}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Return Date:</span>
                <span className="font-semibold text-stone-800">{selectedTripDetails.returnDate}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Budget (INR):</span>
                <span className="font-bold text-amber-700">{formatINR(selectedTripDetails.budget)}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Travelers:</span>
                <span className="font-semibold text-stone-800">
                  {selectedTripDetails.travelers} person(s)
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase mb-1">Trip Description</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl">
                {selectedTripDetails.description || 'No detailed itinerary provided.'}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-stone-700 mr-2">Travel Style:</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-800 font-medium">
                  {selectedTripDetails.travelStyle}
                </span>
              </div>

              <div>
                <span className="font-semibold text-stone-700 mr-2">Interests:</span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {selectedTripDetails.interests?.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium text-[11px]"
                    >
                      #{item}
                    </span>
                  ))}
                </div>
              </div>

              {selectedTripDetails.languages && (
                <div>
                  <span className="font-semibold text-stone-700 mr-2">Preferred Languages:</span>
                  <span className="text-stone-800">{selectedTripDetails.languages}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTripDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6.9 DELETE CONFIRMATION MODAL */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">Delete This Trip?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete this trip plan? This demo action will remove it from your
              active list.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTrip(deleteConfirmationId)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   7. TRIP CREATION MODULE (Route: `/create-trip`)
   ========================================================================== */

const CreateTripPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser() || DEFAULT_USERS[0];

  const TRAVEL_STYLES = [
    'Backpacking',
    'Adventure',
    'Relaxation',
    'Cultural exploration',
    'Solo travel',
    'Budget travel',
    'Luxury travel',
  ];

  const TRAVEL_INTERESTS = [
    'Adventure',
    'Food',
    'Photography',
    'Nature',
    'History',
    'Beaches',
    'Trekking',
    'Shopping',
  ];

  const [formData, setFormData] = useState({
    title: '',
    startingLocation: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    budget: '',
    travelers: 1,
    travelStyle: 'Backpacking',
    interests: ['Adventure', 'Nature'],
    languages: 'English, Hindi',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Trip title is required.';
    if (!formData.startingLocation.trim()) errs.startingLocation = 'Starting location is required.';
    if (!formData.destination.trim()) errs.destination = 'Destination is required.';

    if (!formData.departureDate) {
      errs.departureDate = 'Departure date is required.';
    }

    if (!formData.returnDate) {
      errs.returnDate = 'Return date is required.';
    } else if (formData.departureDate && formData.returnDate < formData.departureDate) {
      errs.returnDate = 'Return date cannot be earlier than departure date.';
    }

    const numBudget = Number(formData.budget);
    if (!formData.budget || isNaN(numBudget) || numBudget <= 0) {
      errs.budget = 'Please provide a valid estimated budget greater than zero.';
    }

    const numTravelers = Number(formData.travelers);
    if (!formData.travelers || isNaN(numTravelers) || numTravelers < 1) {
      errs.travelers = 'Number of travelers must be at least 1.';
    }

    if (!formData.travelStyle) {
      errs.travelStyle = 'Please select a travel style.';
    }

    if (formData.interests.length === 0) {
      errs.interests = 'Please select at least one travel interest.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      const newTrip = {
        id: `trip-${Date.now()}`,
        userId: user.id,
        title: formData.title.trim(),
        startingLocation: formData.startingLocation.trim(),
        destination: formData.destination.trim(),
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        budget: Number(formData.budget),
        travelers: Number(formData.travelers),
        travelStyle: formData.travelStyle,
        interests: formData.interests,
        languages: formData.languages.trim() || 'English',
        description: formData.description.trim(),
        status: 'Upcoming',
        createdAt: new Date().toISOString(),
      };

      saveTrip(newTrip);
      logActivity(
        `Created trip: ${newTrip.title} to ${newTrip.destination}`,
        newTrip.destination,
        'trip'
      );
      setSuccessMessage('Trip created successfully! Redirecting to your dashboard...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    }, 450);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Plan Your Next Journey
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Create a New Trip
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Fill in your trip details to find companions, estimate expenses, and discover local
            experiences.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              1. Trip Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Winter Backpacking & Scuba in South Goa"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                errors.title ? 'border-rose-400' : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
              }`}
            />
            {errors.title && <p className="text-rose-600 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Starting Location & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                2. Starting Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="startingLocation"
                value={formData.startingLocation}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Maharashtra"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.startingLocation
                    ? 'border-rose-400'
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.startingLocation && (
                <p className="text-rose-600 text-xs mt-1">{errors.startingLocation}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                3. Destination <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Goa, Manali, Kerala, Jaipur"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.destination
                    ? 'border-rose-400'
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.destination && (
                <p className="text-rose-600 text-xs mt-1">{errors.destination}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                4. Departure Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.departureDate
                    ? 'border-rose-400'
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.departureDate && (
                <p className="text-rose-600 text-xs mt-1">{errors.departureDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                5. Return Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.returnDate
                    ? 'border-rose-400'
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.returnDate && (
                <p className="text-rose-600 text-xs mt-1">{errors.returnDate}</p>
              )}
            </div>
          </div>

          {/* Budget & Number of Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                6. Estimated Budget (INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500 font-semibold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. 15000"
                  min="1"
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                    errors.budget ? 'border-rose-400' : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                  }`}
                />
              </div>
              {errors.budget && <p className="text-rose-600 text-xs mt-1">{errors.budget}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                7. Number of Travelers <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                min="1"
                max="30"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-stone-50 focus:bg-white focus:outline-hidden transition-all ${
                  errors.travelers
                    ? 'border-rose-400'
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              {errors.travelers && <p className="text-rose-600 text-xs mt-1">{errors.travelers}</p>}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              8. Travel Style <span className="text-rose-500">*</span>
            </label>
            <select
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            >
              {TRAVEL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Interests (Multi-select Pills) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              9. Travel Interests <span className="text-rose-500">*</span>{' '}
              <span className="font-normal text-stone-500">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_INTERESTS.map((interest) => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
            {errors.interests && <p className="text-rose-600 text-xs mt-1">{errors.interests}</p>}
          </div>

          {/* Preferred Languages */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              10. Preferred Languages
            </label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="e.g. English, Hindi, Konkani"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Trip Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              11. Trip Description & Itinerary Notes
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your planned route, must-see spots, activities, or what kind of buddies you're hoping to meet..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-70"
            >
              {submitting ? 'Saving trip...' : 'Save & Publish Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==========================================================================
   8. BUDDY MATCHES PAGE (Reusing Person 3's Reusable BuddyCard)
   ========================================================================== */

const BuddyMatchesPage = () => {
  const [buddies] = useState(MOCK_RECOMMENDED_BUDDIES);
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [notification, setNotification] = useState(null);

  const handleConnect = (buddy) => {
    incrementConnectedCount();
    logActivity(`Connected with traveler ${buddy.name}`, buddy.destination, 'buddy');
    setNotification(`Connected with ${buddy.name}! Added to your travel companion network.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredBuddies = useMemo(() => {
    if (selectedDestination === 'All') return buddies;
    return buddies.filter(
      (b) => b.destination.toLowerCase() === selectedDestination.toLowerCase()
    );
  }, [buddies, selectedDestination]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      <SectionHeading
        title="Find Your Travel Buddy"
        subtitle="Connect with verified travelers sharing similar destinations, dates, and adventure styles."
        badge="Community Matching"
      />

      {/* Filter by destination */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-stone-700">Filter Destination:</span>
        {['All', 'Goa', 'Manali', 'Kerala', 'Jaipur'].map((dest) => (
          <button
            key={dest}
            type="button"
            onClick={() => setSelectedDestination(dest)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDestination === dest
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {dest}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBuddies.map((buddy) => (
          <BuddyCard key={buddy.id} buddy={buddy} onConnect={handleConnect} />
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   9. MAIN APP ROUTER INTEGRATION
   ========================================================================== */

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Person 2 Main Frontend Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-trip"
          element={
            <ProtectedRoute>
              <CreateTripPage />
            </ProtectedRoute>
          }
        />

        {/* Person 3 Community & Explore Routes (100% Preserved) */}
        <Route path="explore" element={<Explore />} />
        <Route path="accommodation" element={<Accommodation />} />
        <Route path="food" element={<FoodExperiences />} />
        <Route path="local-guides" element={<LocalGuides />} />
        <Route path="groups" element={<TravelGroups />} />
        <Route path="buddy-matches" element={<BuddyMatchesPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
