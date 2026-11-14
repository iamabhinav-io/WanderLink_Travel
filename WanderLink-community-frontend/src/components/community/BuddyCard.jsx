import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Send,
  Compass,
  Wallet,
} from 'lucide-react';

/**
 * Reusable Travel Buddy Card
 * Created by Person 3 (Community & Explore Developer)
 * Owned by Person 3, used in Explore and Person 2's BuddyMatches.
 *
 * @param {Object} buddy
 * @param {Function} onConnect
 * @param {boolean} isConnected
 */
const BuddyCard = ({ buddy, onConnect, isConnected = false }) => {
  const [connected, setConnected] = useState(isConnected);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!buddy) return null;

  const {
    id,
    name = 'Fellow Traveler',
    avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    destination = 'Goa',
    dates = 'Flexible dates',
    travelStyle = 'Explorer',
    budget = 'Moderate',
    matchScore = 92,
    interests = ['Culture', 'Photography', 'Cafes'],
    bio = 'Excited to discover offbeat trails and local cuisines.',
    verified = true,
  } = buddy;

  const handleConnectClick = (e) => {
    e.stopPropagation();
    if (connected) return;

    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnected(true);
      if (onConnect) {
        onConnect(buddy);
      }
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5 md:p-6">
        {/* Top Header: Avatar, Name, Match Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-600/20"
                loading="lazy"
              />
              {verified && (
                <div
                  title="Verified WanderLink Traveler"
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-stone-900 text-base md:text-lg leading-snug group-hover:text-emerald-800 transition-colors">
                {name}
              </h3>
              <div className="flex items-center text-xs text-stone-600 mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-700 flex-shrink-0" />
                <span className="font-medium truncate max-w-[140px]">{destination}</span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{matchScore}% Match</span>
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-stone-600 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
          {bio}
        </p>

        {/* Style & Budget Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
            <Compass className="w-3 h-3 text-emerald-700" />
            {travelStyle}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/50">
            <Wallet className="w-3 h-3 text-amber-600" />
            {budget}
          </span>
          {dates && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600">
              <Calendar className="w-3 h-3 text-stone-500" />
              {dates}
            </span>
          )}
        </div>

        {/* Interests Tags */}
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1.5">
            Interests
          </span>
          <div className="flex flex-wrap gap-1.5">
            {interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="text-xs bg-stone-50 text-stone-700 border border-stone-200/60 rounded-md px-2 py-0.5"
              >
                #{interest}
              </span>
            ))}
            {interests.length > 3 && (
              <span className="text-xs text-stone-600 self-center">
                +{interests.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-600">
          Looking for travel companions
        </span>

        <button
          type="button"
          onClick={handleConnectClick}
          disabled={connected || isConnecting}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 ${
            connected
              ? 'bg-emerald-100 text-emerald-800 cursor-default border border-emerald-300/60'
              : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 shadow-sm shadow-emerald-900/10'
          }`}
        >
          {isConnecting ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : connected ? (
            <>
              <UserCheck className="w-4 h-4 text-emerald-800" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Connect</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BuddyCard;
