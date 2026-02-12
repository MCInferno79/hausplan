import { getHallwayParty, getSidewalkParty, getSnowParty } from './src/utils/rotation.js';

console.log("--- Testing Rotation Logic ---");

// Test Case 1: 2026-01-05 (Monday)
// Hallway: Should be Schardt (index 2)
// Sidewalk: Should be Melzer (index 1)
// Snow: Should be Nasgrent (index 4) ? Wait.
// Snow Anchor: Pöter/Kühn (0) on Jan 1.
// Jan 2 = Melzer (1)
// Jan 3 = Schardt (2)
// Jan 4 = Goretzky (3)
// Jan 5 = Nasgrent (4)
const date1 = new Date(2026, 0, 5);
console.log(`2026-01-05 Hallway: ${getHallwayParty(date1)} (Expected: Schardt)`);
console.log(`2026-01-05 Sidewalk: ${getSidewalkParty(date1)} (Expected: Melzer)`);
console.log(`2026-01-05 Snow: ${getSnowParty(date1)} (Expected: Nasgrent)`);

// Test Case 2: 2026-01-04 (Sunday)
// Hallway: Melzer (1)
// Sidewalk: Pöter/Kühn (0)
// Snow: Goretzky (3)
const date2 = new Date(2026, 0, 4);
console.log(`2026-01-04 Hallway: ${getHallwayParty(date2)} (Expected: Melzer)`);
console.log(`2026-01-04 Sidewalk: ${getSidewalkParty(date2)} (Expected: Pöter/Kühn)`);
console.log(`2026-01-04 Snow: ${getSnowParty(date2)} (Expected: Goretzky)`);


// Test Case 3: Summer (July)
// Snow should be null.
const date3 = new Date(2026, 6, 1);
console.log(`2026-07-01 Snow: ${getSnowParty(date3)} (Expected: null)`);
