import React, { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { Brush, Snowflake, Leaf, Trash2 } from 'lucide-react';
import { getHallwayParty, getSidewalkParty, getSnowParty } from '../utils/rotation';
import { getWasteStyle } from '../utils/wasteUtils';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function WeeklyView({ parties }) {
    const [wasteEvents, setWasteEvents] = useState([]);
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    // Fetch waste events
    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => setWasteEvents(data))
            .catch(console.error);
    }, []);

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <h2 className="text-2xl font-bold text-center mb-4">Woche vom {format(start, 'd. MMM', { locale: de })}</h2>

            <div className="grid gap-3">
                {days.map((day) => {
                    const isToday = isSameDay(day, today);
                    const hallway = getHallwayParty(day, parties);
                    const sidewalk = getSidewalkParty(day, parties);
                    const snow = getSnowParty(day, parties);

                    // Find waste events for this day
                    const dayEvents = wasteEvents.filter(e => isSameDay(new Date(e.date), day));

                    return (
                        <div
                            key={day.toISOString()}
                            className={twMerge(
                                "p-4 rounded-3xl border transition-all duration-300 relative overflow-hidden",
                                isToday
                                    ? "bg-white/10 border-white/30 shadow-lg scale-[1.02]"
                                    : "bg-glass border-border-glass hover:bg-white/5"
                            )}
                        >
                            {/* Date Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex flex-col">
                                    <span className={clsx("text-sm font-bold uppercase tracking-widest", isToday ? "text-white" : "text-gray-400")}>
                                        {format(day, 'EEEE', { locale: de })}
                                    </span>
                                    <span className="text-xs text-gray-500">{format(day, 'd. MMMM', { locale: de })}</span>
                                </div>
                            </div>

                            {/* Tasks Grid & Large Waste Icons */}
                            <div className="flex justify-between items-center relative">
                                <div className="grid grid-cols-1 gap-2 text-sm text-gray-200 z-10">
                                    {/* Flur */}
                                    <div className="flex items-center gap-3">
                                        <Brush className="w-4 h-4 text-purple-400" />
                                        <span className="truncate">{hallway}</span>
                                    </div>

                                    {/* Bürgersteig */}
                                    <div className="flex items-center gap-3">
                                        <Leaf className="w-4 h-4 text-emerald-400" />
                                        <span className="truncate">{sidewalk}</span>
                                    </div>

                                    {/* Winter - Only if active */}
                                    {snow && (
                                        <div className="flex items-center gap-3">
                                            <Snowflake className="w-4 h-4 text-sky-400" />
                                            <span className="truncate">{snow}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Large Waste Icons (Absolute/Right) */}
                                {dayEvents.length > 0 && (
                                    <div className="flex -space-x-4 opacity-90">
                                        {dayEvents.map((e, i) => {
                                            const style = getWasteStyle(e.type);
                                            return (
                                                <Trash2
                                                    key={e.id}
                                                    className={clsx("w-12 h-12 stroke-[1.5]", style.text)}
                                                    style={{ zIndex: dayEvents.length - i }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
