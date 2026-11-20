export interface ColorItem {
  id: string;
  name: string;
  slug: string;
  hex: string;
  isActive: boolean;
  displayOrder?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
