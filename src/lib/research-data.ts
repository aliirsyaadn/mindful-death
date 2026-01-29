// Data berdasarkan BPS (Badan Pusat Statistik) Indonesia 2023
// dan WHO Global Health Observatory

export const INDONESIA_LIFE_EXPECTANCY = {
  // Angka Harapan Hidup (AHH) Indonesia 2023
  overall: 71.85,
  male: 69.9,
  female: 73.8,

  // Sumber: BPS Indonesia
  source: "Badan Pusat Statistik Indonesia, 2023",
  sourceUrl: "https://www.bps.go.id/id/statistics-table/2/NDk3IzI=/angka-harapan-hidup--ahh--menurut-provinsi-dan-jenis-kelamin.html",
  whoSource: "WHO Global Health Observatory, 2023",
  whoSourceUrl: "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/life-expectancy-at-birth-(years)",
};

// Usia pensiun di Indonesia
export const RETIREMENT_AGE = {
  normal: 58, // Pensiun normal
  early: 55,  // Pensiun dini
  extended: 60, // Pensiun diperpanjang (ASN)
};

// Faktor penyesuaian berdasarkan penelitian
export const LIFESTYLE_FACTORS = {
  smoking: {
    never: 0,
    former: -3.5, // Mantan perokok kehilangan ~3.5 tahun
    light: -5,    // Perokok ringan
    heavy: -10,   // Perokok berat kehilangan ~10 tahun
    source: "Global Burden of Disease Study 2019",
  },
  exercise: {
    sedentary: -3,    // Tidak aktif
    light: -1,        // Aktivitas ringan
    moderate: 0,      // Aktivitas sedang
    active: 2,        // Aktif
    veryActive: 3.5,  // Sangat aktif (+3.5 tahun)
    source: "British Journal of Sports Medicine, 2020",
  },
  bmi: {
    underweight: -2,
    normal: 0,
    overweight: -2,
    obese: -5,
    source: "Lancet Global Health, 2019",
  },
  sleep: {
    poor: -3,      // <5 jam
    fair: -1,      // 5-6 jam
    good: 0,       // 7-8 jam
    excessive: -1, // >9 jam
    source: "European Heart Journal, 2018",
  },
  stress: {
    low: 1,
    moderate: 0,
    high: -2,
    chronic: -4,
    source: "JAMA Internal Medicine, 2020",
  },
  diet: {
    poor: -3,
    average: 0,
    healthy: 2,
    optimal: 4, // Diet mediterania/plant-based
    source: "NEJM, 2018",
  },
  alcohol: {
    never: 0,
    moderate: 0,
    heavy: -5,
    source: "Lancet, 2018",
  },
  socialConnection: {
    isolated: -5,
    limited: -2,
    moderate: 0,
    strong: 3,
    source: "PLOS Medicine, 2010",
  },
};

// Penyebab kematian utama di Indonesia (IHME GBD 2019)
export const TOP_CAUSES_OF_DEATH_INDONESIA = [
  { cause: "Stroke", percentage: 19.2 },
  { cause: "Penyakit Jantung Iskemik", percentage: 16.3 },
  { cause: "Diabetes Mellitus", percentage: 7.9 },
  { cause: "TBC", percentage: 5.4 },
  { cause: "Penyakit Ginjal Kronis", percentage: 3.8 },
  { cause: "PPOK", percentage: 3.4 },
  { cause: "Kecelakaan Lalu Lintas", percentage: 2.9 },
  { cause: "Hipertensi", percentage: 2.8 },
  { cause: "Kanker Paru", percentage: 2.4 },
  { cause: "Sirosis Hati", percentage: 2.1 },
];

export const TOP_CAUSES_SOURCE = {
  name: "Institute for Health Metrics and Evaluation (IHME), Global Burden of Disease 2019",
  url: "https://vizhub.healthdata.org/gbd-results/",
};

// Statistik harapan hidup per provinsi (BPS 2023)
export const LIFE_EXPECTANCY_BY_PROVINCE = [
  { province: "DI Yogyakarta", lifeExpectancy: 75.48 },
  { province: "Kalimantan Timur", lifeExpectancy: 75.05 },
  { province: "Jawa Tengah", lifeExpectancy: 74.23 },
  { province: "DKI Jakarta", lifeExpectancy: 74.02 },
  { province: "Jawa Barat", lifeExpectancy: 73.25 },
  { province: "Riau", lifeExpectancy: 72.71 },
  { province: "Bali", lifeExpectancy: 72.33 },
  { province: "Sulawesi Utara", lifeExpectancy: 72.12 },
  { province: "Jawa Timur", lifeExpectancy: 71.77 },
  { province: "Sumatera Barat", lifeExpectancy: 70.56 },
  { province: "Sumatera Utara", lifeExpectancy: 69.44 },
  { province: "Kalimantan Selatan", lifeExpectancy: 68.79 },
  { province: "Nusa Tenggara Barat", lifeExpectancy: 67.81 },
  { province: "Nusa Tenggara Timur", lifeExpectancy: 66.71 },
  { province: "Papua Barat", lifeExpectancy: 66.49 },
  { province: "Papua", lifeExpectancy: 66.02 },
];

// Fakta menarik untuk ditampilkan
export const LIFE_FACTS = [
  {
    fact: "Orang Indonesia rata-rata menghabiskan 26.280 hari (72 tahun) untuk hidup",
    source: "BPS 2023",
    url: "https://www.bps.go.id/id/statistics-table/2/NDk3IzI=/angka-harapan-hidup--ahh--menurut-provinsi-dan-jenis-kelamin.html",
  },
  {
    fact: "Wanita Indonesia hidup rata-rata 4 tahun lebih lama dari pria",
    source: "WHO 2023",
    url: "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/life-expectancy-at-birth-(years)",
  },
  {
    fact: "Olahraga teratur dapat menambah 3-7 tahun harapan hidup",
    source: "British Journal of Sports Medicine",
    url: "https://bjsm.bmj.com/content/54/24/1499",
  },
  {
    fact: "Merokok mengurangi harapan hidup rata-rata 10 tahun",
    source: "Global Burden of Disease Study",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30752-2/fulltext",
  },
  {
    fact: "Hubungan sosial yang kuat dapat menambah hingga 5 tahun harapan hidup",
    source: "PLOS Medicine",
    url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1000316",
  },
  {
    fact: "Tidur 7-8 jam per malam dikaitkan dengan umur panjang optimal",
    source: "European Heart Journal",
    url: "https://academic.oup.com/eurheartj/article/39/30/2753/5070475",
  },
  {
    fact: "Yogyakarta memiliki harapan hidup tertinggi di Indonesia: 75.48 tahun",
    source: "BPS 2023",
    url: "https://www.bps.go.id/id/statistics-table/2/NDk3IzI=/angka-harapan-hidup--ahh--menurut-provinsi-dan-jenis-kelamin.html",
  },
];

// Milestone kehidupan khas Indonesia
export const LIFE_MILESTONES_ID = [
  { age: 0, labelKey: "born", icon: "baby" },
  { age: 6, labelKey: "enterElementary", icon: "school" },
  { age: 12, labelKey: "enterMiddleSchool", icon: "school" },
  { age: 15, labelKey: "enterHighSchool", icon: "school" },
  { age: 18, labelKey: "graduateHighSchool", icon: "graduation" },
  { age: 22, labelKey: "graduateCollege", icon: "graduation" },
  { age: 25, labelKey: "averageMarriageAge", icon: "heart" },
  { age: 27, labelKey: "averageFirstChild", icon: "baby" },
  { age: 40, labelKey: "middleAge", icon: "milestone" },
  { age: 55, labelKey: "earlyRetirement", icon: "retirement" },
  { age: 58, labelKey: "normalRetirement", icon: "retirement" },
  { age: 60, labelKey: "senior", icon: "elderly" },
  { age: 72, labelKey: "avgLifeExpectancy", icon: "flag" },
];

// Kategori goal
import type { GoalCategory } from "@/types";

export const GOAL_CATEGORIES: { id: GoalCategory; label: string; icon: string }[] = [
  { id: "karir", label: "Karir", icon: "💼" },
  { id: "keluarga", label: "Keluarga", icon: "👨‍👩‍👧‍👦" },
  { id: "kesehatan", label: "Kesehatan", icon: "🏃" },
  { id: "keuangan", label: "Keuangan", icon: "💰" },
  { id: "spiritual", label: "Spiritual", icon: "🙏" },
  { id: "pendidikan", label: "Pendidikan", icon: "📚" },
  { id: "pengalaman", label: "Pengalaman", icon: "✈️" },
  { id: "warisan", label: "Warisan", icon: "🌟" },
];

// Perbandingan harapan hidup di Asia
export const ASIA_COMPARISON = [
  { country: "Jepang", lifeExpectancy: 84.3 },
  { country: "Singapura", lifeExpectancy: 83.9 },
  { country: "Korea Selatan", lifeExpectancy: 83.6 },
  { country: "Malaysia", lifeExpectancy: 76.2 },
  { country: "Thailand", lifeExpectancy: 75.3 },
  { country: "Vietnam", lifeExpectancy: 73.6 },
  { country: "Indonesia", lifeExpectancy: 71.85 },
  { country: "Filipina", lifeExpectancy: 71.2 },
  { country: "India", lifeExpectancy: 70.4 },
  { country: "Myanmar", lifeExpectancy: 67.1 },
];

export const ASIA_COMPARISON_SOURCE = {
  name: "WHO Global Health Observatory 2023",
  url: "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/life-expectancy-at-birth-(years)",
};

// Faktor penyesuaian gaya hidup (untuk tampilan di research page)
export const LIFESTYLE_ADJUSTMENT_FACTORS = [
  {
    factor: "Olahraga teratur (150 menit/minggu)",
    impact: 3.5,
    source: "British Journal of Sports Medicine, 2020",
    url: "https://bjsm.bmj.com/content/54/24/1499"
  },
  {
    factor: "Diet sehat (mediterania/plant-based)",
    impact: 4,
    source: "New England Journal of Medicine, 2018",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1800389"
  },
  {
    factor: "Hubungan sosial yang kuat",
    impact: 3,
    source: "PLOS Medicine, 2010",
    url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1000316"
  },
  {
    factor: "Tidak merokok",
    impact: 0,
    source: "Global Burden of Disease Study 2019",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30752-2/fulltext"
  },
  {
    factor: "Tidur 7-8 jam/malam",
    impact: 0,
    source: "European Heart Journal, 2018",
    url: "https://academic.oup.com/eurheartj/article/39/30/2753/5070475"
  },
  {
    factor: "Stres rendah",
    impact: 1,
    source: "JAMA Internal Medicine, 2020",
    url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2763939"
  },
  {
    factor: "Merokok berat",
    impact: -10,
    source: "Global Burden of Disease Study 2019",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30752-2/fulltext"
  },
  {
    factor: "Tidak berolahraga",
    impact: -3,
    source: "British Journal of Sports Medicine, 2020",
    url: "https://bjsm.bmj.com/content/54/24/1499"
  },
  {
    factor: "Obesitas",
    impact: -5,
    source: "Lancet Global Health, 2019",
    url: "https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(18)30497-4/fulltext"
  },
  {
    factor: "Alkohol berlebihan",
    impact: -5,
    source: "The Lancet, 2018",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)31310-2/fulltext"
  },
  {
    factor: "Isolasi sosial",
    impact: -5,
    source: "PLOS Medicine, 2010",
    url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1000316"
  },
];
