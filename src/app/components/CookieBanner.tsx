
import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 shadow-2xl z-50 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-500">
            <div className="text-sm md:text-base text-gray-700">
                <p className="font-semibold mb-1 text-gray-900">Мы используем файлы cookie 🍪</p>
                <p>
                    Продолжая использовать сайт, вы соглашаетесь на сбор файлов cookie для аналитики и улучшения работы сервиса
                    в соответствии с <a href="/privacy" className="text-[#1A9BAA] underline hover:text-[#158896]">Политикой конфиденциальности</a>.
                </p>
            </div>
            <div className="flex gap-3 shrink-0 w-full md:w-auto">
                <button
                    onClick={accept}
                    className="bg-[#1A9BAA] hover:bg-[#158896] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#1A9BAA]/20 flex-1 md:flex-none text-center"
                >
                    Хорошо, понятно
                </button>
            </div>
        </div>
    );
}
