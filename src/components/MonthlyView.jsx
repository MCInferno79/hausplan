import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { getHallwayParty, getSidewalkParty, getSnowParty } from '../utils/rotation';
import { getWasteStyle } from '../utils/wasteUtils';
import { clsx } from 'clsx';
import { API_URL } from '../config';

export default function MonthlyView({ parties }) {
    const [wasteEvents, setWasteEvents] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

    useEffect(() => {
        fetch(`${API_URL}/api/events`)
            .then(res => res.json())
            .then(data => setWasteEvents(data))
            .catch(console.error);
    }, []);

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <h2 className="text-2xl font-bold text-center mb-4">{format(today, 'MMMM yyyy', { locale: de })}</h2>

            {/* Calendar Grid */}
            <div className="bg-glass border border-border-glass rounded-3xl p-4">
                {/* Week Headers */}
                <div className="grid grid-cols-7 mb-2 text-center">
                    {weekDays.map(d => (
                        <div key={d} className="text-gray-500 text-xs uppercase font-bold py-2">{d}</div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map(day => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isToday = isSameDay(day, today);
                        const isSelected = selectedDay && isSameDay(day, selectedDay);

                        const hallway = getHallwayParty(day, parties);
                        const sidewalk = getSidewalkParty(day, parties);
                        const snow = getSnowParty(day, parties);

                        const dayEvents = wasteEvents.filter(e => isSameDay(new Date(e.date), day));

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDay(day)}
                                className={clsx(
                                    "aspect-square rounded-xl p-1 flex flex-col items-center justify-start gap-1 transition-all relative group",
                                    !isCurrentMonth && "opacity-30",
                                    isToday ? "bg-white/10 text-white border border-white/20" : "hover:bg-white/5",
                                    isSelected && "ring-2 ring-blue-500 bg-white/10"
                                )}
                            >
                                <span className={clsx("text-sm", isToday && "font-bold")}>{format(day, 'd')}</span>

                                {/* Dots Container */}
                                <div className="flex flex-wrap justify-center gap-0.5 max-w-full px-1">
                                    {/* Duties as dots */}
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/80" title={`Flur: ${hallway}`} />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" title={`Bürgersteig: ${sidewalk}`} />
                                    {snow && <div className="w-1.5 h-1.5 rounded-full bg-sky-500/80" title={`Winter: ${snow}`} />}

                                    {/* Waste Dots */}
                                    {dayEvents.map(e => {
                                        const style = getWasteStyle(e.type);
                                        return <div key={e.id} className={clsx("w-1.5 h-1.5 rounded-full", style.color)} title={e.type} />
                                    })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Day Details Overlay/Panel */}
            {selectedDay && (
                <div className="bg-glass border border-border-glass rounded-3xl p-4 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-bold mb-2 text-white">{format(selectedDay, 'EEEE, d. MMMM', { locale: de })}</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                            <span>Flurwoche</span>
                            <span className="font-bold text-white">{getHallwayParty(selectedDay, parties)}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                            <span>Bürgersteig</span>
                            <span className="font-bold text-white">{getSidewalkParty(selectedDay, parties)}</span>
                        </div>
                        {getSnowParty(selectedDay, parties) && (
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span>Winterdienst</span>
                                <span className="font-bold text-white">{getSnowParty(selectedDay, parties)}</span>
                            </div>
                        )}
                    </div>

                    {/* Waste for selected day */}
                    {wasteEvents.filter(e => isSameDay(new Date(e.date), selectedDay)).map(e => {
                        const style = getWasteStyle(e.type);
                        return (
                            <div key={e.id} className={clsx("mt-3 px-3 py-1.5 rounded-lg text-xs font-bold w-fit", style.color, e.type === 'Gelbe Tonne' ? 'text-black' : 'text-white')}>
                                {e.type}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
