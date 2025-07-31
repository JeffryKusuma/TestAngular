import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.isEditMode = true;
      this.loading = true;
      this.productService.getProduct(this.productId)
        .pipe(first())
        .subscribe({
          next: (product) => {
            this.productForm.patchValue(product);
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load product for editing. ' + (err.message || '');
            this.loading = false;
            console.error('Error loading product for form:', err);
          }
        });
    }
  }

  get f() { return this.productForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.isEditMode) {
      this.productService.updateProduct(this.productId!, this.productForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            alert('Product updated successfully!');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.error = 'Failed to update product. ' + (err.message || '');
            this.loading = false;
            console.error('Error updating product:', err);
          }
        });
    } else {
      this.productService.createProduct(this.productForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            alert('Product created successfully!');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.error = 'Failed to create product. ' + (err.message || '');
            this.loading = false;
            console.error('Error creating product:', err);
          }
        });
    }
  }
}