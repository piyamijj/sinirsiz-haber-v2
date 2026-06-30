"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface News {
  id: number;
  baslik: string;
  kategori_id: number;
  resim_url?: string;
}

interface Horoscope {
  current_date: string;
  description: string;
  lucky_number: string;
  lucky_color: string;
  mood: string;
  compatibility: string;
}

export default function SinirsizHaber() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const categories = [
    { id: 1, name: "Gündem", emoji: "📰" },
    { id: 2, name: "Ekonomi", emoji: "💰" },
    { id: 3, name: "Spor", emoji: "⚽" },
    { id: 4, name: "Teknoloji", emoji: "💻" },
    { id: 5, name: "Sağlık", emoji: "🏥" },
    { id: 6, name: "Yaşam", emoji: "🌿" },
    { id: 7, name: "Dünya", emoji: "🌍" }
  ];

  const [namaz, setNamaz] = useState<any>(null);
  const [hava, setHava] = useState<any>(null);
  const [doviz, setDoviz] = useState<any>(null);
  const [imsakIndex, setImsakIndex] = useState(0);

  // Burç State'leri
  const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
  const [showSignDetail, setShowSignDetail] = useState(false);
  const [selectedSign, setSelectedSign] = useState("");
  const [horoscopeData, setHoroscopeData] = useState<Horoscope | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState("");
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);
  const [horoscopeError, setHoroscopeError] = useState("");

  const zodiacSigns = [
    { sign: "aries", name: "Koç", emoji: "♈" },
    { sign: "taurus", name: "Boğa", emoji: "♉" },
    { sign: "gemini", name: "İkizler", emoji: "♊" },
    { sign: "cancer", name: "Yengeç", emoji: "♋" },
    { sign: "leo", name: "Aslan", emoji: "♌" },
    { sign: "virgo", name: "Başak", emoji: "♍" },
    { sign: "libra", name: "Terazi", emoji: "♎" },
    { sign: "scorpio", name: "Akrep", emoji: "♏" },
    { sign: "sagittarius", name: "Yay", emoji: "♐" },
    { sign: "capricorn", name: "Oğlak", emoji: "♑" },
    { sign: "aquarius", name: "Kova", emoji: "♒" },
    { sign: "pisces", name: "Balık", emoji: "♓" }
  ];

  const eczaneLink = "https://www.istanbuleczaciodasi.org.tr/nobetci-eczane/mobile.php?r=2819#nobet-select-page";

  useEffect(() => {
    fetchNews();
    fetchNamaz();
    fetchHava();
    fetchDoviz();
  }, []);

  useEffect(() => {
    if (!namaz) return;
    const interval = setInterval(() => {
      setImsakIndex(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, [namaz]);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('haberler')
      .select('id, baslik, kategori_id, resim_url')
      .order('id', { ascending: false })
      .limit(600);

    if (error) console.error(error);
    else setNews(data || []);
    setLoading(false);
  };

  const fetchNamaz = async () => {
    try {
      const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Istanbul&country=Turkey&method=13');
      const data = await res.json();
      setNamaz(data.data.timings);
    } catch (e) { console.error(e); }
  };

  const fetchHava = async () => {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.95&current=temperature_2m,weather_code&timezone=Europe/Istanbul');
      const data = await res.json();
      setHava({
        derece: Math.round(data.current.temperature_2m),
        durum: data.current.weather_code === 0 ? "Güneşli" : "Bulutlu"
      });
    } catch (e) { console.error(e); }
  };

  const fetchDoviz = async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
      const data = await res.json();
      setDoviz({
        usd: (1 / data.rates.USD).toFixed(2),
        eur: (1 / data.rates.EUR).toFixed(2),
        gbp: (1 / data.rates.GBP).toFixed(2)
      });
    } catch (e) { console.error(e); }
  };

  // MyMemory ile Türkçe çeviri
  const translateToTurkish = async (text: string): Promise<string> => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|tr`
      );
      const data = await res.json();
      return data.responseData?.translatedText || text;
    } catch (error) {
      console.error("Çeviri hatası:", error);
      return text;
    }
  };

  // Burç çekme + çevirme (daha stabil)
  const fetchHoroscope = async (sign: string) => {
    setHoroscopeLoading(true);
    setSelectedSign(sign);
    setShowSignDetail(true);
    setHoroscopeError("");
    setTranslatedDescription("");
    setHoroscopeData(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 saniye timeout

      const res = await fetch('https://aztro.sameerkumar.website/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `sign=${sign}&day=today`,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("API yanıt vermedi");

      const data: Horoscope = await res.json();
      setHoroscopeData(data);

      if (data.description) {
        const translated = await translateToTurkish(data.description);
        setTranslatedDescription(translated);
      }
    } catch (error: any) {
      console.error(error);
      if (error.name === 'AbortError') {
        setHoroscopeError("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
      } else {
        setHoroscopeError("Burç bilgisi alınamadı. Lütfen biraz sonra tekrar deneyin.");
      }
    }
    setHoroscopeLoading(false);
  };

  const filteredNews = activeCategory !== null
    ? news.filter(n => Number(n.kategori_id) === Number(activeCategory))
    : news;

  const imsakItems = namaz ? [
    { label: "İmsak", value: namaz.Fajr },
    { label: "Güneş", value: namaz.Sunrise },
    { label: "Öğle", value: namaz.Dhuhr },
    { label: "İkindi", value: namaz.Asr },
    { label: "İftar", value: namaz.Maghrib },
    { label: "Yatsı", value: namaz.Isha }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sınırsız Haber" className="h-11 w-auto" />
            <span className="text-2xl font-bold text-blue-700">Sınırsız Haber</span>
          </div>

          <div className="flex items-center gap-3">
            {hava && (
              <div className="bg-white border rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <span className="text-2xl">🌤️</span>
                <div>
                  <div className="font-bold text-lg leading-none">{hava.derece}°C</div>
                  <div className="text-xs text-gray-500">{hava.durum}</div>
                </div>
              </div>
            )}

            {imsakItems.length > 0 && (
              <div className="bg-white border rounded-2xl px-4 py-2 min-w-[145px] shadow-sm">
                <div className="text-xs text-gray-500 mb-0.5">İstanbul • İmsakiye</div>
                <div className="font-semibold text-sm transition-all duration-500">
                  {imsakItems[imsakIndex].label}: {imsakItems[imsakIndex].value}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Kategori Butonları */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button onClick={() => setActiveCategory(null)} className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeCategory === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}>
            Tümü
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}>
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* GÜNLÜK BURÇ - TEK ŞIK KART */}
        <div className="mb-10">
          <div 
            onClick={() => setShowHoroscopeModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white cursor-pointer active:scale-[0.985] transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">🔮</span>
                  <h2 className="text-3xl font-bold">Günlük Burç Yorumları</h2>
                </div>
                <p className="text-purple-100">Burcunu seç, günün enerjisini Türkçe öğren</p>
              </div>
              <div className="text-6xl opacity-80">♈♉♊</div>
            </div>
          </div>
        </div>

        {/* Haberler */}
        {loading ? <p className="text-center py-10">Yükleniyor...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {filteredNews.length === 0 ? (
              <p className="col-span-full text-center py-10 text-gray-500">Bu kategoride haber bulunamadı.</p>
            ) : (
              filteredNews.slice(0, 60).map(item => (
                <a href={`/haber/${item.id}`} key={item.id} className="group">
                  <div className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl transition-all duration-300">
                    {item.resim_url && <img src={item.resim_url} alt="" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="p-5">
                      <h3 className="font-bold text-lg leading-snug line-clamp-3 group-hover:text-blue-600 transition">{item.baslik}</h3>
                      <div className="text-xs text-gray-500 mt-3">{categories.find(c => c.id === item.kategori_id)?.name}</div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        )}
      </div>

      {/* Alt Kayan Döviz Bandı */}
      {doviz && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-700 text-white py-3 overflow-hidden z-50">
          <div className="animate-marquee-fast flex items-center gap-16 text-sm font-medium w-max">
            <span>USD/TRY: <span className="font-bold">{doviz.usd}</span></span>
            <span>EUR/TRY: <span className="font-bold">{doviz.eur}</span></span>
            <span>GBP/TRY: <span className="font-bold">{doviz.gbp}</span></span>
            <span>USD/TRY: <span className="font-bold">{doviz.usd}</span></span>
            <span>EUR/TRY: <span className="font-bold">{doviz.eur}</span></span>
            <span>GBP/TRY: <span className="font-bold">{doviz.gbp}</span></span>
          </div>
        </div>
      )}

      {/* BURÇ SEÇME MODAL */}
      {showHoroscopeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-[100]">
          <div className="bg-white w-full md:max-w-2xl md:rounded-3xl md:m-4 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Burcunu Seç</h3>
              <button onClick={() => setShowHoroscopeModal(false)} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {zodiacSigns.map((zodiac) => (
                <button
                  key={zodiac.sign}
                  onClick={() => {
                    setShowHoroscopeModal(false);
                    fetchHoroscope(zodiac.sign);
                  }}
                  className="bg-white border hover:border-purple-500 active:bg-purple-50 transition p-5 rounded-2xl text-center"
                >
                  <div className="text-4xl mb-2">{zodiac.emoji}</div>
                  <div className="font-semibold text-lg">{zodiac.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BURÇ DETAY MODAL */}
      {showSignDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => { 
                setShowSignDetail(false); 
                setHoroscopeData(null); 
                setHoroscopeError(""); 
              }} 
              className="absolute top-4 right-4 text-3xl text-gray-400"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <div className="text-6xl mb-2">
                {zodiacSigns.find(z => z.sign === selectedSign)?.emoji}
              </div>
              <h3 className="text-3xl font-bold">
                {zodiacSigns.find(z => z.sign === selectedSign)?.name}
              </h3>
              <p className="text-gray-500">{horoscopeData?.current_date}</p>
            </div>

            {horoscopeLoading ? (
              <div className="py-10 text-center">
                <p className="text-lg">Burç yorumu alınıyor...</p>
              </div>
            ) : horoscopeError ? (
              <div className="py-6 text-center">
                <p className="text-red-500 mb-4">{horoscopeError}</p>
                <button 
                  onClick={() => fetchHoroscope(selectedSign)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : horoscopeData ? (
              <div className="space-y-5">
                <div>
                  <div className="font-semibold text-gray-700 mb-2">📝 Günlük Yorum</div>
                  <p className="text-gray-700 leading-relaxed">
                    {translatedDescription || horoscopeData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-gray-500 text-xs">Şanslı Sayı</div>
                    <div className="font-bold text-2xl mt-1">{horoscopeData.lucky_number}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-gray-500 text-xs">Şanslı Renk</div>
                    <div className="font-bold text-2xl mt-1">{horoscopeData.lucky_color}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-gray-500 text-xs">Ruh Hali</div>
                    <div className="font-bold text-xl mt-1">{horoscopeData.mood}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="text-gray-500 text-xs">Uyumlu Burç</div>
                    <div className="font-bold text-xl mt-1">{horoscopeData.compatibility}</div>
                  </div>
                </div>
              </div>
            ) : null}

            <button 
              onClick={() => { 
                setShowSignDetail(false); 
                setHoroscopeData(null); 
                setHoroscopeError(""); 
              }} 
              className="mt-6 w-full py-3.5 bg-blue-600 text-white rounded-2xl font-semibold"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
