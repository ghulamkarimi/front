"use client";
import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
        if (!hasAcceptedCookies) {
            setIsVisible(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setIsVisible(false);
    };

    const handleDeclineCookies = () => {
        localStorage.setItem('cookiesAccepted', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed z-50 bottom-10 left-0 right-0 flex justify-center items-center p-6  text-white shadow-lg">
            <div className="bg-gray-800 p-8 rounded-lg flex items-center space-x-8 max-w-4xl">
                <div>
                    <h2 className="text-2xl font-semibold py-3">🍪 Cookie Hinweis</h2>
                    <p className='pb-6'>Diese Website verwendet Cookies, um Ihnen eine bessere Nutzererfahrung zu bieten. Bitte akzeptieren oder lehnen Sie die Nutzung ab.</p>
                </div>
                <div className="flex flex-col space-y-4">
                    <button 
                        onClick={handleAcceptCookies} 
                        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-md transition-all ease-in-out duration-200">
                        Akzeptieren
                    </button>
                    <button 
                        onClick={handleDeclineCookies} 
                        className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-md transition-all ease-in-out duration-200">
                        Ablehnen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
