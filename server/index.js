import express from 'express';
import cors from 'cors';
import multer from 'multer';
import ical from 'node-ical';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Storage for uploaded files
const upload = multer({ dest: 'uploads/' });

// In-memory or file-based storage for events
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ events: [], parties: ["Pöter/Kühn", "Melzer", "Schardt", "Goretzky", "Nasgrent"] }));
}

// Helpers
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// API: Get Parties
app.get('/api/parties', (req, res) => {
    const data = readData();
    res.json(data.parties);
});

// API: Update Parties
app.post('/api/parties', (req, res) => {
    try {
        const { parties } = req.body;
        if (!Array.isArray(parties) || parties.length !== 5) {
            return res.status(400).json({ error: 'Parties must be an array of 5 strings' });
        }

        const data = readData();
        data.parties = parties;
        writeData(data);
        res.json({ success: true, parties });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update parties' });
    }
});

// API: Get Waste Events
app.get('/api/events', (req, res) => {
    const data = readData();
    res.json(data.events);
});

// API: Upload .ics
app.post('/api/upload-ics', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const events = await ical.async.parseFile(req.file.path);
        const wasteEvents = [];

        for (const key in events) {
            const event = events[key];
            if (event.type === 'VEVENT') {
                // Simple mapping based on summary
                // Biomüll: Brown
                // Papier: Blue
                // Gelbe Tonne: Yellow
                // Restmüll: Grey
                let type = null;
                let color = '';

                const summary = (event.summary || '').toLowerCase();

                if (summary.includes('biomüll') || summary.includes('bioabfall') || summary.includes('braun')) {
                    type = 'Biomüll';
                } else if (summary.includes('papier') || summary.includes('pappe') || summary.includes('blau')) {
                    type = 'Papier';
                } else if (summary.includes('gelbe') || summary.includes('lehverpackung') || summary.includes('gelb')) {
                    type = 'Gelbe Tonne';
                } else if (summary.includes('restmüll') || summary.includes('restabfall') || summary.includes('grau')) {
                    type = 'Restmüll';
                }

                if (type) {
                    wasteEvents.push({
                        id: event.uid || Math.random().toString(36),
                        type,
                        date: event.start
                    });
                }
            }
        }

        // Filter future events and sort
        const now = new Date();
        const futureEvents = wasteEvents
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 50); // increased limit

        // Save to data.json
        const data = readData();
        data.events = futureEvents;
        writeData(data);

        // Cleanup upload
        fs.unlinkSync(req.file.path);

        res.json({ success: true, events: futureEvents });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to parse ICS file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
