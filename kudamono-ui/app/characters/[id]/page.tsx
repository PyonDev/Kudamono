'use client';
import { useParams } from 'next/navigation';
import { MOCK_CHARACTERS } from '../../data/mockAnime';
import Link from 'next/link';

export default function CharacterDetailPage() {
  const params = useParams();
  const { id } = params;

  const character = MOCK_CHARACTERS.find(char => char.id === id);

  if (!character) {
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
              src={character.imageUrl} 
              alt={character.name} 
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
              Database Record #{character.id}
            </span>
            <h1 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '2.5rem', color: '#fff', fontWeight: 700 }}>
              {character.name}
            </h1>
            <p style={{ margin: '0 0 2rem 0', fontSize: '1.2rem', color: '#94a3b8' }}>
              Origin Series: <strong style={{ color: '#ff4757' }}>{character.originSeries}</strong>
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
              {character.tags.map(t => (
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