import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '../i18n';

const DAYS_OF_WEEK = [
  { id: 'sunday', name: 'Sunday', icon: '🌅' },
  { id: 'monday', name: 'Monday', icon: '💼' },
  { id: 'tuesday', name: 'Tuesday', icon: '🔥' },
  { id: 'wednesday', name: 'Wednesday', icon: '🎯' },
  { id: 'thursday', name: 'Thursday', icon: '⚡' },
  { id: 'friday', name: 'Friday', icon: '🎉' },
  { id: 'saturday', name: 'Saturday', icon: '🌟' }
];

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [dealType, setDealType] = useState('menu'); // 'menu' or 'custom'
  const [formData, setFormData] = useState({
    menuItemId: '',
    discountPercent: '',
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    originalPrice: '',
    dealPrice: '',
    image: '',
    isActive: true
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchDeals();
    fetchMenuItems();
  }, []);

  const fetchDeals = () => {
    axios.get('http://localhost:5000/api/deals/admin/all')
      .then(res => setDeals(res.data))
      .catch(err => console.error(err));
  };

  const fetchMenuItems = () => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dealData = {
      ...formData,
      dayOfWeek: selectedDay
    };
    
    // Remove menu item fields if custom deal
    if (dealType === 'custom') {
      delete dealData.menuItemId;
    } else {
      // Remove custom deal fields if menu item deal
      delete dealData.name;
      delete dealData.nameAr;
      delete dealData.description;
      delete dealData.descriptionAr;
      delete dealData.originalPrice;
      delete dealData.dealPrice;
      delete dealData.image;
    }
    
    if (editingDeal) {
      // Update existing deal
      axios.put(`http://localhost:5000/api/deals/${editingDeal.id}`, dealData)
        .then(() => {
          fetchDeals();
          closeModal();
        })
        .catch(err => console.error(err));
    } else {
      // Create new deal
      axios.post('http://localhost:5000/api/deals', dealData)
        .then(() => {
          fetchDeals();
          closeModal();
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (day, deal) => {
    setSelectedDay(day);
    setEditingDeal(deal);
    
    // Determine deal type
    const isCustomDeal = deal.name && !deal.menuItemId;
    setDealType(isCustomDeal ? 'custom' : 'menu');
    
    setFormData({
      menuItemId: deal.menuItemId || '',
      discountPercent: deal.discountPercent || '',
      name: deal.name || '',
      nameAr: deal.nameAr || '',
      description: deal.description || '',
      descriptionAr: deal.descriptionAr || '',
      originalPrice: deal.originalPrice || '',
      dealPrice: deal.dealPrice || '',
      image: deal.image || '',
      isActive: deal.isActive
    });
    
    if (deal.image) {
      setImagePreview(deal.image.startsWith('http') ? deal.image : `http://localhost:5000${deal.image}`);
    } else {
      setImagePreview('');
    }
    
    setShowModal(true);
  };

  const handleDelete = (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      axios.delete(`http://localhost:5000/api/deals/${dealId}`)
        .then(() => fetchDeals())
        .catch(err => console.error(err));
    }
  };

  const handleAddDeal = (day) => {
    setSelectedDay(day);
    setEditingDeal(null);
    setDealType('menu');
    setFormData({
      menuItemId: '',
      discountPercent: '',
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      originalPrice: '',
      dealPrice: '',
      image: '',
      isActive: true
    });
    setImagePreview('');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5000/api/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setFormData({ ...formData, image: response.data.imageUrl });
      setImagePreview(`http://localhost:5000${response.data.imageUrl}`);
    } catch (error) {
      alert('Image upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
    setEditingDeal(null);
    setDealType('menu');
    setFormData({
      menuItemId: '',
      discountPercent: '',
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      originalPrice: '',
      dealPrice: '',
      image: '',
      isActive: true
    });
    setImagePreview('');
  };

  const getDealForDay = (dayId) => {
    return deals.find(deal => deal.dayOfWeek === dayId);
  };

  const getDealName = (deal) => {
    if (deal.menuItemId) {
      const item = menuItems.find(item => item.id === deal.menuItemId);
      return item ? item.name : 'Unknown Item';
    }
    return deal.name || 'Custom Deal';
  };

  const getDealPrice = (deal) => {
    if (deal.menuItemId) {
      const item = menuItems.find(item => item.id === deal.menuItemId);
      return item ? item.price : 0;
    }
    return deal.originalPrice || 0;
  };

  const getDealImage = (deal) => {
    if (deal.menuItemId) {
      const item = menuItems.find(item => item.id === deal.menuItemId);
      return item ? item.image : null;
    }
    return deal.image || null;
  };

  const isToday = (dayId) => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return daysOfWeek[new Date().getDay()] === dayId;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          color: '#4a6741', 
          fontWeight: '800',
          marginBottom: '0.5rem'
        }}>
          🎁 Weekly Deal Schedule
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Assign deals to each day of the week. Choose from menu items or create custom combo deals.
        </p>
      </div>

      {/* Weekly Day Slots */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {DAYS_OF_WEEK.map(day => {
          const deal = getDealForDay(day.id);
          const today = isToday(day.id);
          
          return (
            <div
              key={day.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: today 
                  ? '0 8px 25px rgba(249, 202, 61, 0.4)' 
                  : '0 4px 15px rgba(0,0,0,0.08)',
                border: today 
                  ? '3px solid #f9ca3d' 
                  : deal 
                    ? '2px solid #4a6741' 
                    : '2px dashed #ccc',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => deal ? handleEdit(day.id, deal) : handleAddDeal(day.id)}
            >
              {/* Today Badge */}
              {today && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)',
                  color: '#4a6741',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(249, 202, 61, 0.4)'
                }}>
                  TODAY
                </div>
              )}

              {/* Day Header */}
              <div style={{
                background: deal 
                  ? 'linear-gradient(135deg, #4a6741 0%, #5d7f51 100%)' 
                  : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                color: 'white',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  {day.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '800', 
                  margin: 0 
                }}>
                  {day.name}
                </h3>
              </div>

              {/* Deal Content */}
              {deal ? (
                <div style={{ padding: '1.5rem' }}>
                  {getDealImage(deal) && (
                    <img 
                      src={getDealImage(deal).startsWith('http') 
                        ? getDealImage(deal) 
                        : `http://localhost:5000${getDealImage(deal)}`}
                      alt={getDealName(deal)}
                      style={{ 
                        width: '100%', 
                        height: '150px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        border: '2px solid #f9ca3d'
                      }}
                    />
                  )}
                  <div style={{
                    background: '#f9f9f9',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#4a6741', 
                      marginBottom: '0.5rem',
                      fontSize: '1.1rem'
                    }}>
                      {getDealName(deal)}
                      {deal.name && !deal.menuItemId && (
                        <span style={{
                          background: '#e67e22',
                          color: 'white',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          marginLeft: '0.5rem'
                        }}>
                          Custom
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: '#999', fontSize: '0.9rem' }}>
                        Original:
                      </span>
                      <span style={{ 
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '0.9rem'
                      }}>
                        {formatCurrency(getDealPrice(deal))}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: '#4a6741', fontWeight: '600' }}>
                        Deal:
                      </span>
                      <span style={{ 
                        fontSize: '1.4rem', 
                        fontWeight: 'bold', 
                        color: '#e74c3c'
                      }}>
                        {formatCurrency(deal.menuItem?.dealPrice || 
                          deal.dealPrice || 
                          Math.round(getDealPrice(deal) * (1 - deal.discountPercent / 100)))}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {deal.discountPercent > 0 && (
                      <span style={{
                        background: '#e74c3c',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {deal.discountPercent}% OFF
                      </span>
                    )}
                    <span style={{
                      background: deal.isActive ? '#d4edda' : '#f8d7da',
                      color: deal.isActive ? '#155724' : '#721c24',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}>
                      {deal.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div style={{ 
                    marginTop: '1rem', 
                    display: 'flex', 
                    gap: '0.5rem' 
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(day.id, deal);
                      }}
                      style={{
                        flex: 1,
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(deal.id);
                      }}
                      style={{
                        flex: 1,
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center',
                  color: '#999'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    ➕
                  </div>
                  <p style={{ fontSize: '1rem', fontWeight: '600' }}>
                    No deal assigned
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>
                    Click to add a deal
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                color: '#4a6741', 
                margin: 0,
                fontWeight: '800'
              }}>
                {editingDeal ? 'Edit Deal' : 'Add Deal'}
              </h3>
              <div style={{
                background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)',
                color: '#4a6741',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {DAYS_OF_WEEK.find(d => d.id === selectedDay)?.name}
              </div>
            </div>

            {/* Deal Type Toggle */}
            <div style={{ 
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                type="button"
                onClick={() => setDealType('menu')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: dealType === 'menu' 
                    ? 'linear-gradient(135deg, #4a6741 0%, #5d7f51 100%)' 
                    : '#f0f0f0',
                  color: dealType === 'menu' ? 'white' : '#666',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🍽️ Menu Item Deal
              </button>
              <button
                type="button"
                onClick={() => setDealType('custom')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: dealType === 'custom' 
                    ? 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)' 
                    : '#f0f0f0',
                  color: dealType === 'custom' ? 'white' : '#666',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🎁 Custom Combo Deal
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {dealType === 'menu' ? (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Menu Item
                    </label>
                    <select
                      value={formData.menuItemId}
                      onChange={(e) => setFormData({...formData, menuItemId: parseInt(e.target.value)})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select a menu item</option>
                      {menuItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {formatCurrency(item.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Deal Name (English)
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="e.g., Family Combo"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Deal Name (Arabic)
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                      placeholder="مثال: عرض عائلي"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        direction: 'rtl'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Description (English)
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="e.g., 2 Main dishes + 2 Beverages"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Description (Arabic)
                    </label>
                    <input
                      type="text"
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                      placeholder="وصف العرض"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        direction: 'rtl'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: '#4a6741'
                      }}>
                        Original Price
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({...formData, originalPrice: parseInt(e.target.value)})}
                        required
                        placeholder="60000"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: '#4a6741'
                      }}>
                        Deal Price (Optional)
                      </label>
                      <input
                        type="number"
                        value={formData.dealPrice}
                        onChange={(e) => setFormData({...formData, dealPrice: parseInt(e.target.value)})}
                        placeholder="Auto-calculated"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Discount Percentage (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})}
                      placeholder="Auto-calculated from prices"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600',
                      color: '#4a6741'
                    }}>
                      Deal Image
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
                            setFormData({ ...formData, image: '' });
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
                </>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontWeight: '600',
                  color: '#4a6741'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    style={{ width: '20px', height: '20px' }}
                  />
                  Active
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f9ca3d 0%, #e8b424 100%)',
                    color: '#4a6741',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  {editingDeal ? 'Update Deal' : 'Create Deal'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
