import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ViewSwitcher from './components/ViewSwitcher'
import TodayDashboard from './components/TodayDashboard'
import WeeklyView from './components/WeeklyView'
import MonthlyView from './components/MonthlyView'
import AdminPanel from './components/AdminPanel'
import { Settings } from 'lucide-react'
import { getAllParties } from './utils/rotation'

function App() {
    const [currentView, setCurrentView] = useState('Tag');
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [parties, setParties] = useState(getAllParties());
    const [loading, setLoading] = useState(true);

    // Fetch initial parties
    useEffect(() => {
        fetch('/api/parties')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setParties(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch parties", err);
                setLoading(false);
            });
    }, []);

    const handlePartiesUpdate = (newParties) => {
        setParties(newParties);
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Laden...</div>;
    }

    return (
        <Layout>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsAdminOpen(true)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />

            <div className="flex-1">
                {currentView === 'Tag' && <TodayDashboard parties={parties} />}
                {currentView === 'Woche' && <WeeklyView parties={parties} />}
                {currentView === 'Monat' && <MonthlyView parties={parties} />}
            </div>

            <AdminPanel
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
                currentParties={parties}
                onPartiesUpdate={handlePartiesUpdate}
            />
        </Layout>
    )
}

export default App
