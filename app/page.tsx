"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface News {
  id: string;
  baslik: string;
  ozet: string;
  kategori_id: number;
  kaynak_url: string;
}

export default function SinirsizHaber() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('haberler')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setNews(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Sınırsız Haber</h1>
      
      {loading ? <p>Yükleniyor...</p> : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow">
              <h3 className="font-bold text-xl">{item.baslik}</h3>
              <p className="text-gray-600 mt-2">{item.ozet}</p>
              <a href={item.kaynak_url} target="_blank" className="text-blue-600 text-sm mt-4 block">Devamını oku →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
