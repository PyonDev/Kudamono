'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCharacterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    tags: '',
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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      imageUrl: formData.imageUrl,
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
        alert('Failed to save the character to the catalog database.');
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
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Add New Character</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Character Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g., Makima" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Series *</label>
                  <input type="text" name="series" required value={formData.series} onChange={handleChange} style={inputStyle} placeholder="e.g., Chainsaw Man" />
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: '#ff4757', marginBottom: '1rem', borderBottom: '1px solid #2d313f', paddingBottom: '0.5rem' }}>Details</h2>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Tags (comma separated) *</label>
                <input type="text" name="tags" required value={formData.tags} onChange={handleChange} placeholder="Tsundere, Kuudere.. etc" style={inputStyle} />
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: '#ff4757', marginBottom: '1rem', borderBottom: '1px solid #2d313f', paddingBottom: '0.5rem' }}>Media</h2>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Image URL</label>
              <span style={{ display: 'block', fontSize: '0.70em', color: '#9ca3af', marginBottom: '0.5rem' }}>Optional, will be handled internally</span>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/character-image.png" style={inputStyle} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" disabled={isSubmitting} onClick={() => router.push('/characters')} style={{ padding: '0.75rem 1.5rem', borderRadius: '4px', border: '1px solid #2d313f', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', borderRadius: '4px', border: 'none', backgroundColor: '#ff4757', color: '#fff', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>

          <div style={{ position: 'sticky', top: '2rem', backgroundColor: '#1a1c24', border: '1px solid #2d313f', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Card Preview</h3>
            
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