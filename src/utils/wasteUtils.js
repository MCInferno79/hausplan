export const WASTE_TYPES = {
    'Biomüll': { color: 'bg-waste-bio', text: 'text-waste-bio', border: 'border-waste-bio', label: 'Biomüll' },
    'Papier': { color: 'bg-waste-paper', text: 'text-waste-paper', border: 'border-waste-paper', label: 'Papier' },
    'Gelbe Tonne': { color: 'bg-waste-yellow', text: 'text-waste-yellow', border: 'border-waste-yellow', label: 'Gelbe Tonne' },
    'Restmüll': { color: 'bg-waste-rest', text: 'text-waste-rest', border: 'border-waste-rest', label: 'Restmüll' }
};

export function getWasteStyle(type) {
    return WASTE_TYPES[type] || { color: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500', label: type };
}
