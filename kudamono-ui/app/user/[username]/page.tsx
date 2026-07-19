'use client';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, use } from 'react';

interface PageProps {
  params: Promise<{ username: string }>;
}

interface UserProfile {
  id?: string;
  username: string;
  createdAt?: string;
}

export default function UserProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const targetUsername = decodeURIComponent(resolvedParams.username);

  const { user: currentUser, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'settings'>('overview');
  
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = isLoggedIn && currentUser?.username?.toLowerCase() === targetUsername.toLowerCase();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8080/api/v1/users/${targetUsername}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error(`Could not fetch profile`);
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [targetUsername]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#13141c', minHeight: 'calc(100vh - 60px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
        Loading profile..
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div style={{ backgroundColor: '#13141c', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ff4757', gap: '1rem' }}>
        <h2>{error === 'User not found' ? 'User Not Found' : 'Error'}</h2>
        <p style={{ color: '#94a3b8' }}>{error || 'The requested user profile does not exist.'}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#13141c', minHeight: 'calc(100vh - 60px)', color: '#fff', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', flexDirection: 'row', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1', minWidth: '280px', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#ff4757', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', margin: '0 auto 1rem auto', boxShadow: '0 4px 14px rgba(255, 71, 87, 0.3)' }}>
              {profileData.username.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profileData.username}</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #2d313f', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ color: '#ff4757', fontWeight: 'bold', fontSize: '1.2rem' }}>0</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Favorites</div>
              </div>
              <div style={{ borderLeft: '1px solid #2d313f' }}></div>
              <div>
                <div style={{ color: '#ff4757', fontWeight: 'bold', fontSize: '1.2rem' }}>0</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Friends</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: '3', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid #2d313f', gap: '1.5rem' }}>
            {(['overview', 'favorites', 'settings'] as const)
              .filter(tab => tab !== 'settings' || isOwnProfile)
              .map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab ? '2px solid #ff4757' : '2px solid transparent',
                    color: activeTab === tab ? '#ff4757' : '#64748b',
                    paddingBottom: '0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
            ))}
          </div>

          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '2rem', minHeight: '300px' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ff4757' }}>Bio Placeholder</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {isOwnProfile ? (
                    <span>Profile placeholder</span>
                  ) : (
                    <span>You are viewing <strong>{profileData.username} profile</strong>.</span>
                  )}
                </p>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ff4757' }}>Favorite Characters</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Characters bookmarked by {profileData.username} will show up right here.</p>
              </div>
            )}

            {activeTab === 'settings' && isOwnProfile && (
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ff4757' }}>Account Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', marginTop: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>User Identification Key</label>
                    <input type="text" readOnly value={currentUser?.id || ''} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', marginTop: '0.5rem' }}>Update Username</label>
                    <input type="text" defaultValue={currentUser?.username || ''} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                    <button style={{ marginTop: '0.5rem', backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Update Username</button>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', marginTop: '0.5rem' }}>Update Password</label>
                    <input type="password" placeholder="Enter new password" style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                    <input type="password" placeholder="Confirm new password" style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                    <button style={{ marginTop: '0.5rem', backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Update Password</button>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', marginTop: '0.5rem' }}>Update Profile Picture</label>
                    <input type="file" accept="image/*" style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                    <button style={{ marginTop: '0.5rem', backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Update Profile Picture</button>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', marginTop: '0.5rem' }}>Delete Account</label>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#ff6b81', marginBottom: '0.4rem' }}>Warning: This action is irreversible. Account deletions are permanent.</span>
                    <button style={{ marginTop: '0.5rem', backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}