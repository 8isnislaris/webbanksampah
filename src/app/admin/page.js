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
    formatDateShort,
    getStatistics
} from '@/lib/demo-data';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('bankSampahUser');
        router.push('/');
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

    const stats = getStatistics();
    const recentTransaksi = demoTransaksi.slice(0, 5);
    const nasabahList = demoUsers.filter(u => u.role === 'nasabah').slice(0, 5);

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

                    {/* Mobile Menu Toggle for Sidebar */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                        style={{ marginLeft: 'auto', display: 'none' }} // Hidden by default, shown via CSS media query
                    >
                        ☰
                    </button>
                    <style jsx>{`
                        @media (max-width: 768px) {
                            .navbar-nav { display: none; }
                            .mobile-menu-btn { display: flex !important; }
                        }
                    `}</style>
                </div>
            </nav>

            <div className="dashboard-layout">
                <Sidebar
                    user={user}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="dashboard-main">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Dashboard Admin</h1>
                        <p className="dashboard-subtitle">Kelola Bank Sampah dengan mudah</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon green">👥</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Nasabah</div>
                                <div className="stat-value">{stats.totalNasabah}</div>
                                <span className="stat-change positive">+2 minggu ini</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon blue">📋</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Transaksi</div>
                                <div className="stat-value">{stats.totalTransaksi}</div>
                                <span className="stat-change positive">+5 minggu ini</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon yellow">⚖️</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Sampah</div>
                                <div className="stat-value">{stats.totalSampah} kg</div>
                                <span className="stat-change positive">+8.5 kg minggu ini</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon purple">💰</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Terbayar</div>
                                <div className="stat-value">{formatRupiah(stats.totalNilai)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action */}
                    <div className="card" style={{
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Input Setoran Baru</h3>
                                <p style={{ opacity: '0.9', fontSize: '0.9375rem' }}>
                                    Catat setoran sampah dari nasabah
                                </p>
                            </div>
                            <Link href="/admin/transaksi" className="btn btn-lg" style={{
                                background: 'white',
                                color: 'var(--primary-700)'
                            }}>
                                ➕ Input Setoran
                            </Link>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        {/* Recent Transactions */}
                        <div className="table-container">
                            <div className="table-header">
                                <h3 className="table-title">Transaksi Terakhir</h3>
                                <Link href="/admin/transaksi" className="btn btn-ghost btn-sm">
                                    Lihat Semua →
                                </Link>
                            </div>

                            <div style={{ padding: '0.5rem' }}>
                                {recentTransaksi.map((transaksi) => {
                                    const kategori = demoKategoriSampah.find(k => k.id === transaksi.kategori_id);
                                    return (
                                        <div key={transaksi.id} className="transaction-item">
                                            <div className="transaction-icon">
                                                {kategori?.icon || '📦'}
                                            </div>
                                            <div className="transaction-details">
                                                <div className="transaction-type">{transaksi.nasabah_nama}</div>
                                                <div className="transaction-date">
                                                    {transaksi.kategori_nama} • {transaksi.berat} kg
                                                </div>
                                            </div>
                                            <div className="transaction-amount">
                                                {formatRupiah(transaksi.total_harga)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Nasabah List */}
                        <div className="table-container">
                            <div className="table-header">
                                <h3 className="table-title">Nasabah Terdaftar</h3>
                                <Link href="/admin/nasabah" className="btn btn-ghost btn-sm">
                                    Lihat Semua →
                                </Link>
                            </div>

                            <div style={{ padding: '0.5rem' }}>
                                {nasabahList.map((nasabah) => (
                                    <div key={nasabah.id} className="transaction-item">
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-full)',
                                            background: 'var(--primary-100)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary-600)',
                                            fontWeight: '600',
                                            fontSize: '1.125rem'
                                        }}>
                                            {nasabah.nama_lengkap.charAt(0)}
                                        </div>
                                        <div className="transaction-details">
                                            <div className="transaction-type">{nasabah.nama_lengkap}</div>
                                            <div className="transaction-date">{nasabah.email}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                {formatRupiah(nasabah.total_saldo)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Saldo</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Category Stats */}
                    <div className="table-container" style={{ marginTop: '1.5rem' }}>
                        <div className="table-header">
                            <h3 className="table-title">Kategori Sampah</h3>
                            <Link href="/admin/kategori" className="btn btn-ghost btn-sm">
                                Kelola →
                            </Link>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '1rem',
                            padding: '1.5rem'
                        }}>
                            {demoKategoriSampah.map((kategori) => (
                                <div key={kategori.id} style={{
                                    textAlign: 'center',
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{kategori.icon}</div>
                                    <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                        {kategori.nama_jenis}
                                    </div>
                                    <div style={{ color: 'var(--primary-600)', fontWeight: '600', fontSize: '0.875rem' }}>
                                        {formatRupiah(kategori.harga_per_kg)}/kg
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
