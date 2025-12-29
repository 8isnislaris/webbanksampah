// Demo data for Bank Sampah application
// This data is used for demonstration purposes before Supabase integration

export const demoUsers = [
    {
        id: '1',
        email: 'nasabah@banksampah.com',
        nama_lengkap: 'Ahmad Santoso',
        alamat: 'Jl. Merdeka No. 123, Jakarta',
        role: 'nasabah',
        total_saldo: 250000,
        created_at: '2024-01-15T08:00:00Z'
    },
    {
        id: '2',
        email: 'budi@banksampah.com',
        nama_lengkap: 'Budi Pratama',
        alamat: 'Jl. Sudirman No. 45, Bandung',
        role: 'nasabah',
        total_saldo: 175000,
        created_at: '2024-02-20T10:30:00Z'
    },
    {
        id: '3',
        email: 'siti@banksampah.com',
        nama_lengkap: 'Siti Rahayu',
        alamat: 'Jl. Gatot Subroto No. 67, Surabaya',
        role: 'nasabah',
        total_saldo: 320000,
        created_at: '2024-03-10T14:00:00Z'
    },
    {
        id: '4',
        email: 'admin@banksampah.com',
        nama_lengkap: 'Admin Bank Sampah',
        alamat: 'Kantor Bank Sampah Pusat',
        role: 'admin',
        total_saldo: 0,
        created_at: '2024-01-01T00:00:00Z'
    }
];

export const demoKategoriSampah = [
    {
        id: '1',
        nama_jenis: 'Plastik Bening',
        harga_per_kg: 3000,
        icon: '🥤',
        deskripsi: 'Botol air mineral, gelas plastik bening'
    },
    {
        id: '2',
        nama_jenis: 'Plastik Keras',
        harga_per_kg: 2500,
        icon: '🧴',
        deskripsi: 'Ember, baskom, kursi plastik'
    },
    {
        id: '3',
        nama_jenis: 'Kertas HVS',
        harga_per_kg: 2000,
        icon: '📄',
        deskripsi: 'Kertas putih, kertas fotokopi'
    },
    {
        id: '4',
        nama_jenis: 'Kardus',
        harga_per_kg: 1500,
        icon: '📦',
        deskripsi: 'Kardus bekas, box kemasan'
    },
    {
        id: '5',
        nama_jenis: 'Besi/Logam',
        harga_per_kg: 5000,
        icon: '🔧',
        deskripsi: 'Besi tua, kaleng, aluminium'
    },
    {
        id: '6',
        nama_jenis: 'Kaca/Botol',
        harga_per_kg: 1000,
        icon: '🍾',
        deskripsi: 'Botol kaca, pecahan kaca'
    },
    {
        id: '7',
        nama_jenis: 'Elektronik',
        harga_per_kg: 8000,
        icon: '📱',
        deskripsi: 'HP bekas, charger, kabel'
    },
    {
        id: '8',
        nama_jenis: 'Minyak Jelantah',
        harga_per_kg: 4000,
        icon: '🛢️',
        deskripsi: 'Minyak goreng bekas'
    }
];

export const demoTransaksi = [
    {
        id: '1',
        nasabah_id: '1',
        nasabah_nama: 'Ahmad Santoso',
        petugas_id: '4',
        kategori_id: '1',
        kategori_nama: 'Plastik Bening',
        berat: 5.5,
        harga_per_kg: 3000,
        total_harga: 16500,
        created_at: '2024-12-20T09:30:00Z'
    },
    {
        id: '2',
        nasabah_id: '2',
        nasabah_nama: 'Budi Pratama',
        petugas_id: '4',
        kategori_id: '4',
        kategori_nama: 'Kardus',
        berat: 10,
        harga_per_kg: 1500,
        total_harga: 15000,
        created_at: '2024-12-19T14:15:00Z'
    },
    {
        id: '3',
        nasabah_id: '3',
        nasabah_nama: 'Siti Rahayu',
        petugas_id: '4',
        kategori_id: '5',
        kategori_nama: 'Besi/Logam',
        berat: 3,
        harga_per_kg: 5000,
        total_harga: 15000,
        created_at: '2024-12-18T11:00:00Z'
    },
    {
        id: '4',
        nasabah_id: '1',
        nasabah_nama: 'Ahmad Santoso',
        petugas_id: '4',
        kategori_id: '3',
        kategori_nama: 'Kertas HVS',
        berat: 8,
        harga_per_kg: 2000,
        total_harga: 16000,
        created_at: '2024-12-17T10:45:00Z'
    },
    {
        id: '5',
        nasabah_id: '2',
        nasabah_nama: 'Budi Pratama',
        petugas_id: '4',
        kategori_id: '7',
        kategori_nama: 'Elektronik',
        berat: 2,
        harga_per_kg: 8000,
        total_harga: 16000,
        created_at: '2024-12-16T15:30:00Z'
    }
];

// Helper functions
export function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export function formatDate(dateString) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString));
}

export function formatDateShort(dateString) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(dateString));
}

// Calculate statistics
export function getStatistics() {
    const totalNasabah = demoUsers.filter(u => u.role === 'nasabah').length;
    const totalTransaksi = demoTransaksi.length;
    const totalSampah = demoTransaksi.reduce((sum, t) => sum + t.berat, 0);
    const totalNilai = demoTransaksi.reduce((sum, t) => sum + t.total_harga, 0);

    return {
        totalNasabah,
        totalTransaksi,
        totalSampah,
        totalNilai
    };
}
