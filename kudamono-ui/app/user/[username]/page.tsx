'use client';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ username: string }>;
}

interface UserProfile {
  id?: string;
  username: string;
  createdAt?: string;
}

interface Character {
  id: string;
  charName: string;
  series: string;
  imageUrl: string;
}

export default function UserProfilePage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const targetUsername = decodeURIComponent(resolvedParams.username);

  const { user: currentUser, isLoggedIn, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'settings'>('overview');

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState<boolean>(false);

  const [newUsernameInput, setNewUsernameInput] = useState<string>('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState<boolean>(false);
  const [usernameUpdateMsg, setUsernameUpdateMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const isOwnProfile = isLoggedIn && currentUser?.username?.toLowerCase() === targetUsername.toLowerCase();

  useEffect(() => {
    if (currentUser?.username) {
      setNewUsernameInput(currentUser.username);
    }
  }, [currentUser]);

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

  useEffect(() => {
    if (!profileData?.username) return;

    async function loadFavoritesData() {
      try {
        setIsFavoritesLoading(true);

        const favsResponse = await fetch(`http://localhost:8080/api/v1/users/${profileData.username}/favourites`);
        if (!favsResponse.ok) throw new Error("Failed find favourites");

        const ids: string[] = await favsResponse.json();
        setFavoriteIds(ids);

        if (ids.length > 0) {
          const catalogResponse = await fetch(`http://localhost:8080/api/v1/catalog`);
          if (!catalogResponse.ok) throw new Error("Failed to fetch character");

          const catalogData = await catalogResponse.json();

          const matchedCharacters = catalogData
            .filter((item: any) => ids.includes(String(item.id)))
            .map((item: any) => ({
              id: String(item.id),
              charName: item.charName || item.name || 'Unknown Character',
              series: item.series || 'Unknown Series',
              imageUrl: item.imageUrl || item.image || ''
            }));

          setFavoriteCharacters(matchedCharacters);
        } else {
          setFavoriteCharacters([]);
        }
      } catch (err) {
        console.error("Error aggregating profile favorites layout:", err);
      } finally {
        setIsFavoritesLoading(false);
      }
    }

    loadFavoritesData();
  }, [profileData?.username]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameUpdateMsg(null);

    const trimmedNewUsername = newUsernameInput.trim();

    if (!trimmedNewUsername) {
      setUsernameUpdateMsg({ text: 'Username cannot be empty', isError: true });
      return;
    }

    if (trimmedNewUsername.toLowerCase() === targetUsername.toLowerCase()) {
      setUsernameUpdateMsg({ text: 'Username is identical to current', isError: false });
      return;
    }

    try {
      setIsUpdatingUsername(true);

      const response = await fetch(
        `http://localhost:8080/api/v1/users/${encodeURIComponent(targetUsername)}/update/${encodeURIComponent(trimmedNewUsername)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.status === 409) {
        setUsernameUpdateMsg({ text: `Username "${trimmedNewUsername}" is already taken.`, isError: true });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update username');
      }

      const updatedUserData = await response.json();

      const storedSession = localStorage.getItem('kudamono_session');
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        parsed.username = updatedUserData.username || trimmedNewUsername;
        localStorage.setItem('kudamono_session', JSON.stringify(parsed));
      }

      setUser((prev) => prev ? { ...prev, username: updatedUserData.username || trimmedNewUsername } : null);

      setUsernameUpdateMsg({ text: 'Username updated successfully! Redirecting...', isError: false });

      setTimeout(() => {
        router.push(`/user/${encodeURIComponent(trimmedNewUsername)}`);
        router.refresh();
      }, 1200);

    } catch (err: any) {
      console.error('Update Username Error:', err);
      setUsernameUpdateMsg({ text: err.message || 'An error occurred while updating username.', isError: true });
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      return;
    }
  }

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
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #2d313f', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ color: '#ff4757', fontWeight: 'bold', fontSize: '1.2rem' }}>{favoriteIds.length}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Favorites</div>
              </div>
              <div style={{ borderLeft: '1px solid #2d313f' }} />
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
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#ff4757' }}>Favorite Characters</h3>

                {isFavoritesLoading ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Hydrating chars..</p>
                ) : favoriteCharacters.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {profileData.username} hasn't favorited any characters yet.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
                    {favoriteCharacters.map((char) => (
                      <Link
                        href={`/characters/${encodeURIComponent(char.charName.replace(/\s+/g, ''))}`}
                        key={char.id}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div style={{ backgroundColor: '#13141c', border: '1px solid #2d313f', borderRadius: '6px', overflow: 'hidden', transition: 'transform 0.2s' }}>
                          <img
                            src={char.imageUrl}
                            alt={char.charName}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          />
                          <div style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {char.charName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {char.series}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && isOwnProfile && (
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ff4757' }}>Account Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px', marginTop: '1rem' }}>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>User Identification Key</label>
                    <input type="text" readOnly value={currentUser?.id || profileData.id || ''} style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                  </div>

                  <form onSubmit={handleUpdateUsername}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Update Username</label>
                    <input
                      type="text"
                      value={newUsernameInput}
                      onChange={(e) => setNewUsernameInput(e.target.value)}
                      disabled={isUpdatingUsername}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#e2e8f0', outline: 'none', fontSize: '0.85rem' }}
                    />

                    {usernameUpdateMsg && (
                      <span style={{ display: 'block', fontSize: '0.8rem', marginTop: '0.4rem', color: usernameUpdateMsg.isError ? '#ff4757' : '#22c55e' }}>
                        {usernameUpdateMsg.text}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={isUpdatingUsername}
                      style={{ marginTop: '0.75rem', backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: isUpdatingUsername ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: isUpdatingUsername ? 0.7 : 1 }}
                    >
                      {isUpdatingUsername ? 'Updating...' : 'Update Username'}
                    </button>
                  </form>

                  <div style={{ borderTop: '1px solid #2d313f', paddingTop: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Update Password</label>
                    <input type="password" placeholder="Enter new password" style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem', marginBottom: '0.5rem' }} />
                    <input type="password" placeholder="Confirm new password" style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem' }} />
                    <button style={{ marginTop: '0.75rem', backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Update Password</button>
                  </div>

                  <div style={{ borderTop: '1px solid #2d313f', paddingTop: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Update Profile Picture</label>
                    <input type="file" accept="image/*" style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: '#13141c', color: '#64748b', outline: 'none', fontSize: '0.85rem' }} />
                    <button style={{ marginTop: '0.75rem', backgroundColor: '#ff4757', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Update Profile Picture</button>
                  </div>

                  <div style={{ borderTop: '1px solid #2d313f', paddingTop: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#ff4757', fontWeight: 'bold', marginBottom: '0.2rem' }}>Delete Account</label>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#ff6b81', marginBottom: '0.6rem' }}>Warning: This action is irreversible. Account deletions are permanent.</span>
                    <button style={{ backgroundColor: 'rgba(255, 71, 87, 0.15)', color: '#ff4757', border: '1px solid #ff4757', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Delete Account</button>
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