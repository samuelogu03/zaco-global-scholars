export const universities = [
  { n: 'University of Oxford', code: 'UK', r: 'Europe', rk: 1 },
  { n: 'University of Cambridge', code: 'UK', r: 'Europe', rk: 2 },
  { n: 'Imperial College London', code: 'UK', r: 'Europe', rk: 6 },
  { n: 'Harvard University', code: 'US', r: 'North America', rk: 3 },
  { n: 'Stanford University', code: 'US', r: 'North America', rk: 4 },
  { n: 'University of Toronto', code: 'CA', r: 'North America', rk: 18 },
  { n: 'McGill University', code: 'CA', r: 'North America', rk: 30 },
  { n: 'University of Regina', code: 'CA', r: 'North America', rk: 601 },
  { n: 'University of Melbourne', code: 'AU', r: 'Oceania', rk: 33 },
  { n: 'University of Sydney', code: 'AU', r: 'Oceania', rk: 19 },
  { n: 'TU Munich', code: 'DE', r: 'Europe', rk: 37 },
  { n: 'LMU Munich', code: 'DE', r: 'Europe', rk: 43 },
  { n: 'University of Auckland', code: 'NZ', r: 'Oceania', rk: 68 },
  { n: 'National University of Singapore', code: 'SG', r: 'Asia', rk: 8 },
  { n: 'University of Tokyo', code: 'JP', r: 'Asia', rk: 28 },
  { n: 'Seoul National University', code: 'KR', r: 'Asia', rk: 29 },
  { n: 'ETH Zurich', code: 'CH', r: 'Europe', rk: 7 },
  { n: 'University of Amsterdam', code: 'NL', r: 'Europe', rk: 53 },
  { n: 'Trinity College Dublin', code: 'IE', r: 'Europe', rk: 81 },
  { n: 'Uppsala University', code: 'SE', r: 'Europe', rk: 105 },
  { n: 'University of Oslo', code: 'NO', r: 'Europe', rk: 117 },
  { n: 'University of Helsinki', code: 'FI', r: 'Europe', rk: 115 },
  { n: 'University of Copenhagen', code: 'DK', r: 'Europe', rk: 32 },
  { n: 'Sorbonne University', code: 'FR', r: 'Europe', rk: 43 },
  { n: 'Politecnico di Milano', code: 'IT', r: 'Europe', rk: 123 },
  { n: 'University of Barcelona', code: 'ES', r: 'Europe', rk: 164 },
  { n: 'University of Warsaw', code: 'PL', r: 'Europe', rk: 260 },
  { n: 'University of Lisbon', code: 'PT', r: 'Europe', rk: 290 },
  { n: 'University of Vienna', code: 'AT', r: 'Europe', rk: 128 },
  { n: 'Tsinghua University', code: 'CN', r: 'Asia', rk: 12 },
  { n: 'University of the Philippines', code: 'PH', r: 'Asia', rk: 400 },
  { n: 'Khalifa University', code: 'AE', r: 'Middle East', rk: 180 }
]

export function universitiesByCountry(code) {
  return universities.filter((u) => u.code === code)
}
