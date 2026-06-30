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

  // Namaz vakitleri (İstanbul)
  const namaz = { imsak: "04:45", gunes: "06:15", ogle: "13:10", ikindi: "17:05", aksam: "20:25", yatsi: "22:00" };

  // Hava
  const hava = { derece: "28", durum: "Güneşli", nem: "45%" };

  // Döviz
  const doviz = { usd: "34.25", eur: "37.10", gbp: "43.80" };

  // Nöbetçi Eczane (örnek)
  const eczane = { ad: "Merkez Eczanesi", adres: "Atatürk Cad. No:45", telefon: "0212 555 12 34" };

  // İmsakiye (örnek)
  const imsakiye = { tarih: "30 Haziran 2026", imsak: "04:45", iftar: "20:25" };

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Sınırsız Haber</h1>

        {/* Namaz + Hava + Döviz */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Namaz */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">🕌 Namaz Vakitleri</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(namaz).map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="capitalize">{k}</span><span className="font-mono">{v}</span></div>
              ))}
            </div>
          </div>

          {/* Hava */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">🌤️ Hava Durumu</h3>
            <div className="text-center">
              <div className="text-6xl font-bold">{hava.derece}°C</div>
              <div className="text-xl">{hava.durum}</div>
              <div className="text-sm text-gray-500">Nem: {hava.nem}</div>
            </div>
          </div>

          {/* Döviz */}
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">💵 Döviz Kuru</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(doviz).map(([k, v]) => (
                <div key={k} className="flex justify-between"><span>{k.toUpperCase()}/TRY</span><span className="font-mono font-bold">{v}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Nöbetçi Eczane + İmsakiye */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">💊 Nöbetçi Eczane</h3>
            <div className="text-sm">
              <div className="font-bold">{eczane.ad}</div>
              <div>{eczane.adres}</div>
              <div className="text-blue-600">{eczane.telefon}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl mb-4">🌙 İmsakiye</h3>
            <div className="text-sm">
              <div><strong>Tarih:</strong> {imsakiye.tarih}</div>
              <div><strong>İmsak:</strong> {imsakiye.imsak}</div>
              <div><strong>İftar:</strong> {imsakiye.iftar}</div>
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
