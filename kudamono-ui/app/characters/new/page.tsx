'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCharacterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    role: 'Main',
    bio: '',
    traits: '',
    imageUrl: ''
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 0.8rem',
    borderRadius: '4px',
    border: '1px solid #2d313f',
    backgroundColor: '#13141c',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Add New Character</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          <form style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Character Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Series</label>
                  <input type="text" name="series" value={formData.series} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: '#ff4757', marginBottom: '1rem', borderBottom: '1px solid #2d313f', paddingBottom: '0.5rem' }}>Details</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Summary (can be left blank)</label>
                <textarea name="bio" rows={5} value={formData.bio} onChange={handleChange} placeholder="Will only be considered during review. What you like about the character etc.." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                <input type="text" name="traits" value={formData.traits} onChange={handleChange} placeholder="Tsundere, Kuudere etc" style={inputStyle} />
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: '#ff4757', marginBottom: '1rem', borderBottom: '1px solid #2d313f', paddingBottom: '0.5rem' }}>Media</h2>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Image URL</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/character-image.png" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => router.push('/characters')} style={{ padding: '0.75rem 1.5rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: '0.75rem 2rem', borderRadius: '4px', border: 'none', backgroundColor: '#ff4757', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                Submit
              </button>
            </div>
          </form>

          <div style={{ position: 'sticky', top: '2rem', backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Image Preview</h3>
            <div style={{ width: '100%', height: '220px', borderRadius: '6px', backgroundColor: '#13141c', border: '1px solid #2d313f', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '1rem' }}>
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#4b5563', fontSize: '0.85rem' }}>No image link added yet</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}