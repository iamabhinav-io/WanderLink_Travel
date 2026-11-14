import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Utensils,
  ChefHat,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';

import communityService from '../../services/communityService';
import FoodCard from '../../components/community/FoodCard';
import SectionHeading from '../../components/community/SectionHeading';
import EmptyState from '../../components/community/EmptyState';
import InquiryModal from '../../components/community/InquiryModal';

const DESTINATIONS = ['All', 'Goa', 'Manali', 'Kerala', 'Jaipur'];
const DIETARY_OPTIONS = ['All Diets', 'Veg', 'Non-Veg', 'Traditional'];

const FoodExperiences = () => {
  const [foodListings, setFoodListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('All Diets');
  const [sortBy, setSortBy] = useState('recommended');

  // Booking modal state
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFoodListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communityService.getFoodListings({
        destination: selectedDestination,
      });
      setFoodListings(data);
    } catch (err) {
      console.error('Failed to load food listings:', err);
      setError('Could not load food listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodListings();
  }, [selectedDestination]);

  // Filtered and sorted listings
  const filteredListings = useMemo(() => {
    let result = [...foodListings];

    // Search term filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.cuisine.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.providerName?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    // Dietary filter
    if (selectedDiet !== 'All Diets') {
      result = result.filter((item) =>
        item.dietaryType.toLowerCase().includes(selectedDiet.toLowerCase())
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
  }, [foodListings, searchTerm, selectedDiet, sortBy]);

  const handleOpenBooking = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-800/70 text-amber-200 border border-amber-700/60 mb-3 tracking-wide uppercase">
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              WanderLink Home Cooked Dining
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Taste Culture Through Family Kitchens
            </h1>
            <p className="text-amber-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
              Dine inside local homes. Experience fiery Goan prawn curries, Pahadi Siddu in Manali, 24-dish Kerala banana-leaf Sadya, and royal Rajasthani Dal Baati Churma.
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
                placeholder="Search cuisine, dish, chef, or city (e.g. Seafood, Sadya)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-900 placeholder-stone-600"
              />
            </div>

            {/* Dietary Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-stone-800 bg-white"
              >
                {DIETARY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
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
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="md:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={fetchFoodListings}
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
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
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
              onClick={fetchFoodListings}
              className="text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">
            Available Homemade Food Experiences ({filteredListings.length})
          </h2>
          <span className="text-xs text-stone-600">
            Backend: <code className="bg-stone-100 px-2 py-0.5 rounded text-emerald-800 font-mono">GET /api/food</code>
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
            title="No food experiences found"
            description="Try switching cuisines, destinations, or resetting your dietary filters."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedDestination('All');
              setSelectedDiet('All Diets');
              setSortBy('recommended');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onRequest={handleOpenBooking}
              />
            ))}
          </div>
        )}
      </main>

      {/* Booking / Contact Provider Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedFood}
        type="food"
      />
    </div>
  );
};

export default FoodExperiences;
