import { useState, useEffect } from 'react';
import { Menu, X, Fish, Check, MapPin, Phone, Mail, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import BookingWidget from '../components/BookingWidget';
import YandexMap from '../components/YandexMap';
import { Link } from 'react-router-dom';
import { APPS_SCRIPT_URL } from '../../config';

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState('');

    const features = [
        {
            icon: '🎣',
            title: 'Рыбалка мечты',
            description: 'Щука, судак, лещ круглый год'
        },
        {
            icon: '🏡',
            title: 'Современный дом',
            description: '3 спальни, 2 санузла, кухня'
        },
        {
            icon: '♨️',
            title: 'Баня-бочка',
            description: 'На 6 человек с видом на воду'
        },
        {
            icon: '⚓',
            title: 'Причал',
            description: 'Спуск к воде, причал для лодок'
        },
        {
            icon: '🔥',
            title: 'Мангал и кострище',
            description: 'BBQ зона на территории'
        },
        {
            icon: '🚗',
            title: 'Удобный подъезд',
            description: 'Асфальт до деревни, парковка'
        }
    ];

    const [galleryImages, setGalleryImages] = useState([
        { url: '/photos/1.jpg', caption: 'Просторная гостиная' },
        { url: '/photos/2.jpg', caption: 'Кухня со всем необходимым' },
        { url: '/photos/3.jpg', caption: 'Уютная спальня' },
        { url: '/photos/4.jpg', caption: 'Вид на озеро' },
        { url: '/photos/5.jpg', caption: 'Баня-бочка' },
        { url: '/photos/6.jpg', caption: 'Зона отдыха' },
        { url: '/photos/7.jpg', caption: 'Причал для лодок' },
        { url: '/photos/8.jpg', caption: 'Территория дома' },
        { url: '/photos/9.jpg', caption: 'Мангальная зона' },
        { url: '/photos/10.jpg', caption: 'Вечерняя атмосфера' },
        { url: '/photos/11.jpg', caption: 'Рыбалка на рассвете' },
        { url: '/photos/12.jpg', caption: 'Зимняя сказка' }
    ]);



    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch(`${APPS_SCRIPT_URL}?action=getGallery`);
                const data = await res.json();
                if (data && Array.isArray(data) && data.length > 0) {
                    setGalleryImages(data);
                }
            } catch (e) {
                console.error('Failed to fetch gallery', e);
            }
        };
        fetchGallery();
    }, []);

    const openLightbox = (url: string) => {
        setLightboxImage(url);
        setLightboxOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFB] relative overflow-x-hidden">
            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-gray-300 transition-colors z-50 bg-white/10 rounded-full p-2"
                    >
                        <X className="w-8 h-8 md:w-10 md:h-10" />
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Gallery"
                        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0B2A3D]/90 backdrop-blur-xl border-b border-white/10 transition-all duration-300 shadow-[0_0_20px_rgba(26,155,170,0.2)]">
                <div className="max-w-[1240px] mx-auto px-5 md:px-20">
                    <div className="flex items-center justify-between h-20 md:h-24">
                        {/* Logo */}
                        <a href="#" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-tr from-[#1A9BAA] to-[#2DD4BF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(26,155,170,0.6)]">
                                <Fish className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl text-white font-bold tracking-wider uppercase drop-shadow-md">Дом у воды</span>
                                {/* Wave graphic instead of text */}
                                <div className="flex space-x-1 mt-1.5 opacity-80">
                                    <div className="w-6 h-1 bg-[#2DD4BF] rounded-full animate-pulse" />
                                    <div className="w-4 h-1 bg-[#1A9BAA] rounded-full animate-pulse delay-75" />
                                    <div className="w-2 h-1 bg-white rounded-full animate-pulse delay-150" />
                                </div>
                            </div>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8">
                            <a href="#about" className="text-white/80 hover:text-[#2DD4BF] hover:shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all text-sm font-bold tracking-widest uppercase px-2 py-1 rounded">О доме</a>
                            <a href="#gallery" className="text-white/80 hover:text-[#2DD4BF] hover:shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all text-sm font-bold tracking-widest uppercase px-2 py-1 rounded">Галерея</a>
                            <a href="#booking" className="text-white/80 hover:text-[#2DD4BF] hover:shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all text-sm font-bold tracking-widest uppercase px-2 py-1 rounded">Бронирование</a>
                            <a href="#directions" className="text-white/80 hover:text-[#2DD4BF] hover:shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all text-sm font-bold tracking-widest uppercase px-2 py-1 rounded">Как добраться</a>
                            <a href="#booking">
                                <Button className="bg-gradient-to-r from-[#1A9BAA] to-[#158896] hover:from-[#158896] hover:to-[#0F6F7A] text-white px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(26,155,170,0.4)] hover:shadow-[0_0_30px_rgba(26,155,170,0.6)] font-bold transition-all hover:-translate-y-1 active:translate-y-0 border border-white/10">
                                    Мгновенное бронирование
                                </Button>
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-6 space-y-4 border-t border-white/10 animate-in slide-in-from-top-4 duration-200 bg-[#0B2A3D]">
                            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-[#2DD4BF] transition-colors py-3 text-center text-lg font-bold tracking-wider uppercase">О доме</a>
                            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-[#2DD4BF] transition-colors py-3 text-center text-lg font-bold tracking-wider uppercase">Галерея</a>
                            <a href="#booking" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-[#2DD4BF] transition-colors py-3 text-center text-lg font-bold tracking-wider uppercase">Бронирование</a>
                            <a href="#directions" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-[#2DD4BF] transition-colors py-3 text-center text-lg font-bold tracking-wider uppercase">Как добраться</a>
                            <a href="#booking" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-[#1A9BAA] hover:bg-[#168A97] text-white h-14 rounded-xl mt-4 text-lg font-bold shadow-[0_0_20px_rgba(26,155,170,0.4)]">
                                    Мгновенное бронирование
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 md:pt-24 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="/photos/1.jpg" // Use local photo if available, or fallback
                        onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1760998805360-52ab052f0feb?w=1600"}
                        alt="Дом у воды"
                        className="w-full h-full object-cover scale-105 animate-in fade-in duration-[1500ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B2A3D]/40 via-[#0B2A3D]/20 to-[#0B2A3D]/90" />
                    <div className="absolute inset-0 bg-black/20" /> {/* Extra darken for text contrast */}
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-20 py-20 md:py-32 w-full">
                    <div className="max-w-4xl animate-in slide-in-from-bottom-12 duration-1000 fade-in fill-mode-forwards">
                        <h1 className="text-3xl md:text-5xl lg:text-7xl text-white mb-6 md:mb-8 leading-tight font-extrabold tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                            220 км от МКАД по Новорижскому шоссе (М-9) <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#1A9BAA] drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">Тишина, природа и комфорт</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-white/95 mb-8 md:mb-12 leading-relaxed max-w-2xl font-medium drop-shadow-md">
                            Премиум отдых для рыбаков и охотников. Дом у воды на Вазузском водохранилище.
                        </p>

                        {/* Feature Chips - Monochrome Icons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-10 md:mb-14">
                            {['130 м² комфорта', 'Прямой выход к воде', 'Баня-бочка', 'До 8 гостей'].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-2xl px-5 py-4 border border-white/20 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] duration-300 group">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors">
                                        <Check className="w-5 h-5 text-white/80 group-hover:text-white" />
                                    </div>
                                    <span className="text-white font-bold text-lg drop-shadow-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-5">
                            <a href="#booking">
                                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#1A9BAA] to-[#158896] hover:from-[#2DD4BF] hover:to-[#1A9BAA] text-white px-10 h-16 text-xl rounded-2xl shadow-[0_0_20px_rgba(26,155,170,0.4)] hover:shadow-[0_0_40px_rgba(26,155,170,0.6)] font-bold transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 border border-white/10">
                                    Мгновенное бронирование
                                </Button>
                            </a>
                            <a href="#gallery">
                                <Button className="w-full sm:w-auto bg-[#0B2A3D]/80 hover:bg-[#0B2A3D] text-white px-10 h-16 text-xl rounded-2xl backdrop-blur-md font-bold transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20 hover:border-[#2DD4BF]/50">
                                    Смотреть фото
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Wave Decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFB] to-transparent" />
            </section>

            {/* About Section */}
            <section id="about" className="py-20 md:py-32 relative">
                <div className="max-w-[1240px] mx-auto px-5 md:px-20 relative z-10">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6 font-bold text-[#0B2A3D]">Всё для идеального отдыха</h2>
                        <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
                            Примерно 4 часа по одной из самых скоростных трасс и вы на месте. Мы продумали каждую деталь вашего комфорта.
                        </p>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group bg-white rounded-[2rem] p-8 md:p-10 shadow-lg hover:shadow-[0_20px_40px_rgba(26,155,170,0.15)] transition-all duration-500 hover:-translate-y-3 border border-[#E2E8F0] relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F1F5F9] rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-[1.7] duration-700 ease-out" />

                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="text-4xl drop-shadow-sm text-[#0B2A3D] group-hover:scale-110 transition-transform duration-300 grayscale opacity-80 group-hover:opacity-100">{feature.icon}</div>
                                    <h3 className="text-2xl font-bold text-[#0B2A3D] leading-tight group-hover:text-[#1A9BAA] transition-colors">{feature.title}</h3>
                                </div>

                                <p className="text-[#64748B] leading-relaxed relative z-10 text-lg font-medium">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <section id="booking" className="py-20 md:py-32 bg-gradient-to-b from-[#F0F4F8] to-white relative">
                <div className="max-w-[1240px] mx-auto px-5 md:px-20 relative z-10">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6 font-bold text-[#0B2A3D]">Бронирование</h2>
                        <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
                            Выберите даты проживания в календаре ниже
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                        <BookingWidget />
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0B2A3D] skew-y-3 transform origin-top-left -z-10 h-full scale-110 translate-y-20" />

                <div className="max-w-[1240px] mx-auto px-5 md:px-20">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6 font-bold text-white">Фотогалерея</h2>
                        <p className="text-white/60 text-xl">Почувствуйте атмосферу уюта и спокойствия</p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {galleryImages.map((image, idx) => (
                            <div
                                key={idx}
                                onClick={() => openLightbox(image.url)}
                                className="break-inside-avoid group relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <img
                                    src={image.url}
                                    alt={image.caption}
                                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                    <p className="text-white font-bold text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {image.caption}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[#0B2A3D] h-14 px-8 rounded-2xl text-lg transition-all">
                            Показать больше фото
                        </Button>
                    </div>
                </div>
            </section>

            {/* Directions Section */}
            <section id="directions" className="py-20 md:py-32 bg-[#F8FAFB]">
                <div className="max-w-[1240px] mx-auto px-5 md:px-20">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6 font-bold text-[#0B2A3D]">Как добраться</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                        {/* Info Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[#E2E8F0] space-y-8 sticky top-24">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-[#1A9BAA]/10 rounded-2xl flex items-center justify-center shrink-0 text-[#1A9BAA]">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl mb-2 font-bold text-[#0B2A3D]">Наш адрес</h3>
                                    <p className="text-[#64748B] text-lg leading-relaxed">
                                        Смоленская область, деревня Хлепень, ул. Набережная
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-[#E2E8F0]">
                                <h4 className="font-bold text-lg mb-4 text-[#0B2A3D]">Маршрут на авто:</h4>
                                <p className="text-[#64748B] mb-6 leading-relaxed text-lg">
                                    220 км от МКАД по Новорижскому шоссе (М-9). Асфальтированная дорога прямо до въезда в деревню. Парковка на территории включена.
                                </p>
                            </div>

                            <div className="grid gap-4">
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 justify-center bg-[#1A9BAA] hover:bg-[#168A97] text-white h-14 md:h-16 rounded-2xl shadow-lg shadow-[#1A9BAA]/20 text-base md:text-lg font-bold whitespace-nowrap"
                                        onClick={() => {
                                            navigator.clipboard.writeText("Смоленская область, деревня Хлепень, ул. Набережная");
                                            alert("Адрес скопирован!");
                                        }}
                                    >
                                        <div className="mr-2">📋</div>
                                        Скопировать адрес
                                    </Button>
                                    <Button
                                        className="w-16 h-14 md:h-16 justify-center bg-[#0B2A3D] hover:bg-[#0F3A55] text-white rounded-2xl shadow-lg text-lg font-bold"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: 'FisherHouse',
                                                    text: 'Дом у воды, Вазузское водохранилище',
                                                    url: 'https://vazuza-fisherhouse.ru'
                                                });
                                            } else {
                                                alert("Ваш браузер не поддерживает кнопку 'Поделиться'.");
                                            }
                                        }}
                                    >
                                        <div className="text-xl">🔗</div>
                                    </Button>
                                </div>
                                <a href="https://yandex.ru/maps/?rtext=~55.96231,34.46818" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="w-full justify-center h-14 md:h-16 rounded-2xl border-2 text-gray-600 hover:bg-gray-50 text-base md:text-lg font-semibold">
                                        <MapPin className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                                        Открыть в Яндекс.Навигаторе
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white rounded-[2.5rem] overflow-hidden h-[500px] md:h-[600px] border-4 border-white shadow-2xl relative">
                            <YandexMap />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0B2A3D] text-white py-20 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 20c-5 0-9 2-9 5s4 5 9 5 9-2 9-5-4-5-9-5zm0 8c-3.5 0-6-1.5-6-3s2.5-3 6-3 6 1.5 6 3-2.5 3-6 3z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>

                <div className="max-w-[1240px] mx-auto px-5 md:px-20 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 mb-16">
                        {/* Contacts */}
                        <div>
                            <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-[#1A9BAA] rounded-full"></div>
                                Контакты
                            </h4>
                            <div className="space-y-5 text-white/80">
                                <div className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#1A9BAA] transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">+7 (996) 415-94-05</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#1A9BAA] transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">booking@vazuza-fisherhouse.ru</span>
                                </div>
                                <div className="flex items-start gap-4 group cursor-pointer hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#1A9BAA] transition-colors shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="leading-relaxed">Смоленская обл., д. Хлепень, ул. Набережная</span>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-[#1A9BAA] rounded-full"></div>
                                Документы
                            </h4>
                            <div className="space-y-4 text-white/70">
                                <Link to="/agreement" className="block hover:text-[#1A9BAA] hover:translate-x-1 transition-all">Публичная оферта</Link>
                                <Link to="/privacy" className="block hover:text-[#1A9BAA] hover:translate-x-1 transition-all">Политика конфиденциальности</Link>
                                <Link to="/agreement" className="block hover:text-[#1A9BAA] hover:translate-x-1 transition-all">Правила проживания</Link>
                                <Link to="/agreement" className="block hover:text-[#1A9BAA] hover:translate-x-1 transition-all">Согласие на обработку ПД</Link>
                            </div>
                        </div>

                        {/* Info */}
                        <div>
                            <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-[#1A9BAA] rounded-full"></div>
                                Реквизиты
                            </h4>
                            <div className="space-y-4 text-white/70">
                                <p>Емельянов Евгений Юрьевич</p>
                                <p>ИНН: 504409892030</p>
                                <p className="mt-4 text-white/50 text-sm">Сайт не является публичной офертой.</p>
                            </div>
                        </div>

                        {/* Social */}
                        <div>
                            <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-[#1A9BAA] rounded-full"></div>
                                Мы в соцсетях
                            </h4>
                            <div className="flex gap-4">
                                <a href="https://vk.com" target="_blank" className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-[#0077FF] flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#0077FF]/30">
                                    <span className="font-bold">VK</span>
                                </a>
                                <a href="https://t.me/fisherhouse" target="_blank" className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-[#229ED9] flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-[#229ED9]/30">
                                    <span className="font-bold">TG</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
                        <p>© 2026 FisherHouse. Все права защищены.</p>
                        <p>Made with ❤️ by Antigravity</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
