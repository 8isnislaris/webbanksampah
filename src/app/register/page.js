'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nik: '',
        no_wa: '',
        email: '',
        alamat: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok!');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter');
            setLoading(false);
            return;
        }

        if (formData.nik.length !== 16) {
            setError('NIK harus 16 digit');
            setLoading(false);
            return;
        }

        if (formData.no_wa.length < 10 || formData.no_wa.length > 15) {
            setError('No WhatsApp harus 10-15 digit');
            setLoading(false);
            return;
        }

        // Check all fields are filled
        if (!formData.nama_lengkap.trim() || !formData.nik.trim() || !formData.no_wa.trim() || !formData.email.trim() || !formData.alamat.trim()) {
            setError('Semua kolom wajib diisi!');
            setLoading(false);
            return;
        }

        // Demo registration - in production this would be Supabase auth
        setTimeout(() => {
            // Store in localStorage for demo
            localStorage.setItem('bankSampahUser', JSON.stringify({
                email: formData.email,
                role: 'nasabah',
                nama_lengkap: formData.nama_lengkap,
                nik: formData.nik,
                no_wa: formData.no_wa,
                alamat: formData.alamat,
                total_saldo: 0
            }));

            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="auth-page">
            <div className="auth-container" style={{ maxWidth: '480px' }}>
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">🌿</div>
                        <h1 className="auth-title">Daftar Akun Baru</h1>
                        <p className="auth-subtitle">Bergabung dan mulai menghasilkan uang dari sampah</p>
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
                            <label className="form-label">Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Masukkan nama lengkap"
                                value={formData.nama_lengkap}
                                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">NIK (Nomor Induk Kependudukan) <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="form-input"
                                placeholder="16 digit NIK"
                                value={formData.nik}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    setFormData({ ...formData, nik: value });
                                }}
                                maxLength={16}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">No WhatsApp Aktif <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="form-input"
                                placeholder="Contoh: 08123456789"
                                value={formData.no_wa}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
                                    setFormData({ ...formData, no_wa: value });
                                }}
                                maxLength={15}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email <span style={{ color: '#ef4444' }}>*</span></label>
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
                            <label className="form-label">Alamat <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Alamat lengkap Anda"
                                value={formData.alamat}
                                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Minimal 6 karakter"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Konfirmasi Password <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Ulangi password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Sudah punya akun? <Link href="/login">Masuk di sini</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
