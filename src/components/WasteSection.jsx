import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { getWasteStyle } from '../utils/wasteUtils';

export default function WasteSection() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch events", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="mt-8 text-gray-500 text-sm">Lade Mülltermine...</div>;
    if (!events || events.length === 0) return <div className="mt-8 text-gray-500 text-sm">Keine anstehenden Termine.</div>;

    return (
        <div className="mt-8">
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Nächste Abfuhr
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-4 px-1 -mx-1 scrollbar-hide">
                {events.map(event => {
                    const style = getWasteStyle(event.type);
                    return (
                        <div
                            key={event.id}
                            className="flex-shrink-0 flex items-center gap-3 p-3 pr-5 rounded-2xl bg-glass border border-border-glass backdrop-blur-md min-w-[160px]"
                        >
                            <div className={clsx("w-3 h-12 rounded-full", style.color)}></div>
                            <div>
                                <p className="font-bold text-white text-sm">{event.type}</p>
                                <p className="text-xs text-gray-400">
                                    {format(new Date(event.date), 'EEE, d. MMM', { locale: de })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
