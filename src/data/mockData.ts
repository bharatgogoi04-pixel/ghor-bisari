import { Property, Owner } from '../types';

export const INITIAL_OWNERS: Owner[] = [
  {
    id: 'owner-1',
    name: 'Bhaben Hazarika',
    email: 'bhaben.hazarika@gmail.com',
    phone: '+919864012345',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'owner-2',
    name: 'Maini Borah',
    email: 'maini.borah@gmail.com',
    phone: '+919854098765',
    createdAt: '2026-01-15T11:30:00Z'
  },
  {
    id: 'owner-3',
    name: 'Rajib Saikia',
    email: 'rajib.saikia@gmail.com',
    phone: '+919870123489',
    createdAt: '2026-02-01T09:15:00Z'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    ownerId: 'owner-1',
    ownerName: 'Bhaben Hazarika',
    title: 'Spacious 2 BHK Independent House with Parking',
    category: 'Rental House',
    photos: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    monthlyRent: 14500,
    district: 'Kamrup Metropolitan',
    area: 'Ulubari, Guwahati',
    fullAddress: 'Near BSNL Office, Lachit Nagar Byelane 3, Ulubari, Guwahati - 781007',
    availableRooms: 2,
    description: 'Well-ventilated 2 BHK independent ground floor house with 2 bedrooms, 1 hall, kitchen, and attached bathrooms. 24/7 municipal water supply, boring water backup, and covered car parking available. Peaceful residential locality close to markets and hospitals.',
    contactPhone: '+919864012345',
    status: 'AVAILABLE',
    paymentStatus: 'VERIFIED',
    utrNumber: 'UPI405928192',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-10T08:00:00Z',
    amenities: ['Car Parking', '24/7 Water', 'Boring Backup', 'Balcony', 'Nearby Market']
  },
  {
    id: 'prop-2',
    ownerId: 'owner-2',
    ownerName: 'Maini Borah',
    title: 'Cozy Single Room for Students / Working Professionals',
    category: 'Single Room',
    photos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    monthlyRent: 4500,
    district: 'Dibrugarh',
    area: 'Milan Nagar, Dibrugarh',
    fullAddress: 'Near Chowkidinghee Playground, Milan Nagar, Dibrugarh - 786001',
    availableRooms: 1,
    description: 'Independent single room with shared clean bathroom facilities. Ideal for Dibrugarh University students or medical staff. Electricity bill included in rent. Safe campus with compound gate.',
    contactPhone: '+919854098765',
    status: 'AVAILABLE',
    paymentStatus: 'VERIFIED',
    utrNumber: 'UPI405928193',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-12T14:20:00Z',
    amenities: ['Electricity Included', 'Secure Compound', 'Bicycle Parking', 'Near Hospital']
  },
  {
    id: 'prop-3',
    ownerId: 'owner-3',
    ownerName: 'Rajib Saikia',
    title: 'Modern Paying Guest (PG) Accommodation for Men',
    category: 'Paying Guest (PG)',
    photos: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    monthlyRent: 6500,
    district: 'Jorhat',
    area: 'Atgaon / JB College Road, Jorhat',
    fullAddress: 'Near JB College, Gar Ali, Jorhat - 785001',
    availableRooms: 4,
    description: 'High-quality PG accommodation with nutritious Assamese home-cooked meals (lunch and dinner optional), high-speed Wi-Fi, laundry area, and power backup. Located right near JB College.',
    contactPhone: '+919870123489',
    status: 'AVAILABLE',
    paymentStatus: 'VERIFIED',
    utrNumber: 'UPI405928194',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-14T09:10:00Z',
    amenities: ['Wi-Fi', 'Home Food Option', 'Power Backup', 'Laundry', 'Study Table']
  },
  {
    id: 'prop-4',
    ownerId: 'owner-1',
    ownerName: 'Bhaben Hazarika',
    title: 'Girls Student Hostel with Security & Mess',
    category: 'Student Hostel',
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    monthlyRent: 5500,
    district: 'Kamrup Metropolitan',
    area: 'Chandmari, Guwahati',
    fullAddress: 'Near Engineering College (GEC), Chandmari, Guwahati - 781003',
    availableRooms: 6,
    description: 'Secure and peaceful hostel exclusively for girl students and working women. 24 hours warden supervision, CCTV surveillance, nutritious meals, and study hall.',
    contactPhone: '+919864012345',
    status: 'AVAILABLE',
    paymentStatus: 'VERIFIED',
    utrNumber: 'UPI405928195',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-15T16:00:00Z',
    amenities: ['CCTV Security', 'Warden', 'Mess Facility', 'Study Room', 'Wi-Fi']
  },
  {
    id: 'prop-5',
    ownerId: 'owner-2',
    ownerName: 'Maini Borah',
    title: 'Affordable Sharing Room in Town Centre',
    category: 'Sharing Room',
    photos: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
    ],
    monthlyRent: 3500,
    district: 'Cachar',
    area: 'Tarapur, Silchar',
    fullAddress: 'Main Road Tarapur, Near Railway Station, Silchar - 788001',
    availableRooms: 2,
    description: 'Double sharing spacious room with individual bed, wardrobe, and study table. Clean environment, kitchen access, and bike parking.',
    contactPhone: '+919854098765',
    status: 'AVAILABLE',
    paymentStatus: 'VERIFIED',
    utrNumber: 'UPI405928196',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-18T11:45:00Z',
    amenities: ['Individual Almirah', 'Kitchen Access', 'Near Railway Station', 'Water Filter']
  },
  {
    id: 'prop-6',
    ownerId: 'owner-3',
    ownerName: 'Rajib Saikia',
    title: 'Family Accommodation 3 BHK Duplex House',
    category: 'Family Accommodation',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    monthlyRent: 22000,
    district: 'Sonitpur',
    area: 'Mission Chariali, Tezpur',
    fullAddress: 'Mission Chariali Bypass Road, Tezpur - 784001',
    availableRooms: 3,
    description: 'Luxurious 3 BHK independent duplex house with lawn, modular kitchen, 3 bathrooms, and 2 balconies. Perfect for established families and corporate officers.',
    contactPhone: '+919870123489',
    status: 'AVAILABLE',
    paymentStatus: 'VERIFIED',
    utrNumber: 'UPI405928197',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2026-02-20T10:20:00Z',
    amenities: ['Lawn Garden', 'Modular Kitchen', 'Geyser', 'Covered Parking', 'Power Backup']
  }
];
