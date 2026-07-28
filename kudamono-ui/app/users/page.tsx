'use client';
import React, { useState, useEffect } from 'react';

interface UserResponse {
  id: string;
  username: string;
}

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<UserResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const pageSize = 30;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchAllUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/users/all');
        if (!response.ok) throw new Error('Failed to retrieve user accounts');
        
        const data = await response.json();
        setAllUsers(data || []);
      } catch (error) {
        console.error('Error fetching user catalog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [isMounted]);

  const filteredUsers = allUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  
  const safeCurrentPage = currentPage >= totalPages ? 0 : currentPage;

  const startIndex = safeCurrentPage * pageSize;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  if (!isMounted) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0d0e12' }} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0e12', color: '#fff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>All Users</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Browse all users currently registered
        </p>

        <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search users.."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              borderRadius: '6px',
              border: '1px solid #2d313f',
              backgroundColor: '#1a1c24',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff4757'}
            onBlur={(e) => e.target.style.borderColor = '#2d313f'}
          />
        </div>

        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px' }}>
            Loading entries...
          </div>
        ) : allUsers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px' }}>
            No registered users found. Odd!
          </div>
        ) : (
          <div style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d313f', backgroundColor: '#13141c' }}>
                  <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>Username</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>Account Created</th>
                  <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #1f222e', backgroundColor: '#161822' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#ff4757' }}>
                      {user.username}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#cbd5e1' }}>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        2026
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <a 
                        href={`/user/${user.username.toLowerCase().replace(/\s+/g, '')}`} 
                        style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', border: '1px solid #2d313f', padding: '0.4rem 0.8rem', borderRadius: '4px', backgroundColor: '#13141c', transition: 'all 0.2s' }} 
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ff4757'; e.currentTarget.style.color = '#fff'; }} 
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#2d313f'; e.currentTarget.style.color = '#94a3b8'; }}
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#13141c', borderTop: '1px solid #2d313f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                disabled={currentPage === 0} 
                onClick={() => handlePageChange(currentPage - 1)} 
                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: currentPage === 0 ? '#1a1c24' : '#161822', color: currentPage === 0 ? '#4b5563' : '#cbd5e1', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
              >
                Previous
              </button>
              
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Page <strong style={{ color: '#fff' }}>{currentPage + 1}</strong> of {totalPages || 1}
              </span>

              <button 
                disabled={currentPage >= totalPages - 1} 
                onClick={() => handlePageChange(currentPage + 1)} 
                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: currentPage >= totalPages - 1 ? '#1a1c24' : '#161822', color: currentPage >= totalPages - 1 ? '#4b5563' : '#cbd5e1', cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
              >
                Next
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}