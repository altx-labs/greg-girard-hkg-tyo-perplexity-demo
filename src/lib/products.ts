export interface Product {
  id: string;
  sku: string;
  name: string;
  nameCn: string;
  price: number; // HKD cents
  currency: string;
  image: string;
  maxQty: number;
  status: "available" | "preorder";
  availableDate?: string;
  category: "poster" | "book";
  description?: string;
}

export const products: Product[] = [
  {
    id: "poster-exhibition",
    sku: "GG_P0001",
    name: "Exhibition Poster (Limited Edition)",
    nameCn: "展覽海報（限量版）",
    price: 45000,
    currency: "HKD",
    image: "/products/poster.jpg",
    maxQty: 5,
    status: "available",
    category: "poster",
    description: "Limited edition exhibition poster from 'Greg Girard: HKG-TYO 1974–2023'.",
  },
  {
    id: "hkpm",
    sku: "GG_B0001",
    name: "HK:PM — Hong Kong Night Life 1974–1989",
    nameCn: "HK:PM — 香港夜生活 1974–1989",
    price: 49000,
    currency: "HKD",
    image: "/products/hkpm.jpg",
    maxQty: 3,
    status: "preorder",
    availableDate: "June 2026",
    category: "book",
  },
  {
    id: "city-of-darkness",
    sku: "GG_B0002",
    name: "City of Darkness Revisited",
    nameCn: "City of Darkness Revisited",
    price: 72500,
    currency: "HKD",
    image: "/products/city-of-darkness.jpg",
    maxQty: 3,
    status: "preorder",
    availableDate: "May 2026",
    category: "book",
  },
  {
    id: "jal-76-88",
    sku: "GG_B0003",
    name: "JAL 76–88",
    nameCn: "JAL 76–88",
    price: 69000,
    currency: "HKD",
    image: "/products/jal.jpg",
    maxQty: 3,
    status: "preorder",
    availableDate: "June 2026",
    category: "book",
  },
  {
    id: "snack-sakura",
    sku: "GG_B0004",
    name: "SNACK SAKURA",
    nameCn: "SNACK SAKURA",
    price: 73000,
    currency: "HKD",
    image: "/products/snack-sakura.jpg",
    maxQty: 3,
    status: "preorder",
    availableDate: "June 2026",
    category: "book",
  },
  {
    id: "american-stopover",
    sku: "GG_B0005",
    name: "AMERICAN STOPOVER",
    nameCn: "AMERICAN STOPOVER",
    price: 69000,
    currency: "HKD",
    image: "/products/american-stopover.jpg",
    maxQty: 3,
    status: "available",
    category: "book",
  },
  {
    id: "under-vancouver",
    sku: "GG_B0006",
    name: "Under Vancouver 1972–1982",
    nameCn: "Under Vancouver 1972–1982",
    price: 42000,
    currency: "HKD",
    image: "/products/under-vancouver.jpg",
    maxQty: 3,
    status: "preorder",
    availableDate: "June 2026",
    category: "book",
  },
];

export const deliveryOptions = [
  {
    id: "pickup",
    label: "Gallery Pickup",
    labelCn: "到畫廊自取",
    price: 0,
    description: "Free",
  },
  {
    id: "local",
    label: "Local Delivery (HK)",
    labelCn: "本地送遞",
    price: 15000,
    description: "HKD 150.00",
    bookOnly: true,
  },
  {
    id: "asia",
    label: "Asia Delivery",
    labelCn: "亞洲送遞",
    price: 125000,
    description: "HKD 1,250.00",
    bookOnly: true,
  },
  {
    id: "international",
    label: "International Delivery",
    labelCn: "國際送遞",
    price: 180000,
    description: "HKD 1,800.00",
    bookOnly: true,
  },
];

export function formatPrice(cents: number): string {
  return `HKD ${(cents / 100).toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
