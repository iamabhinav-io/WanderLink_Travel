import React from 'react';
import { MapPin, Star, Utensils, ChefHat, Clock } from 'lucide-react';

/**
 * Reusable Food Experience Card
 * Created by Person 3 (Community & Explore Developer)
 *
 * @param {Object} food - Food listing object
 * @param {Function} onRequest - Callback when clicking "Contact Provider" / "Book Meal"
 */
const FoodCard = ({ food, onRequest }) => {
  if (!food) return null;

  const {
    id,
    title = 'Homemade Specialty',
    name = title,
    cuisine = 'Local Traditional',
    providerName = 'Local Cook',
    location = 'India',
    price = 450,
    rating = 4.9,
    reviewsCount = 32,
    dietaryType = 'Veg',
    mealType = 'Meal Experience',
    description = 'Handcrafted traditional meal cooked with authentic family recipes and warm hospitality.',
    imageUrl = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    includes = [],
    verified = true,
  } = food;

  const handleRequestClick = (e) => {
    e.stopPropagation();
    if (onRequest) {
      onRequest(food);
    }
  };

  const isVeg = dietaryType.toLowerCase().includes('veg') && !dietaryType.toLowerCase().includes('non');

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={imageUrl}
            alt={name || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Cuisine Pill */}
          <div className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>{cuisine}</span>
          </div>

          {/* Dietary Indicator */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
            <span className={isVeg ? 'text-emerald-800' : 'text-rose-800'}>
              {dietaryType}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Location & Meal Type */}
          <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
            <div className="flex items-center gap-1 font-medium text-emerald-800">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[150px]">{location}</span>
            </div>
            {mealType && (
              <span className="flex items-center gap-1 text-stone-600">
                <Clock className="w-3 h-3 text-stone-500" />
                {mealType}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-base md:text-lg leading-snug group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1.5">
            {name || title}
          </h3>

          {/* Provider / Chef */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-3">
            <ChefHat className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Prepared by <strong className="font-semibold text-stone-800">{providerName}</strong></span>
          </div>

          {/* Description */}
          <p className="text-stone-600 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>

          {/* Includes / Tags */}
          {includes && includes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {includes.slice(0, 2).map((item, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200/50 px-2 py-0.5 rounded-md font-medium"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg md:text-xl font-bold text-stone-900">
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-600">/ person</span>
          </div>
          {rating && (
            <div className="flex items-center gap-1 text-xs text-stone-600">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-stone-800">{rating.toFixed(1)}</span>
              {reviewsCount && <span>({reviewsCount} reviews)</span>}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleRequestClick}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 transition-all shadow-sm shadow-emerald-900/10 flex-shrink-0"
        >
          Contact Provider
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
