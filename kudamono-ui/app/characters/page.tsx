'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Character {
  id: number;
  name: string;
  series: string;
  tags: string[];
  imageUrl: string;
}

export default function BrowseCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;


  useEffect(() => {
    async function fetchCharacters() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:8080/api/v1/catalog');
        if (!response.ok) {
          throw new Error(`Error fetching characters: ${response.statusText}`);
        }
        const data = await response.json();
        const transformedData: Character[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          series: item.series || 'Unknown Series',
          tags: Array.isArray(item.tags) ? item.tags : [],
          imageUrl: item.imageUrl || ''
        }))
        setCharacters(transformedData);
      } catch (err) {
        setError('Failed to fetch characters.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  const allUniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    characters.forEach(char => char.tags.forEach(t => tagsSet.add(t)));
    return Array.from(tagsSet).sort();
  }, [characters]);

  const filteredCharacters = useMemo(() => {
    return characters.filter(char => {
      const matchesSearch = searchQuery.trim() === '' || 
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.series.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesTag = !selectedTag || char.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [characters, searchQuery, selectedTag]);

  const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE) || 1;
  
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedCharacters = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredCharacters.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCharacters, activePage]);

  const handleTagToggle = (tag: string) => {
    setSelectedTag(prev => (prev === tag ? null : tag));
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: '#12131a', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, Helvetica, sans-serif' }}>
      

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.25rem' }}>
            <button 
              onClick={() => router.push('/characters/new')}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                borderRadius: '4px', 
                border: 'none', 
                backgroundColor: '#ff4757',
                color: '#fff', 
                fontSize: '0.9rem', 
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.15s ease'
              }}
            >
              Submit New Character
            </button>
          </div>
          
          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Search</h3>
            <input 
              type="text"
              placeholder="Name or series..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filter by Tag</h3>
              {selectedTag && (
                <button onClick={() => setSelectedTag(null)} style={{ background: 'none', border: 'none', color: '#ff4757', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}>Clear</button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {allUniqueTags.map(tag => {
                const isSelected = selectedTag === tag;
                return (
                  <div 
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '4px', 
                      fontSize: '0.88rem', 
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#ff4757' : '#13141c',
                      color: isSelected ? '#fff' : '#cbd5e1',
                      border: isSelected ? '1px solid #ff4757' : '1px solid #2d313f',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{tag}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {characters.filter(c => c.tags.includes(tag)).length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <main>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            <div>
              Showing <strong style={{ color: '#fff' }}>{filteredCharacters.length === 0 ? 0 : (activePage - 1) * ITEMS_PER_PAGE + 1}</strong> - <strong style={{ color: '#fff' }}>{Math.min(activePage * ITEMS_PER_PAGE, filteredCharacters.length)}</strong> of <strong style={{ color: '#ff4757' }}>{filteredCharacters.length}</strong> results
            </div>
          </div>

          {paginatedCharacters.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {paginatedCharacters.map(char => (
                <Link 
                  key={char.id} 
                  href={`/characters/${char.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
              >
                <div style={{ display: 'flex', gap: '1.2rem', padding: '1rem', border: '1px solid #2d313f', borderRadius: '8px', backgroundColor: '#1a1c24', width: '100%', cursor: 'pointer', transition: 'transform 0.15s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                  <img src={char.imageUrl} alt={char.name} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #2d313f' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', color: '#ff4757' }}>{char.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Series: <strong style={{ color: '#cbd5e1' }}>{char.originSeries}</strong></span>
        
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
          ) : (
            <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
              No items match your active filters or text criteria. Try broadening your criteria.
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
              
              <button 
                disabled={activePage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', color: activePage === 1 ? '#475569' : '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '4px', cursor: activePage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
              >
                ◀ Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => {
                const isCurrent = pageNum === activePage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{ 
                      backgroundColor: isCurrent ? '#ff4757' : '#1a1c24', 
                      border: isCurrent ? '1px solid #ff4757' : '1px solid #2d313f', 
                      color: isCurrent ? '#fff' : '#cbd5e1', 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontSize: '0.9rem',
                      fontWeight: isCurrent ? 'bold' : 'normal'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', color: activePage === totalPages ? '#475569' : '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '4px', cursor: activePage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
              >
                Next ▶
              </button>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}