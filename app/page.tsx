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
  const = useState<News[]>([ { id: 1, name: "Gündem", emoji: "📰" },
    { id: 2, name: "Ekonomi", emoji: "💰" },
    { id: 3, name: "Spor", emoji: "⚽" },
    { id: 4, name: "Teknoloji", emoji: "💻" },
    { id: 5, name: "Sağlık", emoji: "🏥" },
    { id: 6, name: "Yaşam", emoji: "🌿" }
  ];

  const = useState<any>(null);
  const = useState<any>(null);
  const = useState<any>(null);

  const eczaneLink = "https://www.istanbuleczaciodasi.org.tr/nobetci-eczane/mobile.php?r=2819#nobet-select-page";

  useEffect(() => {
    fetchNews();
    fetchNamaz();
    fetchHava();
    fetchDoviz();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('haberler')
      .select('id, baslik, kategori_id, resim_url')
      .order('id', { ascending: false })
      .limit(100);

    if (error) console.error("Haber çekme hatası:", error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Sınırsız Haber</h1>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button onClick={() => setActiveCategory(null)} className={`px-5 py-2 rounded-full text-sm font-medium ${activeCategory === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
            Tümü
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Namaz, Hava, Döviz, Eczane kutuları buraya gelecek - kısalttım */}
          <div className="bg-white p-6 rounded-3xl shadow text-center">
            <p className="text-sm text-gray-500">Diğer kutular (Namaz, Hava, Döviz, Eczane)</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          {activeCategory ? categories.find(c => c.id === activeCategory)?.name : "Tüm Haberler"}
        </h2>

        {loading ? <p>Yükleniyor...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNews.length === 0 ? (
              <p className="col-span-2 text-center py-10 text-gray-500">Bu kategoride henüz haber bulunmuyor.</p>
            ) : (
              filteredNews.slice(0, 30).map(item => (
                <a href={`/haber/${item.id}`} key={item.id} className="block">
                  <div className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl transition">
                    {item.resim_url && (
                      <img src={item.resim_url} alt="" className="w-full h-48 object-cover" />
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg leading-tight">{item.baslik}</h3>
                      <div className="text-xs text-gray-500 mt-3">
                        {categories.find(c => c.id === item.kategori_id)?.name || "Haber"}
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
