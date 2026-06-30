"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface News {
  id: number;
  baslik: string;
}

export default function SinirsizHaber() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // Dinamik Veriler
  const [namaz, setNamaz] = useState<any>(null);
  const [hava, setHava] = useState<any>(null);
  const [doviz, setDoviz] = useState<any>(null);

  useEffect(() => {
    fetchNews();
    fetchNamaz();
    fetchHava();
    fetchDoviz();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('haberler')
      .select('id, baslik')
      .order('id', { ascending: false })
      .limit(20);

    if (error) console.error(error);
    else setNews(data || []);
    setLoading(false);
  };

  // Namaz Vakitleri (AlAdhan API - ücretsiz)
  const fetchNamaz = async () => {
    try {
      const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Istanbul&country=Turkey&method=13');
      const data = await res.json();
      setNamaz(data.data.timings);
    } catch (e) {
      console.error(e);
    }
  };

  // Hava Durumu (Open-Meteo - ücretsiz, key yok)
  const fetchHava = async () => {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.95&current=temperature_2m,weather_code&timezone=Europe/Istanbul');
      const data = await res.json();
      setHava({
        derece: Math.round(data.current.temperature_2m),
        durum: data.current.weather_code === 0 ? "Güneşli" : "Bulutlu"
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Döviz Kuru (ExchangeRate API - ücretsiz)
  const fetchDoviz = async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
      const data = await res.json();
      setDoviz({
        usd: (1 / data.rates.USD).toFixed(2),
        eur: (1 / data.rates.EUR).toFixed(2),
        gbp: (1 / data.rates.GBP).toFixed(2)
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Sınırsız Haber</h1>

        {/* Namaz + Hava + Döviz */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Namaz */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">🕌 Namaz Vakitleri (İstanbul)</h3>
            {namaz ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>İmsak</span><span className="font-mono">{namaz.Fajr}</span></div>
                <div className="flex justify-between"><span>Güneş</span><span className="font-mono">{namaz.Sunrise}</span></div>
                <div className="flex justify-between"><span>Öğle</span><span className="font-mono">{namaz.Dhuhr}</span></div>
                <div className="flex justify-between"><span>İkindi</span><span className="font-mono">{namaz.Asr}</span></div>
                <div className="flex justify-between"><span>Akşam</span><span className="font-mono">{namaz.Maghrib}</span></div>
                <div className="flex justify-between"><span>Yatsı</span><span className="font-mono">{namaz.Isha}</span></div>
              </div>
            ) : <p>Yükleniyor...</p>}
          </div>

          {/* Hava */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">🌤️ Hava Durumu (İstanbul)</h3>
            {hava ? (
              <div className="text-center">
                <div className="text-6xl font-bold">{hava.derece}°C</div>
                <div className="text-xl mt-2">{hava.durum}</div>
              </div>
            ) : <p>Yükleniyor...</p>}
          </div>

          {/* Döviz */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">💵 Döviz Kuru</h3>
            {doviz ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>USD/TRY</span><span className="font-mono font-bold">{doviz.usd}</span></div>
                <div className="flex justify-between"><span>EUR/TRY</span><span className="font-mono font-bold">{doviz.eur}</span></div>
                <div className="flex justify-between"><span>GBP/TRY</span><span className="font-mono font-bold">{doviz.gbp}</span></div>
              </div>
            ) : <p>Yükleniyor...</p>}
          </div>
        </div>

        {/* Haberler */}
        <h2 className="text-2xl font-bold mb-4">Son Haberler</h2>
        {loading ? <p>Yükleniyor...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow">
                <h3 className="font-bold text-xl">{item.baslik}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
