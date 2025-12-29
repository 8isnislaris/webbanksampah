'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import {
    demoTransaksi,
    demoUsers,
    demoKategoriSampah,
    formatRupiah,
    formatDate
} from '@/lib/demo-data';

export default function TransaksiPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [transaksiList, setTransaksiList] = useState(demoTransaksi);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        nasabah_id: '',
        kategori_id: '',
        berat: ''
    });

    const nasabahList = demoUsers.filter(u => u.role === 'nasabah');
    const selectedKategori = demoKategoriSampah.find(k => k.id === formData.kategori_id);
    const totalHarga = selectedKategori && formData.berat
        ? selectedKategori.harga_per_kg * parseFloat(formData.berat)
        : 0;

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const nasabah = nasabahList.find(n => n.id === formData.nasabah_id);
            const kategori = demoKategoriSampah.find(k => k.id === formData.kategori_id);

            const newTransaksi = {
                id: String(Date.now()),
                nasabah_id: formData.nasabah_id,
                nasabah_nama: nasabah?.nama_lengkap || '',
                petugas_id: '4',
                kategori_id: formData.kategori_id,
                kategori_nama: kategori?.nama_jenis || '',
                berat: parseFloat(formData.berat),
                harga_per_kg: kategori?.harga_per_kg || 0,
                total_harga: totalHarga,
                created_at: new Date().toISOString()
            };

            setTransaksiList([newTransaksi, ...transaksiList]);
            setFormData({ nasabah_id: '', kategori_id: '', berat: '' });
            setShowModal(false);
            setSubmitting(false);
            setSuccessMessage(`Transaksi berhasil! ${nasabah?.nama_lengkap} +${formatRupiah(totalHarga)}`);

            setTimeout(() => setSuccessMessage(''), 5000);
        }, 1000);
    };

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
                    <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="dashboard-title">Input Transaksi</h1>
                            <p className="dashboard-subtitle">Catat setoran sampah dari nasabah</p>
                        </div>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg">
                            ➕ Input Setoran Baru
                        </button>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div style={{
                            padding: '1rem 1.5rem',
                            background: 'var(--primary-100)',
                            color: 'var(--primary-700)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            animation: 'fadeIn 0.3s ease'
                        }}>
                            <span style={{ fontSize: '1.25rem' }}>✅</span>
                            {successMessage}
                        </div>
                    )}

                    {/* Transactions Table */}
                    <div className="table-container">
                        <div className="table-header">
                            <h3 className="table-title">Riwayat Transaksi</h3>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Nasabah</th>
                                    <th>Kategori</th>
                                    <th>Berat</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaksiList.map((transaksi) => {
                                    const kategori = demoKategoriSampah.find(k => k.id === transaksi.kategori_id);
                                    return (
                                        <tr key={transaksi.id}>
                                            <td>{formatDate(transaksi.created_at)}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: 'var(--radius-full)',
                                                        background: 'var(--primary-100)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--primary-600)',
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {transaksi.nasabah_nama?.charAt(0) || 'N'}
                                                    </div>
                                                    {transaksi.nasabah_nama}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {kategori?.icon} {transaksi.kategori_nama}
                                                </span>
                                            </td>
                                            <td>{transaksi.berat} kg</td>
                                            <td style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                {formatRupiah(transaksi.total_harga)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Input Setoran Baru</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Pilih Nasabah *</label>
                                    <select
                                        className="form-select"
                                        value={formData.nasabah_id}
                                        onChange={(e) => setFormData({ ...formData, nasabah_id: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Pilih Nasabah --</option>
                                        {nasabahList.map((nasabah) => (
                                            <option key={nasabah.id} value={nasabah.id}>
                                                {nasabah.nama_lengkap}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Kategori Sampah *</label>
                                    <select
                                        className="form-select"
                                        value={formData.kategori_id}
                                        onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {demoKategoriSampah.map((kategori) => (
                                            <option key={kategori.id} value={kategori.id}>
                                                {kategori.icon} {kategori.nama_jenis} - {formatRupiah(kategori.harga_per_kg)}/kg
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Berat (kg) *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Contoh: 5.5"
                                        step="0.1"
                                        min="0.1"
                                        value={formData.berat}
                                        onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Preview */}
                                {totalHarga > 0 && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1.25rem',
                                        background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                                        borderRadius: 'var(--radius-lg)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            Total yang akan diterima nasabah:
                                        </div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-600)' }}>
                                            {formatRupiah(totalHarga)}
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                            {formData.berat} kg × {formatRupiah(selectedKategori?.harga_per_kg || 0)}/kg
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Menyimpan...' : '💾 Simpan Transaksi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
