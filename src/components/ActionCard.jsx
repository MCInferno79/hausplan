import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function ActionCard({ title, assignee, icon: Icon, colorClass, isInactive }) {
    // Extract base color for the icon background
    // Assuming colorClass is like "from-purple-500 to-indigo-500"
    // We want a subtle bg like "bg-purple-500/10"
    // Easier to pass a separate "accentColor" prop or derive it.
    // For now, let's just use white/10 if not parsable, or rely on the gradient passing.

    return (
        <div className={twMerge(
            "relative overflow-hidden rounded-3xl p-6 border border-border-glass bg-glass backdrop-blur-xl transition-all duration-300 group",
            isInactive ? "opacity-50 grayscale" : "hover:border-opacity-50 hover:shadow-2xl hover:-translate-y-1 hover:border-white/20"
        )}>
            {/* Decorative Gradient Blob */}
            <div className={twMerge("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-20", colorClass)}></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {isInactive && <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 border border-gray-700 px-2 py-1 rounded-full">Inaktiv</span>}
            </div>

            <div className="relative z-10">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
                <p className="text-2xl font-bold text-white tracking-tight">{assignee || "—"}</p>
            </div>
        </div>
    );
}
