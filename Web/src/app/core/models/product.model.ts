/**
 * Defines the data structure for a Product.
 * This model is used to ensure consistency across the application
 * when dealing with product data from the API.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional property, represented by a question mark
  createdAt?: string; // Optional property, using string for ISO 8601 date format
  updatedAt?: string; // Optional property
}