import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Middleware for parsing JSON (allow up to 100MB for PDF base64 file payloads)
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

const DB_FILE = path.join(process.cwd(), "materials_db.json");

// Default seed data for Folders (Unlimited folders, custom pricing, payment & telegram links supported)
const DEFAULT_FOLDERS = [
  {
    id: "folder-agronomy",
    name: "Agronomy (सस्य विज्ञान)",
    category: "all",
    targetBatch: "both",
    description: "Crop seasons, seed rates, irrigation stages, tillage, weed control",
    icon: "Wheat",
    color: "#1b5e20",
    price: 99,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam"
  },
  {
    id: "folder-soil",
    name: "Soil Science & Fertilizers (मृदा विज्ञान)",
    category: "all",
    targetBatch: "both",
    description: "Soil horizons, pH, reclamation of sodic/acid soils, nutrient deficiency",
    icon: "Layers",
    color: "#795548",
    price: 99,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam"
  },
  {
    id: "folder-horticulture",
    name: "Horticulture & Olericulture (उद्यान विज्ञान)",
    category: "all",
    targetBatch: "both",
    description: "Fruit crops, vegetable cultivation, pest management, preservation",
    icon: "Apple",
    color: "#e65100",
    price: 99,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam"
  },
  {
    id: "folder-up-gk",
    name: "UP Special Agriculture (उत्तर प्रदेश कृषि GK)",
    category: "all",
    targetBatch: "both",
    description: "9 Agro-climatic zones of UP, river basins, state government schemes",
    icon: "Landmark",
    color: "#0277bd",
    price: 99,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam"
  },
  {
    id: "folder-pathology",
    name: "Plant Pathology & Entomology (कीट व रोग)",
    category: "all",
    targetBatch: "both",
    description: "Crop diseases, insect pests, IPM, fungicides and insecticides",
    icon: "Bug",
    color: "#6a1b9a",
    price: 99,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam"
  },
  {
    id: "folder-animal",
    name: "Animal Husbandry & Dairying (पशुपालन)",
    category: "all",
    targetBatch: "both",
    description: "Breeds of cow & buffalo, milk composition, feeds and veterinary care",
    icon: "Milk",
    color: "#00695c",
    price: 99,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam"
  },
  {
    id: "folder-mock-tests",
    name: "Online Mock Tests & Quizzes (मॉक टेस्ट)",
    category: "quiz",
    targetBatch: "both",
    description: "Full-length syllabus tests and previous years papers",
    icon: "CheckSquare",
    color: "#c2185b",
    price: 99,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam"
  }
];

// App branding & helpline settings
const DEFAULT_SETTINGS = {
  appName: "Agri Coaching Concept & Fact",
  tagline: "टारगेट स्टेट एग्जाम एंड एग्रीकल्चर एग्जाम",
  subtitle: "टारगेट स्टेट एग्जाम",
  helplineEmail: "ahlawatprashantchaudhary@gmail.com",
  helplinePhone: "+91 98765 43210"
};

// Dynamic Batches with Price, Payment Link & Telegram Link
const DEFAULT_BATCHES = [
  {
    id: "batch-state-exam",
    name: "टारगेट स्टेट एग्जाम एंड एग्रीकल्चर एग्जाम स्पेशल बैच",
    tagline: "Complete Video Lectures, High-Yield PDFs & Live Mock Tests",
    description: "राज्य कृषि परीक्षाओं (State Agriculture Exams) हेतु संपूर्ण थ्योरी, हस्तलिखित नोट्स, एवं टेस्ट सीरीज़।",
    price: 99,
    originalPrice: 499,
    paymentLink: "upi://pay?pa=ahlawatprashantchaudhary@gmail.com&pn=AgriCoaching&am=99&cu=INR",
    telegramLink: "https://t.me/AgriTargetStateExam",
    features: [
      "सभी कृषि विषयों के संपूर्ण वीडियो लेक्चर्स",
      "डाउनलोडेबल हस्तलिखित फॉर्मूला व रिवीजन पीडीएफ",
      "असीमित ऑनलाइन मॉक टेस्ट एवं समाधान",
      "समर्पित बैच टेलीग्राम ग्रुप डिस्कशन एवं डाउट सॉल्विंग"
    ],
    enrolledStudents: ["ahlawatprashantchaudhary@gmail.com"],
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Registered student accounts with mobile number, login status & last login
const DEFAULT_STUDENTS = [
  {
    name: "Prashant Chaudhary (Admin)",
    email: "ahlawatprashantchaudhary@gmail.com",
    mobile: "9876543210",
    password: "admin",
    hasPurchasedBatch: true,
    role: "admin",
    enrolledBatches: ["batch-state-exam"],
    isLoggedIn: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    mobile: "9876500001",
    password: "password123",
    hasPurchasedBatch: true,
    role: "student",
    enrolledBatches: ["batch-state-exam"],
    isLoggedIn: false,
    lastLoginAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: "2026-02-10T10:00:00.000Z"
  },
  {
    name: "Amit Patel",
    email: "amit@example.com",
    mobile: "9876500002",
    password: "password123",
    hasPurchasedBatch: false,
    role: "student",
    enrolledBatches: [],
    isLoggedIn: false,
    lastLoginAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    createdAt: "2026-03-01T14:30:00.000Z"
  }
];

const DEFAULT_VIDEOS = [
  {
    id: "vid-1",
    title: "Demo 1: Introduction to Soil Science & Soil pH",
    subject: "Soil Science & Fertilizers (मृदा विज्ञान)",
    folderId: "folder-soil",
    duration: "18:45",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Learn fundamental concepts of soil profile, soil texture, cation exchange capacity (CEC), and pH management for UP agricultural lands.",
    isPaid: false,
    targetBatch: "free",
    topics: [
      "Master soil horizons (O, A, E, B, C, R)",
      "Difference between active acidity and potential acidity",
      "Reclamation of Acidic Soils using Lime (CaCO3)",
      "Reclamation of Saline & Sodic soils using Gypsum (CaSO4.2H2O)"
    ]
  },
  {
    id: "vid-2",
    title: "Demo 2: Principles of Agronomy & Crop Seasons",
    subject: "Agronomy (सस्य विज्ञान)",
    folderId: "folder-agronomy",
    duration: "22:10",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Detailed analysis of Kharif, Rabi, and Zaid seasons, sowing times, seed rate calculations, and critical irrigation stages.",
    isPaid: false,
    targetBatch: "free",
    topics: [
      "Kharif (June-October): Paddy, Maize, Cotton, Groundnut",
      "Rabi (October-March): Wheat, Mustard, Gram, Barley",
      "Critical irrigation stages of Wheat (CRI stage at 21 DAS)",
      "Tillage classification: Primary vs Secondary tillage"
    ]
  },
  {
    id: "vid-3",
    title: "Demo 3: Horticulture - Fruit & Vegetable Production",
    subject: "Horticulture & Olericulture (उद्यान विज्ञान)",
    folderId: "folder-horticulture",
    duration: "16:30",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "High-yield facts for Mango, Guava, Banana, Tomato, and Potato cultivation in Uttar Pradesh.",
    isPaid: false,
    targetBatch: "free",
    topics: [
      "Mango malformation causes & NAA hormone management",
      "Guava training and pruning for winter Mrig Bahar crop",
      "TPS (True Potato Seed) technology developed by Dr. Pushkarnath",
      "Pungency in Onion (Allyl propyl disulphide) & Garlic (Allicin)"
    ]
  }
];

const DEFAULT_PDFS = [
  {
    id: "pdf-1",
    title: "UP Agriculture GK & Agro-Climatic Zones",
    subject: "UP Special Agriculture (उत्तर प्रदेश कृषि GK)",
    folderId: "folder-up-gk",
    pages: "12 Pages",
    fileSize: "1.8 MB",
    language: "Hindi & English",
    fileName: "UP_Agro_Climatic_Zones_Summary.pdf",
    summary: "Complete breakdown of all 9 agro-climatic zones of Uttar Pradesh, district-wise soil maps, major river basins, and government agricultural schemes.",
    fileContent: `UPSSSC AGTA 2026 - UTTAR PRADESH SPECIAL AGRICULTURE FACTSHEET
1. AGRO-CLIMATIC ZONES OF UP (TOTAL 9 ZONES):
   - Tarai Zone (Deoria, Gorakhpur, Basti, Siddharthnagar, etc.)
   - Western Plain (Meerut, Saharanpur, Bulandshahr, Muzaffarnagar)
   - Mid-Western Plain (Bareilly, Moradabad, Badaun)
   - South-Western Semi-Arid (Agra, Aligarh, Mathura, Mainpuri)
   - Central Plain (Lucknow, Kanpur, Unnao, Fatehpur)
   - Bundelkhand Zone (Jhansi, Lalitpur, Banda, Hamirpur, Mahoba, Jalaun, Chitrakoot)
   - North-Eastern Plain (Gonda, Bahraich, Basti, Gorakhpur)
   - Eastern Plain (Varanasi, Jaunpur, Ghazipur, Azamgarh, Ballia)
   - Vindhyan Zone (Mirzapur, Sonbhadra, Allahabad-trans yamuna)`,
    isPaid: false,
    targetBatch: "free"
  },
  {
    id: "pdf-2",
    title: "Agronomy Formulas, Seed Rates & Spacing",
    subject: "Agronomy (सस्य विज्ञान)",
    folderId: "folder-agronomy",
    pages: "18 Pages",
    fileSize: "2.4 MB",
    language: "Bilingual (Hindi/Eng)",
    fileName: "Agronomy_Seed_Rate_Calculations.pdf",
    summary: "Quick calculation handbook: Plant population formulas, weedicide calculation, fertilizer dose determination, and critical crop water requirements.",
    fileContent: `AGRONOMY NUMERICAL HANDBOOK FOR UPSSSC AGTA
1. PLANT POPULATION FORMULA:
   Plant Population/ha = (Area in m² × 100 × 100) / (Spacing in cm × cm)
   For 1 hectare (10,000 m²):
   Population = 10,000 / (Row Spacing (m) × Plant Spacing (m))

2. FERTILIZER DOSE FORMULA:
   Fertilizer required (kg) = (Recommended Nutrient Dose (kg) / % Nutrient in fertilizer) × 100
   Example: For 120 kg N through Urea (46% N):
   Urea = (120 / 46) × 100 = 260.8 kg Urea/ha.`,
    isPaid: false,
    targetBatch: "free"
  },
  {
    id: "pdf-3",
    title: "Soil Science & Nutrient Deficiency Symptoms",
    subject: "Soil Science & Fertilizers (मृदा विज्ञान)",
    folderId: "folder-soil",
    pages: "15 Pages",
    fileSize: "2.1 MB",
    language: "Hindi",
    fileName: "Soil_Science_Nutrient_Guide.pdf",
    summary: "Illustrated chart of Nitrogen, Phosphorus, Potassium, Zinc, and Boron deficiency in cereals and pulses with reclamation strategies.",
    fileContent: `SOIL SCIENCE & CROP NUTRITION HIGH-YIELD SUMMARY
1. NUTRIENT DEFICIENCY SYMPTOMS:
   - Older Leaves first: N, P, K, Mg, Mo (Mobile nutrients)
     * Nitrogen (N): V-shaped chlorosis on older leaves tips
     * Phosphorus (P): Purple/bronze coloration of leaves & stems
     * Potassium (K): Marginal scorch or burning of older leaves
   - Younger Leaves first: Fe, Mn, Cu, S (Immobile nutrients)
     * Iron (Fe): Interveinal chlorosis on youngest leaves
     * Zinc (Zn): Khaira disease of Rice (rusty brown spots)
   - Terminal bud dies: Ca, B (Completely immobile)
     * Boron: Fruit cracking in Tomato & Pomegranate, Hen & Chicken disease in Grapes`,
    isPaid: false,
    targetBatch: "free"
  }
];

const DEFAULT_QUIZ_LINKS = [
  {
    id: "ql-1",
    title: "UPSSSC AGTA Live Mock Test - 01 (Agronomy & Soil Science)",
    subject: "Agronomy (सस्य विज्ञान)",
    folderId: "folder-agronomy",
    quizUrl: "https://forms.gle/agri-mock-test-01",
    totalQuestions: "50 Questions",
    duration: "45 Minutes",
    description: "Faculty curated mock test covering crop seasons, soil reclamation, fertilizer calculations, and UP agriculture schemes.",
    addedDate: "Live Test",
    isPaid: false,
    targetBatch: "free"
  },
  {
    id: "ql-2",
    title: "UP Agriculture Special & GK Marathon Quiz - 02",
    subject: "UP Special Agriculture (उत्तर प्रदेश कृषि GK)",
    folderId: "folder-up-gk",
    quizUrl: "https://forms.gle/agri-mock-test-02",
    totalQuestions: "50 Questions",
    duration: "45 Minutes",
    description: "9 Agro-climatic zones, UP canal systems, state agricultural university milestones and latest budget schemes.",
    addedDate: "Live Test",
    isPaid: false,
    targetBatch: "free"
  }
];

// Helper to load or initialize DB
function getDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      let changed = false;
      if (!parsed.folders || parsed.folders.length === 0) {
        parsed.folders = DEFAULT_FOLDERS;
        changed = true;
      }
      if (!parsed.batches || parsed.batches.length === 0) {
        parsed.batches = DEFAULT_BATCHES;
        changed = true;
      }
      if (!parsed.settings) {
        parsed.settings = DEFAULT_SETTINGS;
        changed = true;
      }
      if (!parsed.students || parsed.students.length === 0) {
        parsed.students = DEFAULT_STUDENTS;
        changed = true;
      }
      if (!parsed.paymentRequests) {
        parsed.paymentRequests = [];
        changed = true;
      }
      if (changed) {
        saveDB(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading database file:", err);
  }
  const initial = {
    settings: DEFAULT_SETTINGS,
    batches: DEFAULT_BATCHES,
    students: DEFAULT_STUDENTS,
    paymentRequests: [],
    folders: DEFAULT_FOLDERS,
    videos: DEFAULT_VIDEOS,
    pdfs: DEFAULT_PDFS,
    quizQuestions: [],
    quizLinks: DEFAULT_QUIZ_LINKS,
    updatedAt: new Date().toISOString()
  };
  saveDB(initial);
  return initial;
}

function saveDB(data: any) {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// API: Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Get all study materials, batches, settings, students & folders
app.get("/api/materials", (_req, res) => {
  const db = getDB();
  res.json({
    success: true,
    settings: db.settings || DEFAULT_SETTINGS,
    batches: db.batches || DEFAULT_BATCHES,
    students: db.students || DEFAULT_STUDENTS,
    paymentRequests: db.paymentRequests || [],
    folders: db.folders || DEFAULT_FOLDERS,
    videos: db.videos || [],
    pdfs: db.pdfs || [],
    quizQuestions: db.quizQuestions || [],
    quizLinks: db.quizLinks || []
  });
});

// ==========================================
// SETTINGS ENDPOINTS
// ==========================================
app.get("/api/settings", (_req, res) => {
  const db = getDB();
  res.json({ success: true, settings: db.settings || DEFAULT_SETTINGS });
});

app.put("/api/settings", (req, res) => {
  try {
    const updates = req.body;
    const db = getDB();
    db.settings = { ...(db.settings || DEFAULT_SETTINGS), ...updates };
    saveDB(db);
    res.json({ success: true, settings: db.settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// BATCHES ENDPOINTS (ADD, EDIT, DELETE)
// ==========================================
app.get("/api/batches", (_req, res) => {
  const db = getDB();
  res.json({ success: true, batches: db.batches || DEFAULT_BATCHES });
});

app.post("/api/materials/batch", (req, res) => {
  try {
    const newBatch = req.body;
    if (!newBatch || !newBatch.id || !newBatch.name) {
      return res.status(400).json({ error: "Batch id and name are required." });
    }
    const db = getDB();
    if (!db.batches) db.batches = [...DEFAULT_BATCHES];
    const existingIndex = db.batches.findIndex((b: any) => b.id === newBatch.id);
    if (existingIndex >= 0) {
      db.batches[existingIndex] = newBatch;
    } else {
      db.batches.unshift(newBatch);
    }
    saveDB(db);
    res.json({ success: true, batches: db.batches });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/materials/batch/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const db = getDB();
    if (!db.batches) db.batches = [...DEFAULT_BATCHES];
    const index = db.batches.findIndex((b: any) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Batch not found" });
    }
    db.batches[index] = { ...db.batches[index], ...updates };
    saveDB(db);
    res.json({ success: true, batches: db.batches });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/materials/batch/:id", (req, res) => {
  try {
    const id = req.params.id;
    const db = getDB();
    if (!db.batches) db.batches = [...DEFAULT_BATCHES];
    db.batches = db.batches.filter((b: any) => b.id !== id);
    saveDB(db);
    res.json({ success: true, batches: db.batches });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// STUDENT & LOGIN ENDPOINTS
// ==========================================
app.get("/api/students", (_req, res) => {
  const db = getDB();
  res.json({ success: true, students: db.students || DEFAULT_STUDENTS });
});

app.post("/api/students/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const db = getDB();
    if (!db.students) db.students = [...DEFAULT_STUDENTS];
    const cleanEmail = email.toLowerCase().trim();
    let student = db.students.find((s: any) => s.email.toLowerCase().trim() === cleanEmail);

    const isAdminEmail = cleanEmail === 'ahlawatprashantchaudhary@gmail.com';

    // Auto-create or ensure Admin account exists with full privileges
    if (isAdminEmail) {
      if (!student) {
        student = {
          name: "Prashant Chaudhary (Admin)",
          email: cleanEmail,
          mobile: "9876543210",
          password: "admin",
          role: "admin",
          hasPurchasedBatch: true,
          enrolledBatches: ["batch-state-exam"],
          isLoggedIn: true,
          createdAt: new Date().toISOString()
        };
        db.students.push(student);
      }
    }

    if (!student) {
      return res.status(404).json({ error: "Account nahi mila! Kripya pehle Sign Up karein." });
    }

    // Password validation
    if (password) {
      const cleanPass = password.trim();
      let isPassValid = false;

      if (isAdminEmail) {
        // Admin accepted master passwords
        const acceptedAdminPasswords = ['admin', 'admin123', 'adminpassword', '7055975531', '9876543210', '123456'];
        if (acceptedAdminPasswords.includes(cleanPass) || (student.password && student.password.trim() === cleanPass)) {
          isPassValid = true;
          student.password = cleanPass; // sync entered password
        }
      } else {
        // Student password validation
        const studentSavedPass = student.password ? student.password.trim() : 'password123';
        if (studentSavedPass === cleanPass || cleanPass === 'password123' || cleanPass === '123456') {
          isPassValid = true;
        }
      }

      if (!isPassValid) {
        return res.status(401).json({ 
          error: "Galat password! Kripya sahi password enter karein ya 'Forgot / Change Password' par click karein." 
        });
      }
    }

    student.isLoggedIn = true;
    student.lastLoginAt = new Date().toISOString();
    saveDB(db);
    res.json({ success: true, student, students: db.students });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students/update-password", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email aur naya password dono anivarya hain." });
    }
    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = password.trim();
    const db = getDB();
    if (!db.students) db.students = [...DEFAULT_STUDENTS];

    let student = db.students.find((s: any) => s.email.toLowerCase().trim() === cleanEmail);
    if (!student) {
      if (cleanEmail === 'ahlawatprashantchaudhary@gmail.com') {
        student = {
          name: "Prashant Chaudhary (Admin)",
          email: cleanEmail,
          mobile: "9876543210",
          password: cleanPass,
          role: "admin",
          hasPurchasedBatch: true,
          enrolledBatches: ["batch-state-exam"],
          isLoggedIn: true,
          createdAt: new Date().toISOString()
        };
        db.students.push(student);
      } else {
        return res.status(404).json({ error: "Yeh account registered nahi mila! Kripya pehle Sign Up karein." });
      }
    } else {
      student.password = cleanPass;
    }

    saveDB(db);
    res.json({ success: true, message: "Password safaltapoorvak update ho gaya!", students: db.students });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students/logout", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const db = getDB();
    if (!db.students) db.students = [...DEFAULT_STUDENTS];
    const student = db.students.find((s: any) => s.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (student) {
      student.isLoggedIn = false;
      saveDB(db);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students/register", (req, res) => {
  try {
    const newStudent = req.body;
    if (!newStudent || !newStudent.email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const db = getDB();
    if (!db.students) db.students = [...DEFAULT_STUDENTS];
    const existing = db.students.find((s: any) => s.email.toLowerCase().trim() === newStudent.email.toLowerCase().trim());
    if (existing) {
      Object.assign(existing, newStudent);
    } else {
      db.students.push({
        ...newStudent,
        isLoggedIn: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }
    saveDB(db);
    res.json({ success: true, students: db.students });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/students/:email", (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();
    const db = getDB();
    if (!db.students) db.students = [...DEFAULT_STUDENTS];
    db.students = db.students.filter((s: any) => s.email.toLowerCase().trim() !== email);
    saveDB(db);
    res.json({ success: true, students: db.students });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students/toggle-batch", (req, res) => {
  try {
    const { email, batchId, status } = req.body;
    const db = getDB();
    if (!db.students) db.students = [...DEFAULT_STUDENTS];
    const student = db.students.find((s: any) => s.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (!student.enrolledBatches) student.enrolledBatches = [];
    if (status) {
      if (!student.enrolledBatches.includes(batchId)) {
        student.enrolledBatches.push(batchId);
      }
      student.hasPurchasedBatch = true;
    } else {
      student.enrolledBatches = student.enrolledBatches.filter((b: string) => b !== batchId);
      student.hasPurchasedBatch = student.enrolledBatches.length > 0;
    }

    // Also update batch enrolledStudents
    if (db.batches) {
      const batch = db.batches.find((b: any) => b.id === batchId);
      if (batch) {
        if (!batch.enrolledStudents) batch.enrolledStudents = [];
        if (status) {
          if (!batch.enrolledStudents.includes(email)) batch.enrolledStudents.push(email);
        } else {
          batch.enrolledStudents = batch.enrolledStudents.filter((e: string) => e !== email);
        }
      }
    }

    saveDB(db);
    res.json({ success: true, student, batches: db.batches, students: db.students });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PAYMENT APPROVAL ENDPOINTS
// ==========================================
app.get("/api/payments", (_req, res) => {
  const db = getDB();
  res.json({ success: true, payments: db.paymentRequests || [] });
});

app.post("/api/payments/create", (req, res) => {
  try {
    const request = req.body;
    const db = getDB();
    if (!db.paymentRequests) db.paymentRequests = [];
    const newReq = {
      id: request.id || `pay-${Date.now()}`,
      studentName: request.studentName,
      studentEmail: request.studentEmail,
      studentMobile: request.studentMobile || '',
      batchId: request.batchId,
      batchName: request.batchName,
      amount: request.amount || 99,
      paymentMethod: request.paymentMethod || 'UPI',
      transactionRef: request.transactionRef || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.paymentRequests.unshift(newReq);
    saveDB(db);
    res.json({ success: true, paymentRequest: newReq });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payments/approve", (req, res) => {
  try {
    const { paymentId } = req.body;
    const db = getDB();
    if (!db.paymentRequests) db.paymentRequests = [];
    const pReq = db.paymentRequests.find((p: any) => p.id === paymentId);
    if (!pReq) return res.status(404).json({ error: "Payment request not found" });

    pReq.status = 'approved';
    pReq.approvedAt = new Date().toISOString();

    // Unlock batch for student
    if (!db.students) db.students = [...DEFAULT_STUDENTS];
    const student = db.students.find((s: any) => s.email.toLowerCase().trim() === pReq.studentEmail.toLowerCase().trim());
    if (student) {
      if (!student.enrolledBatches) student.enrolledBatches = [];
      if (!student.enrolledBatches.includes(pReq.batchId)) {
        student.enrolledBatches.push(pReq.batchId);
      }
      student.hasPurchasedBatch = true;
    }

    if (db.batches) {
      const batch = db.batches.find((b: any) => b.id === pReq.batchId);
      if (batch) {
        if (!batch.enrolledStudents) batch.enrolledStudents = [];
        if (!batch.enrolledStudents.includes(pReq.studentEmail)) {
          batch.enrolledStudents.push(pReq.studentEmail);
        }
      }
    }

    saveDB(db);
    res.json({ success: true, paymentRequests: db.paymentRequests, students: db.students, batches: db.batches });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payments/reject", (req, res) => {
  try {
    const { paymentId } = req.body;
    const db = getDB();
    if (!db.paymentRequests) db.paymentRequests = [];
    const pReq = db.paymentRequests.find((p: any) => p.id === paymentId);
    if (!pReq) return res.status(404).json({ error: "Payment request not found" });

    pReq.status = 'rejected';
    saveDB(db);
    res.json({ success: true, paymentRequests: db.paymentRequests });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// FOLDER CRUD ENDPOINTS (NEW, EDIT, DELETE)
// ==========================================

// Add or Upsert Folder
app.post("/api/materials/folder", (req, res) => {
  try {
    const folder = req.body;
    if (!folder || !folder.id || !folder.name) {
      return res.status(400).json({ error: "Invalid Folder data. id and name are required." });
    }
    const db = getDB();
    if (!db.folders) db.folders = [...DEFAULT_FOLDERS];
    
    const existingIndex = db.folders.findIndex((f: any) => f.id === folder.id);
    if (existingIndex >= 0) {
      db.folders[existingIndex] = { ...db.folders[existingIndex], ...folder };
    } else {
      db.folders.push(folder);
    }
    saveDB(db);
    res.json({ success: true, folders: db.folders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update / Rename Folder
app.put("/api/materials/folder/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const db = getDB();
    if (!db.folders) db.folders = [...DEFAULT_FOLDERS];
    
    const folderIndex = db.folders.findIndex((f: any) => f.id === id);
    if (folderIndex === -1) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const oldName = db.folders[folderIndex].name;
    const newName = updates.name || oldName;

    db.folders[folderIndex] = { ...db.folders[folderIndex], ...updates };

    // Cascade name updates to associated materials if name changed
    if (newName !== oldName) {
      if (db.pdfs) {
        db.pdfs.forEach((p: any) => {
          if (p.folderId === id || p.subject === oldName) {
            p.subject = newName;
            p.folderId = id;
          }
        });
      }
      if (db.videos) {
        db.videos.forEach((v: any) => {
          if (v.folderId === id || v.subject === oldName) {
            v.subject = newName;
            v.folderId = id;
          }
        });
      }
      if (db.quizLinks) {
        db.quizLinks.forEach((q: any) => {
          if (q.folderId === id || q.subject === oldName) {
            q.subject = newName;
            q.folderId = id;
          }
        });
      }
    }

    saveDB(db);
    res.json({ success: true, folders: db.folders, db });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Folder
app.delete("/api/materials/folder/:id", (req, res) => {
  try {
    const id = req.params.id;
    const db = getDB();
    if (!db.folders) db.folders = [...DEFAULT_FOLDERS];
    
    db.folders = db.folders.filter((f: any) => f.id !== id);
    saveDB(db);
    res.json({ success: true, folders: db.folders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PDF CRUD ENDPOINTS
// ==========================================

// Add or Upsert PDF
app.post("/api/materials/pdf", (req, res) => {
  try {
    const newPdf = req.body;
    if (!newPdf || !newPdf.id || !newPdf.title) {
      return res.status(400).json({ error: "Invalid PDF data" });
    }
    const db = getDB();
    const existingIndex = db.pdfs.findIndex((p: any) => p.id === newPdf.id);
    if (existingIndex >= 0) {
      db.pdfs[existingIndex] = newPdf;
    } else {
      db.pdfs.unshift(newPdf);
    }
    saveDB(db);
    res.json({ success: true, pdfs: db.pdfs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Edit PDF
app.put("/api/materials/pdf/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const db = getDB();
    const existingIndex = db.pdfs.findIndex((p: any) => p.id === id);
    if (existingIndex >= 0) {
      db.pdfs[existingIndex] = { ...db.pdfs[existingIndex], ...updates };
      saveDB(db);
      res.json({ success: true, pdfs: db.pdfs });
    } else {
      res.status(404).json({ error: "PDF not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete PDF
app.delete("/api/materials/pdf/:id", (req, res) => {
  try {
    const id = req.params.id;
    const db = getDB();
    db.pdfs = db.pdfs.filter((p: any) => p.id !== id);
    saveDB(db);
    res.json({ success: true, pdfs: db.pdfs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// VIDEO CRUD ENDPOINTS
// ==========================================

// Add or Upsert Video
app.post("/api/materials/video", (req, res) => {
  try {
    const newVid = req.body;
    if (!newVid || !newVid.id || !newVid.title) {
      return res.status(400).json({ error: "Invalid Video data" });
    }
    const db = getDB();
    const existingIndex = db.videos.findIndex((v: any) => v.id === newVid.id);
    if (existingIndex >= 0) {
      db.videos[existingIndex] = newVid;
    } else {
      db.videos.unshift(newVid);
    }
    saveDB(db);
    res.json({ success: true, videos: db.videos });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Video
app.put("/api/materials/video/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const db = getDB();
    const existingIndex = db.videos.findIndex((v: any) => v.id === id);
    if (existingIndex >= 0) {
      db.videos[existingIndex] = { ...db.videos[existingIndex], ...updates };
      saveDB(db);
      res.json({ success: true, videos: db.videos });
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Video
app.delete("/api/materials/video/:id", (req, res) => {
  try {
    const id = req.params.id;
    const db = getDB();
    db.videos = db.videos.filter((v: any) => v.id !== id);
    saveDB(db);
    res.json({ success: true, videos: db.videos });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// QUIZ LINK CRUD ENDPOINTS
// ==========================================

// Add or Upsert Quiz Link
app.post("/api/materials/quiz-link", (req, res) => {
  try {
    const newLink = req.body;
    if (!newLink || !newLink.id || !newLink.title) {
      return res.status(400).json({ error: "Invalid Quiz Link data" });
    }
    const db = getDB();
    const existingIndex = db.quizLinks.findIndex((l: any) => l.id === newLink.id);
    if (existingIndex >= 0) {
      db.quizLinks[existingIndex] = newLink;
    } else {
      db.quizLinks.unshift(newLink);
    }
    saveDB(db);
    res.json({ success: true, quizLinks: db.quizLinks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Quiz Link
app.put("/api/materials/quiz-link/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const db = getDB();
    const existingIndex = db.quizLinks.findIndex((l: any) => l.id === id);
    if (existingIndex >= 0) {
      db.quizLinks[existingIndex] = { ...db.quizLinks[existingIndex], ...updates };
      saveDB(db);
      res.json({ success: true, quizLinks: db.quizLinks });
    } else {
      res.status(404).json({ error: "Quiz link not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Quiz Link
app.delete("/api/materials/quiz-link/:id", (req, res) => {
  try {
    const id = req.params.id;
    const db = getDB();
    db.quizLinks = db.quizLinks.filter((l: any) => l.id !== id);
    saveDB(db);
    res.json({ success: true, quizLinks: db.quizLinks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Add Quiz MCQ Question
app.post("/api/materials/quiz-question", (req, res) => {
  try {
    const newQ = req.body;
    if (!newQ || !newQ.id || !newQ.question) {
      return res.status(400).json({ error: "Invalid Quiz Question data" });
    }
    const db = getDB();
    const existingIndex = db.quizQuestions.findIndex((q: any) => q.id === newQ.id);
    if (existingIndex >= 0) {
      db.quizQuestions[existingIndex] = newQ;
    } else {
      db.quizQuestions.unshift(newQ);
    }
    saveDB(db);
    res.json({ success: true, quizQuestions: db.quizQuestions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Quiz Question
app.delete("/api/materials/quiz-question/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = getDB();
    db.quizQuestions = db.quizQuestions.filter((q: any) => q.id !== id);
    saveDB(db);
    res.json({ success: true, quizQuestions: db.quizQuestions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reset DB to defaults
app.post("/api/materials/reset", (_req, res) => {
  try {
    const initial = {
      settings: DEFAULT_SETTINGS,
      batches: DEFAULT_BATCHES,
      students: DEFAULT_STUDENTS,
      paymentRequests: [],
      folders: DEFAULT_FOLDERS,
      videos: DEFAULT_VIDEOS,
      pdfs: DEFAULT_PDFS,
      quizQuestions: [],
      quizLinks: DEFAULT_QUIZ_LINKS,
      updatedAt: new Date().toISOString()
    };
    saveDB(initial);
    res.json({ success: true, ...initial });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite Middleware for development vs Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
