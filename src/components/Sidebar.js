'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ user }) {
    const pathname = usePathname();
    const isAdmin = user?.role === 'admin';

    const nasabahLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { href: '/riwayat', label: 'Riwayat Transaksi', icon: '📋' },
        { href: '/profil', label: 'Profil Saya', icon: '👤' },
    ];

    const adminLinks = [
        { href: '/admin', label: 'Dashboard', icon: '🏠' },
        { href: '/admin/transaksi', label: 'Input Transaksi', icon: '➕' },
        { href: '/admin/nasabah', label: 'Data Nasabah', icon: '👥' },
        { href: '/admin/kategori', label: 'Kategori Sampah', icon: '🗂️' },
        { href: '/admin/laporan', label: 'Laporan', icon: '📊' },
    ];

    const links = isAdmin ? adminLinks : nasabahLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <div className="sidebar-title">Menu Utama</div>
                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            <span className="sidebar-link-icon">{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {isAdmin && (
                <div className="sidebar-section">
                    <div className="sidebar-title">Quick Actions</div>
                    <nav className="sidebar-nav">
                        <Link href="/admin/transaksi" className="btn btn-primary" style={{ width: '100%' }}>
                            ➕ Input Setoran Baru
                        </Link>
                    </nav>
                </div>
            )}

            <div className="sidebar-section" style={{ marginTop: 'auto' }}>
                <div className="sidebar-user-card card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--primary-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary-600)',
                            fontWeight: '600'
                        }}>
                            {user?.nama_lengkap?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.nama_lengkap || 'User'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                {isAdmin ? 'Administrator' : 'Nasabah'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
