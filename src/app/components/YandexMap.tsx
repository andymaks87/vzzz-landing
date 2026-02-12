
import { useEffect, useRef } from 'react';

const YANDEX_MAP_API_KEY = 'dd7a9341-a67b-402c-a28a-6f0144d2d886';
const CENTER_COORDS = [55.96231, 34.46818];

declare global {
    interface Window {
        ymaps: any;
    }
}

export default function YandexMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (window.ymaps) {
            initMap();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAP_API_KEY}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
            window.ymaps.ready(initMap);
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup if needed
            document.body.removeChild(script);
        };
    }, []);

    const initMap = () => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        mapInstanceRef.current = new window.ymaps.Map(mapContainerRef.current, {
            center: CENTER_COORDS,
            zoom: 14,
            controls: ['zoomControl', 'fullscreenControl']
        });

        const myPlacemark = new window.ymaps.Placemark(CENTER_COORDS, {
            balloonContent: 'Дом у воды (Хлепень)'
        }, {
            preset: 'islands#redDotIcon'
        });

        mapInstanceRef.current.geoObjects.add(myPlacemark);
        mapInstanceRef.current.behaviors.disable('scrollZoom');
    };

    return (
        <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '1.5rem', overflow: 'hidden' }}
        />
    );
}
