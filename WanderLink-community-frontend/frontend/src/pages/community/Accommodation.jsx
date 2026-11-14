import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Home,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';

import communityService from '../../services/communityService';
import AccommodationCard from '../../components/community/AccommodationCard';
import SectionHeading from '../../components/community/SectionHeading';
import EmptyState from '../../components/community/EmptyState';
import InquiryModal from '../../components/community/InquiryModal';

const DESTINATIONS = ['All', 'Goa', 'Manali', 'Kerala', 'Jaipur'];
const PROPERTY_TYPES = ['All Types', 'Homestay', 'Heritage Villa', 'Eco Cottage', 'Heritage Haveli', 'Hostel'];

const Accommodation = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('recommended');

  // Inquiry modal state
  const [selectedStay, setSelectedStay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAccommodations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getAccommodations({
        destination: selectedDestination,
      });
      setAccommodations(data);
    } catch (err) {
      console.error('Failed to load accommodations:', err);
      setError('Could not load accommodations. Please check your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, [selectedDestination]);

  // Filtered & sorted accommodations
  const filteredListings = useMemo(() => {
    let result = [...accommodations];

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.hostName?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    // Property type filter
    if (selectedType !== 'All Types') {
      result = result.filter((item) =>
        item.type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.pricePerNight || a.price) - (b.pricePerNight || b.price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.pricePerNight || b.price) - (a.pricePerNight || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [accommodations, searchTerm, selectedType, sortBy]);

  const handleOpenInquiry = (stay) => {
    setSelectedStay(stay);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 mb-3 tracking-wide uppercase">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              WanderLink Stays & Homestays
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Stay With Locals, Live Like Locals
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
              Skip sterile hotel rooms. Wake up to fresh filter coffee in Kerala, apple orchards in Manali, historic havelis in Jaipur, and Portuguese villas in Goa.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200/80 p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-emerald-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by stay name, location, or host..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-900 placeholder-stone-600"
              />
            </div>

            {/* Property Type Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-800 bg-white"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
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
                onClick={fetchAccommodations}
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
              onClick={fetchAccommodations}
              className="text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">
            Available Community Stays ({filteredListings.length})
          </h2>
          <span className="text-xs text-stone-600">
            Backend: <code className="bg-stone-100 px-2 py-0.5 rounded text-emerald-800 font-mono">GET /api/accommodations</code>
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-88 border border-stone-200" />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <EmptyState
            title="No stays match your criteria"
            description="Try changing your destination or resetting your property type filters."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedDestination('All');
              setSelectedType('All Types');
              setSortBy('recommended');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((stay) => (
              <AccommodationCard
                key={stay.id}
                stay={stay}
                onRequest={handleOpenInquiry}
              />
            ))}
          </div>
        )}
      </main>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedStay}
        type="accommodation"
      />
    </div>
  );
};

export default Accommodation;
