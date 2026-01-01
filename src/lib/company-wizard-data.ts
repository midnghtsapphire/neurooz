// Secretary of State filing links and info by state
export const SECRETARY_OF_STATE_DATA: Record<string, {
  name: string;
  url: string;
  llcFee: string;
  corpFee: string;
  processingTime: string;
}> = {
  AL: { name: "Alabama Secretary of State", url: "https://www.sos.alabama.gov/business-entities", llcFee: "$200", corpFee: "$100", processingTime: "2-3 weeks" },
  AK: { name: "Alaska Division of Corporations", url: "https://www.commerce.alaska.gov/web/cbpl/Corporations.aspx", llcFee: "$250", corpFee: "$250", processingTime: "5-7 days" },
  AZ: { name: "Arizona Corporation Commission", url: "https://azcc.gov/", llcFee: "$50", corpFee: "$60", processingTime: "3-5 days" },
  AR: { name: "Arkansas Secretary of State", url: "https://www.sos.arkansas.gov/business-commercial-services-bcs", llcFee: "$50", corpFee: "$50", processingTime: "5-7 days" },
  CA: { name: "California Secretary of State", url: "https://www.sos.ca.gov/business-programs/", llcFee: "$70", corpFee: "$100", processingTime: "1-2 weeks" },
  CO: { name: "Colorado Secretary of State", url: "https://www.sos.state.co.us/biz/", llcFee: "$50", corpFee: "$50", processingTime: "3-5 days" },
  CT: { name: "Connecticut Secretary of State", url: "https://portal.ct.gov/SOTS/Business-Services/", llcFee: "$120", corpFee: "$275", processingTime: "1-2 weeks" },
  DE: { name: "Delaware Division of Corporations", url: "https://corp.delaware.gov/", llcFee: "$90", corpFee: "$89", processingTime: "Same day" },
  FL: { name: "Florida Division of Corporations", url: "https://dos.myflorida.com/sunbiz/", llcFee: "$125", corpFee: "$70", processingTime: "3-5 days" },
  GA: { name: "Georgia Secretary of State", url: "https://sos.ga.gov/corporations-division-0", llcFee: "$100", corpFee: "$100", processingTime: "5-7 days" },
  HI: { name: "Hawaii DCCA", url: "https://cca.hawaii.gov/breg/", llcFee: "$50", corpFee: "$50", processingTime: "1-2 weeks" },
  ID: { name: "Idaho Secretary of State", url: "https://sos.idaho.gov/business-services/", llcFee: "$100", corpFee: "$100", processingTime: "3-5 days" },
  IL: { name: "Illinois Secretary of State", url: "https://www.ilsos.gov/departments/business_services/", llcFee: "$150", corpFee: "$150", processingTime: "1-2 weeks" },
  IN: { name: "Indiana Secretary of State", url: "https://www.in.gov/sos/business/", llcFee: "$100", corpFee: "$100", processingTime: "3-5 days" },
  IA: { name: "Iowa Secretary of State", url: "https://sos.iowa.gov/business/", llcFee: "$50", corpFee: "$50", processingTime: "3-5 days" },
  KS: { name: "Kansas Secretary of State", url: "https://www.sos.ks.gov/business/business.html", llcFee: "$165", corpFee: "$90", processingTime: "5-7 days" },
  KY: { name: "Kentucky Secretary of State", url: "https://www.sos.ky.gov/bus/", llcFee: "$40", corpFee: "$50", processingTime: "3-5 days" },
  LA: { name: "Louisiana Secretary of State", url: "https://www.sos.la.gov/BusinessServices/", llcFee: "$100", corpFee: "$75", processingTime: "5-7 days" },
  ME: { name: "Maine Bureau of Corporations", url: "https://www.maine.gov/sos/cec/corp/", llcFee: "$175", corpFee: "$175", processingTime: "1-2 weeks" },
  MD: { name: "Maryland SDAT", url: "https://dat.maryland.gov/", llcFee: "$100", corpFee: "$120", processingTime: "1-2 weeks" },
  MA: { name: "Massachusetts Secretary of State", url: "https://www.sec.state.ma.us/cor/", llcFee: "$500", corpFee: "$275", processingTime: "1-2 weeks" },
  MI: { name: "Michigan LARA", url: "https://www.michigan.gov/lara/bureau-list/cscl/corp", llcFee: "$50", corpFee: "$50", processingTime: "3-5 days" },
  MN: { name: "Minnesota Secretary of State", url: "https://www.sos.state.mn.us/business-liens/", llcFee: "$160", corpFee: "$180", processingTime: "5-7 days" },
  MS: { name: "Mississippi Secretary of State", url: "https://www.sos.ms.gov/business-services/", llcFee: "$50", corpFee: "$50", processingTime: "5-7 days" },
  MO: { name: "Missouri Secretary of State", url: "https://www.sos.mo.gov/business/", llcFee: "$50", corpFee: "$58", processingTime: "3-5 days" },
  MT: { name: "Montana Secretary of State", url: "https://sosmt.gov/business/", llcFee: "$70", corpFee: "$70", processingTime: "3-5 days" },
  NE: { name: "Nebraska Secretary of State", url: "https://sos.nebraska.gov/business/", llcFee: "$105", corpFee: "$60", processingTime: "3-5 days" },
  NV: { name: "Nevada Secretary of State", url: "https://www.nvsos.gov/sos/businesses/", llcFee: "$75", corpFee: "$75", processingTime: "1-2 days" },
  NH: { name: "New Hampshire Secretary of State", url: "https://www.sos.nh.gov/corporation-division", llcFee: "$100", corpFee: "$100", processingTime: "5-7 days" },
  NJ: { name: "New Jersey Division of Revenue", url: "https://www.njportal.com/dor/BusinessFormation/", llcFee: "$125", corpFee: "$125", processingTime: "1-2 weeks" },
  NM: { name: "New Mexico Secretary of State", url: "https://portal.sos.state.nm.us/BFS/online/", llcFee: "$50", corpFee: "$100", processingTime: "3-5 days" },
  NY: { name: "New York Department of State", url: "https://www.dos.ny.gov/corps/", llcFee: "$200", corpFee: "$125", processingTime: "1-2 weeks" },
  NC: { name: "North Carolina Secretary of State", url: "https://www.sosnc.gov/divisions/business_registration", llcFee: "$125", corpFee: "$125", processingTime: "3-5 days" },
  ND: { name: "North Dakota Secretary of State", url: "https://sos.nd.gov/business/", llcFee: "$135", corpFee: "$100", processingTime: "3-5 days" },
  OH: { name: "Ohio Secretary of State", url: "https://www.ohiosos.gov/businesses/", llcFee: "$99", corpFee: "$99", processingTime: "3-5 days" },
  OK: { name: "Oklahoma Secretary of State", url: "https://www.sos.ok.gov/business/", llcFee: "$100", corpFee: "$50", processingTime: "3-5 days" },
  OR: { name: "Oregon Secretary of State", url: "https://sos.oregon.gov/business/Pages/default.aspx", llcFee: "$100", corpFee: "$100", processingTime: "3-5 days" },
  PA: { name: "Pennsylvania DOS", url: "https://www.dos.pa.gov/BusinessCharities/Business/", llcFee: "$125", corpFee: "$125", processingTime: "1-2 weeks" },
  RI: { name: "Rhode Island Secretary of State", url: "https://www.sos.ri.gov/divisions/business-portal", llcFee: "$150", corpFee: "$230", processingTime: "3-5 days" },
  SC: { name: "South Carolina Secretary of State", url: "https://sos.sc.gov/online-filings/", llcFee: "$110", corpFee: "$135", processingTime: "5-7 days" },
  SD: { name: "South Dakota Secretary of State", url: "https://sdsos.gov/business-services/", llcFee: "$165", corpFee: "$165", processingTime: "3-5 days" },
  TN: { name: "Tennessee Secretary of State", url: "https://sos.tn.gov/business-services", llcFee: "$300", corpFee: "$100", processingTime: "3-5 days" },
  TX: { name: "Texas Secretary of State", url: "https://www.sos.state.tx.us/corp/", llcFee: "$300", corpFee: "$300", processingTime: "3-5 days" },
  UT: { name: "Utah Division of Corporations", url: "https://corporations.utah.gov/", llcFee: "$54", corpFee: "$70", processingTime: "3-5 days" },
  VT: { name: "Vermont Secretary of State", url: "https://sos.vermont.gov/corporations/", llcFee: "$125", corpFee: "$125", processingTime: "5-7 days" },
  VA: { name: "Virginia SCC", url: "https://www.scc.virginia.gov/clk/", llcFee: "$100", corpFee: "$100", processingTime: "3-5 days" },
  WA: { name: "Washington Secretary of State", url: "https://www.sos.wa.gov/corps/", llcFee: "$200", corpFee: "$200", processingTime: "3-5 days" },
  WV: { name: "West Virginia Secretary of State", url: "https://sos.wv.gov/business/Pages/default.aspx", llcFee: "$100", corpFee: "$100", processingTime: "5-7 days" },
  WI: { name: "Wisconsin DFI", url: "https://www.wdfi.org/corporations/", llcFee: "$130", corpFee: "$100", processingTime: "3-5 days" },
  WY: { name: "Wyoming Secretary of State", url: "https://sos.wyo.gov/Business/", llcFee: "$100", corpFee: "$100", processingTime: "1-2 days" },
  DC: { name: "DC DLCP", url: "https://dcra.dc.gov/service/business-registration", llcFee: "$220", corpFee: "$270", processingTime: "5-7 days" },
};

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export const ENTITY_TYPES = [
  {
    value: "sole_proprietorship",
    label: "Sole Proprietorship",
    description: "Simplest structure. No separate legal entity. Personal liability.",
    pros: ["Easy to start", "No formation fees", "Simple taxes (Schedule C)"],
    cons: ["Personal liability", "Self-employment tax", "Hard to raise capital"],
  },
  {
    value: "llc_single",
    label: "Single-Member LLC",
    description: "One owner with liability protection. Taxed as sole prop by default.",
    pros: ["Liability protection", "Pass-through taxation", "Flexible"],
    cons: ["State fees", "Self-employment tax", "Annual reports"],
  },
  {
    value: "llc_multi",
    label: "Multi-Member LLC",
    description: "Two+ owners with liability protection. Taxed as partnership by default.",
    pros: ["Liability protection", "Flexible profit sharing", "Pass-through taxation"],
    cons: ["Operating agreement needed", "State fees", "Complex tax returns"],
  },
  {
    value: "s_corp",
    label: "S Corporation",
    description: "Corporation with pass-through taxation. Salary + distribution model.",
    pros: ["Save on self-employment tax", "Liability protection", "Credibility"],
    cons: ["Reasonable salary required", "Payroll taxes", "More compliance"],
  },
  {
    value: "c_corp",
    label: "C Corporation",
    description: "Standard corporation. Double taxation but unlimited growth potential.",
    pros: ["Unlimited shareholders", "Raise capital easily", "Fringe benefits"],
    cons: ["Double taxation", "Complex compliance", "More expensive"],
  },
  {
    value: "partnership",
    label: "Partnership",
    description: "Two+ owners sharing profits. No separate entity for tax.",
    pros: ["Easy to form", "Pass-through taxation", "Flexible"],
    cons: ["Personal liability (general)", "Partner disputes", "Complex exits"],
  },
  {
    value: "nonprofit",
    label: "Nonprofit (501c3)",
    description: "Tax-exempt organization for charitable, religious, or educational purposes.",
    pros: ["Tax exempt", "Donations deductible", "Grant eligible"],
    cons: ["No profit distribution", "Complex compliance", "Public scrutiny"],
  },
];

export const EIN_IRS_URL = "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online";

export interface CompanyFormData {
  // Step 1: Entity Type
  entityType: string;
  
  // Step 2: Basic Info
  companyName: string;
  state: string;
  formationDate: string;
  
  // Step 3: EIN
  hasEin: "yes" | "no" | "later";
  ein: string;
  
  // Step 4: Members/Owners
  members: {
    name: string;
    email: string;
    ownershipPercent: number;
    role: string;
  }[];
  
  // Step 5: Address
  address: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Step 6: S-Corp Election (if applicable)
  electSCorp: boolean;
  
  // Outputs
  documentsGenerated: string[];
}

export const WIZARD_STEPS = [
  { id: 1, title: "Entity Type", description: "Choose your business structure" },
  { id: 2, title: "Basic Info", description: "Company name and state" },
  { id: 3, title: "EIN", description: "Employer Identification Number" },
  { id: 4, title: "Ownership", description: "Members or shareholders" },
  { id: 5, title: "Address", description: "Principal place of business" },
  { id: 6, title: "Review", description: "Confirm and generate documents" },
];
