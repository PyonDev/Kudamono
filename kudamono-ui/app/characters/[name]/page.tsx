'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Character {
  id: string;
  charName: string;
  series: string;
  tags: string[];
  imageUrl: string;
}

export default function CharacterDetailPage() {
  const params = useParams();
  
  const nameParam = params?.name as string; 
  const decodedName = nameParam ? decodeURIComponent(nameParam) : '';

  const [char, setChar] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!decodedName) return;

    async function loadCharacterDetail() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8080/api/v1/catalog/${encodeURIComponent(decodedName)}`);
        
        if (response.status === 404) {
          setChar(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Could not sync details from database server.');
        }

        const data = await response.json();

        const normalizedCharacter: Character = {
          id: data.id || 'N/A',
          charName: data.name || 'Unknown Name',
          series: data.series || 'Unknown Series',
          imageUrl: data.imageUrl || null,
          tags: Array.isArray(data.tags) ? data.tags : []
        };

        setChar(normalizedCharacter);
      } catch (err: any) {
        console.error('Fetch Details Error:', err);
        setError(err.message || 'An unexpected connection error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCharacterDetail();
  }, [decodedName]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#12131a', color: '#e2e8f0', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
        <div style={{ width: '30px', height: '30px', border: '3px solid #2d313f', borderTopColor: '#ff4757', borderRadius: '50%', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#94a3b8' }}>Hydrating record profile...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#12131a', color: '#e2e8f0', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
        <h2 style={{ color: '#ff4757', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connection Failed</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error}</p>
        <Link href="/characters" style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', color: '#cbd5e1', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 600 }}>
          Return to Catalog
        </Link>
      </div>
    );
  }

  if (!char) {
    return (
      <div style={{ backgroundColor: '#12131a', color: '#e2e8f0', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
        <h1 style={{ color: '#ff4757', fontSize: '2.5rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Character not found in database index.</p>
        <Link href="/characters" style={{ backgroundColor: '#ff4757', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 600 }}>
          Back to Index
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#12131a', color: '#e2e8f0', minHeight: 'calc(100vh - 60px)', fontFamily: 'Segoe UI, Roboto, Helvetica, sans-serif', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/characters" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ◀ Back to Browse Catalog
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'start' }}>
          
          <div style={{ textAlign: 'center' }}>
            <img 
              src={char.imageUrl} 
              alt={char.charName} 
              style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2d313f', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)' }} 
            />
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{ backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
                Add to Favorites
              </button>
              <button style={{ backgroundColor: '#1a1c24', color: '#cbd5e1', border: '1px solid #2d313f', padding: '0.75rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', fontSize: '0.95rem' }}>
                Add to Custom List
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '2.5rem' }}>
            <span style={{ color: '#ff4757', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
              Database Record #{char.id}
            </span>
            <h1 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '2.5rem', color: '#fff', fontWeight: 700 }}>
              {char.charName}
            </h1>
            <p style={{ margin: '0 0 2rem 0', fontSize: '1.2rem', color: '#94a3b8' }}>
              Origin Series: <strong style={{ color: '#ff4757' }}>{char.series}</strong>
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #2d313f', margin: '2rem 0' }} />

            <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 1rem 0' }}>Attributes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#13141c', padding: '1.25rem', borderRadius: '6px', border: '1px solid #2d313f', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#64748b' }}>Affiliation:</span>
                <span style={{ fontWeight: 500 }}>Main Character</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#64748b' }}>Popularity:</span>
                <span style={{ color: '#eab308', fontWeight: 'bold' }}>100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#64748b' }}>Status:</span>
                <span style={{ color: '#22c55e', fontWeight: 500 }}>Verified</span>
              </div>
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.75rem 0' }}>Tags</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {char.tags.map(t => (
                <span 
                  key={t} 
                  style={{ fontSize: '0.85rem', backgroundColor: '#1e293b', color: '#94a3b8', padding: '4px 12px', borderRadius: '4px', border: '1px solid #2d313f' }}
                >
                  {t}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}