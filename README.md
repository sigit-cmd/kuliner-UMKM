# You Bake – Landing Page UMKM Brownies

Landing page statis bergaya Modern Premium (orange, cokelat, putih) untuk toko brownies **You Bake**.
Dibuat dengan HTML, CSS, JavaScript, dan Bootstrap 5. Tanpa database, tanpa proses build.

## Fitur
- Hero, menu 6 varian, pilihan ukuran 10×10 / 20×10 / 20×20 dengan harga otomatis
- Keranjang pesanan (tersimpan di browser) dan checkout ke WhatsApp
- Aturan minimal 2 box untuk ukuran 10×10
- Mix & Match: pilih topping, kirim pertanyaan harga ke WhatsApp
- Tabel ukuran, cara pesan, FAQ, tombol WhatsApp mengambang
- Responsif (mobile first), mendukung `prefers-reduced-motion`

## Checklist fitur
Wajib: Navbar (Logo, Home, Produk, Tentang, Kontak), Hero (banner, slogan, CTA), Tentang Kami (profil dan sejarah), Produk (6 produk + gambar), Keunggulan, Testimoni (3), Kontak (alamat, WhatsApp, Instagram, lokasi).
Tambahan: tombol pesan WhatsApp, galeri foto + lightbox, Google Maps, responsive, animasi scroll sederhana, footer dan hak cipta.

## Struktur
```
youbake/
├── index.html
├── css/style.css
├── js/main.js
├── images/        (foto produk)
└── README.md
```

## Menjalankan
Buka `index.html` di browser. Bootstrap, Bootstrap Icons, dan Google Fonts dimuat lewat CDN, jadi perlu internet.

## Yang perlu kamu ganti
Buka `js/main.js`, ubah bagian `CONFIG` di paling atas:
- `whatsapp`: nomor WA format `62812...` (tanpa `+`)
- `instagram`: link Instagram toko
- `address`, `hours`: alamat dan jam buka toko
- `mapsQuery`: alamat/nama tempat untuk Google Maps
- `minBox10x10`: minimal box ukuran 10×10

**Mengubah harga atau menu:** edit array `PRODUCTS` di `js/main.js` (urutan harga: 10×10, 20×10, 20×20).
**Menambah foto:** taruh di `images/`, lalu isi path-nya di `PRODUCTS`.
**Warna:** ubah variabel di bagian `:root` pada `css/style.css`.
**Testimoni:** memakai tangkapan chat pelanggan di `images/testi-1.jpg` sampai `testi-3.jpg`. Untuk mengganti, timpa file gambarnya dan edit kutipan di `index.html`.
**Teks Tentang dan Keunggulan:** masih contoh, ganti dengan cerita dan keunggulan tokomu di `index.html`.
**Teks FAQ & cara pesan:** edit langsung di `index.html`.

## Deploy gratis
Upload folder ke Netlify Drop, GitHub Pages, atau Cloudflare Pages. Tidak butuh pengaturan tambahan.
