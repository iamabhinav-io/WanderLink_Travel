import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Compass,
  Home,
  Utensils,
  Award,
  Users,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Filter,
} from 'lucide-react';

import communityService from '../../services/communityService';
import BuddyCard from '../../components/community/BuddyCard';
import AccommodationCard from '../../components/community/AccommodationCard';
import FoodCard from '../../components/community/FoodCard';
import GuideCard from '../../components/community/GuideCard';
import GroupCard from '../../components/community/GroupCard';
import SectionHeading from '../../components/community/SectionHeading';
import EmptyState from '../../components/community/EmptyState';
import InquiryModal from '../../components/community/InquiryModal';

const DESTINATIONS = ['All', 'Goa', 'Manali', 'Kerala', 'Jaipur'];

const CATEGORIES = [
  { id: 'all', label: 'All Community' },
  { id: 'buddies', label: 'Travel Buddies', icon: Sparkles },
  { id: 'stays', label: 'Accommodations', icon: Home },
  { id: 'food', label: 'Food Experiences', icon: Utensils },
  { id: 'guides', label: 'Local Guides', icon: Award },
  { id: 'groups', label: 'Travel Tribes', icon: Users },
];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [activeCategory, setActiveCategory] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [buddies, setBuddies] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [foodExperiences, setFoodExperiences] = useState([]);
  const [guides, setGuides] = useState([]);
  const [groups, setGroups] = useState([]);

  // Modal states for interactive contact buttons
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    item: null,
    type: 'accommodation',
  });

  // Success toast for connect actions
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [buddiesData, staysData, foodData, guidesData, groupsData] = await Promise.all([
        communityService.getRecommendedBuddies({ destination: selectedDestination }),
        communityService.getAccommodations({ destination: selectedDestination }),
        communityService.getFoodListings({ destination: selectedDestination }),
        communityService.getLocalGuides({ destination: selectedDestination }),
        communityService.getTravelGroups({ destination: selectedDestination }),
      ]);

      setBuddies(buddiesData);
      setAccommodations(staysData);
      setFoodExperiences(foodData);
      setGuides(guidesData);
      setGroups(groupsData);
    } catch (err) {
      console.error('Error fetching explore data:', err);
      setError('Unable to load some community listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [selectedDestination]);

  // Client-side search filters across listings
  const filteredBuddies = useMemo(() => {
    return buddies.filter((b) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        b.interests.some((i) => i.toLowerCase().includes(q));
      return matchSearch;
    });
  }, [buddies, searchTerm]);

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((a) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      return matchSearch;
    });
  }, [accommodations, searchTerm]);

  const filteredFood = useMemo(() => {
    return foodExperiences.filter((f) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.cuisine.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q);
      return matchSearch;
    });
  }, [foodExperiences, searchTerm]);

  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q) ||
        g.languages.some((l) => l.toLowerCase().includes(q));
      return matchSearch;
    });
  }, [guides, searchTerm]);

  const filteredGroups = useMemo(() => {
    return groups.filter((grp) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        grp.name.toLowerCase().includes(q) ||
        grp.destination.toLowerCase().includes(q) ||
        grp.description.toLowerCase().includes(q);
      return matchSearch;
    });
  }, [groups, searchTerm]);

  // Action handlers
  const handleConnectBuddy = (buddy) => {
    showToast(`Connection request sent to ${buddy.name}! You can chat once they accept.`);
  };

  const handleRequestStay = (stay) => {
    setModalConfig({ isOpen: true, item: stay, type: 'accommodation' });
  };

  const handleRequestFood = (food) => {
    setModalConfig({ isOpen: true, item: food, type: 'food' });
  };

  const handleContactGuide = (guide) => {
    setModalConfig({ isOpen: true, item: guide, type: 'guide' });
  };

  const handleJoinGroup = async (group) => {
    const res = await communityService.joinTravelGroup(group.id);
    showToast(`Joined ${group.name}! Welcome to the tribe.`);
  };

  const hasAnyResults =
    filteredBuddies.length > 0 ||
    filteredAccommodations.length > 0 ||
    filteredFood.length > 0 ||
    filteredGuides.length > 0 ||
    filteredGroups.length > 0;

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 text-sm">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section & Search Header */}
      <section className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-100 border border-emerald-600/50 mb-3 tracking-wide uppercase">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              WanderLink Community Discovery
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Explore India With Fellow Wanderers
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
              Every Journey Starts With a Connection. Find compatible buddies, authentic homestays, home-cooked food, and local guides.
            </p>
          </div>

          {/* Destination Search Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl border border-white/20 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-3 py-2 text-stone-800">
              <Search className="w-5 h-5 text-emerald-700 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search destination, cuisine, stay, or interest (e.g. Goa, Sadya, Trekking)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm md:text-base focus:outline-hidden text-stone-900 placeholder-stone-600"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-stone-600 hover:text-stone-700 px-1 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-stone-200 pt-2 sm:pt-0 sm:pl-2">
              <button
                type="button"
                onClick={loadAllData}
                title="Refresh listings"
                className="p-2.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Destination Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs text-emerald-200/80 font-medium mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Popular:
            </span>
            {DESTINATIONS.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => setSelectedDestination(dest)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  selectedDestination === dest
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700/80 border border-emerald-700/60'
                }`}
              >
                {dest === 'All' ? 'All India' : dest}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation Category Jump Bar */}
      <section className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100/80 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Error Notice */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center justify-between mb-8 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={loadAllData}
              className="text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-12 animate-pulse">
            <div className="h-8 bg-stone-200 rounded-lg w-64 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 border border-stone-200" />
              ))}
            </div>
          </div>
        ) : !hasAnyResults ? (
          <EmptyState
            title="No WanderLink matches found"
            description={`We couldn't find any community listings for "${searchTerm || selectedDestination}". Try a different keyword or reset filters.`}
            actionLabel="Reset Destination & Search"
            onAction={() => {
              setSearchTerm('');
              setSelectedDestination('All');
              setActiveCategory('all');
            }}
          />
        ) : (
          <div className="space-y-16">
            {/* 1. RECOMMENDED TRAVEL BUDDIES */}
            {(activeCategory === 'all' || activeCategory === 'buddies') && filteredBuddies.length > 0 && (
              <section id="buddies">
                <SectionHeading
                  title="Recommended Travel Buddies"
                  subtitle="Meet verified solo travelers heading to the same destination with compatible vibes."
                  badge="Buddy Matching"
                  viewAllLink="/buddy-matches"
                  viewAllText="Find more buddies"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredBuddies.map((buddy) => (
                    <BuddyCard
                      key={buddy.id}
                      buddy={buddy}
                      onConnect={handleConnectBuddy}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. LOCAL ACCOMMODATION */}
            {(activeCategory === 'all' || activeCategory === 'stays') && filteredAccommodations.length > 0 && (
              <section id="accommodations">
                <SectionHeading
                  title="Local Accommodations & Homestays"
                  subtitle="Stay with verified local families, heritage havelis, and eco-cottages."
                  badge="Community Stays"
                  viewAllLink="/accommodation"
                  viewAllText="Explore all stays"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAccommodations.slice(0, 3).map((stay) => (
                    <AccommodationCard
                      key={stay.id}
                      stay={stay}
                      onRequest={handleRequestStay}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. LOCAL FOOD EXPERIENCES */}
            {(activeCategory === 'all' || activeCategory === 'food') && filteredFood.length > 0 && (
              <section id="food">
                <SectionHeading
                  title="Authentic Homemade Food Experiences"
                  subtitle="Taste home-cooked Goan curries, Himachali Dham, Kerala Sadya, and royal Rajasthani thalis."
                  badge="Home Chefs"
                  viewAllLink="/food"
                  viewAllText="Explore food experiences"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFood.slice(0, 3).map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      onRequest={handleRequestFood}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 4. LOCAL GUIDES */}
            {(activeCategory === 'all' || activeCategory === 'guides') && filteredGuides.length > 0 && (
              <section id="guides">
                <SectionHeading
                  title="Passionate Local Guides"
                  subtitle="Discover offbeat trails, secret heritage monuments, and untold stories with licensed local insiders."
                  badge="Local Experts"
                  viewAllLink="/local-guides"
                  viewAllText="View all guides"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredGuides.map((guide) => (
                    <GuideCard
                      key={guide.id}
                      guide={guide}
                      onContact={handleContactGuide}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 5. POPULAR TRAVEL GROUPS */}
            {(activeCategory === 'all' || activeCategory === 'groups') && filteredGroups.length > 0 && (
              <section id="groups">
                <SectionHeading
                  title="Popular Travel Tribes & Groups"
                  subtitle="Join curated solo groups for upcoming road trips, beach treks, and mountain expeditions."
                  badge="Travel Tribes"
                  viewAllLink="/groups"
                  viewAllText="Explore all groups"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleJoinGroup}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Interactive Inquiry Modal */}
      <InquiryModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false, item: null })}
        item={modalConfig.item}
        type={modalConfig.type}
      />
    </div>
  );
};

export default Explore;
