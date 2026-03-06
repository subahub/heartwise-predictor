// Extended India hospital database by state/district
export interface IndiaHospital {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
  state: string;
  phone: string;
  rating: number;
  specialty: string;
  hours: string;
  lat: number;
  lng: number;
  facilities: string[];
}

export const indiaHospitalDatabase: IndiaHospital[] = [
  // Delhi
  { id: 101, name: 'AIIMS Cardiology Department', address: 'Sri Aurobindo Marg, Ansari Nagar', city: 'New Delhi', district: 'New Delhi', state: 'Delhi', phone: '+91 11 2658 8500', rating: 4.8, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 28.5672, lng: 77.2100, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Surgery', 'Research Lab'] },
  { id: 102, name: 'Fortis Escorts Heart Institute', address: 'Okhla Rd, Sukhdev Vihar', city: 'New Delhi', district: 'South East Delhi', state: 'Delhi', phone: '+91 11 4713 5000', rating: 4.7, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 28.5494, lng: 77.2740, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab'] },
  { id: 103, name: 'Max Super Speciality Hospital', address: 'Saket, New Delhi', city: 'New Delhi', district: 'South Delhi', state: 'Delhi', phone: '+91 11 2651 5050', rating: 4.6, specialty: 'Heart Failure', hours: 'Open 24/7', lat: 28.5274, lng: 77.2145, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Rehab'] },
  { id: 104, name: 'Sir Ganga Ram Hospital', address: 'Rajinder Nagar, New Delhi', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', phone: '+91 11 2575 0000', rating: 4.5, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 28.6388, lng: 77.1889, facilities: ['ICU', 'Emergency', 'Cardiac Surgery'] },

  // Tamil Nadu
  { id: 201, name: 'Apollo Hospitals Heart Centre', address: '21, Greams Lane', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', phone: '+91 44 2829 3333', rating: 4.7, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 13.0604, lng: 80.2496, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab', 'Cardiac Rehab'] },
  { id: 202, name: 'MIOT International', address: '4/112 Mount Poonamallee Rd', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', phone: '+91 44 4200 2288', rating: 4.6, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 13.0285, lng: 80.1743, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cath Lab'] },
  { id: 203, name: 'Madurai Meenakshi Mission Hospital', address: 'Lake Area, Melur Road', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', phone: '+91 452 258 8800', rating: 4.5, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 9.9400, lng: 78.1300, facilities: ['ICU', 'Cardiac Surgery', 'Emergency'] },
  { id: 204, name: 'G. Kuppuswamy Naidu Memorial Hospital', address: 'Pappanaickenpalayam', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', phone: '+91 422 430 5000', rating: 4.5, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 11.0168, lng: 76.9558, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Rehab'] },
  { id: 205, name: 'PSG Hospitals', address: 'Peelamedu', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', phone: '+91 422 257 0170', rating: 4.4, specialty: 'Electrophysiology', hours: 'Open 24/7', lat: 11.0245, lng: 77.0252, facilities: ['ICU', 'Emergency', 'Electrophysiology Lab'] },
  { id: 206, name: 'Theni Government Medical College Hospital', address: 'Theni Town', city: 'Theni', district: 'Theni', state: 'Tamil Nadu', phone: '+91 4546 252 200', rating: 4.0, specialty: 'General Cardiology', hours: 'Mon-Sat 8AM-8PM', lat: 10.0104, lng: 77.4768, facilities: ['Cardiology Dept', 'Emergency'] },
  { id: 207, name: 'Velammal Medical College Hospital', address: 'Anuppanadi', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', phone: '+91 452 284 1111', rating: 4.2, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 9.9452, lng: 78.1578, facilities: ['ICU', 'Cardiac Surgery', 'Emergency'] },
  { id: 208, name: 'KMC Hospital', address: 'Dr Nanjappa Road', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu', phone: '+91 431 240 7777', rating: 4.3, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 10.7905, lng: 78.7047, facilities: ['ICU', 'Cardiology Dept', 'Emergency'] },
  { id: 209, name: 'Salem Cardiac Center', address: 'Fairlands', city: 'Salem', district: 'Salem', state: 'Tamil Nadu', phone: '+91 427 231 2345', rating: 4.1, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 11.6643, lng: 78.1460, facilities: ['ICU', 'Emergency', 'Cath Lab'] },

  // Karnataka
  { id: 301, name: 'Narayana Institute of Cardiac Sciences', address: '258/A, Bommasandra', city: 'Bangalore', district: 'Bangalore', state: 'Karnataka', phone: '+91 80 7122 2222', rating: 4.8, specialty: 'Heart Transplant', hours: 'Open 24/7', lat: 12.8520, lng: 77.6670, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery', 'Cardiac Rehab'] },
  { id: 302, name: 'Jayadeva Institute of Cardiovascular Sciences', address: 'Bannerghatta Road', city: 'Bangalore', district: 'Bangalore', state: 'Karnataka', phone: '+91 80 2653 4520', rating: 4.7, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 12.9165, lng: 77.5946, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Research Lab'] },
  { id: 303, name: 'Manipal Hospital', address: 'Old Airport Road', city: 'Bangalore', district: 'Bangalore', state: 'Karnataka', phone: '+91 80 2502 4444', rating: 4.6, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 12.9611, lng: 77.6472, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab'] },

  // Maharashtra
  { id: 401, name: 'Asian Heart Institute', address: 'G/N Block, BKC', city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', phone: '+91 22 6698 6868', rating: 4.7, specialty: 'Preventive Cardiology', hours: 'Open 24/7', lat: 19.0596, lng: 72.8656, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cardiac Rehab'] },
  { id: 402, name: 'Kokilaben Dhirubhai Ambani Hospital', address: 'Four Bungalows, Andheri', city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', phone: '+91 22 3099 9999', rating: 4.7, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 19.1308, lng: 72.8255, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab'] },
  { id: 403, name: 'Ruby Hall Clinic', address: 'Pune', city: 'Pune', district: 'Pune', state: 'Maharashtra', phone: '+91 20 6645 5100', rating: 4.5, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 18.5333, lng: 73.8833, facilities: ['ICU', 'Emergency', 'Cath Lab'] },

  // Haryana
  { id: 501, name: 'Medanta - The Medicity Heart Institute', address: 'CH Baktawar Singh Rd, Sector 38', city: 'Gurugram', district: 'Gurugram', state: 'Haryana', phone: '+91 124 414 1414', rating: 4.8, specialty: 'Electrophysiology', hours: 'Open 24/7', lat: 28.4395, lng: 77.0426, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Electrophysiology Lab', 'Cardiac Surgery'] },

  // Telangana
  { id: 601, name: 'Care Hospitals Heart Center', address: 'Road No 1, Banjara Hills', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', phone: '+91 40 6810 6810', rating: 4.6, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 17.4112, lng: 78.4386, facilities: ['ICU', 'Emergency', 'Cath Lab'] },
  { id: 602, name: 'Apollo Hospitals Jubilee Hills', address: 'Jubilee Hills', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', phone: '+91 40 2360 7777', rating: 4.7, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 17.4325, lng: 78.4073, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab', 'Cardiac Rehab'] },

  // Kerala
  { id: 701, name: 'SCTIMST - Sree Chitra Heart Centre', address: 'Medical College PO', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', phone: '+91 471 252 4600', rating: 4.6, specialty: 'Cardiovascular Medicine', hours: 'Mon-Sat 8AM-6PM', lat: 8.5241, lng: 76.9366, facilities: ['ICU', 'Cardiology Dept', 'Research Lab'] },
  { id: 702, name: 'Amrita Institute of Medical Sciences', address: 'Ponekkara', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', phone: '+91 484 285 1234', rating: 4.6, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 10.0369, lng: 76.2995, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cardiac Rehab'] },

  // West Bengal
  { id: 801, name: 'Rabindranath Tagore International Institute of Cardiac Sciences', address: 'Mukundapur', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', phone: '+91 33 6631 4444', rating: 4.6, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 22.5006, lng: 88.3953, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab'] },

  // Uttar Pradesh
  { id: 901, name: 'Sanjay Gandhi Postgraduate Institute', address: 'Raebareli Road', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', phone: '+91 522 266 8800', rating: 4.6, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 26.8352, lng: 80.9462, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Research Lab'] },
  { id: 902, name: 'Medanta Hospital Lucknow', address: 'Shaheed Path', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', phone: '+91 522 678 9999', rating: 4.5, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 26.8000, lng: 81.0100, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab'] },

  // Gujarat
  { id: 1001, name: 'U. N. Mehta Institute of Cardiology', address: 'Civil Hospital Campus', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', phone: '+91 79 2268 2000', rating: 4.7, specialty: 'Interventional Cardiology', hours: 'Open 24/7', lat: 23.0556, lng: 72.6040, facilities: ['ICU', 'Cardiology Dept', 'Emergency', 'Cath Lab', 'Research Lab'] },

  // Rajasthan
  { id: 1101, name: 'Eternal Heart Care Centre', address: 'Jagatpura Road', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', phone: '+91 141 510 0000', rating: 4.6, specialty: 'Cardiac Surgery', hours: 'Open 24/7', lat: 26.8504, lng: 75.8166, facilities: ['ICU', 'Cardiac Surgery', 'Emergency', 'Cath Lab'] },

  // Punjab
  { id: 1201, name: 'Fortis Hospital Mohali', address: 'Phase 8, Mohali', city: 'Mohali', district: 'Mohali', state: 'Punjab', phone: '+91 172 469 2222', rating: 4.5, specialty: 'Heart Transplant', hours: 'Open 24/7', lat: 30.7214, lng: 76.7256, facilities: ['ICU', 'Heart Transplant Unit', 'Emergency', 'Cardiac Surgery'] },
  { id: 1202, name: 'Dayanand Medical College', address: 'Civil Lines', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', phone: '+91 161 230 2620', rating: 4.4, specialty: 'Cardiovascular Medicine', hours: 'Open 24/7', lat: 30.9010, lng: 75.8573, facilities: ['ICU', 'Cardiology Dept', 'Emergency'] },
];
