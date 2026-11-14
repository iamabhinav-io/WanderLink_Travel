import React, { useState } from 'react';
import { MapPin, Users, Calendar, Check, UserPlus } from 'lucide-react';

/**
 * Reusable Travel Group Card
 * Created by Person 3 (Community & Explore Developer)
 *
 * @param {Object} group - Travel group object
 * @param {Function} onJoin - Callback to join group: (group) => Promise or void
 * @param {boolean} isJoined - Optional joined override
 */
const GroupCard = ({ group, onJoin, isJoined = false }) => {
  const [joined, setJoined] = useState(Boolean(group?.isJoined || isJoined));
  const [memberCount, setMemberCount] = useState(group?.memberCount || 0);
  const [isJoining, setIsJoining] = useState(false);

  if (!group) return null;

  const {
    id,
    name = 'WanderLink Travel Tribe',
    groupName = name,
    destination = 'India',
    description = 'Join fellow wanderers for scenic road trips and authentic cultural exploration.',
    maxMembers = 150,
    category = 'Travel Tribe',
    upcomingTripDate = 'Upcoming Soon',
    dates = upcomingTripDate,
    imageUrl = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    organizer = 'Community Lead',
  } = group;

  const handleJoinClick = async (e) => {
    e.stopPropagation();
    if (joined || isJoining) return;

    setIsJoining(true);
    try {
      if (onJoin) {
        await onJoin(group);
      }
      setJoined(true);
      setMemberCount((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to join group:', err);
    } finally {
      setIsJoining(false);
    }
  };

  const capacityPercentage = Math.min(100, Math.round((memberCount / (maxMembers || 150)) * 100));

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Banner Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
          <img
            src={imageUrl}
            alt={groupName || name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Category Pill */}
          <div className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
            {category}
          </div>

          {/* Destination Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{destination}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Upcoming Date Info */}
          {(upcomingTripDate || dates) && (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Next meet: {upcomingTripDate || dates}</span>
            </div>
          )}

          {/* Group Name */}
          <h3 className="font-bold text-stone-900 text-base md:text-lg leading-snug group-hover:text-emerald-800 transition-colors line-clamp-1 mb-2">
            {groupName || name}
          </h3>

          {/* Description */}
          <p className="text-stone-600 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>

          {/* Member Count & Capacity Bar */}
          <div className="space-y-1.5 mb-2">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-1 font-medium text-stone-800">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>{memberCount} members</span>
              </div>
              <span>Max {maxMembers}</span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Organizer & Join Action */}
      <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-3">
        <span className="text-xs text-stone-600 truncate max-w-[130px]">
          Lead: <strong className="font-medium text-stone-800">{organizer}</strong>
        </span>

        <button
          type="button"
          onClick={handleJoinClick}
          disabled={joined || isJoining}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 flex-shrink-0 ${
            joined
              ? 'bg-emerald-100 text-emerald-800 cursor-default border border-emerald-300/60'
              : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 shadow-sm shadow-emerald-900/10'
          }`}
        >
          {isJoining ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : joined ? (
            <>
              <Check className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
              <span>Joined</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join Tribe</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
