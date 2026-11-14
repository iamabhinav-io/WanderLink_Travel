import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Reusable Section Heading for WanderLink Community & Explore
 *
 * @param {string} title - Main headline
 * @param {string} subtitle - Descriptive subtext
 * @param {string} badge - Optional pill label (e.g. "Community Picks")
 * @param {string} viewAllLink - Optional route path for "View All" (e.g. "/accommodation")
 * @param {string} viewAllText - Custom text for link (default: "View all")
 * @param {React.ReactNode} action - Optional custom action element
 */
const SectionHeading = ({
  title,
  subtitle,
  badge,
  viewAllLink,
  viewAllText = 'View all',
  action,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
      <div className="max-w-2xl">
        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2 tracking-wide uppercase">
            {badge}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-stone-600 text-sm md:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex-shrink-0">
        {action ? (
          action
        ) : viewAllLink ? (
          <Link
            to={viewAllLink}
            className="inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-900 group transition-colors"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default SectionHeading;
