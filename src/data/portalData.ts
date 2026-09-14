import { VideoLesson, StudyPdf, QuizQuestion, QuizLink, StudyFolder, StudyBatch, AppSettings } from '../types';

export const DEFAULT_FOLDERS: StudyFolder[] = [
  {
    id: 'folder-agronomy',
    name: 'Agronomy (सस्य विज्ञान)',
    category: 'all',
    targetBatch: 'both',
    description: 'Crop seasons, seed rates, irrigation stages, tillage, weed control',
    icon: 'Wheat',
    color: '#1b5e20'
  },
  {
    id: 'folder-soil',
    name: 'Soil Science & Fertilizers (मृदा विज्ञान)',
    category: 'all',
    targetBatch: 'both',
    description: 'Soil horizons, pH, reclamation of sodic/acid soils, nutrient deficiency',
    icon: 'Layers',
    color: '#795548'
  },
  {
    id: 'folder-horticulture',
    name: 'Horticulture & Olericulture (उद्यान विज्ञान)',
    category: 'all',
    targetBatch: 'both',
    description: 'Fruit crops, vegetable cultivation, pest management, preservation',
    icon: 'Apple',
    color: '#e65100'
  },
  {
    id: 'folder-up-gk',
    name: 'UP Special Agriculture (उत्तर प्रदेश कृषि GK)',
    category: 'all',
    targetBatch: 'both',
    description: '9 Agro-climatic zones of UP, river basins, state government schemes',
    icon: 'Landmark',
    color: '#0277bd'
  },
  {
    id: 'folder-pathology',
    name: 'Plant Pathology & Entomology (कीट व रोग)',
    category: 'all',
    targetBatch: 'both',
    description: 'Crop diseases, insect pests, IPM, fungicides and insecticides',
    icon: 'Bug',
    color: '#6a1b9a'
  },
  {
    id: 'folder-animal',
    name: 'Animal Husbandry & Dairying (पशुपालन)',
    category: 'all',
    targetBatch: 'both',
    description: 'Breeds of cow & buffalo, milk composition, feeds and veterinary care',
    icon: 'Milk',
    color: '#00695c'
  },
  {
    id: 'folder-mock-tests',
    name: 'Online Mock Tests & Quizzes (मॉक टेस्ट)',
    category: 'quiz',
    targetBatch: 'both',
    description: 'Full-length syllabus tests and previous years papers',
    icon: 'CheckSquare',
    color: '#c2185b'
  }
];


export const FREE_VIDEOS: VideoLesson[] = [
  {
    id: 'vid-1',
    title: 'Demo 1: Introduction to Soil Science & Soil pH',
    subject: 'Soil Science',
    duration: '18:45',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Learn fundamental concepts of soil profile, soil texture, cation exchange capacity (CEC), and pH management for UP agricultural lands.',
    isPaid: false,
    targetBatch: 'free',
    topics: [
      'Master soil horizons (O, A, E, B, C, R)',
      'Difference between active acidity and potential acidity',
      'Reclamation of Acidic Soils using Lime (CaCO3)',
      'Reclamation of Saline & Sodic soils using Gypsum (CaSO4.2H2O)'
    ]
  },
  {
    id: 'vid-2',
    title: 'Demo 2: Principles of Agronomy & Crop Seasons',
    subject: 'Agronomy',
    duration: '22:10',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Detailed analysis of Kharif, Rabi, and Zaid seasons, sowing times, seed rate calculations, and critical irrigation stages.',
    isPaid: false,
    targetBatch: 'free',
    topics: [
      'Kharif (June-October): Paddy, Maize, Cotton, Groundnut',
      'Rabi (October-March): Wheat, Mustard, Gram, Barley',
      'Critical irrigation stages of Wheat (CRI stage at 21 DAS)',
      'Tillage classification: Primary vs Secondary tillage'
    ]
  },
  {
    id: 'vid-3',
    title: 'Demo 3: Horticulture - Fruit & Vegetable Production',
    subject: 'Horticulture',
    duration: '16:30',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'High-yield facts for Mango, Guava, Banana, Tomato, and Potato cultivation in Uttar Pradesh.',
    isPaid: false,
    targetBatch: 'free',
    topics: [
      'Mango malformation causes & NAA hormone management',
      'Guava training and pruning for winter Mrig Bahar crop',
      'TPS (True Potato Seed) technology developed by Dr. Pushkarnath',
      'Pungency in Onion (Allyl propyl disulphide) & Garlic (Allicin)'
    ]
  }
];

export const FREE_PDFS: StudyPdf[] = [
  {
    id: 'pdf-agronomy',
    title: 'Agronomy High-Yield Fact Sheet',
    subject: 'General Agronomy',
    pages: '2 Pages',
    language: 'Bilingual (Hindi & English)',
    fileName: 'UPSSSC_AGTA_Agronomy_Facts.txt',
    isPaid: false,
    targetBatch: 'free',
    summary: 'Key crop seed rates, classification of crops, critical irrigation timings, and weed index.',
    fileContent: `=====================================================
AGRI CONCEPT & FACT - UPSSSC AGTA SPECIAL FACT SHEET
SUBJECT: AGRONOMY HIGH YIELD REVISION NOTES
=====================================================

1. CROP SEASONS IN INDIA:
   - Kharif: Sown in June-July, Harvested in Sept-Oct (Monsoon crops: Rice, Maize, Sorghum, Cotton)
   - Rabi: Sown in Oct-Nov, Harvested in March-April (Winter crops: Wheat, Mustard, Chickpea, Barley)
   - Zaid: Grown in summer (March-June: Watermelon, Muskmelon, Cucumber, Moong)

2. CRITICAL IRRIGATION STAGES:
   - Wheat (6 stages):
     * CRI (Crown Root Initiation) - 20-25 days after sowing (Most Critical)
     * Tillering stage - 40-45 DAS
     * Late Jointing stage - 60-65 DAS
     * Flowering stage - 80-85 DAS
     * Milking stage - 100-105 DAS
     * Dough stage - 115-120 DAS

3. SEED RATES (Standard Exam Reference):
   - Normal Wheat: 100 kg/ha (Late sown: 125 kg/ha)
   - Hybrid Rice: 15 kg/ha
   - Mustard: 4 - 5 kg/ha
   - Gram (Chickpea): 75 - 80 kg/ha
   - Pigeon Pea (Arhar): 12 - 15 kg/ha

4. IMPORTANT BOTANICAL FACTS:
   - "King of Cereals": Wheat (Triticum aestivum)
   - "Queen of Cereals": Maize (Zea mays)
   - "King of Pulses": Gram (Cicer arietinum)
   - "Queen of Pulses": Pea (Pisum sativum)
   - "White Gold": Cotton (Gossypium spp.)
   - "Yellow Jewel": Soybean (Glycine max)

Target Exam: UPSSSC AGTA, Cane Supervisor, BPSC BAO.
Website: Agri Concept & Fact Learning Portal`
  },
  {
    id: 'pdf-animal',
    title: 'Animal Husbandry & Dairying Basics',
    subject: 'Animal Husbandry',
    pages: '3 Pages',
    language: 'Bilingual (Hindi & English)',
    fileName: 'Animal_Husbandry_AGTA_Notes.txt',
    summary: 'Indigenous vs exotic breeds, gestation periods, fat percentages, and vaccination schedule.',
    fileContent: `=====================================================
AGRI CONCEPT & FACT - UPSSSC AGTA SPECIAL FACT SHEET
SUBJECT: ANIMAL HUSBANDRY & DAIRY SCIENCE
=====================================================

1. GESTATION PERIOD OF LIVESTOCK:
   - Cow: 282 - 285 Days
   - Buffalo: 310 Days
   - Sheep: 148 - 150 Days
   - Goat: 150 Days
   - Pig: 114 Days (3 months, 3 weeks, 3 days)
   - Mare (Horse): 340 Days

2. IMPORTANT INDIGENOUS BREEDS:
   - Buffalo Breeds:
     * Murrah: Known as "Black Gold", highest milk yielder with jet black body & tightly curled horns.
     * Bhadawari: Highest milk fat content (up to 13%), copper colored body, suited for ravines.
     * Jaffarabadi: Heaviest buffalo breed ("Gir buffalo").
   - Cattle (Cow) Breeds:
     * Milch Breeds: Sahiwal (highest milk yielder among indigenous cows), Red Sindhi, Gir.
     * Draught Breeds: Amritmahal, Hallikar, Nagori, Malvi.
     * Dual Purpose: Tharparkar, Hariana, Kankrej (famous for 'Sawai Chaal').

3. MILK COMPOSITION & FACTS:
   - Yellow color of cow milk is due to: Carotene (precursor of Vitamin A).
   - White color of buffalo milk is due to: Casein protein.
   - Specific gravity of Cow milk: 1.028 to 1.030
   - Specific gravity of Buffalo milk: 1.030 to 1.032
   - First milk produced after calving: Colostrum (rich in Immunoglobulins).

Target Exam: UPSSSC AGTA & State Agriculture Officer.
Prepared by: Agri Concept & Fact Team`
  },
  {
    id: 'pdf-soil',
    title: 'Soil Science & Plant Nutrition Summary',
    subject: 'Soil Science',
    pages: '2 Pages',
    language: 'English & Hindi',
    fileName: 'Soil_Science_Nutrients_Notes.txt',
    summary: 'Essential 17 plant elements, mobility in plants, deficiency symptoms, and fertilizer math.',
    fileContent: `=====================================================
AGRI CONCEPT & FACT - UPSSSC AGTA SPECIAL FACT SHEET
SUBJECT: SOIL SCIENCE & ESSENTIAL PLANT NUTRIENTS
=====================================================

1. TOTAL ESSENTIAL PLANT NUTRIENTS: 17 elements
   - Basic Nutrients: C, H, O (supplied by air and water)
   - Primary Macronutrients: N, P, K
   - Secondary Macronutrients: Ca, Mg, S
   - Micronutrients: Fe, Mn, Zn, Cu, B, Mo, Cl, Ni (Nickel was added 17th in 1987 by Brown et al.)

2. NUTRIENT MOBILITY & DEFICIENCY SYMPTOMS:
   - Highly Mobile in plant (Symptoms on Lower/Older leaves first):
     * Nitrogen (N): Uniform yellowing (chlorosis) of older leaves.
     * Phosphorus (P): Purplish or bronze discoloration of leaves.
     * Potassium (K): Marginal scorching or leaf burn.
     * Magnesium (Mg): Interveinal chlorosis of older leaves.
   - Immobile in plant (Symptoms on Terminal buds/New leaves):
     * Calcium (Ca) and Boron (B): Terminal bud dies.
   - Moderately Mobile / Immobile (Symptoms on New leaves):
     * Sulfur (S) and Iron (Fe): Chlorosis on younger leaves.

3. SPECIAL DEFICIENCY DISEASES:
   - Khaira disease of Rice: Zinc (Zn) deficiency.
   - Marsh spot of Pea: Manganese (Mn) deficiency.
   - Whip tail of Cauliflower: Molybdenum (Mo) deficiency.
   - Heart rot of Sugarbeet: Boron (B) deficiency.
   - White bud of Maize: Zinc (Zn) deficiency.

Agri Concept & Fact Learning Portal - Target UPSSSC AGTA 2026`
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which crop is widely known as "White Gold" in Indian Agriculture?',
    options: [
      { key: 'A', text: 'Wheat (Triticum aestivum)' },
      { key: 'B', text: 'Cotton (Gossypium spp.)' },
      { key: 'C', text: 'Basmati Rice (Oryza sativa)' },
      { key: 'D', text: 'Sugarcane (Saccharum officinarum)' }
    ],
    correctAnswer: 'B',
    explanation: 'Cotton is called "White Gold" because of its high economic value as a primary natural fiber cash crop.'
  },
  {
    id: 2,
    question: 'Who is revered as the "Father of the Green Revolution in India"?',
    options: [
      { key: 'A', text: 'Dr. Verghese Kurien' },
      { key: 'B', text: 'Dr. M.S. Swaminathan' },
      { key: 'C', text: 'Dr. Norman E. Borlaug' },
      { key: 'D', text: 'Dr. B.P. Pal' }
    ],
    correctAnswer: 'B',
    explanation: 'Prof. M.S. Swaminathan led the introduction of high-yielding semi-dwarf wheat varieties in India alongside Dr. Norman Borlaug (Father of the World Green Revolution).'
  },
  {
    id: 3,
    question: '"Khaira" disease of rice is caused by the deficiency of which plant nutrient?',
    options: [
      { key: 'A', text: 'Iron (Fe)' },
      { key: 'B', text: 'Nitrogen (N)' },
      { key: 'C', text: 'Zinc (Zn)' },
      { key: 'D', text: 'Boron (B)' }
    ],
    correctAnswer: 'C',
    explanation: 'Khaira disease was first reported by Dr. Y.L. Nene at Pantnagar (1966) and is cured by foliar spray of 0.5% Zinc Sulphate + 0.25% Lime.'
  },
  {
    id: 4,
    question: 'Where is the headquarters of ICAR (Indian Council of Agricultural Research) situated?',
    options: [
      { key: 'A', text: 'Karnal, Haryana' },
      { key: 'B', text: 'Lucknow, Uttar Pradesh' },
      { key: 'C', text: 'New Delhi (Krishi Bhavan)' },
      { key: 'D', text: 'Hyderabad, Telangana' }
    ],
    correctAnswer: 'C',
    explanation: 'ICAR was established on 16 July 1929 as Imperial Council of Agricultural Research with headquarters in New Delhi.'
  },
  {
    id: 5,
    question: 'What is the optimum soil pH range for the cultivation and nutrient availability of most agricultural crops?',
    options: [
      { key: 'A', text: '3.5 to 5.0' },
      { key: 'B', text: '6.5 to 7.5' },
      { key: 'C', text: '8.5 to 9.5' },
      { key: 'D', text: '10.0 to 11.5' }
    ],
    correctAnswer: 'B',
    explanation: 'A slightly acidic to neutral pH between 6.5 and 7.5 provides the highest microbial activity and balanced availability of macro and micro nutrients.'
  }
];

export const PREMIUM_BATCH_DETAILS = {
  title: 'UPSSSC AGTA 2026 Target Batch',
  subtitle: 'Complete Selection Guaranteed Preparation Batch',
  discountPrice: 99,
  originalPrice: 499,
  discountPercentage: 80,
  features: [
    '120+ High-Definition Recorded Video Lectures covering all 6 syllabus modules',
    'Complete Chapter-wise PDF Notes & Fact-Sheets (English + Hindi)',
    '15 Full Length Mock Tests based on latest UPSSSC examination pattern',
    'Special focus on Uttar Pradesh Specific Agriculture, Schemes & Statistics',
    'Telegram Secret Doubt Discussion Group with Agriculture Subject Specialists',
    'Previous Year Solved Papers (2018, 2019, 2022) with detailed video explanations'
  ],
  syllabusTopics: [
    'General Agriculture, Agronomy & Weather Forecasting',
    'Soil Science, Fertility, Saline-Alkali Soil Reclamation',
    'Horticulture, Olericulture, Pomology & Post Harvest Technology',
    'Plant Pathology, Entomology & Integrated Pest Management (IPM)',
    'Animal Husbandry, Dairying & Livestock Management',
    'Uttar Pradesh Agriculture, Agro-Ecological Zones & State Schemes'
  ]
};

export const PREMIUM_LECTURES: VideoLesson[] = [
  {
    id: 'prem-1',
    title: 'Lecture 1: Comprehensive Soil Profile, Horizons & Clay Minerals',
    subject: 'Soil Science - In Depth',
    duration: '42:15',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Exclusive paid session exploring 1:1, 2:1 expanding, and 2:1 non-expanding clay minerals (Kaolinite, Montmorillonite, Illite), cation exchange, and UP soil mapping.',
    isPaid: true,
    targetBatch: 'paid',
    topics: [
      'Differences between Solum and Regolith',
      'Structural composition of Montmorillonite with swelling properties',
      'Soil Taxonomy: 12 Soil Orders with Indian distribution',
      'UP specific Alluvial (Bangar vs Khadar) and Bundelkhand soils'
    ]
  },
  {
    id: 'prem-2',
    title: 'Lecture 2: UP Agro-Climatic Zones & Cropping Patterns',
    subject: 'UP Specific Agriculture',
    duration: '38:50',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Detailed analysis of all 9 Agro-Climatic Zones of Uttar Pradesh, rainfall patterns, major canal systems, and special crop belts.',
    isPaid: true,
    targetBatch: 'paid',
    topics: [
      'Detailed breakdown of UP’s 9 Agro-Climatic zones',
      'Bhabhar and Tarai Zone soil and crop adaptations',
      'Bundelkhand Zone: Drought management & pulse cultivation',
      'Eastern Plain Zone: Rice-Wheat cropping system and water logging'
    ]
  },
  {
    id: 'prem-3',
    title: 'Lecture 3: Integrated Pest Management (IPM) & Pesticide Calculations',
    subject: 'Plant Protection',
    duration: '35:20',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Pesticide formulations (EC, WP, SP), calculating active ingredient (a.i.), biological control agents, and insect pests of paddy & wheat.',
    isPaid: true,
    targetBatch: 'paid',
    topics: [
      'Formula for calculating commercial pesticide quantity: (Dose in a.i. × 100) / % a.i.',
      'Trichogramma egg parasitoids and Bacillus thuringiensis (Bt)',
      'Economic Threshold Level (ETL) vs Economic Injury Level (EIL)',
      'Major pests: Brown Planthopper (BPH), Stem Borer, Pink Bollworm'
    ]
  }
];

export const PREMIUM_BATCH_PDFS: StudyPdf[] = [
  {
    id: 'pdf-prem-1',
    title: 'UPSSSC AGTA 2026 Complete Master Syllabus Notes',
    subject: 'Complete AGTA Syllabus',
    pages: '45 Pages',
    language: 'Hindi & English',
    fileName: 'UPSSSC_AGTA_Complete_Master_Notes.txt',
    isPaid: true,
    targetBatch: 'paid',
    summary: 'Exclusively handwritten compilation covering all 6 syllabus modules: Agronomy, Soil, Horticulture, Plant Protection, Animal Husbandry & UP GK.',
    fileContent: `=====================================================
UPSSSC AGTA 2026 - COMPLETE MASTER SYLLABUS HANDWRITTEN NOTES
AGRI CONCEPT & FACT - EXCLUSIVE TARGET BATCH
FACULTY: PRASHANT CHAUDHARY SIR
=====================================================

SECTION 1: GENERAL AGRICULTURE & EXTENSION
- ICAR Established: 16 July 1929 (New Delhi)
- IARI Founded: 1905 at Pusa, Bihar (shifted to New Delhi 1936)
- First Agricultural University in India: GBPUAT Pantnagar (1960)
- National Agriculture Day (Kisan Diwas): 23 December (Chaudhary Charan Singh Jayanti)

SECTION 2: SOIL CHEMISTRY & DIAGNOSIS
- Electrical Conductivity (EC) > 4 dS/m, ESP < 15, pH < 8.5 => Saline Soil
- ESP > 15, pH 8.5 to 10.0 => Sodic/Alkali Soil (Reclaimed by Gypsum)
- Soil texture determining tool: Bouyoucos Hydrometer
- Nitrogen, Phosphorus, Potassium (Primary macronutrients)

SECTION 3: UTTAR PRADESH AGRO CLIMATIC HIGHLIGHTS
- Total Agro-Climatic Zones in UP: 9 Zones
- Largest Wheat, Sugarcane, Potato, and Milk producing State: Uttar Pradesh
- Major Canal Irrigation Network: Sharda Canal System

SECTION 4: PLANT PROTECTION & SEED SCIENCE
- Seed Certification Tag Colors:
  * Breeder Seed: Golden Yellow
  * Foundation Seed: White
  * Registered Seed: Purple
  * Certified Seed: Azure Blue (Supplied to farmers)

Target Exam: UPSSSC AGTA 2026. All rights reserved.`
  },
  {
    id: 'pdf-prem-2',
    title: 'UP Agro-Climatic Zones, Soils & State Schemes Master Dossier',
    subject: 'UP Specific Agriculture',
    pages: '12 Pages',
    language: 'Hindi & English',
    fileName: 'UP_Agro_Zones_And_Schemes.txt',
    isPaid: true,
    targetBatch: 'paid',
    summary: 'In-depth analysis of 9 UP agro-climatic zones, Bundelkhand soils, Tarai-Bhabhar agriculture, and major irrigation schemes.',
    fileContent: `=====================================================
UPSSSC AGTA 2026 - UTTAR PRADESH AGRICULTURE & SCHEMES SPECIAL
AGRI CONCEPT & FACT - EXCLUSIVE BATCH DOSSIER
=====================================================

1. NINE AGRO-CLIMATIC ZONES OF UTTAR PRADESH:
   1) Tarai & Bhabhar Zone (Sub-Himalayan belt: Saharanpur, Pilibhit, Lakhimpur Kheri)
   2) Western Plain Zone (Meerut, Muzaffarnagar, Bulandshahr)
   3) Mid-Western Plain Zone (Bareilly, Moradabad, Badaun)
   4) South-Western Semi-Arid Zone (Agra, Mathura, Aligarh)
   5) Central Plain Zone (Lucknow, Kanpur, Unnao, Fatehpur)
   6) Bundelkhand Zone (Jhansi, Lalitpur, Jalaun, Banda, Mahoba, Chitrakoot, Hamirpur)
   7) North-Eastern Plain Zone (Gorakhpur, Basti, Gonda, Bahraich)
   8) Eastern Plain Zone (Varanasi, Jaunpur, Ghazipur, Azamgarh)
   9) Vindhyan Zone (Mirzapur, Sonbhadra, Allahabad trans-Yamuna)

2. BUNDELKHAND SOILS (SPECIFIC EXAM CLASSIFICATION):
   - Rakar: Highly eroded, gravelly, sloping red soil.
   - Parwa: Light sandy loam red soil, suitable for pulses & oilseeds.
   - Kabar: Heavy dark clay soil with swelling & shrinking properties.
   - Mar: Fertile black clayey soil with high moisture retention capacity.

Target Exam: UPSSSC AGTA 2026.`
  }
];

export const ALL_DEFAULT_VIDEOS: VideoLesson[] = [
  ...FREE_VIDEOS,
  ...PREMIUM_LECTURES
];

export const ALL_DEFAULT_PDFS: StudyPdf[] = [
  ...FREE_PDFS,
  ...PREMIUM_BATCH_PDFS
];

export const MOCK_TEST_PAPERS = [
  {
    id: 'mock-1',
    title: 'UPSSSC AGTA Full Mock Test - 01',
    questionsCount: '100 Questions',
    duration: '120 Minutes',
    difficulty: 'Moderate to High',
    downloadContent: `=====================================================
UPSSSC AGTA 2026 - FULL LENGTH MOCK TEST PAPER 01
TOTAL MARKS: 100 | TIME: 120 MINUTES | NEGATIVE MARKING: 1/4th
=====================================================

[SECTION A: GENERAL AGRICULTURE & AGRONOMY]
Q1. Which among the following is a C4 plant?
(A) Rice
(B) Wheat
(C) Maize
(D) Potato
Answer: (C) Maize, Sugarcane, Sorghum are C4 plants with high photosynthetic efficiency.

Q2. What is the test weight of Basmati Rice?
(A) 25 grams
(B) 21 grams
(C) 40 grams
(D) 15 grams
Answer: (B) Test weight of Basmati Rice is 21 g (Normal paddy is 25 g).

Q3. Phalaris minor (Gulli Danda) is an obnoxious weed found predominantly in:
(A) Paddy field
(B) Wheat field
(C) Mustard field
(D) Gram field
Answer: (B) Wheat field. Mimic weed of wheat. Controlled by Sulfosulfuron/Isoproturon.

Q4. What is the optimum temperature for wheat germination?
(A) 10 - 15 °C
(B) 20 - 25 °C
(C) 30 - 35 °C
(D) 5 - 10 °C
Answer: (B) 20 to 25 °C.

[SECTION B: SOIL SCIENCE & PLANT NUTRITION]
Q5. Which soil order occupies the largest area in Uttar Pradesh?
(A) Vertisols
(B) Inceptisols
(C) Entisols
(D) Aridisols
Answer: (B) Inceptisols, followed by Entisols (Alluvial soils).

Q6. Urea contains what percentage of Nitrogen?
(A) 20.6%
(B) 46.0%
(C) 18.0%
(D) 60.0%
Answer: (B) Urea (CO(NH2)2) contains 46% Nitrogen in amide form.

=====================================================
Agri Concept and Fact Learning Portal - Target UPSSSC AGTA`
  },
  {
    id: 'mock-2',
    title: 'UPSSSC AGTA Special Revision Mock Test - 02',
    questionsCount: '100 Questions',
    duration: '120 Minutes',
    difficulty: 'High Yield Standard',
    downloadContent: `=====================================================
UPSSSC AGTA 2026 - FULL LENGTH MOCK TEST PAPER 02
TOTAL MARKS: 100 | TIME: 120 MINUTES
=====================================================

Q1. Central Institute for Subtropical Horticulture (CISH) is located at:
(A) Varanasi
(B) Rehmankhera, Lucknow
(C) Kanpur
(D) Meerut
Answer: (B) Lucknow.

Q2. Indian Institute of Pulses Research (IIPR) is located at:
(A) Kanpur
(B) Bhopal
(C) Jhansi
(D) Patna
Answer: (A) Kalyanpur, Kanpur.

Q3. What is the average gestation period of Buffalo?
(A) 282 days
(B) 310 days
(C) 345 days
(D) 150 days
Answer: (B) 310 days.

Q4. National Dairy Research Institute (NDRI) is situated at:
(A) Anand, Gujarat
(B) Karnal, Haryana
(C) Izatnagar, Bareilly
(D) Mathura, UP
Answer: (B) Karnal, Haryana.

=====================================================
Agri Concept and Fact Learning Portal - Premium Content`
  }
];

export const DEFAULT_QUIZ_LINKS: QuizLink[] = [
  {
    id: 'quizlink-1',
    title: 'UPSSSC AGTA Online Mock Test - Agronomy & Soil Science (50 MCQs)',
    subject: 'Agronomy & Soil Science',
    quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-example-agta-mock-1/viewform',
    totalQuestions: '50 Questions',
    duration: '45 Minutes',
    description: 'Free timed online practice test prepared by Prashant Chaudhary sir with instant scoring.',
    dateAdded: '2026-09-12',
    addedDate: 'Free Mock Test',
    isPaid: false,
    targetBatch: 'free'
  },
  {
    id: 'quizlink-2',
    title: 'Daily Agriculture Current Affairs & UP Special Agriculture Quiz',
    subject: 'UP Special & Current Affairs',
    quizUrl: 'https://forms.gle/sample-agri-current-affairs-quiz',
    totalQuestions: '25 Questions',
    duration: '20 Minutes',
    description: 'Important current updates in UP crop schemes, MSP 2025-26, and recent agricultural developments.',
    dateAdded: '2026-09-13',
    addedDate: 'Free Mock Test',
    isPaid: false,
    targetBatch: 'free'
  },
  {
    id: 'quizlink-agta-paid-1',
    title: 'UPSSSC AGTA 2026 Target Batch - Full Length Mock Test 01 (100 MCQs)',
    subject: 'Complete Syllabus AGTA Batch',
    quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-agta-full-syllabus-mock-test/viewform',
    totalQuestions: '100 Questions',
    duration: '120 Minutes',
    description: 'Exclusive Target AGTA 2026 Paid Batch full length mock test with negative marking (1/4th) and all 6 modules.',
    dateAdded: '2026-09-14',
    addedDate: 'AGTA Paid Batch Test',
    isPaid: true,
    targetBatch: 'paid'
  },
  {
    id: 'quizlink-agta-paid-2',
    title: 'AGTA Special Batch Test - Soil Diagnostics, Fertilisers & UP Agro Zones',
    subject: 'Soil Science & UP GK',
    quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe-soil-science-agta-test/viewform',
    totalQuestions: '50 Questions',
    duration: '60 Minutes',
    description: 'Target Batch exclusive subject test covering Bundelkhand soils, fertilizer calculation, and high-yield UP MCQs.',
    dateAdded: '2026-09-14',
    addedDate: 'AGTA Paid Batch Test',
    isPaid: true,
    targetBatch: 'paid'
  }
];

export const DEFAULT_BATCHES: StudyBatch[] = [
  {
    id: 'batch-target-state-exam',
    name: 'Target State Exam & Agriculture Exam',
    tagline: 'Complete Selection Guaranteed Special Batch',
    description: 'Special batch for UPSSSC AGTA & State Agriculture Officer Examinations with complete syllabus coverage, high-yield notes, and video classes.',
    price: 99,
    originalPrice: 499,
    paymentLink: 'https://rzp.io/l/target-state-exam',
    telegramLink: 'https://t.me/AgriTargetStateExam',
    isSpecialBatch: true,
    color: '#1b5e20',
    features: [
      '120+ High-Definition Recorded Video Lectures covering all syllabus modules',
      'Complete Chapter-wise PDF Notes & Fact-Sheets (English + Hindi)',
      '15 Full Length Mock Tests based on latest exam pattern',
      'Special focus on Uttar Pradesh Specific Agriculture, Schemes & Statistics',
      'Telegram Secret Doubt Discussion Group with Agriculture Subject Specialists',
      'Previous Year Solved Papers with detailed explanations'
    ],
    syllabusTopics: [
      'General Agriculture, Agronomy & Weather Forecasting',
      'Soil Science, Fertility, Saline-Alkali Soil Reclamation',
      'Horticulture, Olericulture, Pomology & Post Harvest Technology',
      'Plant Pathology, Entomology & Integrated Pest Management (IPM)',
      'Animal Husbandry, Dairying & Livestock Management',
      'Uttar Pradesh Agriculture, Agro-Ecological Zones & State Schemes'
    ]
  },
  {
    id: 'batch-agta-2026',
    name: 'Target State Exam',
    tagline: 'Comprehensive Agricultural Competitive Exam Batch',
    description: 'Foundational and advanced agriculture course designed for state services, agricultural technical assistants, and competitive entrance exams.',
    price: 99,
    originalPrice: 499,
    paymentLink: 'https://rzp.io/l/target-state-exam',
    telegramLink: 'https://t.me/AgriTargetStateExam',
    isSpecialBatch: false,
    color: '#f57c00',
    features: [
      'Daily Live & Recorded Video Classes',
      'Subject Wise Digital Handouts & Mindmaps',
      'Weekly Online Speed & Accuracy Quizzes',
      'Dedicated Doubt Clearing via Telegram Group'
    ],
    syllabusTopics: [
      'Agronomy & Water Management',
      'Genetics & Plant Breeding',
      'Agricultural Economics & Extension',
      'Agricultural Entomology & Nematology'
    ]
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  appName: 'Target State Exam',
  subTitle: 'Target State Exam & Agriculture Exam',
  helplineEmail: 'ahlawatprashantchaudhary@gmail.com',
  telegramChannel: 'https://t.me/AgriTargetStateExam',
  upiId: 'ahlawatprashantchaudhary@okaxis',
  supportPhone: '+91 9876543210',
  marqueeNotice: '🔥 UPSSSC AGTA 2026 एवं राज्य कृषि भर्ती स्पेशल बैचेस शुरू हो चुके हैं! अभी डिस्काउंट ऑफर के साथ एडमिशन लें।',
  bannerTitle: 'Target State Exam & Agriculture Batch 2026',
  bannerDescription: 'लाइव व रिकॉर्डेड क्लासेज, विशेष हस्तलिखित PDF नोट्स और 100% परीक्षा आधारित डिजिटल मॉक टेस्ट सीरीज।'
};

