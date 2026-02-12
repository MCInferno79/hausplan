import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Brush, Snowflake, Leaf } from 'lucide-react';
import ActionCard from './ActionCard';
import WasteSection from './WasteSection';
import { getHallwayParty, getSidewalkParty, getSnowParty } from '../utils/rotation';

export default function TodayDashboard({ parties }) {
    const today = new Date();

    const hallwayParty = getHallwayParty(today, parties);
    const sidewalkParty = getSidewalkParty(today, parties);
    const snowParty = getSnowParty(today, parties);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Date Header */}
            <div className="text-center mb-2">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-tracking-tight">
                    {format(today, 'EEEE', { locale: de })}
                </h2>
                <p className="text-gray-400 uppercase tracking-widest text-sm mt-1">
                    {format(today, 'd. MMMM yyyy', { locale: de })}
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4">
                <ActionCard
                    title="Flurwoche"
                    assignee={hallwayParty}
                    icon={Brush}
                    colorClass="from-purple-500 to-fuchsia-600"
                />

                <ActionCard
                    title="Bürgersteig"
                    assignee={sidewalkParty}
                    icon={Leaf}
                    colorClass="from-emerald-400 to-green-600"
                />

                {snowParty && (
                    <ActionCard
                        title="Winterdienst"
                        assignee={snowParty}
                        icon={Snowflake}
                        colorClass="from-sky-400 to-blue-600"
                    />
                )}
            </div>

            <WasteSection />
        </div>
    );
}
