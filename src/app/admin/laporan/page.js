'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import {
    demoUsers,
    demoTransaksi,
    demoKategoriSampah,
    formatRupiah,
    formatDate,
    formatDateShort
} from '@/lib/demo-data';

export default function LaporanPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ringkasan');
    const [filterPeriod, setFilterPeriod] = useState('semua');
    const [filterKategori, setFilterKategori] = useState('semua');

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

    // Get nasabah data
    const getNasabahList = () => {
        const storedNasabah = localStorage.getItem('bankSampahNasabah');
        if (storedNasabah) {
            return JSON.parse(storedNasabah);
        }
        return demoUsers.filter(u => u.role === 'nasabah');
    };

    // Filter transactions based on period
    const getFilteredTransactions = () => {
        let filtered = [...demoTransaksi];

        if (filterPeriod !== 'semua') {
            const now = new Date();
            const periodDays = {
                'hari': 1,
                'minggu': 7,
                'bulan': 30,
                '3bulan': 90,
                'tahun': 365
            };

            const daysAgo = periodDays[filterPeriod] || 0;
            const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

            filtered = filtered.filter(t => new Date(t.created_at) >= startDate);
        }

        if (filterKategori !== 'semua') {
            filtered = filtered.filter(t => t.kategori_id === filterKategori);
        }

        return filtered;
    };

    // Calculate statistics
    const calculateStats = () => {
        const transactions = getFilteredTransactions();
        const nasabahList = getNasabahList();

        const totalTransaksi = transactions.length;
        const totalBerat = transactions.reduce((sum, t) => sum + t.berat, 0);
        const totalNilai = transactions.reduce((sum, t) => sum + t.total_harga, 0);
        const totalNasabah = nasabahList.length;
        const avgTransaksiPerNasabah = totalNasabah > 0 ? (totalTransaksi / totalNasabah).toFixed(1) : 0;
        const avgBeratPerTransaksi = totalTransaksi > 0 ? (totalBerat / totalTransaksi).toFixed(2) : 0;

        return {
            totalTransaksi,
            totalBerat,
            totalNilai,
            totalNasabah,
            avgTransaksiPerNasabah,
            avgBeratPerTransaksi
        };
    };

    // Calculate category breakdown
    const getCategoryBreakdown = () => {
        const transactions = getFilteredTransactions();
        const breakdown = {};

        demoKategoriSampah.forEach(kategori => {
            breakdown[kategori.id] = {
                ...kategori,
                totalBerat: 0,
                totalNilai: 0,
                jumlahTransaksi: 0
            };
        });

        transactions.forEach(t => {
            if (breakdown[t.kategori_id]) {
                breakdown[t.kategori_id].totalBerat += t.berat;
                breakdown[t.kategori_id].totalNilai += t.total_harga;
                breakdown[t.kategori_id].jumlahTransaksi += 1;
            }
        });

        return Object.values(breakdown).sort((a, b) => b.totalBerat - a.totalBerat);
    };

    // Get top nasabah
    const getTopNasabah = () => {
        const transactions = getFilteredTransactions();
        const nasabahStats = {};

        transactions.forEach(t => {
            if (!nasabahStats[t.nasabah_id]) {
                nasabahStats[t.nasabah_id] = {
                    id: t.nasabah_id,
                    nama: t.nasabah_nama,
                    totalBerat: 0,
                    totalNilai: 0,
                    jumlahTransaksi: 0
                };
            }
            nasabahStats[t.nasabah_id].totalBerat += t.berat;
            nasabahStats[t.nasabah_id].totalNilai += t.total_harga;
            nasabahStats[t.nasabah_id].jumlahTransaksi += 1;
        });

        return Object.values(nasabahStats).sort((a, b) => b.totalBerat - a.totalBerat).slice(0, 10);
    };

    // Export to CSV
    const exportToCSV = (data, filename) => {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleExportTransaksi = () => {
        const data = getFilteredTransactions().map(t => ({
            'ID': t.id,
            'Tanggal': formatDate(t.created_at),
            'Nasabah': t.nasabah_nama,
            'Kategori': t.kategori_nama,
            'Berat (kg)': t.berat,
            'Harga/kg': t.harga_per_kg,
            'Total': t.total_harga
        }));
        exportToCSV(data, 'laporan_transaksi');
    };

    const handleExportNasabah = () => {
        const nasabahList = getNasabahList();
        const data = nasabahList.map(n => ({
            'ID': n.id,
            'Nama': n.nama_lengkap,
            'Email': n.email,
            'Alamat': n.alamat || '',
            'NIK': n.nik || '',
            'No HP': n.no_hp || '',
            'Saldo': n.total_saldo || 0,
            'Terdaftar': formatDate(n.created_at)
        }));
        exportToCSV(data, 'laporan_nasabah');
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

    const stats = calculateStats();
    const categoryBreakdown = getCategoryBreakdown();
    const topNasabah = getTopNasabah();
    const filteredTransactions = getFilteredTransactions();
    const maxBerat = Math.max(...categoryBreakdown.map(c => c.totalBerat), 1);

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
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">📊 Laporan</h1>
                        <p className="dashboard-subtitle">Analisis dan statistik Bank Sampah</p>
                    </div>

                    {/* Filter Section */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.25rem' }}>Periode</label>
                                    <select
                                        className="input"
                                        value={filterPeriod}
                                        onChange={(e) => setFilterPeriod(e.target.value)}
                                        style={{ minWidth: '150px' }}
                                    >
                                        <option value="semua">Semua Waktu</option>
                                        <option value="hari">Hari Ini</option>
                                        <option value="minggu">7 Hari Terakhir</option>
                                        <option value="bulan">30 Hari Terakhir</option>
                                        <option value="3bulan">3 Bulan Terakhir</option>
                                        <option value="tahun">1 Tahun Terakhir</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.25rem' }}>Kategori</label>
                                    <select
                                        className="input"
                                        value={filterKategori}
                                        onChange={(e) => setFilterKategori(e.target.value)}
                                        style={{ minWidth: '150px' }}
                                    >
                                        <option value="semua">Semua Kategori</option>
                                        {demoKategoriSampah.map(k => (
                                            <option key={k.id} value={k.id}>{k.icon} {k.nama_jenis}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-ghost btn-sm" onClick={handleExportTransaksi}>
                                    📥 Export Transaksi
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={handleExportNasabah}>
                                    📥 Export Nasabah
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-primary)', paddingBottom: '0' }}>
                        {[
                            { id: 'ringkasan', label: '📈 Ringkasan', icon: '📈' },
                            { id: 'kategori', label: '🗂️ Per Kategori', icon: '🗂️' },
                            { id: 'nasabah', label: '👥 Per Nasabah', icon: '👥' },
                            { id: 'transaksi', label: '📋 Daftar Transaksi', icon: '📋' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: activeTab === tab.id ? 'var(--primary-500)' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Ringkasan Tab */}
                    {activeTab === 'ringkasan' && (
                        <>
                            {/* Main Stats */}
                            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                                <div className="stat-card">
                                    <div className="stat-icon green">📋</div>
                                    <div className="stat-content">
                                        <div className="stat-label">Total Transaksi</div>
                                        <div className="stat-value">{stats.totalTransaksi}</div>
                                        <span className="stat-change positive">transaksi tercatat</span>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon blue">⚖️</div>
                                    <div className="stat-content">
                                        <div className="stat-label">Total Sampah</div>
                                        <div className="stat-value">{stats.totalBerat.toFixed(1)} kg</div>
                                        <span className="stat-change positive">rata-rata {stats.avgBeratPerTransaksi} kg/transaksi</span>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon purple">💰</div>
                                    <div className="stat-content">
                                        <div className="stat-label">Total Nilai</div>
                                        <div className="stat-value">{formatRupiah(stats.totalNilai)}</div>
                                        <span className="stat-change positive">dibayarkan ke nasabah</span>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon yellow">👥</div>
                                    <div className="stat-content">
                                        <div className="stat-label">Total Nasabah</div>
                                        <div className="stat-value">{stats.totalNasabah}</div>
                                        <span className="stat-change positive">rata-rata {stats.avgTransaksiPerNasabah} transaksi/nasabah</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Charts */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                {/* Category Distribution */}
                                <div className="table-container">
                                    <div className="table-header">
                                        <h3 className="table-title">🗂️ Distribusi per Kategori</h3>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        {categoryBreakdown.slice(0, 5).map((cat, index) => (
                                            <div key={cat.id} style={{ marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span>{cat.icon}</span>
                                                        <span style={{ fontWeight: '500' }}>{cat.nama_jenis}</span>
                                                    </span>
                                                    <span style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                        {cat.totalBerat.toFixed(1)} kg
                                                    </span>
                                                </div>
                                                <div style={{
                                                    height: '8px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: 'var(--radius-full)',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${(cat.totalBerat / maxBerat) * 100}%`,
                                                        background: `linear-gradient(90deg, var(--primary-400), var(--primary-600))`,
                                                        borderRadius: 'var(--radius-full)',
                                                        transition: 'width 0.5s ease'
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Nasabah */}
                                <div className="table-container">
                                    <div className="table-header">
                                        <h3 className="table-title">🏆 Top Nasabah</h3>
                                    </div>
                                    <div style={{ padding: '0.5rem' }}>
                                        {topNasabah.slice(0, 5).map((ns, index) => (
                                            <div key={ns.id} className="transaction-item">
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                                                        index === 1 ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' :
                                                            index === 2 ? 'linear-gradient(135deg, #CD7F32, #8B4513)' :
                                                                'var(--bg-tertiary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: index < 3 ? 'white' : 'var(--text-secondary)',
                                                    fontWeight: '700',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {index + 1}
                                                </div>
                                                <div className="transaction-details">
                                                    <div className="transaction-type">{ns.nama}</div>
                                                    <div className="transaction-date">
                                                        {ns.jumlahTransaksi} transaksi
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                        {ns.totalBerat.toFixed(1)} kg
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                        {formatRupiah(ns.totalNilai)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {topNasabah.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                                                Tidak ada data transaksi
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Kategori Tab */}
                    {activeTab === 'kategori' && (
                        <div className="table-container">
                            <div className="table-header">
                                <h3 className="table-title">Laporan per Kategori Sampah</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Kategori</th>
                                            <th>Harga/kg</th>
                                            <th>Jumlah Transaksi</th>
                                            <th>Total Berat</th>
                                            <th>Total Nilai</th>
                                            <th>Persentase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryBreakdown.map((cat) => {
                                            const percentage = stats.totalBerat > 0 ? ((cat.totalBerat / stats.totalBerat) * 100).toFixed(1) : 0;
                                            return (
                                                <tr key={cat.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                                                            <div>
                                                                <div style={{ fontWeight: '600' }}>{cat.nama_jenis}</div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                    {cat.deskripsi}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontWeight: '500' }}>{formatRupiah(cat.harga_per_kg)}</td>
                                                    <td>
                                                        <span className="badge badge-info">{cat.jumlahTransaksi}</span>
                                                    </td>
                                                    <td style={{ fontWeight: '600' }}>{cat.totalBerat.toFixed(1)} kg</td>
                                                    <td style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                        {formatRupiah(cat.totalNilai)}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '60px',
                                                                height: '8px',
                                                                background: 'var(--bg-tertiary)',
                                                                borderRadius: 'var(--radius-full)',
                                                                overflow: 'hidden'
                                                            }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    width: `${percentage}%`,
                                                                    background: 'var(--primary-500)',
                                                                    borderRadius: 'var(--radius-full)'
                                                                }} />
                                                            </div>
                                                            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{percentage}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr style={{ background: 'var(--bg-secondary)', fontWeight: '600' }}>
                                            <td>TOTAL</td>
                                            <td>-</td>
                                            <td>{stats.totalTransaksi}</td>
                                            <td>{stats.totalBerat.toFixed(1)} kg</td>
                                            <td style={{ color: 'var(--primary-600)' }}>{formatRupiah(stats.totalNilai)}</td>
                                            <td>100%</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Nasabah Tab */}
                    {activeTab === 'nasabah' && (
                        <div className="table-container">
                            <div className="table-header">
                                <h3 className="table-title">Laporan per Nasabah</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Peringkat</th>
                                            <th>Nasabah</th>
                                            <th>Jumlah Transaksi</th>
                                            <th>Total Berat</th>
                                            <th>Total Nilai</th>
                                            <th>Rata-rata/Transaksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topNasabah.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                                    <p>Tidak ada data transaksi untuk periode ini</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            topNasabah.map((ns, index) => (
                                                <tr key={ns.id}>
                                                    <td>
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: 'var(--radius-full)',
                                                            background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                                                                index === 1 ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' :
                                                                    index === 2 ? 'linear-gradient(135deg, #CD7F32, #8B4513)' :
                                                                        'var(--bg-tertiary)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: index < 3 ? 'white' : 'var(--text-secondary)',
                                                            fontWeight: '700',
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                    </td>
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
                                                                fontWeight: '600'
                                                            }}>
                                                                {ns.nama.charAt(0)}
                                                            </div>
                                                            <span style={{ fontWeight: '600' }}>{ns.nama}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge badge-info">{ns.jumlahTransaksi}</span>
                                                    </td>
                                                    <td style={{ fontWeight: '600' }}>{ns.totalBerat.toFixed(1)} kg</td>
                                                    <td style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                        {formatRupiah(ns.totalNilai)}
                                                    </td>
                                                    <td>
                                                        {(ns.totalBerat / ns.jumlahTransaksi).toFixed(2)} kg
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Transaksi Tab */}
                    {activeTab === 'transaksi' && (
                        <div className="table-container">
                            <div className="table-header">
                                <h3 className="table-title">Daftar Transaksi ({filteredTransactions.length})</h3>
                                <button className="btn btn-primary btn-sm" onClick={handleExportTransaksi}>
                                    📥 Export CSV
                                </button>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tanggal</th>
                                            <th>Nasabah</th>
                                            <th>Kategori</th>
                                            <th>Berat</th>
                                            <th>Harga/kg</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                                                    <p>Tidak ada transaksi untuk filter ini</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTransactions.map((t) => {
                                                const kategori = demoKategoriSampah.find(k => k.id === t.kategori_id);
                                                return (
                                                    <tr key={t.id}>
                                                        <td>
                                                            <span className="badge" style={{ background: 'var(--bg-tertiary)' }}>
                                                                #{t.id}
                                                            </span>
                                                        </td>
                                                        <td>{formatDateShort(t.created_at)}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <div style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: 'var(--radius-full)',
                                                                    background: 'var(--primary-100)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: 'var(--primary-600)',
                                                                    fontWeight: '600',
                                                                    fontSize: '0.75rem'
                                                                }}>
                                                                    {t.nasabah_nama.charAt(0)}
                                                                </div>
                                                                <span>{t.nasabah_nama}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span>{kategori?.icon}</span>
                                                                <span>{t.kategori_nama}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontWeight: '500' }}>{t.berat} kg</td>
                                                        <td>{formatRupiah(t.harga_per_kg)}</td>
                                                        <td style={{ fontWeight: '600', color: 'var(--primary-600)' }}>
                                                            {formatRupiah(t.total_harga)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                    {filteredTransactions.length > 0 && (
                                        <tfoot>
                                            <tr style={{ background: 'var(--bg-secondary)', fontWeight: '600' }}>
                                                <td colSpan="4">TOTAL</td>
                                                <td>{stats.totalBerat.toFixed(1)} kg</td>
                                                <td>-</td>
                                                <td style={{ color: 'var(--primary-600)' }}>{formatRupiah(stats.totalNilai)}</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
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

                .table tfoot tr {
                    border-top: 2px solid var(--border-primary);
                }
            `}</style>
        </>
    );
}
