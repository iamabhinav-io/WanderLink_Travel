import React from 'react';
import { MapPin, Star, Languages, Award, ShieldCheck, Compass } from 'lucide-react';

/**
 * Reusable Local Guide Card
 * Created by Person 3 (Community & Explore Developer)
 *
 * @param {Object} guide - Local guide object
 * @param {Function} onContact - Callback when clicking "Contact Guide"
 */
const GuideCard = ({ guide, onContact }) => {
  if (!guide) return null;

  const {
    id,
    name = 'Certified Local Guide',
    avatar = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
    location = 'India',
    languages = ['English', 'Hindi'],
    experience = '5+ Years Local Guide',
    experienceYears = 5,
    price = 1800,
    pricePerDay = price,
    rating = 4.9,
    reviewsCount = 42,
    specialties = ['Heritage Walks', 'Hidden Gems'],
    bio = 'Certified local insider sharing authentic stories and offbeat experiences.',
    verified = true,
  } = guide;

  const handleContactClick = (e) => {
    e.stopPropagation();
    if (onContact) {
      onContact(guide);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5 md:p-6">
        {/* Top Header: Avatar, Name, Verified */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-600/20"
              loading="lazy"
            />
            {verified && (
              <div
                title="WanderLink Verified Guide"
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-emerald-700"
              >
                <ShieldCheck className="w-4 h-4 fill-emerald-100" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-stone-900 text-base md:text-lg leading-snug group-hover:text-emerald-800 transition-colors truncate">
                {name}
              </h3>
              {rating && (
                <div className="flex items-center gap-1 text-xs font-bold text-stone-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center text-xs text-stone-600 mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-700 flex-shrink-0" />
              <span className="font-medium truncate">{location}</span>
            </div>

            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-2">
              <Award className="w-3 h-3 text-emerald-700" />
              <span>{experience}</span>
            </div>
          </div>
        </div>

        {/* Bio / Excerpt */}
        <p className="text-stone-600 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
          {bio}
        </p>

        {/* Languages Spoken */}
        <div className="mb-3">
          <div className="flex items-center gap-1 text-xs text-stone-600 mb-1.5 font-medium">
            <Languages className="w-3.5 h-3.5 text-stone-500" />
            <span>Languages spoken:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {languages.map((lang, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-xs text-stone-600 mb-1.5 font-medium">
              <Compass className="w-3.5 h-3.5 text-stone-500" />
              <span>Expertise:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {specialties.slice(0, 3).map((spec, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-emerald-50/70 text-emerald-900 border border-emerald-200/50 px-2 py-0.5 rounded-md"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Price & Contact Button */}
      <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg md:text-xl font-bold text-stone-900">
              ₹{(price ?? pricePerDay).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-600">/ day tour</span>
          </div>
          <span className="text-[11px] text-stone-600">
            {reviewsCount} verified traveler reviews
          </span>
        </div>

        <button
          type="button"
          onClick={handleContactClick}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 transition-all shadow-sm shadow-emerald-900/10 flex-shrink-0"
        >
          Contact Guide
        </button>
      </div>
    </div>
  );
};

export default GuideCard;
