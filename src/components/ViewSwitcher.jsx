import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function ViewSwitcher({ currentView, onViewChange }) {
    const views = ['Tag', 'Woche', 'Monat'];

    return (
        <div className="flex bg-glass border border-border-glass rounded-full p-1 mb-8 relative backdrop-blur-md shadow-2xl">
            {views.map((view) => (
                <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={twMerge(
                        "flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-300 relative z-10",
                        currentView === view
                            ? "text-black bg-white shadow-lg scale-100"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    {view}
                </button>
            ))}
        </div>
    );
}
