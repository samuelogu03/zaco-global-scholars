export const scholarships = [
  { name: 'Vanier Canada Graduate Scholarship', code: 'CA', level: 'PhD', coverage: 'Fully Funded' },
  { name: 'Ontario Graduate Scholarship', code: 'CA', level: "Master's", coverage: 'Partial' },
  { name: 'Chevening Scholarship', code: 'UK', level: "Master's", coverage: 'Fully Funded' },
  { name: 'GREAT Scholarships', code: 'UK', level: "Master's", coverage: 'Partial' },
  { name: 'Australia Awards Scholarship', code: 'AU', level: "Master's / PhD", coverage: 'Fully Funded' },
  { name: 'Melbourne Research Scholarship', code: 'AU', level: 'PhD', coverage: 'Fully Funded' },
  { name: 'Fulbright Foreign Student Program', code: 'US', level: "Master's / PhD", coverage: 'Fully Funded' },
  { name: 'DAAD Scholarship', code: 'DE', level: "Master's / PhD", coverage: 'Fully Funded' },
  { name: 'Erasmus Mundus Joint Master Scholarship', code: 'DE', level: "Master's", coverage: 'Fully Funded' },
  { name: 'New Zealand Excellence Award', code: 'NZ', level: "Master's", coverage: 'Partial' },
  { name: 'Irish Government Scholarship', code: 'IE', level: "Master's / PhD", coverage: 'Partial' },
  { name: 'Holland Scholarship', code: 'NL', level: "Bachelor's / Master's", coverage: 'Partial' },
  { name: 'MEXT Scholarship', code: 'JP', level: "Master's / PhD", coverage: 'Fully Funded' },
  { name: 'Korean Government Scholarship Program', code: 'KR', level: "Master's / PhD", coverage: 'Fully Funded' },
  { name: 'Singapore International Graduate Award', code: 'SG', level: 'PhD', coverage: 'Fully Funded' },
  { name: 'Swiss Government Excellence Scholarship', code: 'CH', level: "Master's / PhD", coverage: 'Fully Funded' },
  { name: 'Eiffel Excellence Scholarship', code: 'FR', level: "Master's / PhD", coverage: 'Fully Funded' },
  { name: 'Chinese Government Scholarship', code: 'CN', level: "Master's / PhD", coverage: 'Fully Funded' }
]

export function scholarshipsByCountry(code) {
  return scholarships.filter((s) => s.code === code)
}
