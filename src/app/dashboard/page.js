'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { demoTransaksi, demoKategoriSampah, formatRupiah, formatDateShort } from '@/lib/demo-data';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('bankSampahUser');
        if (!storedUser) {
            router.push('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.role === 'admin') {
            router.push('/admin');
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

    // Get user's transactions from demo data
    const userTransaksi = demoTransaksi.filter(t => t.nasabah_nama === 'Ahmad Santoso').slice(0, 5);
    const totalSaldo = 250000; // Demo saldo

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
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">Selamat datang kembali, {user?.nama_lengkap}!</p>
                    </div>

                    {/* Welcome Card */}
                    <div className="welcome-card">
                        <div className="welcome-content">
                            <h2>💰 Saldo Anda</h2>
                            <p>Total nilai sampah yang telah Anda kumpulkan</p>
                        </div>
                        <div className="welcome-balance">
                            <div className="welcome-balance-label">Total Saldo</div>
                            <div className="welcome-balance-value">{formatRupiah(totalSaldo)}</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon green">📦</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Setoran</div>
                                <div className="stat-value">13.5 kg</div>
                                <span className="stat-change positive">+2.5 kg bulan ini</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon blue">📋</div>
                            <div className="stat-content">
                                <div className="stat-label">Transaksi</div>
                                <div className="stat-value">12</div>
                                <span className="stat-change positive">+3 bulan ini</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon yellow">⭐</div>
                            <div className="stat-content">
                                <div className="stat-label">Kategori Favorit</div>
                                <div className="stat-value">Plastik</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="table-container">
                        <div className="table-header">
                            <h3 className="table-title">Transaksi Terakhir</h3>
                            <Link href="/riwayat" className="btn btn-ghost btn-sm">
                                Lihat Semua →
                            </Link>
                        </div>

                        <div style={{ padding: '0.5rem' }}>
                            {userTransaksi.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📋</div>
                                    <h3 className="empty-state-title">Belum ada transaksi</h3>
                                    <p className="empty-state-description">
                                        Mulai kumpulkan sampah dan setor ke petugas Bank Sampah
                                    </p>
                                </div>
                            ) : (
                                userTransaksi.map((transaksi) => {
                                    const kategori = demoKategoriSampah.find(k => k.id === transaksi.kategori_id);
                                    return (
                                        <div key={transaksi.id} className="transaction-item">
                                            <div className="transaction-icon">
                                                {kategori?.icon || '📦'}
                                            </div>
                                            <div className="transaction-details">
                                                <div className="transaction-type">{transaksi.kategori_nama}</div>
                                                <div className="transaction-date">
                                                    {formatDateShort(transaksi.created_at)} • {transaksi.berat} kg
                                                </div>
                                            </div>
                                            <div className="transaction-amount">
                                                +{formatRupiah(transaksi.total_harga)}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Quick Info Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '2rem'
                    }}>
                        <div className="card">
                            <h3 style={{ fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>💡</span> Tips Menabung Sampah
                            </h3>
                            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.8' }}>
                                <li>• Pisahkan sampah berdasarkan jenisnya</li>
                                <li>• Bersihkan plastik dari sisa makanan</li>
                                <li>• Lipat kardus agar tidak memakan tempat</li>
                                <li>• Kumpulkan sampah elektronik dengan hati-hati</li>
                            </ul>
                        </div>

                        <div className="card">
                            <h3 style={{ fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>📍</span> Lokasi Bank Sampah
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1rem' }}>
                                Jl. Hijau Daun No. 123, Kelurahan Bersih, Kecamatan Sejahtera
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <strong>Jam Operasional:</strong><br />
                                Senin - Jumat: 08.00 - 16.00<br />
                                Sabtu: 08.00 - 12.00
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
