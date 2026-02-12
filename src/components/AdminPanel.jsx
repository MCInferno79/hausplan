import React, { useRef, useState, useEffect } from 'react';
import { Settings, Upload, Save, X, Loader2, Check, User } from 'lucide-react';

export default function AdminPanel({ isOpen, onClose, currentParties, onPartiesUpdate }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [parties, setParties] = useState(currentParties || []);
    const [savingParties, setSavingParties] = useState(false);

    useEffect(() => {
        if (currentParties) {
            setParties(currentParties);
        }
    }, [currentParties]);

    if (!isOpen) return null;

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload-ics', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handlePartyChange = (index, value) => {
        const newParties = [...parties];
        newParties[index] = value;
        setParties(newParties);
    };

    const saveParties = async () => {
        setSavingParties(true);
        try {
            const res = await fetch('/api/parties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ parties })
            });
            if (res.ok) {
                onPartiesUpdate(parties);
                alert('Bewohner gespeichert!');
            } else {
                alert('Fehler beim Speichern');
            }
        } catch (err) {
            console.error(err);
            alert('Fehler beim Speichern');
        } finally {
            setSavingParties(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-[#333333] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Einstellungen
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Section 1: Party List */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bewohner</h3>
                            <button
                                onClick={saveParties}
                                disabled={savingParties}
                                className="text-xs bg-white text-black px-2 py-1 rounded font-bold hover:bg-gray-200 disabled:opacity-50"
                            >
                                {savingParties ? "..." : "Speichern"}
                            </button>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                            {parties.map((party, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-gray-500 text-xs font-mono w-4">{index + 1}.</span>
                                    <div className="relative flex-1">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={party}
                                            onChange={(e) => handlePartyChange(index, e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-gray-600 mt-2 italic">Hinweis: Die Reihenfolge ist fest für die Rotation.</p>
                        </div>
                    </div>

                    {/* Section 2: ICS Upload */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Müllabfuhr Import</h3>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="p-8 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-gray-500 hover:bg-white/5 transition-all cursor-pointer relative"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".ics"
                                onChange={handleFileUpload}
                            />

                            {uploading ? (
                                <Loader2 className="w-8 h-8 mb-2 animate-spin text-blue-500" />
                            ) : success ? (
                                <Check className="w-8 h-8 mb-2 text-green-500" />
                            ) : (
                                <Upload className="w-8 h-8 mb-2" />
                            )}

                            <p className="text-sm">
                                {uploading ? "Wird hochgeladen..." : success ? "Erolgreich importiert!" : "ICS Datei hier ablegen"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    );
}
