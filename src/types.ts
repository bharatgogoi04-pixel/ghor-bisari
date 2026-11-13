export type Language = 'en' | 'as';

export type RentalCategory = 
  | 'Rental House'
  | 'Single Room'
  | 'Paying Guest (PG)'
  | 'Student Hostel'
  | 'Sharing Room'
  | 'Family Accommodation';

export const ASSAM_DISTRICTS = [
  'Bajali',
  'Baksa',
  'Barpeta',
  'Biswanath',
  'Bongaigaon',
  'Cachar',
  'Charaideo',
  'Chirang',
  'Darrang',
  'Dhemaji',
  'Dhubri',
  'Dibrugarh',
  'Dima Hasao',
  'Goalpara',
  'Golaghat',
  'Hailakandi',
  'Hojai',
  'Jorhat',
  'Kamrup',
  'Kamrup Metropolitan',
  'Karbi Anglong',
  'Kokrajhar',
  'Lakhimpur',
  'Majuli',
  'Morigaon',
  'Nagaon',
  'Nalbari',
  'Sivasagar',
  'Sonitpur',
  'South Salmara-Mankachar',
  'Sribhumi',
  'Tamulpur',
  'Tinsukia',
  'Udalguri',
  'West Karbi Anglong'
] as const;

export type AssamDistrict = typeof ASSAM_DISTRICTS[number];

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export type PropertyStatus = 'PAYMENT_PENDING' | 'PENDING_APPROVAL' | 'AVAILABLE' | 'RENTED' | 'EXPIRED';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  category: RentalCategory;
  photos: string[];
  monthlyRent: number;
  district: AssamDistrict;
  area: string;
  fullAddress: string;
  availableRooms: number;
  description: string;
  contactPhone: string;
  status: PropertyStatus;
  paymentStatus: PaymentStatus;
  utrNumber?: string;
  paymentScreenshot?: string;
  expiresAt?: string; // ISO date string
  createdAt: string;
  amenities: string[];
}

export interface FilterState {
  searchQuery: string;
  district: string;
  category: string;
  minRent: number;
  maxRent: number;
}
