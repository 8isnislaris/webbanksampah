'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/" className="navbar-brand">
            <div className="navbar-brand-icon">🌿</div>
            <span>Bank Sampah</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`navbar-nav ${mobileMenuOpen ? 'active' : ''}`}>
            <Link href="#fitur" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Fitur</Link>
            <Link href="#cara-kerja" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Cara Kerja</Link>
            <Link href="/login" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
            <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🌍</span>
              <span>Ramah Lingkungan</span>
            </div>
            <h1 className="hero-title">
              Kelola Sampah,<br />
              <span className="text-gradient">Hasilkan Uang</span>
            </h1>
            <p className="hero-description">
              Bank Sampah adalah solusi modern untuk mengelola sampah daur ulang Anda.
              Kumpulkan sampah, setor ke kami, dan dapatkan nilai tunai langsung ke saldo Anda.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-lg">
                Mulai Sekarang
              </Link>
              <Link href="#cara-kerja" className="btn btn-secondary btn-lg">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-wrapper">
              <div className="hero-image-card">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>♻️</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Sudah Terkumpul
                  </h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-600)' }}>
                    28.5 Ton
                  </p>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Sampah berhasil didaur ulang
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--gray-100)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-600)' }}>500+</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Nasabah</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-600)' }}>8</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Kategori</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-600)' }}>15jt+</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Terbayar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="fitur">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Fitur Unggulan</h2>
            <p className="section-description">
              Nikmati kemudahan mengelola sampah dengan fitur-fitur modern yang kami sediakan
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Nilai Tunai Instan</h3>
              <p className="feature-description">
                Sampah Anda langsung dikonversi menjadi saldo. Pantau saldo real-time dari dashboard Anda.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Laporan Lengkap</h3>
              <p className="feature-description">
                Lihat riwayat transaksi, statistik setoran, dan laporan bulanan dengan mudah.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <h3 className="feature-title">8 Kategori Sampah</h3>
              <p className="feature-description">
                Plastik, kertas, logam, elektronik, dan lainnya. Setiap jenis memiliki harga berbeda.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Akses Mobile</h3>
              <p className="feature-description">
                Akses akun Anda dari mana saja. Tampilan responsif untuk semua perangkat.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Aman & Terpercaya</h3>
              <p className="feature-description">
                Data Anda dilindungi dengan enkripsi modern. Transaksi transparan dan tercatat.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3 className="feature-title">Ramah Lingkungan</h3>
              <p className="feature-description">
                Berkontribusi untuk bumi yang lebih bersih. Setiap kilogram sampah berarti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-primary)' }} id="cara-kerja">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Cara Kerja</h2>
            <p className="section-description">
              Ikuti 4 langkah mudah untuk mulai menghasilkan uang dari sampah Anda
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {[
              { step: 1, icon: '📝', title: 'Daftar Akun', desc: 'Buat akun gratis dalam 1 menit' },
              { step: 2, icon: '🗑️', title: 'Kumpulkan Sampah', desc: 'Pisahkan sampah sesuai kategori' },
              { step: 3, icon: '⚖️', title: 'Setor ke Petugas', desc: 'Sampah ditimbang & dicatat' },
              { step: 4, icon: '💵', title: 'Terima Saldo', desc: 'Saldo masuk otomatis ke akun' },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 1.5rem',
                  background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  position: 'relative'
                }}>
                  {item.icon}
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '32px',
                    height: '32px',
                    background: 'var(--primary-600)',
                    color: 'white',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '700'
                  }}>
                    {item.step}
                  </span>
                </div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Table */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Harga Sampah</h2>
            <p className="section-description">
              Harga terkini per kilogram untuk setiap kategori sampah
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { icon: '🥤', name: 'Plastik Bening', price: 'Rp 3.000' },
              { icon: '🧴', name: 'Plastik Keras', price: 'Rp 2.500' },
              { icon: '📄', name: 'Kertas HVS', price: 'Rp 2.000' },
              { icon: '📦', name: 'Kardus', price: 'Rp 1.500' },
              { icon: '🔧', name: 'Besi/Logam', price: 'Rp 5.000' },
              { icon: '🍾', name: 'Kaca/Botol', price: 'Rp 1.000' },
              { icon: '📱', name: 'Elektronik', price: 'Rp 8.000' },
              { icon: '🛢️', name: 'Minyak Jelantah', price: 'Rp 4.000' },
            ].map((item) => (
              <div key={item.name} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</div>
                <div style={{ color: 'var(--primary-600)', fontWeight: '700', fontSize: '1.125rem' }}>
                  {item.price}/kg
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Mulai Sekarang, Gratis!
          </h2>
          <p style={{ fontSize: '1.125rem', opacity: '0.9', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Bergabung dengan ratusan nasabah lainnya dan mulai menghasilkan uang dari sampah Anda.
          </p>
          <Link href="/register" className="btn btn-lg" style={{
            background: 'white',
            color: 'var(--primary-700)',
            fontWeight: '700'
          }}>
            Daftar Sekarang — Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 0',
        background: 'var(--gray-900)',
        color: 'var(--gray-400)'
      }}>
        <div className="container">
          {/* Footer Top */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--gray-700)'
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--primary-600)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  🌿
                </div>
                <span style={{ fontWeight: '600', color: 'white', fontSize: '1.125rem' }}>Bank Sampah</span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                Solusi modern untuk mengelola sampah daur ulang Anda dan berkontribusi untuk lingkungan yang lebih bersih.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>Hubungi Kami</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--gray-400)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#25D366'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--gray-400)'}
                >
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <span style={{ fontSize: '0.875rem' }}>+62 812-3456-7890</span>
                </a>
                <a
                  href="mailto:admin@banksampah.com"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--gray-400)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-400)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--gray-400)'}
                >
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                  <span style={{ fontSize: '0.875rem' }}>admin@banksampah.com</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>Ikuti Kami</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(225, 48, 108, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 0, 0, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="YouTube"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '0.875rem' }}>
              © 2024 Bank Sampah. Dibuat dengan ❤️ untuk bumi yang lebih baik.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
              <a href="#" style={{ color: 'var(--gray-400)', textDecoration: 'none' }}>Kebijakan Privasi</a>
              <a href="#" style={{ color: 'var(--gray-400)', textDecoration: 'none' }}>Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
