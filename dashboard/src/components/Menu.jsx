import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '../i18n';

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    nameAr: '',
    price: '', 
    category: 'main', 
    description: '',
    descriptionAr: '',
    image: ''
  });
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = () => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setMenu(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/menu/${editing}`, { ...form, price: parseInt(form.price) });
      } else {
        await axios.post('http://localhost:5000/api/menu', { ...form, price: parseInt(form.price) });
      }
      setForm({ name: '', nameAr: '', price: '', category: 'main', description: '', descriptionAr: '', image: '' });
      setImagePreview('');
      setEditing(null);
      loadMenu();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setForm({ ...form, image: response.data.imageUrl });
      setImagePreview(`http://localhost:5000${response.data.imageUrl}`);
    } catch (error) {
      alert('Image upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id) => {
    if (confirm('Delete this item?')) {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      loadMenu();
    }
  };

  const categoryIcons = {
    main: '🍛',
    appetizer: '🥗',
    beverage: '🥤',
    dessert: '🍰'
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#4a6741', fontSize: '2rem' }}>
        🍽️ Menu Management
      </h2>
      
      <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)', border: '3px solid #f9ca3d' }}>
        <h3 style={{ color: '#4a6741', marginBottom: '1rem', fontSize: '1.5rem' }}>
          {editing ? '✏️ Edit Item' : '➕ Add New Item'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
              Item Name (English)
            </label>
            <input 
              type="text" 
              placeholder="e.g., Nasi Goreng Special" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
              Item Name (Arabic) - اسم الصنف بالعربية
            </label>
            <input 
              type="text" 
              placeholder="مثال: أرز مقلي خاص" 
              value={form.nameAr} 
              onChange={(e) => setForm({...form, nameAr: e.target.value})} 
              style={{ direction: 'rtl' }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
                Price (EGP)
              </label>
              <input 
                type="number" 
                placeholder="25000" 
                value={form.price} 
                onChange={(e) => setForm({...form, price: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
                Category
              </label>
              <select 
                value={form.category} 
                onChange={(e) => setForm({...form, category: e.target.value})}
              >
                <option value="main">🍛 Main</option>
                <option value="appetizer">🥗 Appetizer</option>
                <option value="beverage">🥤 Beverage</option>
                <option value="dessert">🍰 Dessert</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
              Description (English)
            </label>
            <input 
              type="text" 
              placeholder="Brief description of the dish" 
              value={form.description} 
              onChange={(e) => setForm({...form, description: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
              Description (Arabic) - الوصف بالعربية
            </label>
            <input 
              type="text" 
              placeholder="وصف مختصر للطبق" 
              value={form.descriptionAr} 
              onChange={(e) => setForm({...form, descriptionAr: e.target.value})} 
              style={{ direction: 'rtl' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a6741', fontWeight: '600' }}>
              Item Image
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ flex: 1 }}
              />
              {uploading && <span>Uploading...</span>}
            </div>
            {imagePreview && (
              <div style={{ marginTop: '1rem' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    maxWidth: '300px', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #f9ca3d'
                  }} 
                />
                <button 
                  type="button"
                  onClick={() => {
                    setForm({ ...form, image: '' });
                    setImagePreview('');
                  }}
                  style={{
                    marginTop: '0.5rem',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              style={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', 
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {editing ? '💾 Update Item' : '➕ Add Item'}
            </button>
            {editing && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditing(null); 
                  setForm({ name: '', nameAr: '', price: '', category: 'main', description: '', descriptionAr: '', image: '' });
                  setImagePreview('');
                }} 
                style={{ 
                  background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)', 
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#4a6741', fontSize: '1.3rem' }}>
          📋 Current Menu Items
        </h3>
        {menu.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666' }}>No menu items yet. Add your first item above!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {menu.map(item => (
              <div key={item.id} className="card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderLeft: '5px solid #f9ca3d'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    {item.image ? (
                      <img 
                        src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                        alt={item.name}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #f9ca3d'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>{categoryIcons[item.category]}</span>
                    )}
                    <div>
                      <h3 style={{ color: '#4a6741', marginBottom: '0.25rem' }}>
                        {item.name} 
                        {item.nameAr && <span style={{ color: '#999', fontSize: '0.9rem', marginRight: '0.5rem' }}> / {item.nameAr}</span>}
                      </h3>
                      <span style={{ 
                        background: '#f0f0f0', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '15px',
                        fontSize: '0.85rem',
                        color: '#666'
                      }}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#666', marginLeft: '4rem' }}>
                    {item.description}
                    {item.descriptionAr && <><br/><span style={{ direction: 'rtl', display: 'block' }}>{item.descriptionAr}</span></>}
                  </p>
                  <p style={{ 
                    marginLeft: '4rem', 
                    marginTop: '0.5rem',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#f9ca3d'
                  }}>
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => { 
                      setEditing(item.id); 
                      setForm(item); 
                      if (item.image) {
                        setImagePreview(item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`);
                      } else {
                        setImagePreview('');
                      }
                    }} 
                    style={{ 
                      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => deleteItem(item.id)} 
                    style={{ 
                      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
