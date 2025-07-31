import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model'; // Pastikan model ini diimpor

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Array asli dari semua produk
  filteredProducts: Product[] = []; // Array yang akan ditampilkan setelah difilter
  searchTerm = ''; // Properti untuk menampung input pencarian
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading = true;
    this.error = '';
    this.productService.getProducts()
      .pipe(first())
      .subscribe({
        next: (products) => {
          this.products = products; // Simpan daftar produk asli
          this.filterProducts(); // Panggil filterProducts untuk menginisialisasi tampilan
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products. ' + (err.message || '');
          this.loading = false;
          console.error('Error fetching products:', err);
        }
      });
  }

  // Metode untuk memfilter produk berdasarkan searchTerm
  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      // Jika searchTerm kosong, tampilkan semua produk
      this.filteredProducts = [...this.products];
    } else {
      // Jika searchTerm ada, lakukan filter
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }
  }

  // Metode untuk mereset pencarian
  clearSearch(): void {
    this.searchTerm = '';
    this.filterProducts();
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id)
        .pipe(first())
        .subscribe({
          next: () => {
            // Setelah sukses menghapus, muat ulang daftar produk
            this.getProducts();
          },
          error: (err) => {
            this.error = 'Failed to delete product. ' + (err.message || '');
            console.error('Error deleting product:', err);
          }
        });
    }
  }
}