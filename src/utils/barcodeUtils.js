// Comprehensive GS1 Prefix Table
// Maps 2-digit and 3-digit prefixes to their country or designated use
export const GS1_PREFIXES = [
  { min: 0, max: 19, name: 'United States & Canada', flag: '🇺🇸 / 🇨🇦' },
  { min: 20, max: 29, name: 'In-Store / Internal Use', flag: '🏷️' },
  { min: 30, max: 39, name: 'United States (Drugs/Health)', flag: '🇺🇸' },
  { min: 40, max: 49, name: 'In-Store / Restricted Distribution', flag: '🏷️' },
  { min: 50, max: 59, name: 'United States & Canada (Coupons)', flag: '🇺🇸' },
  { min: 60, max: 139, name: 'United States & Canada', flag: '🇺🇸 / 🇨🇦' },
  { min: 200, max: 299, name: 'Internal / Variable Measure', flag: '⚖️' },
  { min: 300, max: 379, name: 'France & Monaco', flag: '🇫🇷' },
  { min: 380, max: 380, name: 'Bulgaria', flag: '🇧🇬' },
  { min: 383, max: 383, name: 'Slovenia', flag: '🇸🇮' },
  { min: 385, max: 385, name: 'Croatia', flag: '🇭🇷' },
  { min: 387, max: 387, name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
  { min: 389, max: 389, name: 'Montenegro', flag: '🇲🇪' },
  { min: 400, max: 440, name: 'Germany', flag: '🇩🇪' },
  { min: 450, max: 459, name: 'Japan', flag: '🇯🇵' },
  { min: 460, max: 469, name: 'Russia', flag: '🇷🇺' },
  { min: 470, max: 470, name: 'Kyrgyzstan', flag: '🇰🇬' },
  { min: 471, max: 471, name: 'Taiwan', flag: '🇹🇼' },
  { min: 474, max: 474, name: 'Estonia', flag: '🇪🇪' },
  { min: 475, max: 475, name: 'Latvia', flag: '🇱🇻' },
  { min: 476, max: 476, name: 'Azerbaijan', flag: '🇦🇿' },
  { min: 477, max: 477, name: 'Lithuania', flag: '🇱🇹' },
  { min: 478, max: 478, name: 'Uzbekistan', flag: '🇺🇿' },
  { min: 479, max: 479, name: 'Sri Lanka', flag: '🇱🇰' },
  { min: 480, max: 480, name: 'Philippines', flag: '🇵🇭' },
  { min: 481, max: 481, name: 'Belarus', flag: '🇧🇾' },
  { min: 482, max: 482, name: 'Ukraine', flag: '🇺🇦' },
  { min: 484, max: 484, name: 'Moldova', flag: '🇲🇩' },
  { min: 485, max: 485, name: 'Armenia', flag: '🇦🇲' },
  { min: 486, max: 486, name: 'Georgia', flag: '🇬🇪' },
  { min: 487, max: 487, name: 'Kazakhstan', flag: '🇰🇿' },
  { min: 488, max: 488, name: 'Tajikistan', flag: '🇹🇯' },
  { min: 489, max: 489, name: 'Hong Kong', flag: '🇭🇰' },
  { min: 490, max: 499, name: 'Japan', flag: '🇯🇵' },
  { min: 500, max: 509, name: 'United Kingdom', flag: '🇬🇧' },
  { min: 520, max: 521, name: 'Greece', flag: '🇬🇷' },
  { min: 528, max: 528, name: 'Lebanon', flag: '🇱🇧' },
  { min: 529, max: 529, name: 'Cyprus', flag: '🇨🇾' },
  { min: 530, max: 530, name: 'Albania', flag: '🇦🇱' },
  { min: 531, max: 531, name: 'North Macedonia', flag: '🇲🇰' },
  { min: 535, max: 535, name: 'Malta', flag: '🇲🇹' },
  { min: 539, max: 539, name: 'Ireland', flag: '🇮🇪' },
  { min: 540, max: 549, name: 'Belgium & Luxembourg', flag: '🇧🇪' },
  { min: 560, max: 560, name: 'Portugal', flag: '🇵🇹' },
  { min: 569, max: 569, name: 'Iceland', flag: '🇮🇸' },
  { min: 570, max: 579, name: 'Denmark', flag: '🇩🇰' },
  { min: 590, max: 590, name: 'Poland', flag: '🇵🇱' },
  { min: 594, max: 594, name: 'Romania', flag: '🇷🇴' },
  { min: 599, max: 599, name: 'Hungary', flag: '🇭🇺' },
  { min: 600, max: 601, name: 'South Africa', flag: '🇿🇦' },
  { min: 603, max: 603, name: 'Ghana', flag: '🇬🇭' },
  { min: 604, max: 604, name: 'Senegal', flag: '🇸🇳' },
  { min: 608, max: 608, name: 'Bahrain', flag: '🇧🇭' },
  { min: 609, max: 609, name: 'Mauritius', flag: '🇲🇺' },
  { min: 611, max: 611, name: 'Morocco', flag: '🇲🇦' },
  { min: 613, max: 613, name: 'Algeria', flag: '🇩🇿' },
  { min: 615, max: 615, name: 'Nigeria', flag: '🇳🇬' },
  { min: 616, max: 616, name: 'Kenya', flag: '🇰🇪' },
  { min: 618, max: 618, name: 'Ivory Coast', flag: '🇨🇮' },
  { min: 619, max: 619, name: 'Tunisia', flag: '🇹🇳' },
  { min: 620, max: 620, name: 'Tanzania', flag: '🇹🇿' },
  { min: 621, max: 621, name: 'Syria', flag: '🇸🇾' },
  { min: 622, max: 622, name: 'Egypt', flag: '🇪🇬' },
  { min: 624, max: 624, name: 'Libya', flag: '🇱🇾' },
  { min: 625, max: 625, name: 'Jordan', flag: '🇯🇴' },
  { min: 626, max: 626, name: 'Iran', flag: '🇮🇷' },
  { min: 627, max: 627, name: 'Kuwait', flag: '🇰🇼' },
  { min: 628, max: 628, name: 'Saudi Arabia', flag: '🇸🇦' },
  { min: 629, max: 629, name: 'United Arab Emirates', flag: '🇦🇪' },
  { min: 640, max: 649, name: 'Finland', flag: '🇫🇮' },
  { min: 690, max: 699, name: 'China', flag: '🇨🇳' },
  { min: 700, max: 709, name: 'Norway', flag: '🇳🇴' },
  { min: 729, max: 729, name: 'Israel', flag: '🇮🇱' },
  { min: 730, max: 739, name: 'Sweden', flag: '🇸🇪' },
  { min: 740, max: 740, name: 'Guatemala', flag: '🇬🇹' },
  { min: 741, max: 741, name: 'El Salvador', flag: '🇸🇻' },
  { min: 742, max: 742, name: 'Honduras', flag: '🇭🇳' },
  { min: 743, max: 743, name: 'Nicaragua', flag: '🇳🇮' },
  { min: 744, max: 744, name: 'Costa Rica', flag: '🇨🇷' },
  { min: 745, max: 745, name: 'Panama', flag: '🇵🇦' },
  { min: 746, max: 746, name: 'Dominican Republic', flag: '🇩🇴' },
  { min: 750, max: 750, name: 'Mexico', flag: '🇲🇽' },
  { min: 754, max: 755, name: 'Canada', flag: '🇨🇦' },
  { min: 759, max: 759, name: 'Venezuela', flag: '🇻🇪' },
  { min: 760, max: 769, name: 'Switzerland & Liechtenstein', flag: '🇨🇭' },
  { min: 770, max: 771, name: 'Colombia', flag: '🇨🇴' },
  { min: 773, max: 773, name: 'Uruguay', flag: '🇺🇾' },
  { min: 775, max: 775, name: 'Peru', flag: '🇵🇪' },
  { min: 777, max: 777, name: 'Bolivia', flag: '🇧🇴' },
  { min: 778, max: 779, name: 'Argentina', flag: '🇦🇷' },
  { min: 780, max: 780, name: 'Chile', flag: '🇨🇱' },
  { min: 784, max: 784, name: 'Paraguay', flag: '🇵🇾' },
  { min: 786, max: 786, name: 'Ecuador', flag: '🇪🇨' },
  { min: 789, max: 790, name: 'Brazil', flag: '🇧🇷' },
  { min: 800, max: 839, name: 'Italy, San Marino & Vatican', flag: '🇮🇹' },
  { min: 840, max: 849, name: 'Spain & Andorra', flag: '🇪🇸' },
  { min: 850, max: 850, name: 'Cuba', flag: '🇨🇺' },
  { min: 858, max: 858, name: 'Slovakia', flag: '🇸🇰' },
  { min: 859, max: 859, name: 'Czech Republic', flag: '🇨🇿' },
  { min: 860, max: 860, name: 'Serbia', flag: '🇷🇸' },
  { min: 865, max: 865, name: 'Mongolia', flag: '🇲🇳' },
  { min: 867, max: 867, name: 'North Korea', flag: '🇰🇵' },
  { min: 868, max: 869, name: 'Turkey', flag: '🇹🇷' },
  { min: 870, max: 879, name: 'Netherlands', flag: '🇳🇱' },
  { min: 880, max: 881, name: 'South Korea', flag: '🇰🇷' },
  { min: 884, max: 884, name: 'Cambodia', flag: '🇰🇭' },
  { min: 885, max: 885, name: 'Thailand', flag: '🇹🇭' },
  { min: 888, max: 888, name: 'Singapore', flag: '🇸🇬' },
  { min: 890, max: 890, name: 'India', flag: '🇮🇳' },
  { min: 893, max: 893, name: 'Vietnam', flag: '🇻🇳' },
  { min: 896, max: 896, name: 'Pakistan', flag: '🇵🇰' },
  { min: 899, max: 899, name: 'Indonesia', flag: '🇮🇩' },
  { min: 900, max: 919, name: 'Austria', flag: '🇦🇹' },
  { min: 930, max: 939, name: 'Australia', flag: '🇦🇺' },
  { min: 940, max: 949, name: 'New Zealand', flag: '🇳🇿' },
  { min: 955, max: 955, name: 'Malaysia', flag: '🇲🇾' },
  { min: 958, max: 958, name: 'Macau', flag: '🇲🇴' },
  { min: 977, max: 977, name: 'Periodicals (ISSN)', flag: '📰' },
  { min: 978, max: 979, name: 'Books (ISBN)', flag: '📚' },
  { min: 980, max: 980, name: 'Refund Receipts', flag: '🧾' },
  { min: 981, max: 984, name: 'GS1 Coupon Identification', flag: '🎟️' },
  { min: 990, max: 999, name: 'Coupons & Vouchers', flag: '🏷️' }
];

// GS1 Company Prefix Registry for Major Global Brands (Electronics, Toys, Tech, Consumer Goods)
export const GS1_COMPANIES = [
  // Apple Inc.
  { prefix: '0194252', name: 'Apple Inc.', category: 'Consumer Electronics & Computing', headquarters: 'Cupertino, California, USA', origin: 'Designed in California · Assembled in China / India', flag: '🇺🇸' },
  { prefix: '0194253', name: 'Apple Inc.', category: 'Consumer Electronics & Computing', headquarters: 'Cupertino, California, USA', origin: 'Designed in California · Assembled in China / India', flag: '🇺🇸' },
  { prefix: '0190198', name: 'Apple Inc.', category: 'Consumer Electronics & Computing', headquarters: 'Cupertino, California, USA', origin: 'Designed in California · Assembled in China / India', flag: '🇺🇸' },
  { prefix: '0190199', name: 'Apple Inc.', category: 'Consumer Electronics & Computing', headquarters: 'Cupertino, California, USA', origin: 'Designed in California · Assembled in China / India', flag: '🇺🇸' },
  { prefix: '0888462', name: 'Apple Inc.', category: 'Consumer Electronics & Computing', headquarters: 'Cupertino, California, USA', origin: 'Designed in California · Assembled in China / India', flag: '🇺🇸' },
  { prefix: '0885909', name: 'Apple Inc.', category: 'Consumer Electronics & Computing', headquarters: 'Cupertino, California, USA', origin: 'Designed in California · Assembled in China / India', flag: '🇺🇸' },

  // Google LLC
  { prefix: '0842776', name: 'Google LLC', category: 'Consumer Electronics & Mobile Devices', headquarters: 'Mountain View, California, USA', origin: 'Designed by Google · Assembled in China / Vietnam', flag: '🇺🇸' },
  { prefix: '0810014', name: 'Google LLC', category: 'Consumer Electronics & Mobile Devices', headquarters: 'Mountain View, California, USA', origin: 'Designed by Google · Assembled in China / Vietnam', flag: '🇺🇸' },
  { prefix: '0810008', name: 'Google LLC', category: 'Consumer Electronics & Mobile Devices', headquarters: 'Mountain View, California, USA', origin: 'Designed by Google · Assembled in China / Vietnam', flag: '🇺🇸' },
  { prefix: '0840244', name: 'Google LLC', category: 'Consumer Electronics & Mobile Devices', headquarters: 'Mountain View, California, USA', origin: 'Designed by Google · Assembled in China / Vietnam', flag: '🇺🇸' },

  // LEGO
  { prefix: '570201', name: 'The LEGO Group', category: 'Toys & Construction Sets', headquarters: 'Billund, Denmark', origin: 'Manufactured in Denmark, Hungary, Czech Republic, Mexico, China', flag: '🇩🇰' },

  // Nintendo
  { prefix: '0045496', name: 'Nintendo Co., Ltd.', category: 'Video Games & Consoles', headquarters: 'Kyoto, Japan', origin: 'Designed in Japan · Manufactured in China / Vietnam', flag: '🇯🇵' },
  { prefix: '4902370', name: 'Nintendo Co., Ltd.', category: 'Video Games & Consoles', headquarters: 'Kyoto, Japan', origin: 'Designed in Japan · Manufactured in China / Vietnam', flag: '🇯🇵' },

  // Sony / PlayStation
  { prefix: '4905524', name: 'Sony Corporation', category: 'Consumer Electronics & Audio/Video', headquarters: 'Tokyo, Japan', origin: 'Manufactured in Japan / China', flag: '🇯🇵' },
  { prefix: '0027242', name: 'Sony Corporation', category: 'Consumer Electronics & Cameras', headquarters: 'Tokyo, Japan', origin: 'Manufactured in Japan / Thailand / China', flag: '🇯🇵' },
  { prefix: '0711719', name: 'Sony Interactive Entertainment (PlayStation)', category: 'Gaming Consoles & Accessories', headquarters: 'San Mateo, CA, USA / Tokyo, Japan', origin: 'Assembled in China / Japan', flag: '🇯🇵' },

  // Samsung
  { prefix: '880608', name: 'Samsung Electronics', category: 'Smartphones & Consumer Electronics', headquarters: 'Suwon, South Korea', origin: 'Manufactured in South Korea, Vietnam, India', flag: '🇰🇷' },
  { prefix: '880609', name: 'Samsung Electronics', category: 'Smartphones & Consumer Electronics', headquarters: 'Suwon, South Korea', origin: 'Manufactured in South Korea, Vietnam, India', flag: '🇰🇷' },

  // Microsoft
  { prefix: '0885370', name: 'Microsoft Corporation', category: 'Computing & Xbox Gaming', headquarters: 'Redmond, Washington, USA', origin: 'Designed in USA · Assembled in China', flag: '🇺🇸' },
  { prefix: '0889842', name: 'Microsoft Corporation', category: 'Computing & Xbox Gaming', headquarters: 'Redmond, Washington, USA', origin: 'Designed in USA · Assembled in China', flag: '🇺🇸' },

  // Amazon
  { prefix: '0840080', name: 'Amazon Devices', category: 'Kindle, Echo & Fire TV Hardware', headquarters: 'Seattle, Washington, USA', origin: 'Designed by Amazon · Manufactured in China', flag: '🇺🇸' },
  { prefix: '0841667', name: 'Amazon Devices', category: 'Kindle, Echo & Fire TV Hardware', headquarters: 'Seattle, Washington, USA', origin: 'Designed by Amazon · Manufactured in China', flag: '🇺🇸' },

  // Nike
  { prefix: '0091201', name: 'Nike, Inc.', category: 'Footwear & Athletic Apparel', headquarters: 'Beaverton, Oregon, USA', origin: 'Manufactured in Vietnam, Indonesia, China', flag: '🇺🇸' },
  { prefix: '0194958', name: 'Nike, Inc.', category: 'Footwear & Athletic Apparel', headquarters: 'Beaverton, Oregon, USA', origin: 'Manufactured in Vietnam, Indonesia, China', flag: '🇺🇸' },

  // Dyson
  { prefix: '5025155', name: 'Dyson Technology Limited', category: 'Vacuum Cleaners & Air Treatment', headquarters: 'Malmesbury, UK / Singapore', origin: 'Designed in UK · Manufactured in Malaysia / Philippines', flag: '🇬🇧' },

  // Logitech
  { prefix: '5099206', name: 'Logitech International S.A.', category: 'Computer Peripherals & Gaming', headquarters: 'Lausanne, Switzerland', origin: 'Designed in Switzerland · Manufactured in China', flag: '🇨🇭' },
  { prefix: '0097855', name: 'Logitech International S.A.', category: 'Computer Peripherals & Gaming', headquarters: 'Lausanne, Switzerland', origin: 'Designed in Switzerland · Manufactured in China', flag: '🇨🇭' },

  // Bose
  { prefix: '0017817', name: 'Bose Corporation', category: 'Premium Audio & Noise Cancelling Headphones', headquarters: 'Framingham, Massachusetts, USA', origin: 'Manufactured in USA, Mexico, Malaysia', flag: '🇺🇸' },

  // Canon
  { prefix: '4960999', name: 'Canon Inc.', category: 'Cameras, Lenses & Printers', headquarters: 'Tokyo, Japan', origin: 'Manufactured in Japan / Taiwan', flag: '🇯🇵' },

  // DJI
  { prefix: '6958265', name: 'DJI Innovations', category: 'Drones & Handheld Imaging', headquarters: 'Shenzhen, China', origin: 'Manufactured in Shenzhen, China', flag: '🇨🇳' },

  // Anker
  { prefix: '0848061', name: 'Anker Innovations', category: 'Power Banks & Audio (Soundcore)', headquarters: 'Changsha / Shenzhen, China', origin: 'Manufactured in China', flag: '🇨🇳' }
];

/**
 * Normalizes barcode input.
 * Preserves 8 digits for EAN-8.
 * Preserves 12 digits for UPC-A.
 * Preserves 13 digits for EAN-13.
 */
export function normalizeBarcode(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 8) {
    return digits; // EAN-8
  }
  if (digits.length === 12) {
    return digits; // UPC-A
  }
  return digits.slice(0, 13);
}

/**
 * Returns human-readable barcode standard / type
 */
export function getBarcodeType(barcode) {
  if (!barcode) return 'Unknown';
  if (barcode.length === 8) return 'EAN-8';
  if (barcode.length === 12) return 'UPC-A';
  if (barcode.length === 13) {
    if (/^97[89]/.test(barcode)) return 'ISBN (Book)';
    if (/^977/.test(barcode)) return 'ISSN (Periodical)';
    return 'EAN-13';
  }
  return `Barcode (${barcode.length} digits)`;
}

/**
 * Calculates GS1 Modulo 10 Check Digit for EAN-8 (7 digits), UPC-A (11 digits), or EAN-13 (12 digits).
 */
export function calculateCheckDigit(digits) {
  if (!digits) return null;
  
  // EAN-8 (7 data digits): weights 3, 1, 3, 1, 3, 1, 3
  if (digits.length === 7) {
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const digit = parseInt(digits[i], 10);
      total += digit * (i % 2 === 0 ? 3 : 1);
    }
    return (10 - (total % 10)) % 10;
  }

  // UPC-A (11 data digits): weights 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3
  if (digits.length === 11) {
    let total = 0;
    for (let i = 0; i < 11; i++) {
      const digit = parseInt(digits[i], 10);
      total += digit * (i % 2 === 0 ? 3 : 1);
    }
    return (10 - (total % 10)) % 10;
  }

  // EAN-13 (12 data digits): weights 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3
  if (digits.length === 12) {
    let total = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(digits[i], 10);
      total += digit * (i % 2 === 1 ? 3 : 1);
    }
    return (10 - (total % 10)) % 10;
  }

  return null;
}

/**
 * Validates whether the last digit matches the GS1 Modulo 10 check digit.
 * Works for EAN-8 (8 digits), UPC-A (12 digits), and EAN-13 (13 digits).
 */
export function validateCheckDigit(digits) {
  if (!digits) return false;
  if (digits.length === 8) {
    const expected = calculateCheckDigit(digits.slice(0, 7));
    return expected === parseInt(digits[7], 10);
  }
  if (digits.length === 12) {
    const expected = calculateCheckDigit(digits.slice(0, 11));
    return expected === parseInt(digits[11], 10);
  }
  if (digits.length === 13) {
    const expected = calculateCheckDigit(digits.slice(0, 12));
    return expected === parseInt(digits[12], 10);
  }
  return false;
}

/**
 * Resolves GS1 Member Organization country from the barcode prefix.
 * Matches as soon as 2 or 3 digits are entered.
 */
export function getGS1Country(barcode) {
  if (!barcode || barcode.length < 2) {
    return { name: '', flag: '🌐', prefix: '', matched: false };
  }

  // If 3 or more digits, check 3-digit prefix first
  if (barcode.length >= 3) {
    const prefix3 = parseInt(barcode.slice(0, 3), 10);
    const match3 = GS1_PREFIXES.find(p => prefix3 >= p.min && prefix3 <= p.max);
    if (match3) {
      return { name: match3.name, flag: match3.flag, prefix: barcode.slice(0, 3), matched: true };
    }
  }

  // Check 2-digit prefix (e.g. France 30-37, UK 50, Belgium 54, Germany 40-44, US/Canada 00-13)
  const prefix2 = parseInt(barcode.slice(0, 2), 10);
  const match2 = GS1_PREFIXES.find(p => prefix2 >= p.min && prefix2 <= p.max);
  if (match2) {
    return { name: match2.name, flag: match2.flag, prefix: barcode.slice(0, 2), matched: true };
  }

  if (barcode.length >= 3) {
    return { name: 'GS1 Global Registry', flag: '🌐', prefix: barcode.slice(0, 3), matched: true };
  }

  return { name: '', flag: '🌐', prefix: '', matched: false };
}

/**
 * Resolves specific manufacturer/company from GS1 Company Prefix registry
 */
export function getGS1Company(barcode) {
  if (!barcode || barcode.length < 6) return null;
  const normalized = normalizeBarcode(barcode);

  for (const comp of GS1_COMPANIES) {
    if (normalized.startsWith(comp.prefix)) {
      return comp;
    }
  }
  return null;
}

// In-memory lookup cache to avoid unnecessary network queries
const lookupCache = new Map();

// Built-in high-accuracy samples covering Tech, Toys, Books, and Groceries
export const LOCAL_PRODUCT_DB = {
  // Cereals & Breakfast (EAN-8 Sample)
  '20696351': {
    name: 'Flakes Fruit & Fibre Cereal',
    brand: 'Crownfield',
    category: 'Breakfast Cereals, Flakes with Fruit & Nuts',
    origin: 'United Kingdom / European Union',
    image: 'https://images.openfoodfacts.org/images/products/206/963/51/front_en.16.400.jpg',
    quantity: '750 g',
    nutriscore: 'd',
    nova: 4,
    ingredients: 'Shredded Wholegrain Wheat, Raisins, Sugar, Banana Chips (Banana, Coconut Oil, Sugar, Natural Banana Flavouring), Apple, Coconut Chips, Barley Malt Extract, Salt, Chopped and Roasted Hazelnuts.',
    nutrientLevels: {
      fat: 'moderate',
      'saturated-fat': 'moderate',
      sugars: 'high',
      salt: 'moderate'
    },
    nutriments: {
      energyKcal: 373,
      fat: 3.8,
      saturatedFat: 2.3,
      sugars: 26.0,
      salt: 0.71,
      fiber: 10.5,
      proteins: 7.5
    },
    allergens: 'Gluten, Wheat, Barley, Nuts (Hazelnuts)'
  },

  // Food & Drink
  '3017620422003': {
    name: 'Nutella Hazelnut Spread with Cocoa',
    brand: 'Ferrero',
    category: 'Spreads, Hazelnut & Chocolate',
    origin: 'France',
    image: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.618.400.jpg',
    quantity: '400 g',
    nutriscore: 'e',
    nova: 4,
    ingredients: 'Sugar, palm oil, hazelnuts (13%), skimmed milk powder (8.7%), fat-reduced cocoa (7.4%), emulsifier: lecithins (soya), vanillin.',
    nutrientLevels: {
      fat: 'high',
      'saturated-fat': 'high',
      sugars: 'high',
      salt: 'low'
    },
    nutriments: {
      energyKcal: 539,
      fat: 30.9,
      saturatedFat: 10.6,
      sugars: 56.3,
      salt: 0.107,
      proteins: 6.3
    },
    allergens: 'Milk, Hazelnuts, Soy'
  },
  '5449000000996': {
    name: 'Coca-Cola Original Taste',
    brand: 'The Coca-Cola Company',
    category: 'Beverages, Carbonated Soft Drinks',
    origin: 'Belgium',
    image: 'https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.1158.400.jpg',
    quantity: '330 ml',
    nutriscore: 'e',
    nova: 4,
    ingredients: 'Carbonated Water, Sugar, Colour (Caramel E150d), Acid (Phosphoric Acid), Natural Flavourings Including Caffeine.',
    nutrientLevels: {
      fat: 'low',
      'saturated-fat': 'low',
      sugars: 'high',
      salt: 'low'
    },
    nutriments: {
      energyKcal: 42,
      fat: 0,
      saturatedFat: 0,
      sugars: 10.6,
      salt: 0,
      proteins: 0
    }
  },
  '5000157024671': {
    name: 'Baked Beans in a Rich Tomato Sauce',
    brand: 'Heinz',
    category: 'Canned Foods, Beans',
    origin: 'United Kingdom',
    image: 'https://images.openfoodfacts.org/images/products/500/015/702/4671/front_en.108.400.jpg',
    quantity: '415 g',
    nutriscore: 'a',
    nova: 3,
    ingredients: 'Beans (51%), Tomatoes (34%), Water, Sugar, Spirit Vinegar, Modified Cornflour, Salt, Spice Extracts, Herb Extract.',
    nutrientLevels: {
      fat: 'low',
      'saturated-fat': 'low',
      sugars: 'low',
      salt: 'moderate'
    },
    nutriments: {
      energyKcal: 78,
      fat: 0.2,
      saturatedFat: 0.1,
      sugars: 4.7,
      salt: 0.6,
      fiber: 3.7,
      proteins: 4.7
    }
  },
  '4001686301265': {
    name: 'Goldbären (Goldbears) Gummy Bears',
    brand: 'Haribo',
    category: 'Confectionery, Candies',
    origin: 'Germany',
    image: 'https://images.openfoodfacts.org/images/products/400/168/630/1265/front_en.71.400.jpg',
    quantity: '200 g',
    nutriscore: 'd',
    nova: 4,
    ingredients: 'Glucose syrup, sugar, gelatin, dextrose, fruit juice from fruit juice concentrate: apple, strawberry, raspberry, orange, lemon, pineapple, citric acid, fruit and plant concentrates.',
    nutrientLevels: {
      fat: 'low',
      'saturated-fat': 'low',
      sugars: 'high',
      salt: 'low'
    },
    nutriments: {
      energyKcal: 343,
      fat: 0.5,
      saturatedFat: 0.1,
      sugars: 46.0,
      salt: 0.07,
      proteins: 6.9
    }
  },

  // Tech & Electronics
  '0194252042458': {
    name: 'iPhone 13 Pro (128GB Sierra Blue)',
    brand: 'Apple Inc.',
    category: 'Smartphones & Mobile Devices',
    origin: 'Designed in California · Assembled in China',
    image: null,
    quantity: '1 device',
    headquarters: 'Cupertino, California, USA'
  },
  '0194253397168': {
    name: 'AirPods Pro (2nd Generation with MagSafe Case)',
    brand: 'Apple Inc.',
    category: 'Wireless Audio & Earphones',
    origin: 'Designed in California · Assembled in Vietnam / China',
    image: null,
    quantity: '1 pair',
    headquarters: 'Cupertino, California, USA'
  },
  '0842776100000': {
    name: 'Google Pixel 8 Pro (128GB Obsidian)',
    brand: 'Google LLC',
    category: 'Smartphones & Mobile Hardware',
    origin: 'Designed by Google · Assembled in Vietnam',
    image: null,
    quantity: '1 device',
    headquarters: 'Mountain View, California, USA'
  },
  '0810014300000': {
    name: 'Google Pixel Buds Pro (Charcoal)',
    brand: 'Google LLC',
    category: 'Wireless Audio & Accessories',
    origin: 'Designed by Google · Assembled in China',
    image: null,
    quantity: '1 pair',
    headquarters: 'Mountain View, California, USA'
  },
  '0045496453435': {
    name: 'Nintendo Switch OLED Model (White)',
    brand: 'Nintendo Co., Ltd.',
    category: 'Video Game Consoles',
    origin: 'Designed in Japan · Assembled in China / Vietnam',
    image: null,
    quantity: '1 console system',
    headquarters: 'Kyoto, Japan'
  },
  '0711719541028': {
    name: 'PlayStation 5 DualSense Wireless Controller',
    brand: 'Sony Interactive Entertainment',
    category: 'Gaming Accessories',
    origin: 'Designed in Tokyo & California · Assembled in China',
    image: null,
    quantity: '1 controller',
    headquarters: 'Tokyo, Japan'
  },

  // Toys & Construction
  '5702017156553': {
    name: 'LEGO Star Wars: The Mandalorian Helmet (Set 75328)',
    brand: 'The LEGO Group',
    category: 'Toys, Construction & Building Bricks',
    origin: 'Denmark, Czech Republic, Hungary, Mexico',
    image: null,
    quantity: '584 pieces',
    headquarters: 'Billund, Denmark'
  },
  '5702016913980': {
    name: 'LEGO Icons: Flower Bouquet (Set 10280)',
    brand: 'The LEGO Group',
    category: 'Toys, Botanical Collection',
    origin: 'Denmark, Hungary, Mexico',
    image: null,
    quantity: '756 pieces',
    headquarters: 'Billund, Denmark'
  },

  // Books
  '9780140328721': {
    name: 'Fantastic Mr. Fox',
    brand: 'Puffin Books / Penguin Random House',
    category: 'Books & Children\'s Literature',
    origin: 'United Kingdom',
    image: 'https://covers.openlibrary.org/b/id/8313886-M.jpg',
    quantity: '96 pages',
    author: 'Roald Dahl'
  }
};

/**
 * Multi-source product lookup:
 * 1. Open Library API (for ISBN 978/979 books)
 * 2. Open Food Facts API (for food/groceries)
 * 3. Open Beauty Facts API (for personal care/cosmetics)
 * 4. GS1 Company Registry (for Apple, Google, LEGO, Nintendo, Sony, Samsung, etc.)
 */
export async function fetchProductDetails(barcode) {
  const normalized = normalizeBarcode(barcode);
  if (!normalized || normalized.length < 8) return null;

  if (lookupCache.has(normalized)) {
    return lookupCache.get(normalized);
  }

  const localHit = LOCAL_PRODUCT_DB[normalized];
  const companyHit = getGS1Company(normalized);

  // Helper search URLs for external product lookups
  const searchUrls = {
    google: `https://www.google.com/search?q=${normalized}`,
    amazon: `https://www.amazon.com/s?k=${normalized}`,
    upcitemdb: `https://www.upcitemdb.com/upc/${normalized}`
  };

  // ─────────────────────────────────────────────────────────────
  // 1. Check if Book (ISBN 978 / 979) via Open Library API
  // ─────────────────────────────────────────────────────────────
  if (/^97[89]/.test(normalized)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://openlibrary.org/isbn/${normalized}.json`, {
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const bookData = await res.json();
        if (bookData && bookData.title) {
          const coverId = bookData.covers?.[0];
          const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : (localHit?.image || null);
          const authorNames = localHit?.author || 'Published Work';

          const result = {
            found: true,
            source: 'Open Library Catalog',
            name: bookData.title + (bookData.subtitle ? `: ${bookData.subtitle}` : ''),
            brand: (bookData.publishers && bookData.publishers.join(', ')) || 'Book Publisher',
            category: 'Books & Literature (ISBN)',
            origin: bookData.publish_date ? `Published ${bookData.publish_date}` : 'Book Publication',
            image: coverUrl,
            quantity: bookData.number_of_pages ? `${bookData.number_of_pages} pages` : null,
            nutriscore: null,
            ecoscore: null,
            nova: null,
            searchUrls,
            rawUrl: `https://openlibrary.org/isbn/${normalized}`
          };
          lookupCache.set(normalized, result);
          return result;
        }
      }
    } catch (err) {
      console.warn('Open Library fetch error:', err.message);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Check Open Food Facts API (Groceries & Foods)
  // ─────────────────────────────────────────────────────────────
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const fields = [
      'product_name',
      'product_name_en',
      'generic_name',
      'brands',
      'categories',
      'origins',
      'manufacturing_places',
      'countries',
      'image_front_url',
      'image_url',
      'image_small_url',
      'quantity',
      'nutriscore_grade',
      'ecoscore_grade',
      'nova_group',
      'ingredients_text',
      'ingredients_text_en',
      'nutrient_levels',
      'nutriments',
      'allergens_tags'
    ].join(',');

    const url = `https://world.openfoodfacts.org/api/v2/product/${normalized}.json?fields=${fields}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 1 && data.product) {
        const p = data.product;
        const name = p.product_name || p.product_name_en || p.generic_name || localHit?.name || 'Unnamed Product';
        const brand = p.brands || localHit?.brand || 'Brand';
        const category = p.categories ? p.categories.split(',').slice(0, 3).join(', ') : (localHit?.category || 'General Product');
        const origin = p.origins || p.manufacturing_places || p.countries || localHit?.origin || null;
        const image = p.image_front_url || p.image_url || p.image_small_url || localHit?.image || null;
        const quantity = p.quantity || localHit?.quantity || null;
        const nutriscore = p.nutriscore_grade || localHit?.nutriscore || null;
        const ecoscore = p.ecoscore_grade || null;
        const nova = p.nova_group || localHit?.nova || null;

        const ingredients = p.ingredients_text || p.ingredients_text_en || localHit?.ingredients || null;
        const nutrientLevels = p.nutrient_levels || localHit?.nutrientLevels || null;
        const allergens = (p.allergens_tags && p.allergens_tags.length > 0)
          ? p.allergens_tags.map(a => a.replace(/^[a-z]+:/, '').replace(/-/g, ' ')).filter(Boolean).join(', ')
          : (localHit?.allergens || null);

        const rawNutriments = p.nutriments || {};
        const nutriments = {
          energyKcal: rawNutriments['energy-kcal_100g'] ?? rawNutriments['energy-kcal'] ?? localHit?.nutriments?.energyKcal ?? null,
          fat: rawNutriments.fat_100g ?? rawNutriments.fat ?? localHit?.nutriments?.fat ?? null,
          saturatedFat: rawNutriments['saturated-fat_100g'] ?? rawNutriments['saturated-fat'] ?? localHit?.nutriments?.saturatedFat ?? null,
          sugars: rawNutriments.sugars_100g ?? rawNutriments.sugars ?? localHit?.nutriments?.sugars ?? null,
          salt: rawNutriments.salt_100g ?? rawNutriments.salt ?? localHit?.nutriments?.salt ?? null,
          fiber: rawNutriments.fiber_100g ?? rawNutriments.fiber ?? localHit?.nutriments?.fiber ?? null,
          proteins: rawNutriments.proteins_100g ?? rawNutriments.proteins ?? localHit?.nutriments?.proteins ?? null
        };

        const isFood = Boolean(
          nutrientLevels ||
          ingredients ||
          nutriments.energyKcal != null ||
          nutriments.sugars != null ||
          nutriscore ||
          nova ||
          (category && /(food|grocery|cereal|snack|drink|beverage|sweet|biscuit|chocolate|spread|confection)/i.test(category))
        );

        const result = {
          found: true,
          source: 'Open Food Facts',
          name,
          brand,
          category,
          origin,
          image,
          quantity,
          nutriscore,
          ecoscore,
          nova,
          ingredients,
          nutrientLevels,
          nutriments,
          allergens,
          isFood,
          searchUrls,
          rawUrl: `https://world.openfoodfacts.org/product/${normalized}`
        };

        lookupCache.set(normalized, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Open Food Facts lookup failed:', err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Fallback to Local Verified Catalog (Tech, LEGO, Brands)
  // ─────────────────────────────────────────────────────────────
  if (localHit) {
    const isFood = Boolean(
      localHit.nutrientLevels ||
      localHit.ingredients ||
      localHit.nutriments ||
      localHit.nutriscore ||
      (localHit.category && /(food|grocery|cereal|snack|drink|beverage|sweet|biscuit|chocolate|spread|confection)/i.test(localHit.category))
    );

    const result = {
      found: true,
      source: 'Verified Product Database',
      name: localHit.name,
      brand: localHit.brand,
      category: localHit.category,
      origin: localHit.origin,
      image: localHit.image,
      quantity: localHit.quantity,
      nutriscore: localHit.nutriscore || null,
      ecoscore: null,
      nova: localHit.nova || null,
      ingredients: localHit.ingredients || null,
      nutrientLevels: localHit.nutrientLevels || null,
      nutriments: localHit.nutriments || null,
      allergens: localHit.allergens || null,
      isFood,
      searchUrls,
      rawUrl: `https://www.google.com/search?q=${encodeURIComponent(localHit.name)}`
    };
    lookupCache.set(normalized, result);
    return result;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. GS1 Company Prefix Match (e.g. Apple, Google, LEGO, etc.)
  // ─────────────────────────────────────────────────────────────
  if (companyHit) {
    const prefixLen = companyHit.prefix.length;
    const itemDigits = normalized.slice(prefixLen, 12);

    const result = {
      found: true,
      source: 'GS1 Manufacturer Registry',
      name: `${companyHit.name} Product (Item Ref: ${itemDigits})`,
      brand: companyHit.name,
      category: companyHit.category,
      origin: companyHit.origin,
      headquarters: companyHit.headquarters,
      image: null,
      quantity: null,
      nutriscore: null,
      ecoscore: null,
      nova: null,
      isCompanyMatchOnly: true,
      searchUrls,
      rawUrl: `https://www.google.com/search?q=${encodeURIComponent(companyHit.name + ' ' + normalized)}`
    };
    lookupCache.set(normalized, result);
    return result;
  }

  // ─────────────────────────────────────────────────────────────
  // 5. Unlisted Product (Provide country & Search links)
  // ─────────────────────────────────────────────────────────────
  const notFoundResult = {
    found: false,
    source: null,
    name: `Unlisted Product (${normalized})`,
    brand: 'Manufacturer not listed in open index',
    category: 'General Retail Merchandise',
    origin: null,
    image: null,
    quantity: null,
    nutriscore: null,
    ecoscore: null,
    nova: null,
    searchUrls,
    rawUrl: searchUrls.google
  };
  lookupCache.set(normalized, notFoundResult);
  return notFoundResult;
}
