import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ChevronLeft, ChevronRight, Check, CreditCard, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwfZ9KFuYtW3ZnWB2yFVOAGtV6ygiVuaIs3IGBYSMj4Q90k0PUjrtbjBIJhcCUvnenW/exec',
};

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

interface BookingWidgetProps {
    onBookingSuccess?: () => void;
}

export default function BookingWidget({ onBookingSuccess }: BookingWidgetProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [paidDates, setPaidDates] = useState<Date[]>([]);
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'booking' | 'waitlist'>('booking');

    // Form State
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestCount, setGuestCount] = useState(2);
    const [guestComment, setGuestComment] = useState('');
    const [promoCode, setPromoCode] = useState('');

    // Legal & Marketing
    const [agreePersonalData, setAgreePersonalData] = useState(false);
    const [agreeNewsletter, setAgreeNewsletter] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'sbp' | 'qr'>('sbp');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Load booked dates on mount
    useEffect(() => {
        const loadDates = async () => {
            try {
                const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=getBookedDates`);
                const data = await res.json();
                if (data?.booked) setBookedDates(data.booked.map((d: string) => new Date(d)));
                if (data?.paid) setPaidDates(data.paid.map((d: string) => new Date(d)));
            } catch (e) {
                console.error('Failed to load dates', e);
            }
        };
        loadDates();
    }, []);

    const isoDate = (d: Date) => {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const isDateBooked = (d: Date) => {
        const dStr = isoDate(d);
        return bookedDates.some(bd => isoDate(bd) === dStr) || paidDates.some(pd => isoDate(pd) === dStr);
    };

    const handleDateClick = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today || (selectionMode === 'booking' && isDateBooked(date))) return;

        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(date);
            setCheckOut(null);
        } else {
            if (date <= checkIn) {
                setCheckIn(date);
                setCheckOut(null);
            } else {
                // Check range for booked dates
                let fail = false;
                const temp = new Date(checkIn);
                while (temp <= date) {
                    if (selectionMode === 'booking' && isDateBooked(temp)) {
                        fail = true;
                        break;
                    }
                    temp.setDate(temp.getDate() + 1);
                }

                if (fail) {
                    alert('Выбранный период включает занятые даты.');
                    return;
                }
                setCheckOut(date);
            }
        }
    };


    const calculateTotal = () => {
        if (!checkIn || !checkOut) return 0;
        let total = 0;
        // Clone checkIn to avoid mutating state
        const current = new Date(checkIn);
        while (current < checkOut) {
            const day = current.getDay();
            // Friday (5) and Saturday (6) counts as weekend rate
            if (day === 5 || day === 6) {
                total += 15; // Test rate: Weekend
            } else {
                total += 10; // Test rate: Weekday
            }
            current.setDate(current.getDate() + 1);
        }
        return total;
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const offset = firstDay === 0 ? 6 : firstDay - 1;

        const days = [];
        for (let i = 0; i < offset; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isBooked = isDateBooked(date);
            const isDisabled = date < today;

            let statusClass = "bg-[#F8FAFB] hover:bg-[#1A9BAA]/10 text-gray-700";
            if (isDisabled) statusClass = "opacity-30 cursor-not-allowed";
            else if (isBooked) statusClass = "bg-red-100 text-red-400 cursor-not-allowed border border-red-200";

            const isSelected = (checkIn && isoDate(date) === isoDate(checkIn)) || (checkOut && isoDate(date) === isoDate(checkOut));
            const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;

            if (isSelected) statusClass = "bg-[#1A9BAA] text-white font-bold shadow-md";
            else if (isInRange) statusClass = "bg-[#1A9BAA]/20 text-[#1A9BAA]";


            days.push(
                <div
                    key={d}
                    onClick={() => !isDisabled && (selectionMode === 'waitlist' || !isBooked) && handleDateClick(date)}
                    className={`
                    p-2 text-center rounded-lg cursor-pointer transition-all text-sm font-medium border border-transparent
                    ${statusClass}
                    ${isSelected && selectionMode === 'waitlist' ? '!bg-orange-500 !text-white' : ''}
                    ${isInRange && selectionMode === 'waitlist' ? '!bg-orange-100 !text-orange-600' : ''}
                `}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    // ... validateForm ... 

    // START OF REPLACEMENT FOR SUMMARY SECTION (Step 1) to include TOTAL PRICE
    // Use view tool logic to find exact location, but since I'm in multi-replace I'll target the Summary block specifically if I can.
    // Actually, I should just replace the helper function first, and then the JSX separately? 
    // Wait, the tool instructions say "For each ReplacementChunk...". I can do multiple.

    // Let's replace the whole Summary block in Step 1.


    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!guestName.trim()) newErrors.name = 'Введите имя';
        if (!guestPhone.trim()) newErrors.phone = 'Введите телефон';
        else if (guestPhone.length < 10) newErrors.phone = 'Проверьте номер';
        if (!guestEmail.trim()) newErrors.email = 'Введите email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) newErrors.email = 'Некорректный email';

        if (!agreePersonalData) newErrors.agree = 'Необходимо согласие';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.substring(0, 11);

        let formatted = val;
        if (val.length > 0) {
            if (['7', '8'].includes(val[0])) {
                if (val.length > 1) formatted = `+7 (${val.substring(1, 4)}) ${val.substring(4, 7)}-${val.substring(7, 9)}-${val.substring(9, 11)}`;
                else formatted = '+7 ';
            } else {
                formatted = `+7 ${val}`;
            }
        }
        setGuestPhone(formatted);
        if (errors.phone) setErrors({ ...errors, phone: '' });
    };

    const sendRequest = async () => {
        if (!checkIn || !checkOut) return;
        if (!validateForm()) return;

        setLoading(true);

        const payload = {
            action: 'createRequest',
            checkIn: isoDate(checkIn),
            checkOut: isoDate(checkOut),
            guests: guestCount,
            name: guestName,
            phone: guestPhone,
            email: guestEmail,

            comment: selectionMode === 'waitlist' ? `[WAITLIST] ${guestComment}` : guestComment,
            promoCode: promoCode,
            paymentMethod: paymentMethod === 'sbp' ? 'СБП (номер)' : 'QR-код',
            newsletter: agreeNewsletter ? 'yes' : 'no'
        };

        try {
            const formData = new FormData();
            Object.entries(payload).forEach(([key, value]) => formData.append(key, String(value)));

            await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            setSuccess(true);
            onBookingSuccess?.();
            setStep(3);
        } catch (e) {
            alert('Ошибка отправки. Попробуйте позже или позвоните нам.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center p-8 md:p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка принята!</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Для подтверждения бронирования, пожалуйста, оплатите заказ выбранным способом.
                </p>

                <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-200 mb-8 text-left max-w-md mx-auto shadow-inner">
                    <h4 className="font-bold text-lg mb-6 text-gray-800 text-center">Реквизиты для оплаты</h4>

                    {paymentMethod === 'sbp' ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 shrink-0">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium">Номер телефона (СБП)</p>
                                    <p className="font-bold text-xl text-gray-900 tracking-wide">8 (995) 308-95-80</p>
                                    <p className="text-xs text-gray-500 mt-1">ОТП Банк</p>
                                </div>
                            </div>
                            <div className="text-center text-sm text-gray-500">
                                Получатель: <span className="font-semibold text-gray-700">Емельянов Евгений Юрьевич</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-3 border border-gray-200 rounded-2xl mb-4 shadow-sm">
                                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-xl">
                                    <QrCode className="w-16 h-16 text-gray-300" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                                Отсканируйте QR-код в приложении банка<br />для быстрой оплаты
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200/60">
                        <p className="text-sm text-gray-500 mb-3 text-center">
                            После оплаты отправьте чек (скриншот):
                        </p>
                        <a href="https://t.me/VazuzaFisherHouse_bot" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-[#1A9BAA] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#158896] transition-colors shadow-lg shadow-[#1A9BAA]/20">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-1.08-1.48-1.08-.87-.64.06-1 .55-1.55.33-.36 1.76-1.68 1.76-1.68.08-.08.13-.24-.04-.26-.18-.02-1.2.74-2.4 1.58-1.88 1.32-3.08 1.15-3.08 1.15-.84-.13-1.85-.38-2.65-.63-.98-.3-1.74-.63-1.74-.63.63-.3 8.3-3.23 11-4.28 2.3-.9 2.58-.93 2.9-.93.07 0 .23.02.32.09.08.07.13.17.13.27v.06z" /></svg>
                            Отправить чек в Telegram
                        </a>
                    </div>
                </div>

                <Button onClick={() => window.location.reload()} variant="ghost" className="text-gray-400 hover:text-gray-600">
                    Вернуться на главную
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header Steps */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex-1 py-4 text-center text-sm font-semibold transition-colors
                    ${step >= s ? 'text-[#1A9BAA]' : 'text-gray-400'}
                    ${step === s ? 'bg-white shadow-sm ring-1 ring-black/5 z-10' : ''}
                `}>
                        Шаг {s}
                    </div>
                ))}
            </div>

            <div className="p-6 md:p-10">
                {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Calendar */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <h3 className="text-lg font-bold text-gray-900 shadow-sm">
                                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h3>
                                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {renderCalendar()}
                            </div>
                            <div className="mt-6 flex gap-6 text-xs text-gray-500 justify-center border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div> Занято</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#1A9BAA] rounded shadow-sm"></div> Выбрано</div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h4 className="text-xl font-bold mb-6">Детали бронирования</h4>
                                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Заезд</span>
                                        <span className="font-semibold">{checkIn ? checkIn.toLocaleDateString() : '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Выезд</span>
                                        <span className="font-semibold">{checkOut ? checkOut.toLocaleDateString() : '—'}</span>
                                    </div>
                                    <div className="flex justify-between pt-4 border-t border-gray-200">
                                        <span className="text-gray-900 font-bold">Итого дней</span>
                                        <span className="text-gray-900 font-semibold">
                                            {checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-[#1A9BAA] font-bold text-lg">К оплате</span>
                                        <span className="text-[#1A9BAA] font-bold text-lg">
                                            {checkIn && checkOut ? calculateTotal().toLocaleString() : 0} ₽
                                        </span>
                                    </div>
                                </div>

                                {checkIn && checkOut && (
                                    <div className="mt-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 animate-in fade-in">
                                        <p className="font-bold mb-1">Расчет стоимости:</p>
                                        <div className="flex justify-between mt-2">
                                            <span>Тариф</span>
                                            <span className="font-semibold">Тестовый режим</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                className={`w-full h-14 text-lg text-white rounded-xl mt-6 shadow-lg transition-all
                                    ${selectionMode === 'waitlist' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-[#1A9BAA] hover:bg-[#158896] shadow-[#1A9BAA]/20'}
                                `}
                                disabled={!checkIn || !checkOut}
                                onClick={() => setStep(2)}
                            >
                                {selectionMode === 'waitlist' ? 'Оставить заявку' : 'Далее'}
                            </Button>

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => {
                                        setSelectionMode(prev => prev === 'booking' ? 'waitlist' : 'booking');
                                        setCheckIn(null);
                                        setCheckOut(null);
                                    }}
                                    className={`text-sm font-medium underline decoration-dashed underline-offset-4 transition-colors ${selectionMode === 'waitlist' ? 'text-orange-600' : 'text-gray-400 hover:text-[#1A9BAA]'}`}
                                >
                                    {selectionMode === 'waitlist' ? 'Вернуться к бронированию' : 'Нужных дат нет? Встать в лист ожидания'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-xl mx-auto space-y-6">
                        <div className="text-center mb-4">
                            <h3 className="text-2xl font-bold mb-2">Контактные данные</h3>
                            <p className="text-gray-500 text-sm">Заполните поля, чтобы мы могли связаться с вами</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-1.5 text-gray-700">Имя и Фамилия <span className="text-red-500">*</span></label>
                                    <Input value={guestName} onChange={e => { setGuestName(e.target.value); if (errors.name) setErrors({ ...errors, name: '' }) }} placeholder="Иван Иванов" className={`h-12 bg-gray-50 ${errors.name ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-gray-700">Телефон <span className="text-red-500">*</span></label>
                                    <Input value={guestPhone} onChange={handlePhoneChange} placeholder="+7 (999)..." type="tel" className={`h-12 bg-gray-50 ${errors.phone ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-gray-700">Гостей</label>
                                    <Input value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} type="number" min={1} max={8} className="h-12 bg-gray-50" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1.5 text-gray-700">Email <span className="text-red-500">*</span></label>
                                <Input value={guestEmail} onChange={e => { setGuestEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }} placeholder="email@example.com" type="email" className={`h-12 bg-gray-50 ${errors.email ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-gray-700">Промокод</label>
                                    <Input
                                        value={promoCode}
                                        onChange={e => setPromoCode(e.target.value)}
                                        placeholder="PROMO2026"
                                        className="h-12 bg-gray-50 border-dashed border-2 border-gray-300 focus:border-[#1A9BAA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-gray-700">Способ оплаты</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setPaymentMethod('sbp')}
                                            className={`h-12 rounded-lg border flex items-center justify-center font-bold text-sm transition-all
                                            ${paymentMethod === 'sbp' ? 'bg-[#1A9BAA]/10 border-[#1A9BAA] text-[#1A9BAA]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}
                                        `}
                                        >
                                            СБП
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('qr')}
                                            className={`h-12 rounded-lg border flex items-center justify-center font-bold text-sm transition-all
                                            ${paymentMethod === 'qr' ? 'bg-[#1A9BAA]/10 border-[#1A9BAA] text-[#1A9BAA]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}
                                        `}
                                        >
                                            QR
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Checkboxes - Legal */}
                            <div className="space-y-3 pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            checked={agreePersonalData}
                                            onChange={(e) => {
                                                setAgreePersonalData(e.target.checked);
                                                if (e.target.checked && errors.agree) setErrors({ ...errors, agree: '' });
                                            }}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 shadow-sm transition-all checked:border-[#1A9BAA] checked:bg-[#1A9BAA] hover:border-[#1A9BAA]"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <div className="text-sm text-gray-600 leading-snug">
                                        Я даю согласие на обработку моих персональных данных и соглашаюсь с <Link to="/privacy" target="_blank" className="text-[#1A9BAA] underline hover:text-[#158896]">Политикой конфиденциальности</Link> и <Link to="/agreement" target="_blank" className="text-[#1A9BAA] underline hover:text-[#158896]">Офертой</Link> <span className="text-red-500">*</span>
                                        {errors.agree && <p className="text-red-500 text-xs mt-1 font-medium">{errors.agree}</p>}
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            checked={agreeNewsletter}
                                            onChange={(e) => setAgreeNewsletter(e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 shadow-sm transition-all checked:border-[#1A9BAA] checked:bg-[#1A9BAA] hover:border-[#1A9BAA]"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <div className="text-sm text-gray-600 leading-snug">
                                        Я хочу получать новости, спецпредложения и информацию об акциях
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <Button variant="outline" onClick={() => setStep(1)} className="order-2 md:order-1 flex-1 h-14 text-base rounded-xl font-bold text-gray-600 border-2 border-gray-100 hover:border-gray-200 bg-transparent hover:bg-gray-50">Назад</Button>
                            <Button
                                className={`order-1 md:order-2 flex-1 h-14 text-base rounded-xl bg-[#1A9BAA] hover:bg-[#158896] text-white shadow-lg shadow-[#1A9BAA]/20 transition-all ${loading || !agreePersonalData ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                                onClick={sendRequest}
                                disabled={loading || !agreePersonalData}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Отправка...
                                    </div>
                                ) : 'Отправить заявку'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
