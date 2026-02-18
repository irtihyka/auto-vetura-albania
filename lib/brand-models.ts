/**
 * Comprehensive mapping of car brands to their popular models
 * Used across create-listing, landing page search bar, and search page filters
 */
export const brandModels: Record<string, string[]> = {
  "Audi": [
    "A1", "A3", "A4", "A5", "A6", "A7", "A8",
    "Q2", "Q3", "Q5", "Q7", "Q8",
    "TT", "e-tron", "RS3", "RS4", "RS5", "RS6", "S3", "S4", "S5",
  ],
  "BMW": [
    "Seria 1", "Seria 2", "Seria 3", "Seria 4", "Seria 5", "Seria 6", "Seria 7", "Seria 8",
    "X1", "X2", "X3", "X4", "X5", "X6", "X7",
    "Z4", "i3", "i4", "iX", "M3", "M4", "M5",
  ],
  "Citroën": [
    "C1", "C3", "C3 Aircross", "C4", "C4 Cactus", "C5", "C5 Aircross",
    "Berlingo", "DS3", "DS4", "DS5", "DS7", "Jumpy", "Nemo",
  ],
  "Dacia": [
    "Duster", "Logan", "Sandero", "Sandero Stepway", "Lodgy", "Dokker", "Spring", "Jogger",
  ],
  "Fiat": [
    "500", "500L", "500X", "Panda", "Punto", "Punto Evo", "Tipo",
    "Bravo", "Doblo", "Fiorino", "Linea", "Qubo", "Stilo",
  ],
  "Ford": [
    "Fiesta", "Focus", "Mondeo", "Kuga", "EcoSport", "Puma", "Galaxy",
    "C-Max", "S-Max", "Ranger", "Transit", "Mustang", "Edge", "Explorer",
  ],
  "Honda": [
    "Civic", "Accord", "CR-V", "HR-V", "Jazz", "City",
    "CR-Z", "Insight", "Legend", "e:Ny1",
  ],
  "Hyundai": [
    "i10", "i20", "i30", "i40", "Accent", "Elantra", "Sonata",
    "Tucson", "Santa Fe", "Kona", "Bayon", "ix20", "ix35", "Ioniq",
  ],
  "Kia": [
    "Picanto", "Rio", "Ceed", "Cerato", "Optima", "Stinger",
    "Sportage", "Sorento", "Niro", "Stonic", "XCeed", "EV6", "Carnival",
  ],
  "Mazda": [
    "2", "3", "6", "CX-3", "CX-5", "CX-30", "CX-60",
    "MX-5", "MX-30", "RX-8",
  ],
  "Mercedes-Benz": [
    "A-Class", "B-Class", "C-Class", "E-Class", "S-Class",
    "CLA", "CLS", "CLK",
    "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class",
    "ML", "Vito", "Sprinter", "SLK", "SL", "AMG GT",
  ],
  "Nissan": [
    "Micra", "Note", "Juke", "Qashqai", "X-Trail", "Leaf",
    "Navara", "Pathfinder", "Pulsar", "Almera", "Primera", "Tiida",
  ],
  "Opel": [
    "Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland",
    "Adam", "Karl", "Meriva", "Zafira", "Vectra", "Combo",
  ],
  "Peugeot": [
    "108", "208", "308", "508", "2008", "3008", "5008",
    "Partner", "Rifter", "Expert", "207", "307", "407",
  ],
  "Renault": [
    "Clio", "Megane", "Captur", "Kadjar", "Koleos", "Scenic",
    "Talisman", "Twingo", "Kangoo", "Laguna", "Fluence", "Zoe", "Arkana",
  ],
  "Seat": [
    "Ibiza", "Leon", "Arona", "Ateca", "Tarraco",
    "Alhambra", "Toledo", "Mii", "Cordoba",
  ],
  "Skoda": [
    "Fabia", "Octavia", "Superb", "Rapid", "Scala",
    "Kamiq", "Karoq", "Kodiaq", "Citigo", "Roomster", "Yeti", "Enyaq",
  ],
  "Toyota": [
    "Yaris", "Corolla", "Camry", "Auris", "Avensis",
    "C-HR", "RAV4", "Land Cruiser", "Hilux", "Aygo",
    "Prius", "Supra", "GT86", "Verso",
  ],
  "Volkswagen": [
    "Polo", "Golf", "Passat", "Arteon", "Jetta",
    "T-Cross", "T-Roc", "Tiguan", "Touareg", "Touran",
    "Caddy", "Transporter", "Up!", "Scirocco", "CC", "ID.3", "ID.4",
  ],
  "Volvo": [
    "S40", "S60", "S80", "S90",
    "V40", "V60", "V90",
    "XC40", "XC60", "XC90", "C30", "C40",
  ],
};

/** Get models for a given brand, returns empty array if brand not found */
export function getModelsForBrand(brand: string): string[] {
  return brandModels[brand] || [];
}
