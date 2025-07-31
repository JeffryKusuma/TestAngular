import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // Properti untuk mengelola status formulir dan pesan
  registerForm!: FormGroup; // FormGroup untuk Reactive Forms
  loading = false; // Menunjukkan apakah proses registrasi sedang berlangsung
  submitted = false; // Menunjukkan apakah formulir sudah disubmit (untuk validasi)
  error = ''; // Pesan kesalahan dari backend atau validasi
  success = ''; // Pesan sukses setelah registrasi berhasil

  constructor(
    private formBuilder: FormBuilder, // Digunakan untuk membangun FormGroup
    private router: Router, // Digunakan untuk navigasi
    private authService: AuthService // Layanan untuk interaksi API autentikasi
  ) {
    // Redirect ke halaman utama jika pengguna sudah login
    // Ini mencegah pengguna yang sudah login mengakses halaman register
    if (this.authService.currentUserValue && this.authService.currentUserValue.token) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    // Inisialisasi FormGroup dengan kontrol formulir dan validatornya
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required], // Username wajib diisi
      email: ['', [Validators.required, Validators.email]], // Email wajib diisi dan harus format email
      password: ['', [Validators.required, Validators.minLength(6)]] // Password wajib diisi, minimal 6 karakter
    });
  }

  // Getter yang memudahkan akses ke kontrol formulir di template
  // Contoh: f.username di template akan merujuk ke this.registerForm.controls.username
  get f() { return this.registerForm.controls; }

  // Metode yang dipanggil saat formulir disubmit
  onSubmit() {
    this.submitted = true; // Set submitted ke true untuk memicu tampilan pesan validasi

    // Hentikan di sini jika formulir tidak valid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true; // Mulai loading spinner
    // Panggil metode register dari AuthService
    this.authService.register(this.registerForm.value)
      .pipe(first()) // Ambil hanya emisi pertama dan lengkapi observable
      .subscribe({
        next: () => {
          // Jika registrasi berhasil
          this.success = 'Registration successful! You can now log in.';
          this.loading = false; // Hentikan loading spinner
          // Opsional: Redirect ke halaman login setelah beberapa detik
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // Redirect setelah 2 detik
        },
        error: error => {
          // Jika terjadi kesalahan selama registrasi
          this.error = error.message || 'Registration failed'; // Tampilkan pesan kesalahan dari API atau default
          this.loading = false; // Hentikan loading spinner
          console.error('Registration error:', error); // Log kesalahan ke konsol
        }
      });
  }
}