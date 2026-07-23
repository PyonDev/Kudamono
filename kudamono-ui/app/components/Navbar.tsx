'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { AnimeCharacter, MOCK_CHARACTERS } from '../data/mockAnime';
import { useEffect } from 'react';

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoggedIn, logout, isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [characters] = useState<AnimeCharacter[]>(MOCK_CHARACTERS);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [searchContainerRef]);

  useEffect(() => {
    setIsMounted(true);
  }, [])

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

  const menuItems = {
    'Browse': ['All Characters', 'Top Liked', 'Recently Added', 'Random Character'],
    'Community': ['Wiki', 'User Lists', 'Leaderboards']
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
    const success = await register(username, password);
    if (success) { 
      setAuthMode('login');
      setPassword('');
      setConfirmPassword('');
    }
    } else { 
      await login(username, password);
    }
  };

  return (
    <>
      <nav style={{ backgroundColor: '#1a1c24', borderBottom: '1px solid #2d313f', position: 'relative', zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px', padding: '0 1.5rem' }}>
          
          <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#ff4757', marginRight: '3rem', textDecoration: 'none', letterSpacing: '0.5px' }}>
            KUDAMONO
          </Link>

          <div style={{ display: 'flex', gap: '1.5rem', flexGrow: 1 }}>
            {Object.entries(menuItems).map(([title, options]) => (
              <div key={title} style={{ position: 'relative' }} onMouseEnter={() => setActiveDropdown(title)} onMouseLeave={() => setActiveDropdown(null)}>
                <button style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', padding: '10px 0' }}>
                  {title} <span style={{ fontSize: '0.7rem' }}>▼</span>
                </button>
                {activeDropdown === title && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '4px', minWidth: '180px', padding: '0.5rem 0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}>
                    {options.map(option => (
                      <Link key={option} href={option === 'All Characters' ? '/characters' : '#'} style={{ display: 'block', padding: '0.6rem 1.2rem', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem' }}>
                        {option}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div ref={searchContainerRef} style={{ width: '260px', position: 'relative', margin: '0 1.5rem' }}>
  <input 
    type="text" 
    placeholder="Search characters..." 
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onFocus={() => setIsSearchFocused(true)}
    style={{ 
      width: '100%', 
      padding: '0.45rem 0.8rem', 
      borderRadius: '6px', 
      border: '1px solid #2d313f', 
      backgroundColor: '#13141c', 
      color: '#fff', 
      fontSize: '0.85rem', 
      outline: 'none', 
      boxShadow: isSearchFocused ? '0 0 0 1px #ff4757' : 'none',
      transition: 'all 0.15s ease'
    }}
  />

  {isSearchFocused && searchQuery.trim() !== '' && (
    <div style={{ 
      position: 'absolute', 
      top: 'calc(100% + 8px)', 
      left: 0, 
      width: '320px', 
      backgroundColor: '#1a1c24', 
      border: '1px solid #2d313f', 
      borderRadius: '8px', 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)', 
      zIndex: 90, 
      maxHeight: '340px', 
      overflowY: 'auto'
    }}>
      <div style={{ 
        padding: '0.5rem 0.8rem', 
        borderBottom: '1px solid #2d313f', 
        fontSize: '0.7rem', 
        fontWeight: 'bold', 
        color: '#64748b', 
        textTransform: 'uppercase', 
        display: 'flex', 
        justifyContent: 'space-between' 
      }}>
        <span>{globalSearchResults.length} found</span>
      </div>
      
      {globalSearchResults.length > 0 ? (
        globalSearchResults.map(char => (
          <Link 
            key={char.id} 
            href={`/characters/${char.id}`} 
            onClick={() => {
              setIsSearchFocused(false);
              setSearchQuery('');
            }}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              padding: '0.6rem 0.8rem', 
              borderBottom: '1px solid #1f222e', 
              cursor: 'pointer', 
              backgroundColor: '#161822', 
              transition: 'background 0.15s' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e2130'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#161822'}>
              <img src={char.imageUrl} alt={char.name} style={{ width: '32px', height: '44px', objectFit: 'cover', borderRadius: '3px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: '#ff4757', fontWeight: 600, fontSize: '0.85rem' }}>{char.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{char.originSeries}</div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
          No matches for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  )}
        </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isMounted ? ( <div style={{ width: '130px', height: '36px' }} /> ) : isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href={`/user/${user?.username || 'weeb'}`} style={{ textDecoration: 'none', transition: 'color 0.2s', color: '#cbd5e1', fontSize: '0.9rem' }} onMouseOver={(e) => e.currentTarget.style.color = '#ff4757'} onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                  {user?.username || 'Weeb'}
                </Link>
                <button onClick={logout} style={{ background: 'none', border: '1px solid #2d313f', color: '#94a3b8', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Sign In
                </button>
                <button onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }} style={{ backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginLeft: '1.5rem' }}>
            Database Entries: <span style={{ color: '#ff4757', fontWeight: 'bold' }}>{characters.length}</span>
          </div>
        </div>
      </nav>

      {isAuthModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsAuthModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            
            <div style={{ display: 'flex', borderBottom: '1px solid #2d313f', marginBottom: '1.5rem' }}>
              <button onClick={() => setAuthMode('login')} style={{ flex: 1, paddingBottom: '0.75rem', background: 'none', border: 'none', color: authMode === 'login' ? '#ff4757' : '#64748b', fontWeight: 600, cursor: 'pointer' }}>Login</button>
              <button onClick={() => setAuthMode('register')} style={{ flex: 1, paddingBottom: '0.75rem', background: 'none', border: 'none', color: authMode === 'register' ? '#ff4757' : '#64748b', fontWeight: 600, cursor: 'pointer' }}>Register</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Username</label>
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#fff', outline: 'none' }} />
              </div>
              {authMode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Confirm Password</label>
                  <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#fff', outline: 'none' }} />
                </div>
              )}
              <button type="submit" style={{ backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
              {authMode === 'login' && (
                    <a href="#" style={{ fontSize: '0.8rem', color: '#ff4757', textDecoration: 'none' }}>Forgot Password?</a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}