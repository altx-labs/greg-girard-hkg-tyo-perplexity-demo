export interface Product {
  id: string;
  sku: string;
  name: string;
  nameCn: string;
  price: number; // HKD whole dollars
  currency: string;
  image: string;
  maxQty: number;
  preorder: boolean;
  availableDate?: string;
  category: "poster" | "book";
}

export const products: Product[] = [
  {
    id: "poster-exhibition",
    sku: "GG_P0001",
    name: "Exhibition Poster (Limited Edition)",
    nameCn: "展覽海報（限量版）",
    price: 450,
    currency: "HKD",
    image: "/products/poster.jpg",
    maxQty: 5,
    preorder: false,
    category: "poster",
  },
  {
    id: "hkpm",
    sku: "GG_B0001",
    name: "HK:PM — Hong Kong Night Life 1974–1989",
    nameCn: "HK:PM — 香港夜生活 1974–1989",
    price: 490,
    currency: "HKD",
    image: "/products/hkpm.jpg",
    maxQty: 3,
    preorder: true,
    availableDate: "June 2026",
    category: "book",
  },
  {
    id: "city-of-darkness",
    sku: "GG_B0002",
    name: "City of Darkness Revisited",
    nameCn: "City of Darkness Revisited",
    price: 725,
    currency: "HKD",
    image: "/products/city-of-darkness.jpg",
    maxQty: 3,
    preorder: true,
    availableDate: "May 2026",
    category: "book",
  },
  {
    id: "jal-76-88",
    sku: "GG_B0003",
    name: "JAL 76–88",
    nameCn: "JAL 76–88",
    price: 690,
    currency: "HKD",
    image: "/products/jal.jpg",
    maxQty: 3,
    preorder: true,
    availableDate: "June 2026",
    category: "book",
  },
  {
    id: "snack-sakura",
    sku: "GG_B0004",
    name: "SNACK SAKURA",
    nameCn: "SNACK SAKURA",
    price: 730,
    currency: "HKD",
    image: "/products/snack-sakura.jpg",
    maxQty: 3,
    preorder: true,
    availableDate: "June 2026",
    category: "book",
  },
  {
    id: "american-stopover",
    sku: "GG_B0005",
    name: "AMERICAN STOPOVER",
    nameCn: "AMERICAN STOPOVER",
    price: 690,
    currency: "HKD",
    image: "/products/american-stopover.jpg",
    maxQty: 3,
    preorder: false,
    category: "book",
  },
  {
    id: "under-vancouver",
    sku: "GG_B0006",
    name: "Under Vancouver 1972–1982",
    nameCn: "Under Vancouver 1972–1982",
    price: 420,
    currency: "HKD",
    image: "/products/under-vancouver.jpg",
    maxQty: 3,
    preorder: true,
    availableDate: "June 2026",
    category: "book",
  },
];

export interface DeliveryOption {
  id: string;
  label: string;
  labelCn: string;
  price: number; // HKD whole dollars
  description: string;
  bookOnly?: boolean;
}

export const deliveryOptions: DeliveryOption[] = [
  {
    id: "pickup",
    label: "Pickup at Gallery",
    labelCn: "到畫廊自取",
    price: 0,
    description: "Free",
  },
  {
    id: "local",
    label: "Local Delivery (HK)",
    labelCn: "本地送遞",
    price: 150,
    description: "HKD 150",
    bookOnly: true,
  },
  {
    id: "asia",
    label: "Asia Delivery",
    labelCn: "亞洲送遞",
    price: 1250,
    description: "HKD 1,250",
    bookOnly: true,
  },
  {
    id: "international",
    label: "International Delivery",
    labelCn: "國際送遞",
    price: 1800,
    description: "HKD 1,800",
    bookOnly: true,
  },
];

export function formatPrice(hkd: number): string {
  return `HKD ${hkd.toLocaleString("en-HK")}`;
}
