'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function NewCharacterPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    tags: '',
    imageUrl: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isFormDisabled = !isMounted || !isLoggedIn;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 0.8rem',
    borderRadius: '4px',
    border: '1px solid #2d313f',
    backgroundColor: isFormDisabled ? '#1a1c24' : '#13141c',
    color: isFormDisabled ? '#64748b' : '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: isFormDisabled ? 'not-allowed' : 'text',
    transition: 'all 0.2s ease'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    if (!formData.name || !formData.series || !formData.tags) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const payload = {
      name: formData.name,
      series: formData.series,
      imageUrl: formData.imageUrl || null,
      tags: tagsArray
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/catalog', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/characters');
      } else {
        alert('Failed to save the character.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Could not connect to the backend API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0e12', color: '#fff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <button 
          onClick={() => router.push('/characters')}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Back to Directory
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Add New Character</h1>
        
        {isMounted && !isLoggedIn && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            You must be logged in to submit new entries.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start', marginTop: '1.5rem' }}>
          
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Character Name *</label>
                  <input type="text" name="name" required disabled={isFormDisabled} value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g., Makima" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Series *</label>
                  <input type="text" name="series" required disabled={isFormDisabled} value={formData.series} onChange={handleChange} style={inputStyle} placeholder="e.g., Chainsaw Man" />
                </div>
              </div>
            </div>

            <div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Tags (comma separated) *</label>
                <input type="text" name="tags" required disabled={isFormDisabled} value={formData.tags} onChange={handleChange} placeholder="Tsundere, Kuudere.. etc" style={inputStyle} />
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: '#ff4757', marginBottom: '1rem', borderBottom: '1px solid #2d313f', paddingBottom: '0.5rem' }}>Media</h2>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Image URL</label>
              <span style={{ display: 'block', fontSize: '0.70rem', color: '#64748b', marginBottom: '0.5rem' }}>Optional, will be handled internally</span>
              <input type="text" name="imageUrl" disabled={isFormDisabled} value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/character-image.png" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" disabled={isSubmitting} onClick={() => router.push('/characters')} style={{ padding: '0.75rem 1.5rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' }}>
                Cancel
              </button>
              
              {!isMounted ? (
                <button type="button" disabled style={{ padding: '0.75rem 2rem', borderRadius: '4px', border: 'none', backgroundColor: '#2d313f', color: '#94a3b8', fontWeight: '600', cursor: 'not-allowed' }}>
                  Loading...
                </button>
              ) : isLoggedIn ? (
                <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', borderRadius: '4px', border: 'none', backgroundColor: '#ff4757', color: '#fff', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button type="button" disabled style={{ padding: '0.75rem 2rem', borderRadius: '4px', border: 'none', backgroundColor: '#2d313f', color: '#64748b', fontWeight: '600', cursor: 'not-allowed' }}>
                  Login Required
                </button>
              )}
            </div>
          </form>

          <div style={{ position: 'sticky', top: '2rem', backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview</h3>
            
            <div style={{ width: '100%', height: '220px', borderRadius: '6px', backgroundColor: '#13141c', border: '1px solid #2d313f', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '1rem' }}>
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#4b5563', fontSize: '0.85rem' }}>No image link added yet</span>
              )}
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: formData.name ? '#fff' : '#4b5563' }}>
              {formData.name || 'Untitled Character'}
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#ff4757', margin: 0, fontWeight: '500' }}>
              {formData.series || 'Unknown Series'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}