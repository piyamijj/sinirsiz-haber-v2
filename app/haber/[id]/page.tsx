"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

interface News {
  id: number;
  baslik: string;
  ozet: string;
  resim_url?: string;
  kaynak_url: string;
}

export default function HaberDetay() {
  const params = useParams();
  const id = params.id as string;
  const [haber, setHaber] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchHaber(id);
  }, [id]);

  const fetchHaber = async (haberId: string) => {
    const { data, error } = await supabase
      .from('haberler')
      .select('*')
      .eq('id', parseInt(haberId))
      .single();

    if (error) console.error(error);
    else setHaber(data);
    setLoading(false);
  };

  // HTML etiketlerini temizle
  const cleanText = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (!haber) return <div className="p-8 text-center">Haber bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow">
        
        {/* Resim */}
        {haber.resim_url && (
          <img 
            src={haber.resim_url} 
            alt={haber.baslik} 
            className="w-full h-80 object-cover rounded-2xl mb-6" 
          />
        )}
        
        <h1 className="text-3xl font-bold mb-6">{haber.baslik}</h1>
        
        {/* Temizlenmiş Açıklama */}
        {haber.ozet && cleanText(haber.ozet).length > 10 ? (
          <div className="prose max-w-none mb-8 text-gray-700 leading-relaxed">
            {cleanText(haber.ozet)}
          </div>
        ) : (
          <div className="mb-8 p-4 bg-gray-100 rounded-xl text-gray-600">
            Bu haber için detaylı açıklama bulunmuyor.
          </div>
        )}

        <a 
          href={haber.kaynak_url} 
          target="_blank" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Kaynağa Git →
        </a>

        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:underline">← Ana Sayfaya Dön</a>
        </div>
      </div>
    </div>
  );
}
