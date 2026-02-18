import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@autovetura.al" },
    update: {},
    create: {
      name: "Demo Përdorues",
      email: "demo@autovetura.al",
      phone: "+355 69 123 4567",
      password: hashedPassword,
      role: "user",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@autovetura.al" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@autovetura.al",
      phone: "+355 69 000 0000",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`Created users: ${demoUser.email}, ${adminUser.email}`);

  // Create sample listings — CARS
  const carListings = [
    {
      title: "Mercedes-Benz C-Class 2020",
      brand: "Mercedes-Benz", model: "C-Class", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 45000, price: 25000, color: "E zezë",
      bodyType: "Sedan", location: "Tiranë", phone: "+355 69 111 2222",
      description: "Mercedes-Benz C-Class në gjendje perfekte. Mirëmbajtur rregullisht, pa asnjë problem mekanik. Full opsione.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "BMW 3 Series 320d",
      brand: "BMW", model: "3 Series", year: 2019, fuel: "Diesel",
      transmission: "Automatik", km: 60000, price: 22000, color: "E bardhë",
      bodyType: "Sedan", location: "Durrës", phone: "+355 69 222 3333",
      description: "BMW 320d sportline me enterier lëkure, panoramik, kamerë parkimi.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Audi A4 2.0 TDI",
      brand: "Audi", model: "A4", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 30000, price: 28000, color: "Gri",
      bodyType: "Sedan", location: "Tiranë", phone: "+355 69 333 4444",
      description: "Audi A4 S-Line me pak kilometra. Sapo ardhur nga Gjermania.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Volkswagen Golf 8",
      brand: "Volkswagen", model: "Golf", year: 2021, fuel: "Benzinë",
      transmission: "Manual", km: 35000, price: 19000, color: "Blu",
      bodyType: "Hatchback", location: "Elbasan",
      description: "Golf 8 1.5 TSI, navigacion, kamerë, sensor parkimi.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Toyota Corolla Hybrid",
      brand: "Toyota", model: "Corolla", year: 2022, fuel: "Hibrid",
      transmission: "Automatik", km: 15000, price: 23000, color: "E bardhë",
      bodyType: "Sedan", location: "Vlorë",
      description: "Corolla Hybrid me konsum minimal karburanti. Ideal për qytet.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Ford Focus 1.5 TDCi",
      brand: "Ford", model: "Focus", year: 2020, fuel: "Diesel",
      transmission: "Manual", km: 55000, price: 14000, color: "E kuqe",
      bodyType: "Hatchback", location: "Korçë",
      description: "Ford Focus i mirëmbajtur, me histori servisi të plotë.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Opel Astra 1.6 CDTi",
      brand: "Opel", model: "Astra", year: 2019, fuel: "Diesel",
      transmission: "Manual", km: 70000, price: 12000, color: "Gri",
      bodyType: "Hatchback", location: "Shkodër",
      description: "Opel Astra me klima, navigacion, sensor parkimi.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Renault Megane IV",
      brand: "Renault", model: "Megane", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 35000, price: 18000, color: "E zezë",
      bodyType: "Sedan", location: "Fier",
      description: "Renault Megane edition, full opsione, gjendje e shkëlqyeshme.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Peugeot 3008 GT",
      brand: "Peugeot", model: "3008", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 42000, price: 24000, color: "Blu",
      bodyType: "SUV", location: "Tiranë",
      description: "Peugeot 3008 GT Line me i-cockpit, kamerë 360, panoramik.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Volvo XC40 T4",
      brand: "Volvo", model: "XC40", year: 2022, fuel: "Benzinë",
      transmission: "Automatik", km: 20000, price: 35000, color: "E bardhë",
      bodyType: "SUV", location: "Tiranë", phone: "+355 69 555 6666",
      description: "Volvo XC40 Momentum. Siguria më e lartë, navigacion Volvo, Harman Kardon.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "BMW X3 xDrive20d",
      brand: "BMW", model: "X3", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 28000, price: 38000, color: "E zezë",
      bodyType: "SUV", location: "Durrës",
      description: "BMW X3 M-Sport me head-up display, memorie sediljesh, kamerë parkimi.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Audi Q5 2.0 TDI",
      brand: "Audi", model: "Q5", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 38000, price: 33000, color: "Gri",
      bodyType: "SUV", location: "Tiranë",
      description: "Audi Q5 Quattro me virtual cockpit, bang & olufsen, ajër i kondicionuar 3 zona.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "C class 203",
      brand: "Mercedes-Benz", model: "C-Class", year: 2001, fuel: "Diesel",
      transmission: "Manual", km: 430000, price: 2500, color: "Gri",
      bodyType: "Sedan", location: "Tiranë",
      description: "Mercedes C203 klasike, motor i fortë, për ata që duan makinë të besueshme.",
      featured: false, vehicleType: "Makinë",
    },
    // More cars
    {
      title: "Skoda Octavia 2.0 TDI",
      brand: "Skoda", model: "Octavia", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 40000, price: 21000, color: "Gri",
      bodyType: "Karavan", location: "Tiranë",
      description: "Skoda Octavia Combi me hapësirë të madhe, navigacion, klima automatike.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Hyundai Tucson 1.6 CRDi",
      brand: "Hyundai", model: "Tucson", year: 2022, fuel: "Diesel",
      transmission: "Automatik", km: 25000, price: 27000, color: "Blu",
      bodyType: "SUV", location: "Vlorë",
      description: "Hyundai Tucson i ri, dizajn modern, full opsione, garanci aktive.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Kia Sportage 1.6 T-GDi",
      brand: "Kia", model: "Sportage", year: 2023, fuel: "Benzinë",
      transmission: "Automatik", km: 10000, price: 30000, color: "E bardhë",
      bodyType: "SUV", location: "Tiranë",
      description: "Kia Sportage gjenerata e re. Dizajn i ri, teknologji e avancuar.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Seat Leon 1.5 TSI",
      brand: "Seat", model: "Leon", year: 2021, fuel: "Benzinë",
      transmission: "Manual", km: 32000, price: 17000, color: "E kuqe",
      bodyType: "Hatchback", location: "Elbasan",
      description: "Seat Leon FR me enterier sportiv, digital cockpit, LED matrix.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Dacia Duster 1.5 dCi",
      brand: "Dacia", model: "Duster", year: 2020, fuel: "Diesel",
      transmission: "Manual", km: 65000, price: 13000, color: "E zezë",
      bodyType: "SUV", location: "Kukës",
      description: "Dacia Duster 4x4 me çmim ekonomik, ideal për terren.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Fiat 500X Cross",
      brand: "Fiat", model: "500X", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 45000, price: 16000, color: "E bardhë",
      bodyType: "SUV", location: "Durrës",
      description: "Fiat 500X Cross Look me stile italian, komode dhe ekonomike.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Nissan Qashqai 1.3 DIG-T",
      brand: "Nissan", model: "Qashqai", year: 2022, fuel: "Benzinë",
      transmission: "Automatik", km: 18000, price: 26000, color: "Gri",
      bodyType: "SUV", location: "Tiranë",
      description: "Nissan Qashqai gjenerata e re, ProPilot, kamerë 360°.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Honda Civic 1.5 VTEC Turbo",
      brand: "Honda", model: "Civic", year: 2022, fuel: "Benzinë",
      transmission: "Automatik", km: 20000, price: 24000, color: "E kuqe",
      bodyType: "Sedan", location: "Tiranë",
      description: "Honda Civic e re me motor turbo, sportive dhe ekonomike.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Mazda CX-5 2.2 Skyactiv-D",
      brand: "Mazda", model: "CX-5", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 35000, price: 29000, color: "E kuqe",
      bodyType: "SUV", location: "Durrës",
      description: "Mazda CX-5 AWD me enterier premium, BOSE audio, head-up display.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Citroën C3 1.2 PureTech",
      brand: "Citroën", model: "C3", year: 2021, fuel: "Benzinë",
      transmission: "Manual", km: 28000, price: 11000, color: "E bardhë",
      bodyType: "Hatchback", location: "Fier",
      description: "Citroën C3 e re, komode, ekonomike, ideale për qytet.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "BMW 5 Series 530d xDrive",
      brand: "BMW", model: "5 Series", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 55000, price: 35000, color: "E zezë",
      bodyType: "Sedan", location: "Tiranë",
      description: "BMW 530d Luxury Line, enterier lëkure Nappa, ambient lighting.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Mercedes-Benz GLC 220d",
      brand: "Mercedes-Benz", model: "GLC", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 32000, price: 42000, color: "E bardhë",
      bodyType: "SUV", location: "Tiranë",
      description: "Mercedes GLC AMG-Line, panoramik, Burmester audio, MBUX.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Volkswagen Passat Variant 2.0 TDI",
      brand: "Volkswagen", model: "Passat", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 48000, price: 22000, color: "Gri",
      bodyType: "Karavan", location: "Tiranë",
      description: "VW Passat Variant me hapësirë bagazhi 650L, ideal për familje.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Audi A6 3.0 TDI Quattro",
      brand: "Audi", model: "A6", year: 2019, fuel: "Diesel",
      transmission: "Automatik", km: 65000, price: 32000, color: "E zezë",
      bodyType: "Sedan", location: "Durrës",
      description: "Audi A6 me matrix LED, virtual cockpit, ajër i kondicionuar 4 zona.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Toyota RAV4 Hybrid",
      brand: "Toyota", model: "RAV4", year: 2022, fuel: "Hibrid",
      transmission: "Automatik", km: 12000, price: 34000, color: "Blu",
      bodyType: "SUV", location: "Vlorë",
      description: "Toyota RAV4 Hybrid AWD, konsum vetëm 4.8L/100km, JBL audio.",
      featured: true, vehicleType: "Makinë",
    },
    {
      title: "Ford Puma 1.0 EcoBoost",
      brand: "Ford", model: "Puma", year: 2022, fuel: "Benzinë",
      transmission: "Manual", km: 22000, price: 18000, color: "Blu",
      bodyType: "SUV", location: "Korçë",
      description: "Ford Puma crossover kompakt, MegaBox, B&O audio.",
      featured: false, vehicleType: "Makinë",
    },
    {
      title: "Renault Clio 1.0 TCe",
      brand: "Renault", model: "Clio", year: 2021, fuel: "Benzinë",
      transmission: "Manual", km: 25000, price: 12000, color: "E bardhë",
      bodyType: "Hatchback", location: "Shkodër",
      description: "Renault Clio V me ekran multimedia 9.3 inç, klima automatike.",
      featured: false, vehicleType: "Makinë",
    },
  ];

  // MOTORCYCLES
  const motorcycleListings = [
    {
      title: "Honda CBR 600RR",
      brand: "Honda", model: "CBR 600RR", year: 2021, fuel: "Benzinë",
      transmission: "Manual", km: 8000, price: 9500, color: "E kuqe",
      bodyType: "Sport", location: "Tiranë", phone: "+355 69 700 1111",
      description: "Honda CBR 600RR sportive, gjendje perfekte, e mirëmbajtur.",
      featured: true, vehicleType: "Motocikletë",
    },
    {
      title: "Yamaha MT-07",
      brand: "Yamaha", model: "MT-07", year: 2022, fuel: "Benzinë",
      transmission: "Manual", km: 5000, price: 7200, color: "E zezë",
      bodyType: "Naked", location: "Durrës",
      description: "Yamaha MT-07 me motor CP2, ideale për fillestarë dhe ekspertë.",
      featured: true, vehicleType: "Motocikletë",
    },
    {
      title: "Kawasaki Z900",
      brand: "Kawasaki", model: "Z900", year: 2021, fuel: "Benzinë",
      transmission: "Manual", km: 12000, price: 8500, color: "E gjelbër",
      bodyType: "Naked", location: "Tiranë",
      description: "Kawasaki Z900 me 125HP, TFT display, riding modes.",
      featured: true, vehicleType: "Motocikletë",
    },
    {
      title: "BMW R 1250 GS Adventure",
      brand: "BMW", model: "R 1250 GS", year: 2022, fuel: "Benzinë",
      transmission: "Manual", km: 15000, price: 18000, color: "Gri",
      bodyType: "Adventure", location: "Tiranë", phone: "+355 69 700 2222",
      description: "BMW R 1250 GS Adventure me valixhe origjinale, GPS, heated grips.",
      featured: true, vehicleType: "Motocikletë",
    },
    {
      title: "Ducati Monster 821",
      brand: "Ducati", model: "Monster 821", year: 2020, fuel: "Benzinë",
      transmission: "Manual", km: 10000, price: 9000, color: "E kuqe",
      bodyType: "Naked", location: "Vlorë",
      description: "Ducati Monster 821 me Desmodromic L-twin, Termignoni exhaust.",
      featured: false, vehicleType: "Motocikletë",
    },
    {
      title: "Suzuki GSX-R 750",
      brand: "Suzuki", model: "GSX-R 750", year: 2019, fuel: "Benzinë",
      transmission: "Manual", km: 18000, price: 7500, color: "Blu",
      bodyType: "Sport", location: "Elbasan",
      description: "Suzuki GSX-R 750, supersport klasike, gjendje shumë e mirë.",
      featured: false, vehicleType: "Motocikletë",
    },
    {
      title: "Honda Africa Twin CRF1100L",
      brand: "Honda", model: "Africa Twin", year: 2022, fuel: "Benzinë",
      transmission: "Automatik", km: 7000, price: 14000, color: "E kuqe",
      bodyType: "Adventure", location: "Tiranë",
      description: "Honda Africa Twin DCT me Apple CarPlay, cruise control.",
      featured: true, vehicleType: "Motocikletë",
    },
    {
      title: "KTM 390 Duke",
      brand: "KTM", model: "390 Duke", year: 2023, fuel: "Benzinë",
      transmission: "Manual", km: 3000, price: 5500, color: "Portokalli",
      bodyType: "Naked", location: "Korçë",
      description: "KTM 390 Duke e re, TFT display, WP suspension, LED headlight.",
      featured: false, vehicleType: "Motocikletë",
    },
    {
      title: "Harley-Davidson Iron 883",
      brand: "Harley-Davidson", model: "Iron 883", year: 2020, fuel: "Benzinë",
      transmission: "Manual", km: 9000, price: 8500, color: "E zezë",
      bodyType: "Cruiser", location: "Tiranë",
      description: "Harley-Davidson Iron 883 Sportster, stil klasik amerikan.",
      featured: false, vehicleType: "Motocikletë",
    },
    {
      title: "Vespa GTS 300 Super",
      brand: "Vespa", model: "GTS 300", year: 2022, fuel: "Benzinë",
      transmission: "Automatik", km: 4000, price: 5000, color: "Blu",
      bodyType: "Scooter", location: "Tiranë",
      description: "Vespa GTS 300 Super me ABS, ASR, konfort maksimal për qytetin.",
      featured: false, vehicleType: "Motocikletë",
    },
  ];

  // TRUCKS (Kamiona)
  const truckListings = [
    {
      title: "Mercedes-Benz Actros 1845",
      brand: "Mercedes-Benz", model: "Actros", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 180000, price: 65000, color: "E bardhë",
      bodyType: "Kamion", location: "Tiranë", phone: "+355 69 800 1111",
      description: "Mercedes Actros 1845 LS me MirrorCam, PPC, Multimedia Cockpit.",
      featured: true, vehicleType: "Kamion",
    },
    {
      title: "Volvo FH 500",
      brand: "Volvo", model: "FH 500", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 150000, price: 72000, color: "Blu",
      bodyType: "Kamion", location: "Durrës",
      description: "Volvo FH 500 Globetrotter XL, I-Save, adaptive cruise control.",
      featured: true, vehicleType: "Kamion",
    },
    {
      title: "Scania R 450",
      brand: "Scania", model: "R 450", year: 2019, fuel: "Diesel",
      transmission: "Automatik", km: 250000, price: 55000, color: "E bardhë",
      bodyType: "Kamion", location: "Elbasan",
      description: "Scania R 450 Highline, retarder, fridge, 2 krevate.",
      featured: true, vehicleType: "Kamion",
    },
    {
      title: "MAN TGX 18.500",
      brand: "MAN", model: "TGX", year: 2020, fuel: "Diesel",
      transmission: "Automatik", km: 200000, price: 58000, color: "E kuqe",
      bodyType: "Kamion", location: "Tiranë",
      description: "MAN TGX 18.500 EfficientLine 3, kabinë XXL, intarder.",
      featured: false, vehicleType: "Kamion",
    },
    {
      title: "DAF XF 480",
      brand: "DAF", model: "XF 480", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 170000, price: 62000, color: "E bardhë",
      bodyType: "Kamion", location: "Durrës",
      description: "DAF XF 480 Super Space Cab, PACCAR MX-13, ZF TraXon.",
      featured: false, vehicleType: "Kamion",
    },
    {
      title: "Iveco Stralis 460",
      brand: "Iveco", model: "Stralis", year: 2018, fuel: "Diesel",
      transmission: "Automatik", km: 320000, price: 35000, color: "E bardhë",
      bodyType: "Kamion", location: "Vlorë",
      description: "Iveco Stralis Hi-Way 460, motor Cursor 11, kabinë AS.",
      featured: false, vehicleType: "Kamion",
    },
    {
      title: "Mercedes-Benz Atego 1224",
      brand: "Mercedes-Benz", model: "Atego", year: 2020, fuel: "Diesel",
      transmission: "Manual", km: 120000, price: 38000, color: "E bardhë",
      bodyType: "Kamion", location: "Tiranë",
      description: "Mercedes Atego 1224 me kason alumini, ideal për shpërndarje.",
      featured: false, vehicleType: "Kamion",
    },
    {
      title: "Renault T 480",
      brand: "Renault", model: "T 480", year: 2021, fuel: "Diesel",
      transmission: "Automatik", km: 160000, price: 52000, color: "Gri",
      bodyType: "Kamion", location: "Korçë",
      description: "Renault T 480 High Sleeper Cab, Optidriver, Optiroll.",
      featured: true, vehicleType: "Kamion",
    },
  ];

  // VANS (Furgona)
  const furgonListings = [
    {
      title: "Mercedes-Benz Sprinter 314 CDI",
      brand: "Mercedes-Benz", model: "Sprinter", year: 2021, fuel: "Diesel",
      transmission: "Manual", km: 65000, price: 28000, color: "E bardhë",
      bodyType: "Furgon", location: "Tiranë", phone: "+355 69 900 1111",
      description: "Mercedes Sprinter 314 CDI, L2H2, klima, kamerë.",
      featured: true, vehicleType: "Furgon",
    },
    {
      title: "Ford Transit 2.0 EcoBlue",
      brand: "Ford", model: "Transit", year: 2022, fuel: "Diesel",
      transmission: "Manual", km: 40000, price: 26000, color: "E bardhë",
      bodyType: "Furgon", location: "Durrës",
      description: "Ford Transit L3H2 Trend, 170HP, SYNC 3, FordPass Connect.",
      featured: true, vehicleType: "Furgon",
    },
    {
      title: "Volkswagen Crafter 2.0 TDI",
      brand: "Volkswagen", model: "Crafter", year: 2021, fuel: "Diesel",
      transmission: "Manual", km: 55000, price: 30000, color: "E bardhë",
      bodyType: "Furgon", location: "Tiranë",
      description: "VW Crafter 35 L3H3 me klima, navigacion, ParkPilot.",
      featured: true, vehicleType: "Furgon",
    },
    {
      title: "Renault Master 2.3 dCi",
      brand: "Renault", model: "Master", year: 2020, fuel: "Diesel",
      transmission: "Manual", km: 80000, price: 20000, color: "E bardhë",
      bodyType: "Furgon", location: "Elbasan",
      description: "Renault Master 150HP L3H2, ideal për transport mallrash.",
      featured: false, vehicleType: "Furgon",
    },
    {
      title: "Fiat Ducato 2.3 MultiJet",
      brand: "Fiat", model: "Ducato", year: 2020, fuel: "Diesel",
      transmission: "Manual", km: 70000, price: 18000, color: "E bardhë",
      bodyType: "Furgon", location: "Fier",
      description: "Fiat Ducato L2H2, motor MultiJet 140HP, i besueshëm.",
      featured: false, vehicleType: "Furgon",
    },
    {
      title: "Peugeot Boxer 2.2 BlueHDi",
      brand: "Peugeot", model: "Boxer", year: 2021, fuel: "Diesel",
      transmission: "Manual", km: 50000, price: 22000, color: "E bardhë",
      bodyType: "Furgon", location: "Shkodër",
      description: "Peugeot Boxer 140HP, klima, radio Bluetooth, sensor parkimi.",
      featured: false, vehicleType: "Furgon",
    },
    {
      title: "Citroën Jumper 2.2 BlueHDi",
      brand: "Citroën", model: "Jumper", year: 2021, fuel: "Diesel",
      transmission: "Manual", km: 45000, price: 21000, color: "Gri",
      bodyType: "Furgon", location: "Tiranë",
      description: "Citroën Jumper L3H2, 140HP, Grip Control, klima.",
      featured: false, vehicleType: "Furgon",
    },
    {
      title: "Mercedes-Benz Vito 116 CDI",
      brand: "Mercedes-Benz", model: "Vito", year: 2022, fuel: "Diesel",
      transmission: "Automatik", km: 30000, price: 32000, color: "E zezë",
      bodyType: "Furgon", location: "Tiranë",
      description: "Mercedes Vito Tourer Pro, 9 vende, ideal për transport pasagjerësh.",
      featured: true, vehicleType: "Furgon",
    },
    {
      title: "Ford Transit Custom 2.0 EcoBlue",
      brand: "Ford", model: "Transit Custom", year: 2022, fuel: "Diesel",
      transmission: "Manual", km: 25000, price: 24000, color: "Blu",
      bodyType: "Furgon", location: "Durrës",
      description: "Ford Transit Custom Limited, SYNC 4, heated seats, 170HP.",
      featured: false, vehicleType: "Furgon",
    },
    {
      title: "Opel Vivaro 2.0 Diesel",
      brand: "Opel", model: "Vivaro", year: 2021, fuel: "Diesel",
      transmission: "Manual", km: 55000, price: 19000, color: "E bardhë",
      bodyType: "Furgon", location: "Vlorë",
      description: "Opel Vivaro L2, IntelliLink, klima automatike, sensor parkimi.",
      featured: false, vehicleType: "Furgon",
    },
  ];

  const allListings = [...carListings, ...motorcycleListings, ...truckListings, ...furgonListings];

  // Set premium for featured listings
  for (const listing of allListings) {
    const premium = listing.featured;
    delete listing.featured;
    await prisma.listing.create({
      data: {
        ...listing,
        premium,
        premiumUntil: premium ? new Date("2027-01-01") : null,
        userId: demoUser.id,
      },
    });
  }

  console.log(`Created ${allListings.length} sample listings (${carListings.length} cars, ${motorcycleListings.length} motorcycles, ${truckListings.length} trucks, ${furgonListings.length} vans)`);

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Auto Vetura Albania",
      siteDesc: "Platforma më e madhe për shitblerje makinash në Shqipëri",
      contactEmail: "info@autovetura.al",
      contactPhone: "+355 69 000 0000",
      contactAddress: "Tiranë, Shqipëri",
    },
  });

  console.log("Created site settings");
  console.log("Seeding complete!");
  console.log("\nDemo Login: demo@autovetura.al / demo123");
  console.log("Admin Login: admin@autovetura.al / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
