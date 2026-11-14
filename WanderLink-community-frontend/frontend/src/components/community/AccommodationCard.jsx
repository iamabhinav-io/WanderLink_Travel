import React from 'react';
import { MapPin, Star, ShieldCheck, Home } from 'lucide-react';

/**
 * Reusable Accommodation Card
 * Created by Person 3 (Community & Explore Developer)
 *
 * @param {Object} stay - Accommodation object
 * @param {Function} onRequest - Callback when clicking "Contact Host" / "Request Stay"
 */
const AccommodationCard = ({ stay, onRequest }) => {
  if (!stay) return null;

  const {
    id,
    title = 'Cozy Local Stay',
    propertyName = title,
    hostName = 'Local Host',
    hostAvatar,
    location = 'India',
    pricePerNight = 1800,
    price = pricePerNight,
    rating = 4.8,
    reviewsCount = 24,
    type = 'Homestay',
    description = 'Experience authentic local hospitality with modern comforts.',
    imageUrl = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    amenities = ['Wi-Fi', 'Breakfast'],
    verified = true,
  } = stay;

  const handleRequestClick = (e) => {
    e.stopPropagation();
    if (onRequest) {
      onRequest(stay);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={imageUrl}
            alt={propertyName || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>{type}</span>
          </div>

          {/* Rating Badge */}
          {rating && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{rating.toFixed(1)}</span>
              {reviewsCount && (
                <span className="text-stone-600 font-normal">({reviewsCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Location & Host */}
          <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
            <div className="flex items-center gap-1 font-medium text-emerald-800">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[160px]">{location}</span>
            </div>
            {hostName && (
              <span className="text-stone-600 flex items-center gap-1">
                Hosted by <span className="font-medium text-stone-800">{hostName}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-base md:text-lg leading-snug group-hover:text-emerald-800 transition-colors line-clamp-1 mb-2">
            {propertyName || title}
          </h3>

          {/* Description */}
          <p className="text-stone-600 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>

          {/* Amenities Chips */}
          {amenities && amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-[11px] text-stone-600 self-center">
                  +{amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Contact Button */}
      <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg md:text-xl font-bold text-stone-900">
              ₹{(price ?? pricePerNight).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-600">/ night</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Local Community Host
          </span>
        </div>

        <button
          type="button"
          onClick={handleRequestClick}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 transition-all shadow-sm shadow-emerald-900/10 flex-shrink-0"
        >
          Contact Host
        </button>
      </div>
    </div>
  );
};

export default AccommodationCard;
