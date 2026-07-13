/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useRef, useEffect } from 'react';
import { MOCK_CHARACTERS, AnimeCharacter } from './data/mockAnime';
import Link from 'next/dist/client/link';

export default function Home() {
  const [characters] = useState<AnimeCharacter[]>(MOCK_CHARACTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const globalSearchResults = searchQuery.trim() === '' 
    ? [] 
    : characters.filter(char => {
        const query = searchQuery.toLowerCase();
        return (
          char.name.toLowerCase().includes(query) ||
          char.originSeries.toLowerCase().includes(query) ||
          char.tags.some(t => t.toLowerCase().includes(query))
        );
      });

  return (
    <div style={{ backgroundColor: '#12131a', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, Helvetica, sans-serif' }}>
      

      <div style={{ background: 'linear-gradient(180deg, #161822 0%, #12131a 100%)', padding: '3.5rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          
          <div ref={searchContainerRef} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search.." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              style={{ width: '100%', padding: '1rem 1.2rem', borderRadius: '8px', border: '1px solid #2d313f', backgroundColor: '#1a1c24', color: '#fff', fontSize: '1.05rem', outline: 'none', boxShadow: isSearchFocused ? '0 0 0 2px #ff4757' : 'none' }}
            />

            {isSearchFocused && searchQuery.trim() !== '' && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7)', zIndex: 90, maxHeight: '380px', overflowY: 'auto', textAlign: 'left' }}>
                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #2d313f', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{globalSearchResults.length} found</span>
                </div>
                
                {globalSearchResults.length > 0 ? (
                  globalSearchResults.map(char => (
                    <Link key={char.id} href={`/characters/${char.id}`} style={{ textDecoration: 'none' }}>
                    <div key={char.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #1f222e', cursor: 'pointer', backgroundColor: '#161822', transition: 'background 0.15s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e2130'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#161822'}>
                      <img src={char.imageUrl} alt={char.name} style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '3px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ color: '#ff4757', fontWeight: 600, fontSize: '0.95rem' }}>{char.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{char.originSeries}</div>
                        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.2rem' }}>
                          {char.tags.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: '0.65rem', color: '#cbd5e1', backgroundColor: '#2d313f', padding: '1px 5px', borderRadius: '3px' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    No characters match &quot;<span style={{ color: '#cbd5e1' }}>{searchQuery}</span>&quot;
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        
        <section style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', borderBottom: '1px solid #2d313f', paddingBottom: '0.5rem', color: '#fff' }}>
            Recently Added
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {characters.map(char => (
              <Link key={char.id} href={`/characters/${char.id}`} style={{ textDecoration: 'none' }}>
              <div key={char.id} style={{ display: 'flex', gap: '1.2rem', padding: '1rem', border: '1px solid #2d313f', borderRadius: '6px', backgroundColor: '#13141c' }}>
                <img src={char.imageUrl} alt={char.name} style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #2d313f' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#ff4757', cursor: 'pointer' }}>{char.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Series: <strong style={{ color: '#cbd5e1' }}>{char.originSeries}</strong></span>
                  
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {char.tags.map(t => (
                      <span key={t} style={{ fontSize: '0.75rem', backgroundColor: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#ff4757' }}></div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✨ Girl of the Day
            </h3>
            
            {characters.length > 0 && (
              <div style={{ textAlign: 'center', backgroundColor: '#13141c', padding: '1rem', borderRadius: '6px', border: '1px solid #2d313f' }}>
                <img
                  src={characters[0].imageUrl} 
                  alt={characters[0].name} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.75rem' }} 
                />
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', color: '#fff' }}>{characters[0].name}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>{characters[0].originSeries}</p>
              </div>
            )}
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.75rem', textAlign: 'center', marginBottom: 0 }}>
              Changes automatically every 24 hours.
            </p>
          </div>

          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2d313f', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>Characters:</span>
                <span style={{ fontWeight: 'bold' }}>2,481</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2d313f', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>Series Indexed:</span>
                <span style={{ fontWeight: 'bold' }}>412</span>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}