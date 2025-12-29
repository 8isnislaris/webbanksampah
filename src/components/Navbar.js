'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ user, onLogout }) {
    const pathname = usePathname();

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link href="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🌿</div>
                    <span>Bank Sampah</span>
                </Link>

                <div className="navbar-nav">
                    {!user ? (
                        <>
                            <Link href="/login" className={`navbar-link ${pathname === '/login' ? 'active' : ''}`}>
                                Masuk
                            </Link>
                            <Link href="/register" className="btn btn-primary btn-sm">
                                Daftar Gratis
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                                className={`navbar-link ${pathname.startsWith('/dashboard') || pathname.startsWith('/admin') ? 'active' : ''}`}
                            >
                                Dashboard
                            </Link>
                            <Link href="/riwayat" className={`navbar-link ${pathname === '/riwayat' ? 'active' : ''}`}>
                                Riwayat
                            </Link>
                            <div className="navbar-user">
                                <span className="navbar-link">{user.nama_lengkap}</span>
                                <button onClick={onLogout} className="btn btn-ghost btn-sm">
                                    Keluar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
