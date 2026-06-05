# ⚡ Quiz Battle

Game quiz multiplayer real-time — adu kecepatan menjawab soal trivia bersama teman!

## Cara Menjalankan

### 1. Jalankan Server (Terminal 1)
```bash
cd server
npm install
npm run dev
```
Server berjalan di `http://localhost:3001`

### 2. Jalankan Client (Terminal 2)
```bash
cd client
npm install
npm run dev
```
Buka browser di `http://localhost:5173`

---

## Alur Bermain

1. Pemain pertama masukkan nama → klik **Buat Room** → dapat kode 4 digit
2. Pemain lain masukkan nama + kode → klik **Join Room**
3. Host klik **Mulai Game** (minimal 2 pemain)
4. 10 soal muncul bergantian — jawab secepat mungkin!
5. Jawab lebih cepat = poin lebih besar (max 1000 per soal)
6. Setelah 10 soal → tampil leaderboard → host bisa main lagi

## Fitur
- Room dengan kode 4 digit
- Timer 15 detik per soal
- Poin berbasis kecepatan
- Leaderboard real-time
- Deteksi menang/kalah/seri
- Tombol main lagi (host)
- Penanganan pemain keluar di tengah game
