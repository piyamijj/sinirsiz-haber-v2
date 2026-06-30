"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface News {
  id: number;
  baslik: string;
  kategori_id: number;
  resim_url?: string;
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
    { id: 6, name: "Yaşam", emoji: "🌿" }
  ];

  const [namaz, setNamaz] = useState<any>(null);
  const [hava, setHava] = useState<any>(null);
  const [doviz, setDoviz] = useState<any>(null);

  const eczaneLink = "https://www.istanbuleczaciodasi.org.tr/nobetci-eczane/mobile.php?r=2819#nobet-select-page";
  const [imsakIndex, setImsakIndex] = useState(0);

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
      {/* Navbar - Logo + Yazı Birlikte */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sınırsız Haber" className="h-11 w-auto" />
            <span className="text-2xl font-bold text-blue-700">Sınırsız Haber</span>
          </div>

          {/* Sağ Üst: Hava + İmsakiye */}
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
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeCategory === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Tümü
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Haberler */}
        {loading ? (
          <p className="text-center py-10">Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {filteredNews.length === 0 ? (
              <p className="col-span-full text-center py-10 text-gray-500">Bu kategoride haber bulunamadı.</p>
            ) : (
              filteredNews.slice(0, 60).map(item => (
                <a href={`/haber/${item.id}`} key={item.id} className="group">
                  <div className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl transition-all duration-300">
                    {item.resim_url && (
                      <img 
                        src={item.resim_url} 
                        alt="" 
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg leading-snug line-clamp-3 group-hover:text-blue-600 transition">
                        {item.baslik}
                      </h3>
                      <div className="text-xs text-gray-500 mt-3">
                        {categories.find(c => c.id === item.kategori_id)?.name}
                      </div>
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
          <div className="animate-marquee-fast whitespace-nowrap flex items-center gap-16 text-sm font-medium">
            <span>USD/TRY: <span className="font-bold">{doviz.usd}</span></span>
            <span>EUR/TRY: <span className="font-bold">{doviz.eur}</span></span>
            <span>GBP/TRY: <span className="font-bold">{doviz.gbp}</span></span>
            <span>USD/TRY: <span className="font-bold">{doviz.usd}</span></span>
            <span>EUR/TRY: <span className="font-bold">{doviz.eur}</span></span>
            <span>GBP/TRY: <span className="font-bold">{doviz.gbp}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
