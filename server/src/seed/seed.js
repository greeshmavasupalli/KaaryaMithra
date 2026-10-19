import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { ServiceCategory } from '../models/ServiceCategory.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { Enquiry } from '../models/Enquiry.js';
import { Review } from '../models/Review.js';
import { Report } from '../models/Report.js';
import { AuditLog } from '../models/AuditLog.js';
import { categoriesData, demoUsersData } from './seedData.js';
import { ENQUIRY_STATUSES, PROFILE_STATUSES, USER_ROLES } from '../config/constants.js';

// 32 fictional worker profiles with Andhra Pradesh / Visakhapatnam emphasis
const workerProfilesRaw = [
  {
    demoKey: 'ramesh.electrician@skilldost.demo',
    displayName: 'Ramesh Kumar',
    categorySlug: 'electrician',
    skills: ['MCB repair', 'Inverter wiring', 'Ceiling fan fixing', 'LED switchboards'],
    experienceYears: 8,
    locality: 'MVP Colony',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 250,
    indicativePriceMax: 800,
    languages: ['Telugu', 'Hindi', 'Basic English'],
    availability: 'available',
    bio: 'Experienced local electrician with 8 years repairing home wiring, emergency tripping, and inverter installations across MVP Colony and Maddilapalem.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    demoKey: 'lakshmi.cleaning@skilldost.demo',
    displayName: 'Lakshmi Devi',
    categorySlug: 'house-cleaning',
    skills: ['Deep kitchen scrubbing', 'Bathroom descaling', 'Move-in deep clean', 'Floor polishing'],
    experienceYears: 6,
    locality: 'Seethammadhara',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 12,
    indicativePriceMin: 400,
    indicativePriceMax: 1500,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Dedicated domestic cleaning professional offering reliable kitchen, floor, and move-in deep cleaning services. Eco-friendly cleaning agents used.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    demoKey: 'suresh.plumber@skilldost.demo',
    displayName: 'Suresh Varma',
    categorySlug: 'plumber',
    skills: ['Overhead tank plumbing', 'Bathroom diverter repair', 'Drain blockage', 'CPVC piping'],
    experienceYears: 10,
    locality: 'Gajuwaka',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 15,
    indicativePriceMin: 200,
    indicativePriceMax: 900,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Over a decade of hands-on plumbing in industrial and residential areas of Gajuwaka and Kurmannapalem. Quick emergency leak resolution.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Apparao Naidu',
    email: 'apparao.carpenter@skilldost.demo',
    phone: '9876500010',
    categorySlug: 'carpenter',
    skills: ['Teakwood door repair', 'Cupboard hinge alignment', 'Mesh window fitting', 'Modular wardrobe'],
    experienceYears: 14,
    locality: 'Dwaraka Nagar',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 8,
    indicativePriceMin: 350,
    indicativePriceMax: 1200,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Skilled traditional carpenter specialized in wooden furniture restoration, door latches, and custom kitchen cabinet alterations.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Venkat Rao Polisetty',
    email: 'venkat.painter@skilldost.demo',
    phone: '9876500011',
    categorySlug: 'painter',
    skills: ['Interior emulsion', 'Waterproofing putty', 'Exterior weather coat', 'Wood polish'],
    experienceYears: 9,
    locality: 'Madhurawada',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 15,
    indicativePriceMin: 500,
    indicativePriceMax: 3000,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Clean and punctual painting team leader for homes and flats near IT SEZ and Madhurawada. Honest quote with no hidden paint dilution.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Gowri Parvathi',
    email: 'gowri.cook@skilldost.demo',
    phone: '9876500012',
    categorySlug: 'cook',
    skills: ['Andhra vegetarian meals', 'Pappu charu specialties', 'Tiffin breakfast', 'Snack preparation'],
    experienceYears: 7,
    locality: 'Siripuram',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 6,
    indicativePriceMin: 2500,
    indicativePriceMax: 5000,
    languages: ['Telugu', 'Basic Hindi'],
    availability: 'busy',
    bio: 'Homestyle cooking for families and working professionals. Hygienic preparation with authentic home spices and tailored salt/spice levels.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Chandra Sekhar',
    email: 'chandra.driver@skilldost.demo',
    phone: '9876500013',
    categorySlug: 'driver',
    skills: ['Manual & Automatic cars', 'Night highway driving', 'Airport drops', 'City traffic navigation'],
    experienceYears: 12,
    locality: 'Gopalapatnam',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 20,
    indicativePriceMin: 450,
    indicativePriceMax: 1500,
    languages: ['Telugu', 'Hindi', 'English'],
    availability: 'available',
    bio: 'Calm, defensive driver with a spotless 12-year record. Familiar with all Visakhapatnam routes, Araku outstation paths, and airport transit.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Simhachalam K.',
    email: 'simhachalam.mason@skilldost.demo',
    phone: '9876500014',
    categorySlug: 'mason',
    skills: ['Bathroom tile replacement', 'Wall plastering', 'Compound wall masonry', 'Cement floor screeding'],
    experienceYears: 15,
    locality: 'Pendurthi',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 15,
    indicativePriceMin: 600,
    indicativePriceMax: 2000,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Experienced civil worker offering small and medium masonry jobs, tile fixing, and moisture barrier masonry.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Padma Jyothi',
    email: 'padma.tailor@skilldost.demo',
    phone: '9876500015',
    categorySlug: 'tailor',
    skills: ['Blouse designing & alterations', 'Kurti resizing', 'School uniform stitching', 'Curtain hemming'],
    experienceYears: 11,
    locality: 'Kurmannapalem',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 8,
    indicativePriceMin: 150,
    indicativePriceMax: 900,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Neighborhood tailoring studio with doorstep fabric pickup and return. Accurate measurements and prompt alteration delivery.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Satyanarayana Murthy',
    email: 'satya.ac@skilldost.demo',
    phone: '9876500016',
    categorySlug: 'ac-appliance-repair',
    skills: ['Inverter split AC servicing', 'R32 gas charging', 'Refrigerator cooling coil', 'Washing machine drum fix'],
    experienceYears: 9,
    locality: 'Rushikonda',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 18,
    indicativePriceMin: 400,
    indicativePriceMax: 2200,
    languages: ['Telugu', 'Hindi', 'English'],
    availability: 'available',
    bio: 'Certified repair technician for top split AC and washing machine brands. Complete jet wash and leakage diagnosis.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Bangarraju Palla',
    email: 'bangarraju.gardener@skilldost.demo',
    phone: '9876500017',
    categorySlug: 'gardener',
    skills: ['Terrace garden setup', 'Bonsai pruning', 'Neem oil pest spray', 'Red soil mixing'],
    experienceYears: 13,
    locality: 'Waltair Uplands',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 350,
    indicativePriceMax: 1000,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Plant lover and experienced horticulturist maintaining terrace gardens, ornamental shrubs, and balcony flowering setups.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Praveen Reddy',
    email: 'praveen.tutor@skilldost.demo',
    phone: '9876500018',
    categorySlug: 'home-tutor',
    skills: ['Class 6-10 Mathematics', 'Physics fundamentals', 'Spoken Telugu & English', 'Homework assistance'],
    experienceYears: 5,
    locality: 'Akkayyapalem',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 7,
    indicativePriceMin: 1200,
    indicativePriceMax: 3500,
    languages: ['Telugu', 'English'],
    availability: 'available',
    bio: 'Patient home tutor focusing on building core conceptual clarity in arithmetic, algebra, and basic sciences for school children.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Mohan Das',
    email: 'mohan.electrician@skilldost.demo',
    phone: '9876500019',
    categorySlug: 'electrician',
    skills: ['Emergency short circuit detection', 'Geyser installation', 'Exhaust fan ducting'],
    experienceYears: 7,
    locality: 'Benz Circle',
    districtCity: 'Vijayawada',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 200,
    indicativePriceMax: 700,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Prompt local electrician serving Benz Circle, Patamata, and Bhavanipuram. Equipped with all diagnostic meters and tools.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Kavitha Kumari',
    email: 'kavitha.cleaning@skilldost.demo',
    phone: '9876500020',
    categorySlug: 'house-cleaning',
    skills: ['Sofa shampooing', 'Window grill dusting', 'Tile degreasing'],
    experienceYears: 4,
    locality: 'Patamata',
    districtCity: 'Vijayawada',
    state: 'Andhra Pradesh',
    serviceRadius: 12,
    indicativePriceMin: 350,
    indicativePriceMax: 1200,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Diligent domestic helper with specialized focus on thorough seasonal house sanitization and post-renovation cleanup.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Ganesh Babu',
    email: 'ganesh.plumber@skilldost.demo',
    phone: '9876500021',
    categorySlug: 'plumber',
    skills: ['Submersible pump servicing', 'Water meter fitting', 'Kitchen sink siphon repair'],
    experienceYears: 8,
    locality: 'Brodipet',
    districtCity: 'Guntur',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 250,
    indicativePriceMax: 850,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Trusted Guntur plumber with expertise in high-pressure plumbing, underground sumps, and kitchen drains.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Anil Kumar Varma',
    email: 'anil.carpenter@skilldost.demo',
    phone: '9876500022',
    categorySlug: 'carpenter',
    skills: ['Bed frame tightening', 'Sliding window rollers', 'Shoe rack assembly'],
    experienceYears: 6,
    locality: 'Arundelpet',
    districtCity: 'Guntur',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 300,
    indicativePriceMax: 1000,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Specialist in flat-pack furniture assembly and quick timber repairs across Brodipet and Arundelpet.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Murali Krishna',
    email: 'murali.painter@skilldost.demo',
    phone: '9876500023',
    categorySlug: 'painter',
    skills: ['Texture wall styling', 'Stencils', 'Wood varnish', 'Damp seal coating'],
    experienceYears: 12,
    locality: 'Danavaipeta',
    districtCity: 'Rajahmundry',
    state: 'Andhra Pradesh',
    serviceRadius: 12,
    indicativePriceMin: 450,
    indicativePriceMax: 2500,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Reputed local master painter for Godavari coastal homes. Dampness prevention and vibrant interior wall finishes.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Sita Ramanamma',
    email: 'sita.cook@skilldost.demo',
    phone: '9876500024',
    categorySlug: 'cook',
    skills: ['Godavari special recipes', 'Tiffin dosas & idlis', 'Chutneys and powders'],
    experienceYears: 9,
    locality: 'Kotipalli Bus Stand area',
    districtCity: 'Rajahmundry',
    state: 'Andhra Pradesh',
    serviceRadius: 6,
    indicativePriceMin: 2200,
    indicativePriceMax: 4500,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Traditional homestyle cook skilled in nutritious regional Andhra fare. Courteous and clean work standards.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Ravi Shankar',
    email: 'ravi.driver@skilldost.demo',
    phone: '9876500025',
    categorySlug: 'driver',
    skills: ['Tirumala ghat road driving', 'Commercial driving license', 'Airport transfers'],
    experienceYears: 16,
    locality: 'Alipiri Road',
    districtCity: 'Tirupati',
    state: 'Andhra Pradesh',
    serviceRadius: 25,
    indicativePriceMin: 500,
    indicativePriceMax: 1800,
    languages: ['Telugu', 'Tamil', 'Hindi', 'Basic English'],
    availability: 'available',
    bio: 'Expert ghat-road driver for pilgrimage and outstation travel. Punctual, non-smoker, with high route awareness.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Kishore Goud',
    email: 'kishore.ac@skilldost.demo',
    phone: '9876500026',
    categorySlug: 'ac-appliance-repair',
    skills: ['Commercial HVAC', 'PCB board repair', 'Gas leak soldering'],
    experienceYears: 10,
    locality: 'Madhapur',
    districtCity: 'Hyderabad',
    state: 'Telangana',
    serviceRadius: 15,
    indicativePriceMin: 450,
    indicativePriceMax: 2500,
    languages: ['Telugu', 'Hindi', 'English'],
    availability: 'available',
    bio: 'Experienced electronics technician repairing residential and small commercial cooling appliances.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Narasimha Rao',
    email: 'narasimha.electrician@skilldost.demo',
    phone: '9876500027',
    categorySlug: 'electrician',
    skills: ['3-phase motor wiring', 'Earthing installation', 'Sub-meter fitting'],
    experienceYears: 13,
    locality: 'Maddilapalem',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 8,
    indicativePriceMin: 200,
    indicativePriceMax: 900,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Dependable domestic and light-commercial electrical technician in Central Vizag.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Sunita Kumari',
    email: 'sunita.cleaning@skilldost.demo',
    phone: '9876500028',
    categorySlug: 'house-cleaning',
    skills: ['Kitchen chimney degreasing', 'Glass window polishing', 'Balcony cleaning'],
    experienceYears: 5,
    locality: 'Dabagardens',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 350,
    indicativePriceMax: 1100,
    languages: ['Telugu', 'Odia', 'Hindi'],
    availability: 'available',
    bio: 'Professional house cleaning assistant available for daily or weekend detailed household cleanup.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Prasad Raju',
    email: 'prasad.plumber@skilldost.demo',
    phone: '9876500029',
    categorySlug: 'plumber',
    skills: ['Concealed pipe repairs', 'Kitchen sink leakage', 'Shower panel setup'],
    experienceYears: 11,
    locality: 'Kancharapalem',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 200,
    indicativePriceMax: 800,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Quick response plumber for urgent leaks and pipe fittings across Kancharapalem and Thatichetlapalem.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Devi Prasad',
    email: 'devi.carpenter@skilldost.demo',
    phone: '9876500030',
    categorySlug: 'carpenter',
    skills: ['Door stopper & tower bolts', 'Plywood shelf installation', 'Dining chair repairs'],
    experienceYears: 7,
    locality: 'Marripalem',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 250,
    indicativePriceMax: 750,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Convenient handyman and carpentry service for minor household repairs and wood fittings.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Rajesh G.',
    email: 'rajesh.painter@skilldost.demo',
    phone: '9876500031',
    categorySlug: 'painter',
    skills: ['Grill enamel painting', 'Ceiling water stain block', 'Repainting single rooms'],
    experienceYears: 8,
    locality: 'Suijatha Nagar',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 12,
    indicativePriceMin: 350,
    indicativePriceMax: 1800,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Individual painter offering pocket-friendly single-room, balcony grill, and ceiling touch-up painting.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Sandhya Rani',
    email: 'sandhya.cook@skilldost.demo',
    phone: '9876500032',
    categorySlug: 'cook',
    skills: ['North & South Indian curries', 'Diet-friendly low oil meals', 'Festival sweets'],
    experienceYears: 10,
    locality: 'CBM Compound',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 8,
    indicativePriceMin: 3000,
    indicativePriceMax: 6000,
    languages: ['Telugu', 'Hindi', 'English'],
    availability: 'available',
    bio: 'Accommodating and hygienic chef specialized in balanced family nutrition and wholesome daily cooking.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Naresh Kumar',
    email: 'naresh.driver@skilldost.demo',
    phone: '9876500033',
    categorySlug: 'driver',
    skills: ['Hourly driver service', 'Sedan & SUV handling', 'Night shifts'],
    experienceYears: 7,
    locality: 'Pedda Waltair',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 15,
    indicativePriceMin: 350,
    indicativePriceMax: 1200,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Professional chauffeur for family functions, shopping trips, and executive office travel in Vizag.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Srinu Babu',
    email: 'srinu.mason@skilldost.demo',
    phone: '9876500034',
    categorySlug: 'mason',
    skills: ['Granite step repair', 'Kitchen platform elevation', 'Rainwater drain masonry'],
    experienceYears: 12,
    locality: 'Bheemunipatnam (Bheemili)',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 20,
    indicativePriceMin: 500,
    indicativePriceMax: 1800,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Coastal masonry repair worker with expertise in salt-air erosion prevention and stone masonry.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Lavanya S.',
    email: 'lavanya.tailor@skilldost.demo',
    phone: '9876500035',
    categorySlug: 'tailor',
    skills: ['Fall & pico for sarees', 'Zipper replacement', 'Kids party dress altering'],
    experienceYears: 8,
    locality: 'Pothinamallayya Palem (PM Palem)',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 100,
    indicativePriceMax: 600,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'At-home tailoring and alteration service serving cricket stadium area and PM Palem residents.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Tarun Teja',
    email: 'tarun.ac@skilldost.demo',
    phone: '9876500036',
    categorySlug: 'ac-appliance-repair',
    skills: ['Microwave heating repair', 'Water purifier filter replacement', 'Ceiling fan capacitor'],
    experienceYears: 5,
    locality: 'Sheela Nagar',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 15,
    indicativePriceMin: 300,
    indicativePriceMax: 1200,
    languages: ['Telugu', 'Hindi'],
    availability: 'available',
    bio: 'Quick home appliance diagnosis and repairs with genuine spare parts and honest pricing.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: true,
    },
  },
  {
    displayName: 'Eswaramma K.',
    email: 'eswaramma.gardener@skilldost.demo',
    phone: '9876500037',
    categorySlug: 'gardener',
    skills: ['Lawn mowing', 'Vermicompost enrichment', 'Flowering rose grafting'],
    experienceYears: 16,
    locality: 'Lawson\'s Bay Colony',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 10,
    indicativePriceMin: 400,
    indicativePriceMax: 1200,
    languages: ['Telugu'],
    availability: 'available',
    bio: 'Veteran gardener keeping beachfront residential gardens lush and thriving despite coastal humidity.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: true,
      skillEvidenceSubmitted: false,
    },
  },
  {
    displayName: 'Manohar V.',
    email: 'manohar.tutor@skilldost.demo',
    phone: '9876500038',
    categorySlug: 'home-tutor',
    skills: ['Elementary English reading', 'Basic computer literacy', 'Telugu handwriting'],
    experienceYears: 4,
    locality: 'Isukathota',
    districtCity: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    serviceRadius: 8,
    indicativePriceMin: 1000,
    indicativePriceMax: 2500,
    languages: ['Telugu', 'English', 'Hindi'],
    availability: 'available',
    bio: 'Enthusiastic young tutor encouraging students who need a warm, patient study partner for foundational literacy.',
    verificationStatus: {
      phoneConfirmed: true,
      communityReferenceAdded: false,
      skillEvidenceSubmitted: false,
    },
  },
];

const LOCALITY_COORDINATES = {
  'MVP Colony': { latitude: 17.7423, longitude: 83.3353 },
  'Seethammadhara': { latitude: 17.7348, longitude: 83.3168 },
  'Gajuwaka': { latitude: 17.6897, longitude: 83.2120 },
  'Dwaraka Nagar': { latitude: 17.7226, longitude: 83.3082 },
  'Siripuram': { latitude: 17.7214, longitude: 83.3204 },
  'Madhurawada': { latitude: 17.7984, longitude: 83.3592 },
  'Pendurthi': { latitude: 17.8286, longitude: 83.1979 },
  'Akkayyapalem': { latitude: 17.7312, longitude: 83.3012 },
  'Marripalem': { latitude: 17.7441, longitude: 83.2678 },
  'Kurmannapalem': { latitude: 17.6742, longitude: 83.1678 },
  'Isukathota': { latitude: 17.7479, longitude: 83.3321 },
  'Rushikonda': { latitude: 17.7818, longitude: 83.3768 },
  'Waltair Uplands': { latitude: 17.7198, longitude: 83.3282 },
  'Jagadamba Centre': { latitude: 17.7124, longitude: 83.3014 },
  'Maddilapalem': { latitude: 17.7368, longitude: 83.3276 },
  'Kancharapalem': { latitude: 17.7329, longitude: 83.2798 },
  'Gopalapatnam': { latitude: 17.7554, longitude: 83.2321 },
  'NAD Junction': { latitude: 17.7511, longitude: 83.2435 },
  'Sujatha Nagar': { latitude: 17.7765, longitude: 83.2201 },
  'Kommadi': { latitude: 17.8182, longitude: 83.3702 },
  'PM Palem': { latitude: 17.8080, longitude: 83.3610 },
  'Daba Gardens': { latitude: 17.7161, longitude: 83.3023 },
  'Sagar Nagar': { latitude: 17.7672, longitude: 83.3541 },
  'Yendada': { latitude: 17.7661, longitude: 83.3482 },
  'Anakapalle': { latitude: 17.6896, longitude: 83.0034 },
};

export const seedDatabase = async (reset = false) => {
  try {
    console.log('[SkillDost Seed] Starting database seeding...');
    await connectDB();

    if (reset) {
      console.log('[SkillDost Seed] Reset flag detected: Clearing previous prototype collections...');
      await Promise.all([
        User.deleteMany({}),
        ServiceCategory.deleteMany({}),
        WorkerProfile.deleteMany({}),
        Enquiry.deleteMany({}),
        Review.deleteMany({}),
        Report.deleteMany({}),
        AuditLog.deleteMany({}),
      ]);
      console.log('[SkillDost Seed] Collections cleared.');
    }

    // 1. Seed Categories
    console.log('[SkillDost Seed] Seeding service categories...');
    const createdCategories = {};
    for (const cat of categoriesData) {
      const savedCat = await ServiceCategory.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdCategories[cat.slug] = savedCat;
    }
    console.log(`[SkillDost Seed] ${Object.keys(createdCategories).length} categories ready.`);

    // 2. Seed Demo Core Users
    console.log('[SkillDost Seed] Seeding demo core accounts...');
    const createdUsers = {};
    const defaultPassword = 'demo123';
    const adminPassword = 'admin123';

    for (const u of demoUsersData) {
      const pwd = u.role === 'admin' ? adminPassword : defaultPassword;
      const passwordHash = await User.hashPassword(pwd);

      const savedUser = await User.findOneAndUpdate(
        { email: u.email },
        {
          ...u,
          passwordHash,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdUsers[u.email] = savedUser;
    }
    console.log(`[SkillDost Seed] Demo accounts created/updated (Admin, Customers, Key Workers).`);

    // 3. Seed Worker Profiles
    console.log('[SkillDost Seed] Seeding 32+ fictional worker profiles...');
    const workerMap = {};

    for (const wp of workerProfilesRaw) {
      let userObj = null;

      if (wp.demoKey && createdUsers[wp.demoKey]) {
        userObj = createdUsers[wp.demoKey];
      } else {
        // Create user account for additional workers
        const passwordHash = await User.hashPassword(defaultPassword);
        userObj = await User.findOneAndUpdate(
          { email: wp.email },
          {
            displayName: wp.displayName,
            email: wp.email,
            phone: wp.phone || '9876543210',
            isPhoneConfirmed: wp.verificationStatus.phoneConfirmed,
            role: USER_ROLES.WORKER,
            accountStatus: 'active',
            preferredLanguage: wp.languages[0]?.toLowerCase().includes('telugu') ? 'te' : 'en',
            passwordHash,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }

      const categoryObj = createdCategories[wp.categorySlug];
      const baseSlug = wp.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const slug = `${baseSlug}-${userObj._id.toString().slice(-4)}`;

      const baseCoord = LOCALITY_COORDINATES[wp.locality] || { latitude: 17.7226, longitude: 83.3082 };
      const offset = ((wp.displayName.charCodeAt(0) % 7) - 3) * 0.003;
      const approximateCoordinates = {
        latitude: parseFloat((baseCoord.latitude + offset).toFixed(4)),
        longitude: parseFloat((baseCoord.longitude + offset).toFixed(4)),
      };

      const workerProfile = await WorkerProfile.findOneAndUpdate(
        { userId: userObj._id },
        {
          userId: userObj._id,
          slug,
          displayName: wp.displayName,
          categories: categoryObj ? [categoryObj._id] : [],
          skills: wp.skills,
          bio: wp.bio,
          experienceYears: wp.experienceYears,
          locality: wp.locality,
          districtCity: wp.districtCity,
          state: wp.state,
          serviceRadius: wp.serviceRadius,
          approximateCoordinates,
          indicativePriceMin: wp.indicativePriceMin,
          indicativePriceMax: wp.indicativePriceMax,
          languages: wp.languages,
          availability: wp.availability,
          verificationStatus: wp.verificationStatus,
          profileStatus: PROFILE_STATUSES.PUBLISHED,
          averageRating: 4.8,
          reviewCount: 1,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      workerMap[wp.displayName] = workerProfile;
    }
    console.log(`[SkillDost Seed] ${Object.keys(workerMap).length} worker profiles seeded.`);

    // 4. Seed Enquiries
    console.log('[SkillDost Seed] Seeding interactive customer enquiries...');
    const ananya = createdUsers['ananya.customer@skilldost.demo'];
    const vikram = createdUsers['vikram.customer@skilldost.demo'];
    const ramesh = workerMap['Ramesh Kumar'];
    const lakshmi = workerMap['Lakshmi Devi'];
    const suresh = workerMap['Suresh Varma'];

    let enqAccepted, enqCompleted, enqNew;

    if (ananya && ramesh) {
      enqAccepted = await Enquiry.findOneAndUpdate(
        { customerId: ananya._id, workerId: ramesh._id, locality: 'MVP Colony' },
        {
          customerId: ananya._id,
          workerId: ramesh._id,
          categoryId: createdCategories['electrician']._id,
          locality: 'MVP Colony, Sector 4',
          message: 'Main switchboard keeps tripping when air conditioner starts. Need inspection of MCB and connection.',
          preferredTime: 'Tomorrow morning around 10:00 AM',
          contactPreference: 'phone',
          customerContact: {
            name: ananya.displayName,
            phone: ananya.phone,
          },
          status: ENQUIRY_STATUSES.ACCEPTED,
          statusHistory: [
            {
              status: ENQUIRY_STATUSES.NEW,
              note: 'Enquiry submitted by customer',
              changedBy: ananya._id,
              changedAt: new Date(Date.now() - 24 * 3600 * 1000),
            },
            {
              status: ENQUIRY_STATUSES.RESPONDED,
              note: 'Worker confirmed availability for tomorrow morning',
              changedBy: ramesh.userId,
              changedAt: new Date(Date.now() - 18 * 3600 * 1000),
            },
            {
              status: ENQUIRY_STATUSES.ACCEPTED,
              note: 'Job accepted. Contact shared for coordination.',
              changedBy: ramesh.userId,
              changedAt: new Date(Date.now() - 12 * 3600 * 1000),
            },
          ],
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (ananya && lakshmi) {
      enqCompleted = await Enquiry.findOneAndUpdate(
        { customerId: ananya._id, workerId: lakshmi._id, locality: 'Seethammadhara' },
        {
          customerId: ananya._id,
          workerId: lakshmi._id,
          categoryId: createdCategories['house-cleaning']._id,
          locality: 'Seethammadhara, North Extension',
          message: 'Complete deep cleaning of modular kitchen and utility wash area before festival.',
          preferredTime: 'Completed yesterday',
          contactPreference: 'in_app',
          customerContact: {
            name: ananya.displayName,
            phone: ananya.phone,
          },
          status: ENQUIRY_STATUSES.COMPLETED,
          statusHistory: [
            {
              status: ENQUIRY_STATUSES.NEW,
              note: 'Enquiry submitted',
              changedBy: ananya._id,
              changedAt: new Date(Date.now() - 72 * 3600 * 1000),
            },
            {
              status: ENQUIRY_STATUSES.ACCEPTED,
              note: 'Worker scheduled cleaning',
              changedBy: lakshmi.userId,
              changedAt: new Date(Date.now() - 60 * 3600 * 1000),
            },
            {
              status: ENQUIRY_STATUSES.COMPLETED,
              note: 'Work completed satisfactorily',
              changedBy: ananya._id,
              changedAt: new Date(Date.now() - 24 * 3600 * 1000),
            },
          ],
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Seed review on completed enquiry
      await Review.findOneAndUpdate(
        { enquiryId: enqCompleted._id },
        {
          enquiryId: enqCompleted._id,
          customerId: ananya._id,
          workerId: lakshmi._id,
          rating: 5,
          comment: 'Lakshmi arrived punctually and did a thorough, immaculate cleaning of our kitchen and utility area. Highly respectful and dependable!',
          moderationStatus: 'approved',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Update Lakshmi rating
      await WorkerProfile.findByIdAndUpdate(lakshmi._id, {
        averageRating: 5.0,
        reviewCount: 1,
      });
    }

    if (vikram && suresh) {
      enqNew = await Enquiry.findOneAndUpdate(
        { customerId: vikram._id, workerId: suresh._id },
        {
          customerId: vikram._id,
          workerId: suresh._id,
          categoryId: createdCategories['plumber']._id,
          locality: 'Gajuwaka Industrial area',
          message: 'Water leakage in bathroom concealed CPVC pipe near shower mixer. Water dripping onto wall.',
          preferredTime: 'Today evening after 5 PM',
          contactPreference: 'in_app',
          customerContact: {
            name: vikram.displayName,
            phone: vikram.phone,
          },
          status: ENQUIRY_STATUSES.NEW,
          statusHistory: [
            {
              status: ENQUIRY_STATUSES.NEW,
              note: 'Enquiry submitted by customer',
              changedBy: vikram._id,
              changedAt: new Date(),
            },
          ],
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 5. Seed Reports for Moderator Triage Testing
    console.log('[SkillDost Seed] Seeding reports for moderation queue testing...');
    const adminUser = createdUsers['admin@skilldost.demo'];

    if (ramesh) {
      await Report.findOneAndUpdate(
        { targetId: ramesh._id, reason: 'misleading_info' },
        {
          ticketId: 'GRV-2026-884102',
          reporterId: vikram ? vikram._id : null,
          targetType: 'listing',
          targetId: ramesh._id,
          reason: 'misleading_info',
          details: 'Sample demo report: User noted that visiting charges for Sunday work were slightly higher than the weekday indicative minimum.',
          urgency: 'medium',
          slaHours: 24,
          blocked: false,
          status: 'pending',
          adminNotes: '',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const testWorker = workerMap['Mohan Das'];
    if (testWorker) {
      await Report.findOneAndUpdate(
        { targetId: testWorker._id, reason: 'unreachable_or_fake' },
        {
          ticketId: 'GRV-2026-913401',
          reporterId: ananya ? ananya._id : null,
          targetType: 'listing',
          targetId: testWorker._id,
          reason: 'unreachable_or_fake',
          details: 'Sample demo report: Customer attempted enquiry contact during listed available hours but received no response.',
          urgency: 'high',
          slaHours: 6,
          blocked: false,
          status: 'pending',
          adminNotes: 'Assigned to Ward volunteer triage for field check.',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Seed one resolved report with audit log
    if (adminUser && suresh) {
      const resolvedRep = await Report.findOneAndUpdate(
        { targetId: suresh._id, reason: 'other' },
        {
          ticketId: 'GRV-2026-302194',
          reporterId: ananya ? ananya._id : null,
          targetType: 'listing',
          targetId: suresh._id,
          reason: 'other',
          details: 'Clarification requested regarding service radius limit beyond Gajuwaka.',
          urgency: 'low',
          slaHours: 48,
          blocked: false,
          status: 'resolved',
          adminNotes: 'Contacted provider: confirmed service radius covers up to 15km into Kurmannapalem and Steel Plant township.',
          resolvedBy: adminUser._id,
          resolvedAt: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await AuditLog.findOneAndUpdate(
        { targetId: suresh._id, action: 'RESOLVE_REPORT_NONE' },
        {
          actorId: adminUser._id,
          action: 'RESOLVE_REPORT_NONE',
          targetType: 'listing',
          targetId: suresh._id,
          reason: 'Verified service area details with provider. Report resolved without listing modification.',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('[SkillDost Seed] Seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO CREDENTIALS:');
    console.log('Admin:    admin@skilldost.demo / admin123');
    console.log('Customer: ananya.customer@skilldost.demo / demo123');
    console.log('Customer: vikram.customer@skilldost.demo / demo123');
    console.log('Worker:   ramesh.electrician@skilldost.demo / demo123');
    console.log('Worker:   lakshmi.cleaning@skilldost.demo / demo123');
    console.log('Worker:   suresh.plumber@skilldost.demo / demo123');
    console.log('Simulated OTP demo code: 123456');
    console.log('----------------------------------------------------');

    return true;
  } catch (error) {
    console.error('[SkillDost Seed] Seeding failed:', error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1]?.includes('seed.js')) {
  const isReset = process.argv.includes('--reset');
  seedDatabase(isReset)
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      await disconnectDB();
      process.exit(1);
    });
}
