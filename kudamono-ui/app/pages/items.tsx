'use client';
import { useEffect, useState } from 'react';

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  source: string;
}

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/catalog')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching catalog:", err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Kudamono Catalog</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h2>{item.name}</h2>
            <p><strong>Category:</strong> {item.category} | <strong>Source:</strong> {item.source}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}