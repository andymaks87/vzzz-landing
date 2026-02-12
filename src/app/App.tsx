import { useState } from 'react';
import { Menu, X, Fish, Check, MapPin, Phone, Mail, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [bookingStep, setBookingStep] = useState(1);

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

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1648147870253-c45f6f430528?w=800',
      caption: 'Гостиная с панорамным видом'
    },
    {
      url: 'https://images.unsplash.com/photo-1639751907353-3629fc00d2b2?w=800',
      caption: 'Уютная спальня'
    },
    {
      url: 'https://images.unsplash.com/photo-1758861356142-546a3822ab1a?w=800',
      caption: 'Баня-бочка'
    },
    {
      url: 'https://images.unsplash.com/photo-1748570570668-2148c2ec47ed?w=800',
      caption: 'Причал и лодки'
    },
    {
      url: 'https://images.unsplash.com/photo-1658138617632-feb6a9538436?w=800',
      caption: 'Зона барбекю'
    },
    {
      url: 'https://images.unsplash.com/photo-1760998805360-52ab052f0feb?w=800',
      caption: 'Закат на озере'
    }
  ];

  const openLightbox = (url: string) => {
    setLightboxImage(url);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <img
            src={lightboxImage}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0B2A3D] backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-5 md:px-20">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1A9BAA] flex items-center justify-center">
                <Fish className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl text-white font-semibold">Дом у воды</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#about" className="text-white/90 hover:text-white transition-colors">О доме</a>
              <a href="#gallery" className="text-white/90 hover:text-white transition-colors">Галерея</a>
              <a href="#booking" className="text-white/90 hover:text-white transition-colors">Бронирование</a>
              <a href="#directions" className="text-white/90 hover:text-white transition-colors">Как добраться</a>
              <Button className="bg-[#1A9BAA] hover:bg-[#168A97] text-white px-6 h-12 rounded-2xl shadow-lg shadow-[#1A9BAA]/20">
                Забронировать
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 space-y-4 border-t border-white/10">
              <a href="#about" className="block text-white/90 hover:text-white transition-colors py-2">О доме</a>
              <a href="#gallery" className="block text-white/90 hover:text-white transition-colors py-2">Галерея</a>
              <a href="#booking" className="block text-white/90 hover:text-white transition-colors py-2">Бронирование</a>
              <a href="#directions" className="block text-white/90 hover:text-white transition-colors py-2">Как добраться</a>
              <Button className="w-full bg-[#1A9BAA] hover:bg-[#168A97] text-white h-12 rounded-2xl mt-4">
                Забронировать
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 md:pt-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1760998805360-52ab052f0feb?w=1600"
            alt="Дом у воды"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-20 py-20 md:py-32 w-full">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 md:mb-8 leading-tight">
              Дом у воды на Вазузском водохранилище
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-8 md:mb-12 leading-relaxed">
              Премиум отдых для рыбаков и охотников в 220 км от Москвы
            </p>

            {/* Feature Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-10 md:mb-14">
              {['130 м² комфорта', 'Прямой выход к воде', 'Баня-бочка', 'До 8 гостей'].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A9BAA] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#1A9BAA] hover:bg-[#168A97] text-white px-8 h-14 text-lg rounded-2xl shadow-xl shadow-[#1A9BAA]/30">
                Забронировать
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 h-14 text-lg rounded-2xl backdrop-blur-md">
                Смотреть фото
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFB] to-transparent" />
      </section>

      {/* Fish Pattern Background for remaining sections */}
      <div className="relative" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 20c-5 0-9 2-9 5s4 5 9 5 9-2 9-5-4-5-9-5zm0 8c-3.5 0-6-1.5-6-3s2.5-3 6-3 6 1.5 6 3-2.5 3-6 3z' fill='%231A9BAA' fill-opacity='0.03'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}>
        {/* About Section */}
        <section id="about" className="py-20 md:py-32">
          <div className="max-w-[1240px] mx-auto px-5 md:px-20">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6">Всё для идеального отдыха</h2>
              <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
                Мы продумали каждую деталь вашего комфорта
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#E2E8F0]"
                >
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl md:text-2xl mb-3">{feature.title}</h3>
                  <p className="text-[#64748B] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking" className="py-20 md:py-32 bg-white/50">
          <div className="max-w-[1240px] mx-auto px-5 md:px-20">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6">Бронирование</h2>
              <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
                Выберите даты и оставьте заявку
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center mb-12 md:mb-16 gap-2 md:gap-4 overflow-x-auto pb-4">
              {[
                { num: 1, label: 'Даты' },
                { num: 2, label: 'Контакты' },
                { num: 3, label: 'Подтверждение' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      bookingStep >= step.num 
                        ? 'bg-[#1A9BAA] text-white shadow-lg shadow-[#1A9BAA]/30' 
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}>
                      {step.num}
                    </div>
                    <span className={`font-medium hidden sm:inline ${
                      bookingStep >= step.num ? 'text-[#0F1419]' : 'text-[#64748B]'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <ChevronRight className="w-5 h-5 text-[#64748B] mx-2 md:mx-4 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-[#E2E8F0] overflow-hidden">
              {bookingStep === 1 && (
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12">
                  {/* Calendar Placeholder */}
                  <div className="space-y-6">
                    <h3 className="text-2xl mb-6">Выберите даты</h3>
                    <div className="bg-[#F8FAFB] rounded-2xl p-8 min-h-[320px] flex items-center justify-center border-2 border-dashed border-[#E2E8F0]">
                      <div className="text-center text-[#64748B]">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
                        <p>Календарь бронирования</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-6">
                    <h3 className="text-2xl mb-6">Детали бронирования</h3>
                    <div className="bg-[#F8FAFB] rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between py-3 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Заезд</span>
                        <span className="font-semibold">Выберите дату</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Выезд</span>
                        <span className="font-semibold">Выберите дату</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Ночей</span>
                        <span className="font-semibold">—</span>
                      </div>
                      <div className="flex justify-between py-3 pt-6">
                        <span className="text-xl">Итого</span>
                        <span className="text-2xl font-bold text-[#1A9BAA]">— ₽</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setBookingStep(2)}
                      className="w-full bg-[#1A9BAA] hover:bg-[#168A97] text-white h-14 text-lg rounded-2xl shadow-lg shadow-[#1A9BAA]/20"
                    >
                      Далее
                    </Button>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="p-8 md:p-12 max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl mb-8">Контактные данные</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Имя</label>
                      <Input 
                        className="h-14 rounded-2xl bg-[#F8FAFB] border-[#E2E8F0]" 
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Телефон</label>
                      <Input 
                        type="tel"
                        className="h-14 rounded-2xl bg-[#F8FAFB] border-[#E2E8F0]" 
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input 
                        type="email"
                        className="h-14 rounded-2xl bg-[#F8FAFB] border-[#E2E8F0]" 
                        placeholder="example@mail.ru"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Комментарий</label>
                      <Textarea 
                        className="min-h-32 rounded-2xl bg-[#F8FAFB] border-[#E2E8F0]" 
                        placeholder="Дополнительные пожелания..."
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setBookingStep(1)}
                        className="flex-1 h-14 rounded-2xl border-2"
                      >
                        Назад
                      </Button>
                      <Button 
                        onClick={() => setBookingStep(3)}
                        className="flex-1 bg-[#1A9BAA] hover:bg-[#168A97] text-white h-14 rounded-2xl shadow-lg shadow-[#1A9BAA]/20"
                      >
                        Далее
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="p-8 md:p-12 max-w-2xl mx-auto text-center">
                  <div className="w-20 h-20 bg-[#1A9BAA]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-[#1A9BAA]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl mb-4">Почти готово!</h3>
                  <p className="text-[#64748B] text-lg mb-8 leading-relaxed">
                    Проверьте данные и отправьте заявку. Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setBookingStep(2)}
                      className="flex-1 h-14 rounded-2xl border-2"
                    >
                      Назад
                    </Button>
                    <Button 
                      className="flex-1 bg-[#1A9BAA] hover:bg-[#168A97] text-white h-14 rounded-2xl shadow-lg shadow-[#1A9BAA]/20"
                    >
                      Отправить заявку
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 md:py-32">
          <div className="max-w-[1240px] mx-auto px-5 md:px-20">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6">Фотогалерея</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {galleryImages.map((image, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(image.url)}
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-medium text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Directions Section */}
        <section id="directions" className="py-20 md:py-32 bg-white/50">
          <div className="max-w-[1240px] mx-auto px-5 md:px-20">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl mb-6">Как добраться</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Info Card */}
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#E2E8F0] space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#1A9BAA] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl mb-2 font-semibold">Адрес</h3>
                    <p className="text-[#64748B] leading-relaxed">
                      Смоленская область, Вазузское водохранилище, деревня Хлепень
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <p className="text-[#64748B] mb-6 leading-relaxed">
                    220 км от МКАД по Новорижскому шоссе. Асфальт до деревни, удобный подъезд круглый год.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full justify-start bg-[#1A9BAA] hover:bg-[#168A97] text-white h-14 rounded-2xl shadow-lg shadow-[#1A9BAA]/20">
                    <MapPin className="w-5 h-5 mr-2" />
                    Открыть в навигаторе
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-2">
                    <Phone className="w-5 h-5 mr-2" />
                    Скопировать координаты
                  </Button>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-[#F8FAFB] rounded-3xl overflow-hidden h-[400px] md:h-auto min-h-[400px] border-2 border-dashed border-[#E2E8F0] flex items-center justify-center">
                <div className="text-center text-[#64748B]">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>Интерактивная карта</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0B2A3D] text-white py-16 md:py-20">
          <div className="max-w-[1240px] mx-auto px-5 md:px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
              {/* Contacts */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Контакты</h4>
                <div className="space-y-4 text-white/80">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <span>info@domuvody.ru</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                    <span>Смоленская обл., д. Хлепень</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Документы</h4>
                <div className="space-y-3 text-white/80">
                  <a href="#" className="block hover:text-white transition-colors">Оферта</a>
                  <a href="#" className="block hover:text-white transition-colors">Конфиденциальность</a>
                  <a href="#" className="block hover:text-white transition-colors">Правила проживания</a>
                  <a href="#" className="block hover:text-white transition-colors">Соглашение</a>
                </div>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Информация</h4>
                <div className="space-y-3 text-white/80">
                  <p>Арендодатель: ИП Иванов И.И.</p>
                  <p>ИНН: 1234567890</p>
                  <p>Режим работы: 24/7</p>
                </div>
              </div>

              {/* Social */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Соцсети</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    VK
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    TG
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    WA
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-white/10 text-center md:text-left text-white/60">
              <p>© 2026 Дом у воды. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
