import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const EMPTY_FORM = {
  name: '', category: 'All', description: '', benefits: '', minAge: '', maxAge: 120,
  maxIncome: '', occupation: '', state: '', documents: '', applyLink: '', isActive: true,
};

const AdminPanel = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/schemes/admin/all');
      setSchemes(res.data.schemes);
    } catch { toast.error('Could not load schemes.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSchemes(); }, []);

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (s) => {
    setEditId(s._id);
    setForm({
      ...s,
      benefits: s.benefits.join('\n'),
      occupation: s.occupation.join(', '),
      state: s.state.join(', '),
      documents: s.documents.join('\n'),
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        benefits: form.benefits.split('\n').map(s => s.trim()).filter(Boolean),
        occupation: form.occupation.split(',').map(s => s.trim()).filter(Boolean),
        state: form.state.split(',').map(s => s.trim()).filter(Boolean),
        documents: form.documents.split('\n').map(s => s.trim()).filter(Boolean),
        minAge: Number(form.minAge),
        maxAge: Number(form.maxAge),
        maxIncome: Number(form.maxIncome),
      };
      if (editId) {
        await API.put(`/schemes/${editId}`, payload);
        toast.success('Scheme updated!');
      } else {
        await API.post('/schemes', payload);
        toast.success('Scheme added!');
      }
      setShowModal(false);
      fetchSchemes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/schemes/${id}`);
      toast.success('Scheme deleted!');
      setDeleteId(null);
      fetchSchemes();
    } catch { toast.error('Delete failed.'); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={24} color="#1a56db" /> Admin Panel
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Logged in as <strong>{admin?.username}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={openAdd} style={{ fontSize: '0.9rem', padding: '0.65rem 1.5rem' }}>
            <Plus size={16} /> Add Scheme
          </button>
          <button className="btn-secondary" onClick={() => { logout(); navigate('/'); }} style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-in-up" style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[{ label: 'Total Schemes', val: schemes.length }, { label: 'Active', val: schemes.filter(s => s.isActive).length }, { label: 'Inactive', val: schemes.filter(s => !s.isActive).length }].map((st, i) => (
          <div key={i} className="glass-card" style={{ padding: '1rem 1.5rem', textAlign: 'center', flex: '1 1 100px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a56db' }}>{st.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner text="Loading schemes..." /> : (
        <div className="glass-card fade-in-up" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                {['Scheme Name', 'Category', 'Max Income', 'State', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schemes.map((s, i) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ background: 'var(--primary-light)', color: '#1a56db', padding: '2px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>{s.category}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>₹{Number(s.maxIncome).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>{s.state.slice(0, 2).join(', ')}{s.state.length > 2 ? ` +${s.state.length - 2}` : ''}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ background: s.isActive ? '#d1fae5' : '#fee2e2', color: s.isActive ? '#065f46' : '#991b1b', padding: '2px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(s)} style={{ background: '#eff6ff', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#1a56db' }}><Pencil size={14} /></button>
                      {deleteId === s._id ? (
                        <>
                          <button onClick={() => handleDelete(s._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#dc2626' }}><Check size={14} /></button>
                          <button onClick={() => setDeleteId(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#64748b' }}><X size={14} /></button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteId(s._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {schemes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No schemes yet. Click "Add Scheme" to get started.</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{editId ? 'Edit Scheme' : 'Add New Scheme'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[['name', 'Scheme Name', 'text', ''], ['description', 'Description', 'textarea', ''], ['category', 'Category', 'select', ['All', 'SC', 'ST', 'OBC', 'General', 'Women', 'Minority']], ['minAge', 'Min Age', 'number', ''], ['maxAge', 'Max Age', 'number', ''], ['maxIncome', 'Max Income (₹)', 'number', ''], ['occupation', 'Occupation (comma separated)', 'text', 'farmer, student, labour'], ['state', 'State (comma separated, use "All" for nationwide)', 'text', 'All'], ['benefits', 'Benefits (one per line)', 'textarea', ''], ['documents', 'Documents Required (one per line)', 'textarea', ''], ['applyLink', 'Apply Link (URL)', 'text', '']].map(([key, label, type, placeholder]) => (
                <div key={key}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>{label}</label>
                  {type === 'textarea' ? (
                    <textarea className="form-input" rows={3} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={{ resize: 'vertical' }} />
                  ) : type === 'select' ? (
                    <select className="form-input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}>
                      {placeholder.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input className="form-input" type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                <label htmlFor="isActive" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active (visible to users)</label>
              </div>
              <button className="btn-primary" type="submit" disabled={saving} style={{ justifyContent: 'center' }}>
                {saving ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><Check size={16} /> {editId ? 'Update Scheme' : 'Add Scheme'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
