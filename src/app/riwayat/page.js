'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { demoTransaksi, demoKategoriSampah, formatRupiah, formatDate } from '@/lib/demo-data';

export default function RiwayatPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('semua');

    useEffect(() => {
        const storedUser = localStorage.getItem('bankSampahUser');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('bankSampahUser');
        router.push('/');
    };

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

    // Filter transactions for current user (demo: Ahmad Santoso)
    const userTransaksi = demoTransaksi.filter(t => t.nasabah_nama === 'Ahmad Santoso');

    // Calculate totals
    const totalSampah = userTransaksi.reduce((sum, t) => sum + t.berat, 0);
    const totalNilai = userTransaksi.reduce((sum, t) => sum + t.total_harga, 0);

    // Filter by category
    const filteredTransaksi = filter === 'semua'
        ? userTransaksi
        : userTransaksi.filter(t => t.kategori_id === filter);

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
                        <span className="navbar-link">{user?.nama_lengkap}</span>
                        <button onClick={handleLogout} className="btn btn-ghost btn-sm">Keluar</button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-layout">
                <Sidebar user={user} />

                <main className="dashboard-main">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Riwayat Transaksi</h1>
                        <p className="dashboard-subtitle">Lihat semua setoran sampah Anda</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon green">📦</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Sampah</div>
                                <div className="stat-value">{totalSampah} kg</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon blue">📋</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Transaksi</div>
                                <div className="stat-value">{userTransaksi.length}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon purple">💰</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Pendapatan</div>
                                <div className="stat-value">{formatRupiah(totalNilai)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '500' }}>Filter:</span>
                            <button
                                onClick={() => setFilter('semua')}
                                className={`btn btn-sm ${filter === 'semua' ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                Semua
                            </button>
                            {demoKategoriSampah.slice(0, 5).map((kategori) => (
                                <button
                                    key={kategori.id}
                                    onClick={() => setFilter(kategori.id)}
                                    className={`btn btn-sm ${filter === kategori.id ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    {kategori.icon} {kategori.nama_jenis}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="table-container">
                        <div className="table-header">
                            <h3 className="table-title">
                                {filteredTransaksi.length} Transaksi
                                {filter !== 'semua' && ` - ${demoKategoriSampah.find(k => k.id === filter)?.nama_jenis}`}
                            </h3>
                        </div>

                        {filteredTransaksi.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3 className="empty-state-title">Tidak ada transaksi</h3>
                                <p className="empty-state-description">
                                    {filter !== 'semua' ? 'Coba filter kategori lainnya' : 'Belum ada riwayat setoran sampah'}
                                </p>
                            </div>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Kategori</th>
                                        <th>Berat</th>
                                        <th>Harga/kg</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransaksi.map((transaksi) => {
                                        const kategori = demoKategoriSampah.find(k => k.id === transaksi.kategori_id);
                                        return (
                                            <tr key={transaksi.id}>
                                                <td>{formatDate(transaksi.created_at)}</td>
                                                <td>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {kategori?.icon} {transaksi.kategori_nama}
                                                    </span>
                                                </td>
                                                <td>{transaksi.berat} kg</td>
                                                <td>{formatRupiah(transaksi.harga_per_kg)}</td>
                                                <td style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                    +{formatRupiah(transaksi.total_harga)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
