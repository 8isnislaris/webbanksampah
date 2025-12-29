'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { demoKategoriSampah, formatRupiah } from '@/lib/demo-data';

export default function KategoriPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [kategoriList, setKategoriList] = useState(demoKategoriSampah);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        nama_jenis: '',
        harga_per_kg: '',
        icon: '📦',
        deskripsi: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('bankSampahUser');
        if (!storedUser) {
            router.push('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        setUser(userData);
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('bankSampahUser');
        router.push('/');
    };

    const openAddModal = () => {
        setEditMode(false);
        setSelectedKategori(null);
        setFormData({ nama_jenis: '', harga_per_kg: '', icon: '📦', deskripsi: '' });
        setShowModal(true);
    };

    const openEditModal = (kategori) => {
        setEditMode(true);
        setSelectedKategori(kategori);
        setFormData({
            nama_jenis: kategori.nama_jenis,
            harga_per_kg: kategori.harga_per_kg.toString(),
            icon: kategori.icon,
            deskripsi: kategori.deskripsi || ''
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        setTimeout(() => {
            if (editMode && selectedKategori) {
                // Update existing
                setKategoriList(kategoriList.map(k =>
                    k.id === selectedKategori.id
                        ? { ...k, ...formData, harga_per_kg: parseInt(formData.harga_per_kg) }
                        : k
                ));
            } else {
                // Add new
                const newKategori = {
                    id: String(Date.now()),
                    nama_jenis: formData.nama_jenis,
                    harga_per_kg: parseInt(formData.harga_per_kg),
                    icon: formData.icon,
                    deskripsi: formData.deskripsi
                };
                setKategoriList([...kategoriList, newKategori]);
            }

            setShowModal(false);
            setSubmitting(false);
            setFormData({ nama_jenis: '', harga_per_kg: '', icon: '📦', deskripsi: '' });
        }, 500);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            setKategoriList(kategoriList.filter(k => k.id !== id));
        }
    };

    const icons = ['📦', '🥤', '🧴', '📄', '🔧', '🍾', '📱', '🛢️', '👕', '🪑', '🔋', '💻'];

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
                    <p>Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <div className="container navbar-container">
                    <Link href="/" className="navbar-brand">
                        <div className="navbar-brand-icon">🌿</div>
                        <span>Bank Sampah</span>
                    </Link>

                    <div className="navbar-nav">
                        <span className="badge badge-info" style={{ marginRight: '0.5rem' }}>Admin</span>
                        <span className="navbar-link">{user?.nama_lengkap}</span>
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm">Keluar</button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-layout">
                <Sidebar user={user} />

                <main className="dashboard-main">
                    <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="dashboard-title">Kategori Sampah</h1>
                            <p className="dashboard-subtitle">Kelola jenis-jenis sampah dan harganya</p>
                        </div>
                        <button onClick={openAddModal} className="btn btn-primary">
                            ➕ Tambah Kategori
                        </button>
                    </div>

                    {/* Category Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {kategoriList.map((kategori) => (
                            <div key={kategori.id} className="card" style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.75rem',
                                        flexShrink: 0
                                    }}>
                                        {kategori.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{kategori.nama_jenis}</h3>
                                        <p style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '700',
                                            color: 'var(--primary-600)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {formatRupiah(kategori.harga_per_kg)}/kg
                                        </p>
                                        {kategori.deskripsi && (
                                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                                {kategori.deskripsi}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--gray-100)'
                                }}>
                                    <button
                                        onClick={() => openEditModal(kategori)}
                                        className="btn btn-ghost btn-sm"
                                        style={{ flex: 1 }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(kategori.id)}
                                        className="btn btn-ghost btn-sm"
                                        style={{ flex: 1, color: 'var(--error)' }}
                                    >
                                        🗑️ Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Icon</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {icons.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon })}
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: formData.icon === icon ? '2px solid var(--primary-500)' : '2px solid var(--gray-200)',
                                                    background: formData.icon === icon ? 'var(--primary-50)' : 'var(--surface)',
                                                    fontSize: '1.25rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Nama Kategori *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Contoh: Plastik Bening"
                                        value={formData.nama_jenis}
                                        onChange={(e) => setFormData({ ...formData, nama_jenis: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Harga per Kg (Rp) *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Contoh: 3000"
                                        min="100"
                                        value={formData.harga_per_kg}
                                        onChange={(e) => setFormData({ ...formData, harga_per_kg: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Deskripsi (opsional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Contoh: Botol air mineral, gelas plastik"
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Menyimpan...' : (editMode ? 'Simpan Perubahan' : 'Tambah Kategori')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
