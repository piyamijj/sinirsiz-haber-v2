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

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('haberler')
      .select('id, baslik')
      .order('id', { ascending: false });

    if (error) console.error(error);
    else setNews(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Sınırsız Haber</h1>
      
      {loading ? <p className="text-center">Yükleniyor...</p> : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow">
              <h3 className="font-bold text-xl">{item.baslik}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
