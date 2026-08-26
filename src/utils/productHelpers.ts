import { ProductCategory, DepartmentType } from '../types';

export const SAREE_CATEGORIES: ProductCategory[] = [
  'Silk Sarees',
  'Pattu Sarees',
  'Cotton Sarees',
  'Designer Sarees',
  'Party Wear Sarees',
];

export const HANDBAG_CATEGORIES: ProductCategory[] = [
  'Luxury Handbags',
  'Bridal Clutches & Potlis',
  'Sling & Shoulder Bags',
  'Tote Bags',
];

export const JEWELLERY_CATEGORIES: ProductCategory[] = [
  'Bridal Jewellery Sets',
  'Necklaces & Chokers',
  'Earrings & Jhumkas',
  'Bangles & Kadas',
  'Temple & Kundan Jewellery',
];

export const ALL_CATEGORIES: { group: string; items: ProductCategory[] }[] = [
  {
    group: 'Handloom & Designer Sarees',
    items: SAREE_CATEGORIES,
  },
  {
    group: 'Designer Handbags & Clutches',
    items: HANDBAG_CATEGORIES,
  },
  {
    group: 'Royal Fashion & Bridal Jewellery',
    items: JEWELLERY_CATEGORIES,
  },
  {
    group: 'Featured',
    items: ['New Arrivals'],
  },
];

export function getProductDepartment(category: string): DepartmentType {
  const cat = category.toLowerCase();
  if (
    cat.includes('handbag') ||
    cat.includes('clutch') ||
    cat.includes('potli') ||
    cat.includes('sling') ||
    cat.includes('tote') ||
    cat.includes('bag')
  ) {
    return 'handbags';
  }
  if (
    cat.includes('jewel') ||
    cat.includes('necklace') ||
    cat.includes('choker') ||
    cat.includes('earring') ||
    cat.includes('jhumka') ||
    cat.includes('bangle') ||
    cat.includes('kada') ||
    cat.includes('kundan') ||
    cat.includes('temple')
  ) {
    return 'jewellery';
  }
  return 'sarees';
}

export function getDepartmentLabel(dept: DepartmentType): string {
  switch (dept) {
    case 'sarees':
      return 'Handloom & Designer Sarees';
    case 'handbags':
      return 'Designer Handbags & Clutches';
    case 'jewellery':
      return 'Royal Jewellery Collection';
    default:
      return 'All Luxury Collections';
  }
}

export function getProductFieldLabels(category: string) {
  const dept = getProductDepartment(category);
  if (dept === 'handbags') {
    return {
      materialLabel: 'Material & Craftsmanship',
      materialPlaceholder: 'e.g. Premium Vegan Leather, Embroidered Velvet Zari, Silk Brocade',
      lengthLabel: 'Dimensions & Strap Details',
      lengthPlaceholder: 'e.g. 26cm × 18cm × 7cm with detachable golden chain strap',
      extrasLabel: 'Detachable Strap / Dust Bag Included',
      extrasDescription: 'Comes with protective dust bag and chain/strap accessories',
      namePlaceholder: 'e.g. Royal Gold Embroidered Velvet Bridal Clutch',
    };
  }
  if (dept === 'jewellery') {
    return {
      materialLabel: 'Material & Plating',
      materialPlaceholder: 'e.g. 24K Gold Plated Brass, Kundan Stones, Freshwater Pearls',
      lengthLabel: 'Size & Fit Specification',
      lengthPlaceholder: 'e.g. Adjustable Dori / Choker 16-inch + 2.5-inch Jhumka Earrings',
      extrasLabel: 'Luxury Velvet Gift Box & Certificate Included',
      extrasDescription: 'Comes with branded jewelry velvet box and care certificate',
      namePlaceholder: 'e.g. Royal Kundan & Pearl Bridal Choker Set with Earrings',
    };
  }
  return {
    materialLabel: 'Fabric Detail',
    materialPlaceholder: 'e.g. Pure Mulberry Silk / Handloom Cotton / Organza',
    lengthLabel: 'Saree Length & Blouse Piece',
    lengthPlaceholder: 'e.g. 6.3 Meters (with 0.8m unstitched blouse)',
    extrasLabel: 'Blouse Piece Included (Unstitched)',
    extrasDescription: 'Comes with matching 0.8m unstitched designer blouse piece',
    namePlaceholder: 'e.g. Royal Crimson Gold Kanchipuram Pure Silk Saree',
  };
}
