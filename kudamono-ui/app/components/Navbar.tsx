'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { AnimeCharacter, MOCK_CHARACTERS } from '../data/mockAnime';

export default function Navbar() {
  const { user, isLoggedIn, logout, isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [characters] = useState<AnimeCharacter[]>(MOCK_CHARACTERS);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const menuItems = {
    'Browse': ['All Characters', 'Popular This Week', 'Recently Added', 'Random Tag'],
    'Community': ['Wiki', 'User Lists', 'Leaderboards']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // todo: api/login
    login(email, authMode === 'register' ? username : undefined);
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  Testing
                </span>
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
              {authMode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Username</label>
                  <input type="text" required value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#fff', outline: 'none' }} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#fff', outline: 'none' }} />
              </div>
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