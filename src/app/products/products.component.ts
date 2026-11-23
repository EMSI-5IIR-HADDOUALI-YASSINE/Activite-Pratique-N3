import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] | undefined;
  keyword = '';
  newProduct: Product = { name: '', price: 0, selected: false };
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits :', err);
        this.errorMessage = 'Impossible de joindre le backend sur http://localhost:8083';
      }
    });
  }

  handleDelete(p: Product) {
    const conf = confirm('Voulez-vous vraiment supprimer ' + p.name + ' ?');
    if (conf) {
      this.productService.deleteProduct(p).subscribe({
        next: () => this.getProducts(),
        error: (err) => console.error('Erreur de suppression :', err)
      });
    }
  }

  // Exercice 1 : formulaire d'ajout
  handleAdd() {
    if (!this.newProduct.name.trim()) return;
    this.productService.addProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = { name: '', price: 0, selected: false };
        this.getProducts();
      },
      error: (err) => console.error("Erreur d'ajout :", err)
    });
  }

  // Exercice 2 : bascule de l'état 'selected'
  handleToggle(p: Product) {
    this.productService.toggleSelected(p).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.error('Erreur de mise à jour :', err)
    });
  }

  // Exercice 3 : filtre dynamique
  get filteredProducts(): Product[] {
    const k = this.keyword.trim().toLowerCase();
    return (this.products ?? []).filter(p => p.name.toLowerCase().includes(k));
  }
}
