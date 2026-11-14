import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Award,
  Languages,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

import communityService from '../../services/communityService';
import GuideCard from '../../components/community/GuideCard';
import SectionHeading from '../../components/community/SectionHeading';
import EmptyState from '../../components/community/EmptyState';
import InquiryModal from '../../components/community/InquiryModal';

const DESTINATIONS = ['All', 'Goa', 'Manali', 'Kerala', 'Jaipur'];

const LocalGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  // Contact modal state
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGuides = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getLocalGuides({
        destination: selectedDestination,
      });
      setGuides(data);
    } catch (err) {
      console.error('Failed to load local guides:', err);
      setError('Could not load guides. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [selectedDestination]);

  // Filtered and sorted guides
  const filteredGuides = useMemo(() => {
    let result = [...guides];

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (guide) =>
          guide.name.toLowerCase().includes(q) ||
          guide.location.toLowerCase().includes(q) ||
          guide.languages.some((l) => l.toLowerCase().includes(q)) ||
          guide.specialties?.some((s) => s.toLowerCase().includes(q)) ||
          guide.bio?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [guides, searchTerm, sortBy]);

  const handleOpenContact = (guide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 tracking-wide uppercase">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                WanderLink Certified Insiders
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30">
                Mock Data with API Ready Contract
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Explore Deeper With Verified Local Guides
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
              Don’t just visit monuments — understand their soul. Connect with licensed historians in Jaipur, mountaineers in Manali, spice masters in Kochi, and Latin Quarter storytellers in Goa.
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
                placeholder="Search guide name, language, expertise (e.g. Portuguese, Trekking, Amer)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-900 placeholder-stone-600"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-800 bg-white"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="md:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={fetchGuides}
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
              onClick={fetchGuides}
              className="text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">
            Verified Community Guides ({filteredGuides.length})
          </h2>
          <span className="text-xs text-stone-600">
            Contract Status: <span className="font-semibold text-emerald-800">Mock Data / Ready for Person 1 /api/guides</span>
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-88 border border-stone-200" />
            ))}
          </div>
        ) : filteredGuides.length === 0 ? (
          <EmptyState
            title="No guides match your search"
            description="Try adjusting your destination or searching for different languages and specialties."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchTerm('');
              setSelectedDestination('All');
              setSortBy('recommended');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onContact={handleOpenContact}
              />
            ))}
          </div>
        )}
      </main>

      {/* Contact Guide Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedGuide}
        type="guide"
      />
    </div>
  );
};

export default LocalGuides;
