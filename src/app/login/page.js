'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Demo login - check against demo users
        // In production, this would be Supabase auth
        const demoCredentials = {
            'nasabah@banksampah.com': { password: 'nasabah123', role: 'nasabah' },
            'admin@banksampah.com': { password: 'admin123', role: 'admin' }
        };

        setTimeout(() => {
            const user = demoCredentials[formData.email];
            if (user && formData.password === user.password) {
                // Store in localStorage for demo
                localStorage.setItem('bankSampahUser', JSON.stringify({
                    email: formData.email,
                    role: user.role,
                    nama_lengkap: user.role === 'admin' ? 'Admin Bank Sampah' : 'Ahmad Santoso'
                }));

                // Redirect based on role
                if (user.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError('Email atau password salah. Coba: nasabah@banksampah.com / nasabah123');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">🌿</div>
                        <h1 className="auth-title">Selamat Datang!</h1>
                        <p className="auth-subtitle">Masuk ke akun Bank Sampah Anda</p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Belum punya akun? <Link href="/register">Daftar Gratis</Link>
                    </div>
                </div>

                {/* Demo Credentials Info */}
                <div className="card" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        🔑 <strong>Demo Credentials:</strong>
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        <p>Nasabah: nasabah@banksampah.com / nasabah123</p>
                        <p>Admin: admin@banksampah.com / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
