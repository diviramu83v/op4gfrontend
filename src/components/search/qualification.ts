const targetTypeNames = ['Consumer', 'B2B', 'Patient', 'Caregiver', 'HCP'];
const qualifications = {
  1: [
    'Age Group',
    'Gender: Sex assigned at birth',
    'Gender Identity',
    'HHI',
    'Employment Status',
    'Education',
    'Ethnicity',
    'Parental Status',
    'Household Decision Maker',
    'Vehicle Type',
    'Auto Make',
    'Smoker Type',
    'Gamers_Game Type',
    'Gamers_Game Device',
    'Pet Type',
    'Big Ticket Purchases',
    'Smart Home Devices'
  ],
  2: [
    'Employment Status',
    'Employee Size',
    'Company Revenue',
    'Role',
    'Industry',
    'Decision Maker'
  ],
  3: [
    'Gender: Sex assigned at birth',
    'Ethnicity',
    'Medical Condition',
    'Medical Condition Group'
  ],
  4: [
    'Gender: Sex assigned at birth',
    'Ethnicity',
    'Caregiver Type',
    'Medical Condition',
    'Medical Condition Group'
  ],
  5: ['Healthcare Role', 'Practice Setting', 'Primary Specialty', 'Specialty Area']
};

export { qualifications, targetTypeNames };
