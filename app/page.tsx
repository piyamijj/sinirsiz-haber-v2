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

  // Namaz vakitleri (İstanbul - sabit örnek)
  const namaz = {
    imsak: "04:45",
    gunes: "06:15",
    ogle: "13:10",
    ikindi: "17:05",
    aksam: "20:25",
    yatsi: "22:00"
  };

  // Hava durumu (İstanbul - sabit örnek)
  const hava = {
    derece: "28",
    durum: "Güneşli",
    nem: "45%"
  };

  // Döviz (sabıt örnek)
  const doviz = {
    usd: "34.25",
    eur: "37.10",
    gbp: "43.80"
  };

  useEffect(() => {
    fetchNews();
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Logo ve Başlık */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Sınırsız Haber</h1>

        {/* Namaz + Hava + Döviz Kutuları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Namaz Vakitleri */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">🕌 Namaz Vakitleri (İstanbul)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>İmsak</span><span className="font-mono">{namaz.imsak}</span></div>
              <div className="flex justify-between"><span>Güneş</span><span className="font-mono">{namaz.gunes}</span></div>
              <div className="flex justify-between"><span>Öğle</span><span className="font-mono">{namaz.ogle}</span></div>
              <div className="flex justify-between"><span>İkindi</span><span className="font-mono">{namaz.ikindi}</span></div>
              <div className="flex justify-between"><span>Akşam</span><span className="font-mono">{namaz.aksam}</span></div>
              <div className="flex justify-between"><span>Yatsı</span><span className="font-mono">{namaz.yatsi}</span></div>
            </div>
          </div>

          {/* Hava Durumu */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">🌤️ Hava Durumu (İstanbul)</h3>
            <div className="text-center">
              <div className="text-6xl font-bold">{hava.derece}°C</div>
              <div className="text-xl mt-2">{hava.durum}</div>
              <div className="text-sm text-gray-500 mt-1">Nem: {hava.nem}</div>
            </div>
          </div>

          {/* Döviz Kuru */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">💵 Döviz Kuru</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span>USD/TRY</span>
                <span className="font-mono text-lg font-bold">{doviz.usd}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>EUR/TRY</span>
                <span className="font-mono text-lg font-bold">{doviz.eur}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>GBP/TRY</span>
                <span className="font-mono text-lg font-bold">{doviz.gbp}</span>
              </div>
            </div>
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
