"use client";
import React, { useState } from 'react';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    const handleAcceptCookies = () => {
        setIsVisible(false);
    };

    const handleDeclineCookies = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed z-50 bottom-10 left-0 right-0 p-4 bg-gray-800 text-white mx-10 ">
            <h2 className="text-lg font-bold py-2">Cookie Hinweis</h2>
            <p className='pb-4'>Diese Website verwendet Cookies, um Ihnen eine bessere Nutzererfahrung zu bieten.</p>
            <div className="flex justify-center space-x-2 pb-2">
            <button onClick={handleAcceptCookies} className="bg-green-500 px-4 py-2 rounded mr-2">Akzeptieren</button>
            <button onClick={handleDeclineCookies} className="bg-red-500 px-4 py-2 rounded">Ablehnen</button>
            </div>
        </div>
    );
};

export default CookieBanner;
