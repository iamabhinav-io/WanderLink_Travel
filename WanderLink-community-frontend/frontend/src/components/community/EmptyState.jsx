import React from 'react';
import { Compass } from 'lucide-react';

/**
 * Reusable Empty State component for WanderLink Community
 *
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} icon
 * @param {string} actionLabel
 * @param {Function} onAction
 */
const EmptyState = ({
  title = 'No results found',
  description = 'Try adjusting your destination search or filtering options.',
  icon: Icon = Compass,
  actionLabel = 'Reset Filters',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-sm max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-6 max-w-md">
        {description}
      </p>

      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 transition-all shadow-sm shadow-emerald-900/10"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
