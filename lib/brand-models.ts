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

/** Motorcycle brands and models */
export const motorcycleBrands: Record<string, string[]> = {
  "Honda": [
    "CBR 600RR", "CBR 1000RR", "CB 500F", "CB 650R", "CRF 250L", "CRF 300L",
    "Africa Twin", "Gold Wing", "Rebel 500", "NC750X", "Forza 125", "Forza 350",
    "SH 125", "SH 150", "SH 300", "PCX 125", "X-ADV",
  ],
  "Yamaha": [
    "YZF-R1", "YZF-R6", "YZF-R3", "YZF-R125", "MT-07", "MT-09", "MT-125",
    "Ténéré 700", "Tracer 9", "XSR 700", "XSR 900", "NMAX 125", "XMAX 300",
    "TMAX 560", "FZ", "Aerox",
  ],
  "Kawasaki": [
    "Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R", "Z400", "Z650",
    "Z900", "Z1000", "Versys 650", "Versys 1000", "Vulcan S", "KLR 650",
  ],
  "Suzuki": [
    "GSX-R600", "GSX-R750", "GSX-R1000", "GSX-S750", "GSX-S1000",
    "V-Strom 650", "V-Strom 1050", "SV650", "Burgman 400", "Hayabusa", "Katana",
  ],
  "Ducati": [
    "Panigale V2", "Panigale V4", "Monster", "Scrambler", "Multistrada V4",
    "Diavel", "Streetfighter V4", "Hypermotard", "Desert X", "SuperSport",
  ],
  "BMW": [
    "R 1250 GS", "R 1250 RT", "S 1000 RR", "S 1000 XR", "F 900 R",
    "F 850 GS", "G 310 R", "G 310 GS", "C 400 X", "C 650 GT",
  ],
  "KTM": [
    "Duke 125", "Duke 200", "Duke 390", "Duke 690", "Duke 790", "Duke 890",
    "RC 125", "RC 390", "Adventure 390", "Adventure 790", "Adventure 890",
    "Adventure 1290", "EXC", "SX",
  ],
  "Harley-Davidson": [
    "Sportster", "Iron 883", "Forty-Eight", "Street Bob", "Fat Boy",
    "Road King", "Street Glide", "Road Glide", "Softail", "Electra Glide",
    "LiveWire", "Pan America",
  ],
  "Aprilia": [
    "RS 125", "RS 660", "RSV4", "Tuono 660", "Tuono V4",
    "Shiver 900", "Dorsoduro 900", "SR GT", "SXR 125",
  ],
  "Vespa": [
    "Primavera 50", "Primavera 125", "Primavera 150", "Sprint 125", "Sprint 150",
    "GTS 125", "GTS 300", "Elettrica",
  ],
  "Piaggio": [
    "Liberty 125", "Medley 125", "Medley 150", "Beverly 300", "Beverly 400",
    "MP3 300", "MP3 500",
  ],
  "Triumph": [
    "Street Triple", "Speed Triple", "Tiger 900", "Tiger 1200",
    "Bonneville", "Scrambler", "Rocket 3", "Trident 660",
  ],
  "Benelli": [
    "TRK 502", "TRK 502 X", "Leoncino 500", "752S", "302S", "BN 125",
  ],
};

/** Truck/commercial vehicle brands and models */
export const truckBrands: Record<string, string[]> = {
  "Mercedes-Benz": [
    "Actros", "Arocs", "Atego", "Axor", "Econic", "Sprinter", "Vito", "Citan",
  ],
  "MAN": [
    "TGX", "TGS", "TGM", "TGL", "TGE",
  ],
  "Volvo": [
    "FH", "FM", "FMX", "FE", "FL",
  ],
  "Scania": [
    "R-Series", "S-Series", "G-Series", "P-Series", "L-Series",
  ],
  "DAF": [
    "XF", "XG", "XG+", "CF", "LF",
  ],
  "Iveco": [
    "Stralis", "S-Way", "Eurocargo", "Daily", "Trakker",
  ],
  "Renault": [
    "T", "C", "K", "D", "Master",
  ],
  "Ford": [
    "Transit", "Transit Custom", "Transit Connect", "Ranger", "F-Max",
  ],
  "Fiat": [
    "Ducato", "Doblo", "Fiorino", "Talento",
  ],
  "Isuzu": [
    "N-Series", "F-Series", "D-Max",
  ],
  "Mitsubishi": [
    "Canter", "Fighter", "L200",
  ],
  "Toyota": [
    "Hilux", "Land Cruiser", "Dyna", "Coaster",
  ],
};

/** Van/Furgon brands and models */
export const vanBrands: Record<string, string[]> = {
  "Mercedes-Benz": ["Sprinter", "Vito", "Citan", "V-Class"],
  "Ford": ["Transit", "Transit Custom", "Transit Connect", "Transit Courier"],
  "Volkswagen": ["Transporter", "Caddy", "Crafter", "Caravelle", "Multivan"],
  "Renault": ["Master", "Trafic", "Kangoo", "Express"],
  "Fiat": ["Ducato", "Scudo", "Doblo", "Fiorino", "Talento"],
  "Peugeot": ["Boxer", "Expert", "Partner", "Rifter"],
  "Citroën": ["Jumper", "Jumpy", "Berlingo", "Nemo"],
  "Opel": ["Movano", "Vivaro", "Combo"],
  "Iveco": ["Daily"],
  "Nissan": ["NV400", "NV300", "NV200", "Townstar"],
  "Toyota": ["ProAce", "ProAce City", "Hiace"],
};

/** Get brands for a given vehicle type */
export function getBrandsForVehicleType(vehicleType: string): string[] {
  switch (vehicleType) {
    case "Motocikletë":
      return Object.keys(motorcycleBrands);
    case "Kamion":
      return Object.keys(truckBrands);
    case "Furgon":
      return Object.keys(vanBrands);
    default:
      return Object.keys(brandModels);
  }
}

/** Get models for a given brand, with optional vehicle type context */
export function getModelsForBrand(brand: string, vehicleType?: string): string[] {
  if (vehicleType === "Motocikletë" && motorcycleBrands[brand]) {
    return motorcycleBrands[brand];
  }
  if (vehicleType === "Kamion" && truckBrands[brand]) {
    return truckBrands[brand];
  }
  if (vehicleType === "Furgon" && vanBrands[brand]) {
    return vanBrands[brand];
  }
  // Fall back to car models, then try other categories
  return brandModels[brand] || motorcycleBrands[brand] || truckBrands[brand] || vanBrands[brand] || [];
}
