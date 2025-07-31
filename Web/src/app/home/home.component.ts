import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Properti untuk menyimpan informasi pengguna yang sedang login
  currentUser: any;
  
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Mengambil data pengguna saat ini dari AuthService
    // Ini memastikan bahwa nama pengguna tersedia saat komponen diinisialisasi
    this.currentUser = this.authService.currentUserValue;
  }
}