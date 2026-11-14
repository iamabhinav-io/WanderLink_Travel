import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Users,
  Calendar,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Check,
  UserPlus,
} from 'lucide-react';

import communityService from '../../services/communityService';
import GroupCard from '../../components/community/GroupCard';
import SectionHeading from '../../components/community/SectionHeading';
import EmptyState from '../../components/community/EmptyState';

const DESTINATIONS = ['All', 'Goa', 'Manali', 'Kerala', 'Jaipur'];
const CATEGORIES = ['All Tribes', 'Beach & Adventure', 'High Altitude Trekking', 'Wellness & Culture', 'Heritage & Road Trips', 'Solo Community'];

const TravelGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All Tribes');

  // Feedback toast
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getTravelGroups({
        destination: selectedDestination,
      });
      setGroups(data);
    } catch (err) {
      console.error('Failed to load travel groups:', err);
      setError('Could not load travel groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [selectedDestination]);

  // Join group handler
  const handleJoinGroup = async (group) => {
    if (group.isJoined) {
      showFeedback(`You are already a member of ${group.name}`, 'info');
      return;
    }

    try {
      const result = await communityService.joinTravelGroup(group.id);

      // Optimistically update group list state
      setGroups((prevGroups) =>
        prevGroups.map((g) => {
          if (g.id === group.id) {
            return {
              ...g,
              isJoined: true,
              memberCount: (g.memberCount || 0) + 1,
            };
          }
          return g;
        })
      );

      showFeedback(result.message || `Successfully joined ${group.name}!`, 'success');
    } catch (err) {
      console.error('Join group error:', err);
      showFeedback('Unable to join group right now. Please try again.', 'error');
    }
  };

  // Filtered groups
  const filteredGroups = useMemo(() => {
    let result = [...groups];

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (grp) =>
          grp.name.toLowerCase().includes(q) ||
          grp.destination.toLowerCase().includes(q) ||
          grp.description.toLowerCase().includes(q) ||
          grp.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All Tribes') {
      result = result.filter((grp) =>
        grp.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return result;
  }, [groups, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 text-sm ${
            feedback.type === 'error'
              ? 'bg-rose-900 border border-rose-700'
              : 'bg-emerald-900 border border-emerald-700'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Top Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 mb-3 tracking-wide uppercase">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              WanderLink Travel Tribes
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Find Your Tribe, Travel Together
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
              Never travel alone unless you choose to. Connect with verified groups of solo travelers organizing upcoming road trips, beach treks, and Himalayan expeditions.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200/80 p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-emerald-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search group name, destination, trip style (e.g. Goa Coastal, Backpackers)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-900 placeholder-stone-600"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-800 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <div className="md:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={fetchGroups}
                title="Refresh listings"
                className="p-2.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Destination Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-600 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" /> Destination:
            </span>
            {DESTINATIONS.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => setSelectedDestination(dest)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedDestination === dest
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {dest === 'All' ? 'All Destinations' : dest}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Listings */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center justify-between mb-8 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={fetchGroups}
              className="text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">
            Active Travel Tribes ({filteredGroups.length})
          </h2>
          <span className="text-xs text-stone-600">
            Endpoints: <code className="bg-stone-100 px-2 py-0.5 rounded text-emerald-800 font-mono">GET /api/groups</code> & <code className="bg-stone-100 px-2 py-0.5 rounded text-emerald-800 font-mono">POST /api/groups/&#123;id&#125;/join</code>
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-88 border border-stone-200" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            title="No travel tribes found"
            description="Try searching for a different destination or reset your tribe categories."
            actionLabel="Reset Search & Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedDestination('All');
              setSelectedCategory('All Tribes');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
                isJoined={group.isJoined}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TravelGroups;
