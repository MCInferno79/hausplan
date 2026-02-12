import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
