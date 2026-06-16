// ─── CATEGORIES ──────────────────────────

export const CAT_ICON = {
  Food:'🍔', Transport:'🚗', Shopping:'🛍️', Living:'🏠',
  Utilities:'⚡', Lifestyle:'🎬', Health:'🏥', Finance:'💼', Other:'📦'
}

export const CAT_BG = {
  Food:'#f5e0d0', Transport:'#d8eaf5', Shopping:'#fff0c8', Living:'#ede5d8',
  Utilities:'#d4e8f2', Lifestyle:'#f0ddd8', Health:'#dff0e4', Finance:'#e8dcc8', Other:'#f0f0e8'
}

export const CAT_CLS = {
  Food:'cat-food', Transport:'cat-transport', Shopping:'cat-shopping', Living:'cat-living',
  Utilities:'cat-utilities', Lifestyle:'cat-lifestyle', Health:'cat-health',
  Finance:'cat-finance', Other:'cat-living'
}

export const CAT_SUBS = {
  Food:     [['Groceries','#c49a6c'],['Delivery','#e07840'],['Eating Out','#d4905c'],['Cafes','#f0c098']],
  Transport:[['Ride-hailing','#c8d0a8'],['Public Transport','#a0b878'],['Fuel','#d8e4b8'],['Maintenance','#e8f0d0']],
  Shopping: [['Clothing','#c090c0'],['Electronics','#9868a8'],['Home Items','#d8b8e0'],['Misc','#ecdde8']],
  Living:   [['Rent','#c49a6c'],['Maintenance','#d4b88a'],['Society','#e0ccaa'],['Supplies','#eddfc4']],
  Utilities:[['Electricity','#bdd8f0'],['Internet','#96c4e0'],['Water/Gas','#c8e8f8'],['Subs','#d8eff8']],
  Lifestyle:[['Entertainment','#e08898'],['Outings','#d06878'],['Self-care','#f0b0b8'],['Hobbies','#f8d8dc']],
  Health:   [['Gym','#60b080'],['Medicines','#88c8a0'],['Wellness','#b0dcc0'],['Medical','#d4eedd']],
  Finance:  [['Savings','#c49a6c'],['EMI','#d4b888'],['Investments','#e8d0a8'],['Taxes','#f0e4c8']],
  Other:    [['Misc','#c8c8b0'],['Gifts','#d8d8c0'],['Unknown','#e8e8d0'],['Other','#f0f0e0']]
}

export const CAT_COLOR_DONUT = {
  Food:'#c49a6c', Transport:'#c8d0a8', Shopping:'#bdd8f0', Living:'#e8d5be',
  Utilities:'#f4b8c8', Lifestyle:'#d4b8d0', Health:'#a8d8b8', Finance:'#d4c8a0', Other:'#e4eabf'
}

export const CATEGORIES = ['Living','Food','Transport','Shopping','Utilities','Lifestyle','Health','Finance']

// ─── PEER BENCHMARKS ─────────────────────
// Keyed by city → age_group → income_band
// Values are monthly spend in INR

export const BENCHMARKS = {
  Mumbai: {
    '18-24': {
      '0-30000':   { Food:4200, Transport:3200, Shopping:1500, Utilities:1200, Lifestyle:1800 },
      '30000-50000':{ Food:6200, Transport:4800, Shopping:2000, Utilities:1500, Lifestyle:2200 },
      '50000-80000':{ Food:7300, Transport:5600, Shopping:2500, Utilities:1800, Lifestyle:2800 },
      '80000+':    { Food:9500, Transport:7200, Shopping:4000, Utilities:2200, Lifestyle:4000 },
    },
    '24-28': {
      '0-30000':   { Food:4800, Transport:3500, Shopping:1800, Utilities:1200, Lifestyle:2000 },
      '30000-50000':{ Food:6500, Transport:5000, Shopping:2200, Utilities:1500, Lifestyle:2500 },
      '50000-80000':{ Food:7300, Transport:5600, Shopping:2500, Utilities:1800, Lifestyle:3000 },
      '80000+':    { Food:10000,Transport:7500, Shopping:4500, Utilities:2500, Lifestyle:4500 },
    },
    '28-35': {
      '0-30000':   { Food:5200, Transport:4000, Shopping:2000, Utilities:1400, Lifestyle:2000 },
      '30000-50000':{ Food:7000, Transport:5500, Shopping:2800, Utilities:1700, Lifestyle:2800 },
      '50000-80000':{ Food:8500, Transport:6500, Shopping:3500, Utilities:2000, Lifestyle:3500 },
      '80000+':    { Food:12000,Transport:9000, Shopping:6000, Utilities:2800, Lifestyle:5000 },
    },
  },
  Bangalore: {
    '18-24': {
      '0-30000':   { Food:3800, Transport:2800, Shopping:1400, Utilities:1100, Lifestyle:1600 },
      '30000-50000':{ Food:5800, Transport:4200, Shopping:1900, Utilities:1400, Lifestyle:2100 },
      '50000-80000':{ Food:7000, Transport:5200, Shopping:2400, Utilities:1700, Lifestyle:2700 },
      '80000+':    { Food:9000, Transport:6800, Shopping:3800, Utilities:2100, Lifestyle:3800 },
    },
    '24-28': {
      '0-30000':   { Food:4200, Transport:3000, Shopping:1600, Utilities:1100, Lifestyle:1800 },
      '30000-50000':{ Food:6000, Transport:4500, Shopping:2000, Utilities:1400, Lifestyle:2300 },
      '50000-80000':{ Food:6800, Transport:5200, Shopping:2400, Utilities:1700, Lifestyle:2800 },
      '80000+':    { Food:9500, Transport:7000, Shopping:4200, Utilities:2300, Lifestyle:4200 },
    },
    '28-35': {
      '0-30000':   { Food:4800, Transport:3500, Shopping:1800, Utilities:1300, Lifestyle:1900 },
      '30000-50000':{ Food:6500, Transport:5000, Shopping:2500, Utilities:1600, Lifestyle:2600 },
      '50000-80000':{ Food:8000, Transport:6000, Shopping:3200, Utilities:1900, Lifestyle:3200 },
      '80000+':    { Food:11000,Transport:8500, Shopping:5500, Utilities:2600, Lifestyle:4700 },
    },
  },
  Delhi: {
    '18-24': {
      '0-30000':   { Food:4000, Transport:3000, Shopping:1500, Utilities:1200, Lifestyle:1700 },
      '30000-50000':{ Food:6000, Transport:4500, Shopping:2000, Utilities:1500, Lifestyle:2200 },
      '50000-80000':{ Food:7200, Transport:5400, Shopping:2500, Utilities:1800, Lifestyle:2900 },
      '80000+':    { Food:9200, Transport:7000, Shopping:4000, Utilities:2200, Lifestyle:4000 },
    },
    '24-28': {
      '0-30000':   { Food:4500, Transport:3200, Shopping:1700, Utilities:1200, Lifestyle:1900 },
      '30000-50000':{ Food:6200, Transport:4800, Shopping:2100, Utilities:1500, Lifestyle:2400 },
      '50000-80000':{ Food:7500, Transport:5800, Shopping:2600, Utilities:1900, Lifestyle:3100 },
      '80000+':    { Food:9800, Transport:7200, Shopping:4300, Utilities:2400, Lifestyle:4300 },
    },
    '28-35': {
      '0-30000':   { Food:5000, Transport:3800, Shopping:1900, Utilities:1400, Lifestyle:2100 },
      '30000-50000':{ Food:6800, Transport:5300, Shopping:2700, Utilities:1700, Lifestyle:2700 },
      '50000-80000':{ Food:8200, Transport:6300, Shopping:3400, Utilities:2000, Lifestyle:3400 },
      '80000+':    { Food:11500,Transport:8800, Shopping:5800, Utilities:2800, Lifestyle:4900 },
    },
  },
  Pune: {
    '24-28': {
      '50000-80000':{ Food:6500, Transport:5000, Shopping:2200, Utilities:1600, Lifestyle:2600 },
    },
  },
  Hyderabad: {
    '24-28': {
      '50000-80000':{ Food:6200, Transport:4800, Shopping:2100, Utilities:1500, Lifestyle:2500 },
    },
  },
  Chennai: {
    '24-28': {
      '50000-80000':{ Food:6000, Transport:4600, Shopping:2000, Utilities:1500, Lifestyle:2400 },
    },
  },
  Other: {
    '18-24': { '50000-80000':{ Food:5500, Transport:4000, Shopping:1800, Utilities:1400, Lifestyle:2000 } },
    '24-28': { '50000-80000':{ Food:6000, Transport:4500, Shopping:2000, Utilities:1500, Lifestyle:2200 } },
    '28-35': { '50000-80000':{ Food:7000, Transport:5000, Shopping:2500, Utilities:1700, Lifestyle:2700 } },
  }
}

export function getPeerBenchmark(city, age, income) {
  const cityData = BENCHMARKS[city] || BENCHMARKS['Other']

  // Get age group
  const ageGroup = age < 24 ? '18-24' : age < 28 ? '24-28' : '28-35'
  const ageData  = cityData[ageGroup] || cityData['24-28'] || Object.values(cityData)[0]

  // Get income band
  const incomeBand = income < 30000  ? '0-30000'
                   : income < 50000  ? '30000-50000'
                   : income < 80000  ? '50000-80000'
                   : '80000+'
  return ageData[incomeBand] || ageData[Object.keys(ageData)[0]] || { Food:7000, Transport:5000, Shopping:2000, Utilities:1500, Lifestyle:2500 }
}

export const CITIES = ['Mumbai','Bangalore','Delhi','Pune','Hyderabad','Chennai','Kolkata','Ahmedabad','Other']
export const OCCUPATIONS = ['Student','Salaried (Private)','Salaried (Government)','Freelancer','Self-employed','Business Owner','Other']
