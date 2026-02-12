import { differenceInCalendarDays, startOfDay, getMonth } from 'date-fns';

const PARTIES = [
    "Pöter/Kühn",
    "Melzer",
    "Schardt",
    "Goretzky",
    "Nasgrent"
];

// Flurwoche: Weekly (Mon-Sun).
// Anchor: Melzer (index 1) end 2026-01-04 (Sun) -> Schardt (index 2) starts 2026-01-05 (Mon).
// Reference date: 2026-01-05 is index 2.
const HALLWAY_ANCHOR_DATE = new Date(2026, 0, 5); // Jan 5, 2026
const HALLWAY_ANCHOR_INDEX = 2; // Schardt

export function getHallwayParty(date, parties = PARTIES) {
    const targetDate = startOfDay(date);
    // Calculate full weeks difference
    const daysDiff = differenceInCalendarDays(targetDate, HALLWAY_ANCHOR_DATE);
    const weeksDiff = Math.floor(daysDiff / 7);

    // Calculate new index
    // Note: Standard modulo of negative numbers in JS behaves weirdly, so we handle it.
    const n = parties.length;
    let index = (HALLWAY_ANCHOR_INDEX + weeksDiff) % n;
    if (index < 0) index = (index + n) % n;

    return parties[index];
}


// Bürgersteig: Weekly (Mon-Sun).
// Anchor: Pöter/Kühn (index 0) end 2026-01-04 -> Melzer (index 1) starts 2026-01-05.
// Reference date: 2026-01-05 is index 1.
const SIDEWALK_ANCHOR_DATE = new Date(2026, 0, 5);
const SIDEWALK_ANCHOR_INDEX = 1; // Melzer

export function getSidewalkParty(date, parties = PARTIES) {
    const targetDate = startOfDay(date);
    const daysDiff = differenceInCalendarDays(targetDate, SIDEWALK_ANCHOR_DATE);
    const weeksDiff = Math.floor(daysDiff / 7);

    const n = parties.length;
    let index = (SIDEWALK_ANCHOR_INDEX + weeksDiff) % n;
    if (index < 0) index = (index + n) % n;

    return parties[index];
}

// Schneefegen: Daily rotation.
// Season: Dec to March.
// Anchor: Pöter/Kühn (index 0) on 2026-01-01.
const SNOW_ANCHOR_DATE = new Date(2026, 0, 1);
const SNOW_ANCHOR_INDEX = 0; // Pöter/Kühn

export function getSnowParty(date, parties = PARTIES) {
    const targetDate = startOfDay(date);
    const month = getMonth(targetDate); // 0-11. Jan=0, Dec=11, Mar=2.

    // Active months: Dec (11), Jan (0), Feb (1), Mar (2)
    const isWinter = month === 11 || month <= 2;

    if (!isWinter) return null;

    const daysDiff = differenceInCalendarDays(targetDate, SNOW_ANCHOR_DATE);

    const n = parties.length;
    let index = (SNOW_ANCHOR_INDEX + daysDiff) % n;
    if (index < 0) index = (index + n) % n;

    return parties[index];
}

export function getAllParties() {
    return PARTIES;
}
