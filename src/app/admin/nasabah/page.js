'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import {
    demoUsers,
    demoTransaksi,
    formatRupiah,
    formatDate,
    formatDateShort
} from '@/lib/demo-data';

export default function DataNasabahPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
    const [selectedNasabah, setSelectedNasabah] = useState(null);
    const [nasabahList, setNasabahList] = useState([]);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        email: '',
        alamat: '',
        nik: '',
        no_hp: ''
    });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // Check if user is logged in
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

        // Load nasabah data
        const storedNasabah = localStorage.getItem('bankSampahNasabah');
        if (storedNasabah) {
            setNasabahList(JSON.parse(storedNasabah));
        } else {
            const initialNasabah = demoUsers.filter(u => u.role === 'nasabah');
            setNasabahList(initialNasabah);
            localStorage.setItem('bankSampahNasabah', JSON.stringify(initialNasabah));
        }

        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('bankSampahUser');
        router.push('/');
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenModal = (mode, nasabah = null) => {
        setModalMode(mode);
        setSelectedNasabah(nasabah);
        if (mode === 'edit' && nasabah) {
            setFormData({
                nama_lengkap: nasabah.nama_lengkap,
                email: nasabah.email,
                alamat: nasabah.alamat,
                nik: nasabah.nik || '',
                no_hp: nasabah.no_hp || ''
            });
        } else if (mode === 'add') {
            setFormData({
                nama_lengkap: '',
                email: '',
                alamat: '',
                nik: '',
                no_hp: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedNasabah(null);
        setFormData({
            nama_lengkap: '',
            email: '',
            alamat: '',
            nik: '',
            no_hp: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (modalMode === 'add') {
            const newNasabah = {
                id: Date.now().toString(),
                ...formData,
                role: 'nasabah',
                total_saldo: 0,
                created_at: new Date().toISOString()
            };
            const updatedList = [...nasabahList, newNasabah];
            setNasabahList(updatedList);
            localStorage.setItem('bankSampahNasabah', JSON.stringify(updatedList));
            showNotification('Nasabah berhasil ditambahkan!');
        } else if (modalMode === 'edit') {
            const updatedList = nasabahList.map(n =>
                n.id === selectedNasabah.id ? { ...n, ...formData } : n
            );
            setNasabahList(updatedList);
            localStorage.setItem('bankSampahNasabah', JSON.stringify(updatedList));
            showNotification('Data nasabah berhasil diperbarui!');
        }

        handleCloseModal();
    };

    const handleDelete = () => {
        const updatedList = nasabahList.filter(n => n.id !== selectedNasabah.id);
        setNasabahList(updatedList);
        localStorage.setItem('bankSampahNasabah', JSON.stringify(updatedList));
        showNotification('Nasabah berhasil dihapus!', 'warning');
        handleCloseModal();
    };

    const getNasabahStats = (nasabahId) => {
        const transactions = demoTransaksi.filter(t => t.nasabah_id === nasabahId);
        const totalBerat = transactions.reduce((sum, t) => sum + t.berat, 0);
        const totalNilai = transactions.reduce((sum, t) => sum + t.total_harga, 0);
        return { totalTransaksi: transactions.length, totalBerat, totalNilai };
    };

    const filteredNasabah = nasabahList.filter(nasabah =>
        nasabah.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nasabah.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nasabah.alamat?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
                    <p>Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 1000,
                    padding: '1rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: notification.type === 'success' ? 'var(--success-500)' : 'var(--warning-500)',
                    color: 'white',
                    fontWeight: '500',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'slideIn 0.3s ease'
                }}>
                    {notification.type === 'success' ? '✓' : '⚠'} {notification.message}
                </div>
            )}

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
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                            Keluar
                        </button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-layout">
                <Sidebar user={user} />

                <main className="dashboard-main">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Data Nasabah</h1>
                        <p className="dashboard-subtitle">Kelola data nasabah Bank Sampah</p>
                    </div>

                    {/* Stats Overview */}
                    <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                        <div className="stat-card">
                            <div className="stat-icon green">👥</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Nasabah</div>
                                <div className="stat-value">{nasabahList.length}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon blue">✅</div>
                            <div className="stat-content">
                                <div className="stat-label">Nasabah Aktif</div>
                                <div className="stat-value">{nasabahList.filter(n => n.total_saldo > 0).length}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon purple">💰</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Saldo</div>
                                <div className="stat-value">{formatRupiah(nasabahList.reduce((sum, n) => sum + (n.total_saldo || 0), 0))}</div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-tertiary)'
                                }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Cari nasabah..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input"
                                    style={{ paddingLeft: '3rem', width: '100%' }}
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleOpenModal('add')}
                            >
                                ➕ Tambah Nasabah
                            </button>
                        </div>
                    </div>

                    {/* Nasabah Table */}
                    <div className="table-container">
                        <div className="table-header">
                            <h3 className="table-title">Daftar Nasabah ({filteredNasabah.length})</h3>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nasabah</th>
                                        <th>Kontak</th>
                                        <th>Alamat</th>
                                        <th>Saldo</th>
                                        <th>Transaksi</th>
                                        <th>Terdaftar</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNasabah.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                                                <p>Tidak ada nasabah ditemukan</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredNasabah.map((nasabah) => {
                                            const stats = getNasabahStats(nasabah.id);
                                            return (
                                                <tr key={nasabah.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: 'var(--radius-full)',
                                                                background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontWeight: '600',
                                                                fontSize: '1rem'
                                                            }}>
                                                                {nasabah.nama_lengkap.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: '600' }}>{nasabah.nama_lengkap}</div>
                                                                {nasabah.nik && (
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                        NIK: {nasabah.nik}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontSize: '0.875rem' }}>{nasabah.email}</div>
                                                        {nasabah.no_hp && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                📱 {nasabah.no_hp}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ maxWidth: '200px' }}>
                                                        <div style={{
                                                            fontSize: '0.875rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            📍 {nasabah.alamat || '-'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            fontWeight: '600',
                                                            color: 'var(--primary-600)'
                                                        }}>
                                                            {formatRupiah(nasabah.total_saldo || 0)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                            <span className="badge badge-info">{stats.totalTransaksi} transaksi</span>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                {stats.totalBerat} kg
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                            {formatDateShort(nasabah.created_at)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                className="btn btn-ghost btn-sm"
                                                                onClick={() => handleOpenModal('view', nasabah)}
                                                                title="Lihat Detail"
                                                            >
                                                                👁️
                                                            </button>
                                                            <button
                                                                className="btn btn-ghost btn-sm"
                                                                onClick={() => handleOpenModal('edit', nasabah)}
                                                                title="Edit"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                className="btn btn-ghost btn-sm"
                                                                onClick={() => handleOpenModal('delete', nasabah)}
                                                                title="Hapus"
                                                                style={{ color: 'var(--error-500)' }}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999,
                    padding: '1rem'
                }} onClick={handleCloseModal}>
                    <div
                        className="card"
                        style={{
                            width: '100%',
                            maxWidth: modalMode === 'view' ? '600px' : '500px',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            animation: 'slideIn 0.3s ease'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid var(--border-primary)'
                        }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                {modalMode === 'add' && '➕ Tambah Nasabah Baru'}
                                {modalMode === 'edit' && '✏️ Edit Data Nasabah'}
                                {modalMode === 'view' && '👤 Detail Nasabah'}
                                {modalMode === 'delete' && '🗑️ Hapus Nasabah'}
                            </h2>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                        </div>

                        {/* View Mode */}
                        {modalMode === 'view' && selectedNasabah && (
                            <div>
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '2rem',
                                    padding: '1.5rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '2rem',
                                        margin: '0 auto 1rem'
                                    }}>
                                        {selectedNasabah.nama_lengkap.charAt(0)}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        {selectedNasabah.nama_lengkap}
                                    </h3>
                                    <p style={{ color: 'var(--text-tertiary)' }}>{selectedNasabah.email}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {(() => {
                                        const stats = getNasabahStats(selectedNasabah.id);
                                        return (
                                            <>
                                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-600)' }}>
                                                        {stats.totalTransaksi}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Transaksi</div>
                                                </div>
                                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success-600)' }}>
                                                        {stats.totalBerat} kg
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total Sampah</div>
                                                </div>
                                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning-600)' }}>
                                                        {formatRupiah(selectedNasabah.total_saldo || 0)}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Saldo</div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedNasabah.nik && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                            <span style={{ color: 'var(--text-tertiary)' }}>NIK</span>
                                            <span style={{ fontWeight: '500' }}>{selectedNasabah.nik}</span>
                                        </div>
                                    )}
                                    {selectedNasabah.no_hp && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                            <span style={{ color: 'var(--text-tertiary)' }}>No. HP</span>
                                            <span style={{ fontWeight: '500' }}>{selectedNasabah.no_hp}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                        <span style={{ color: 'var(--text-tertiary)' }}>Alamat</span>
                                        <span style={{ fontWeight: '500', textAlign: 'right', maxWidth: '60%' }}>{selectedNasabah.alamat || '-'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                        <span style={{ color: 'var(--text-tertiary)' }}>Terdaftar</span>
                                        <span style={{ fontWeight: '500' }}>{formatDate(selectedNasabah.created_at)}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            handleCloseModal();
                                            handleOpenModal('edit', selectedNasabah);
                                        }}
                                    >
                                        ✏️ Edit Data
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ flex: 1 }}
                                        onClick={handleCloseModal}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add/Edit Mode */}
                        {(modalMode === 'add' || modalMode === 'edit') && (
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="label">Nama Lengkap *</label>
                                        <input
                                            type="text"
                                            name="nama_lengkap"
                                            value={formData.nama_lengkap}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Masukkan nama lengkap"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label">NIK</label>
                                        <input
                                            type="text"
                                            name="nik"
                                            value={formData.nik}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Masukkan NIK (16 digit)"
                                            maxLength="16"
                                            pattern="[0-9]*"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Masukkan email"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label">No. HP</label>
                                        <input
                                            type="tel"
                                            name="no_hp"
                                            value={formData.no_hp}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Contoh: 08123456789"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label">Alamat *</label>
                                        <textarea
                                            name="alamat"
                                            value={formData.alamat}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Masukkan alamat lengkap"
                                            rows="3"
                                            style={{ resize: 'vertical' }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                    >
                                        {modalMode === 'add' ? '➕ Tambah Nasabah' : '💾 Simpan Perubahan'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        style={{ flex: 1 }}
                                        onClick={handleCloseModal}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Delete Mode */}
                        {modalMode === 'delete' && selectedNasabah && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--error-100)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    fontSize: '2.5rem'
                                }}>
                                    ⚠️
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Hapus Nasabah?
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    Apakah Anda yakin ingin menghapus nasabah <strong>{selectedNasabah.nama_lengkap}</strong>?
                                    Tindakan ini tidak dapat dibatalkan.
                                </p>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            background: 'var(--error-500)',
                                            color: 'white'
                                        }}
                                        onClick={handleDelete}
                                    >
                                        🗑️ Ya, Hapus
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ flex: 1 }}
                                        onClick={handleCloseModal}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table th,
                .table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--border-primary);
                }

                .table th {
                    background: var(--bg-secondary);
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .table tr:hover {
                    background: var(--bg-secondary);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
            `}</style>
        </>
    );
}
