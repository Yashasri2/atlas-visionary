export interface CityData {
  name: string;
  state: string;
  coordinates: [number, number];
  population: number;
  area: number;
  aqi: number;
  trafficIndex: number;
  populationDensity: number;
  greenCover: number;
  populationForecast: { year: number; value: number }[];
  emissions: { sector: string; value: number }[];
  trafficByHour: { hour: number; index: number }[];
  economicData: {
    avgPropertyValue: number;
    taxRevenue: number;
    jobCreation: number;
    infrastructureCost: number;
  };
  aiRecommendations: {
    zoning: string[];
    roads: string[];
    greenSpaces: string[];
    confidence: number;
    warnings: string[];
  };
  zones: { name: string; type: string; coordinates: [number, number][]; color: string }[];
  landmarks: { name: string; coordinates: [number, number]; type: string; info: string }[];
}

const hyderabadZones = [
  { name: "Hitech City IT Hub", type: "commercial", coordinates: [[17.445, 78.381], [17.455, 78.381], [17.455, 78.395], [17.445, 78.395]] as [number, number][], color: "#00D1FF" },
  { name: "Hussain Sagar Lake Park", type: "green", coordinates: [[17.421, 78.472], [17.430, 78.472], [17.430, 78.483], [17.421, 78.483]] as [number, number][], color: "#22C55E" },
  { name: "Secunderabad Residential", type: "residential", coordinates: [[17.435, 78.498], [17.448, 78.498], [17.448, 78.512], [17.435, 78.512]] as [number, number][], color: "#818CF8" },
  { name: "Charminar Heritage Zone", type: "heritage", coordinates: [[17.358, 78.470], [17.365, 78.470], [17.365, 78.480], [17.358, 78.480]] as [number, number][], color: "#F59E0B" },
  { name: "Gachibowli Tech Park", type: "commercial", coordinates: [[17.430, 78.345], [17.440, 78.345], [17.440, 78.358], [17.430, 78.358]] as [number, number][], color: "#00D1FF" },
  { name: "LB Nagar Residential", type: "residential", coordinates: [[17.345, 78.545], [17.358, 78.545], [17.358, 78.560], [17.345, 78.560]] as [number, number][], color: "#818CF8" },
  { name: "Rajendra Nagar Mixed", type: "mixed", coordinates: [[17.395, 78.440], [17.408, 78.440], [17.408, 78.458], [17.395, 78.458]] as [number, number][], color: "#A78BFA" },
];

const hyderabadLandmarks = [
  { name: "Charminar", coordinates: [17.3616, 78.4747] as [number, number], type: "heritage", info: "Historic monument, AQI: 142, Traffic: Heavy" },
  { name: "HITEC City", coordinates: [17.4486, 78.3908] as [number, number], type: "tech", info: "IT Hub, Population Density: 12,400/km², Traffic: Moderate" },
  { name: "Hussain Sagar", coordinates: [17.4239, 78.4738] as [number, number], type: "park", info: "Lake & Recreation, Green Cover: 65%, AQI: 98" },
  { name: "LB Nagar", coordinates: [17.3485, 78.5495] as [number, number], type: "residential", info: "Residential Hub, Pop: 320K, Density: 9,800/km²" },
  { name: "Secunderabad Station", coordinates: [17.4344, 78.5018] as [number, number], type: "transport", info: "Major rail hub, Daily footfall: 180K" },
  { name: "Gachibowli", coordinates: [17.4401, 78.3489] as [number, number], type: "tech", info: "IT Corridor, 200+ companies, Growing density" },
  { name: "Rajendra Nagar", coordinates: [17.3983, 78.4448] as [number, number], type: "residential", info: "Mixed use, Pop: 185K, Coaching hub" },
];

export const CITIES: Record<string, CityData> = {
  hyderabad: {
    name: "Hyderabad",
    state: "Telangana",
    coordinates: [17.385, 78.4867],
    population: 10534418,
    area: 650,
    aqi: 128,
    trafficIndex: 72,
    populationDensity: 18480,
    greenCover: 9.2,
    populationForecast: [
      { year: 2020, value: 10004000 }, { year: 2022, value: 10250000 }, { year: 2024, value: 10534000 },
      { year: 2026, value: 10850000 }, { year: 2028, value: 11200000 }, { year: 2030, value: 11600000 },
      { year: 2032, value: 12050000 }, { year: 2034, value: 12500000 }, { year: 2036, value: 12960000 },
      { year: 2038, value: 13400000 }, { year: 2040, value: 13850000 },
    ],
    emissions: [
      { sector: "Transport", value: 38 }, { sector: "Industry", value: 28 },
      { sector: "Residential", value: 18 }, { sector: "Commercial", value: 12 }, { sector: "Other", value: 4 },
    ],
    trafficByHour: [
      { hour: 0, index: 12 }, { hour: 2, index: 8 }, { hour: 4, index: 10 }, { hour: 6, index: 35 },
      { hour: 8, index: 85 }, { hour: 10, index: 68 }, { hour: 12, index: 55 }, { hour: 14, index: 58 },
      { hour: 16, index: 72 }, { hour: 18, index: 92 }, { hour: 20, index: 60 }, { hour: 22, index: 30 },
    ],
    economicData: {
      avgPropertyValue: 7200,
      taxRevenue: 28500,
      jobCreation: 145000,
      infrastructureCost: 42000,
    },
    aiRecommendations: {
      zoning: [
        "Convert underused industrial land near Uppal to mixed-use residential-commercial zones to address housing demand",
        "Designate 200m green buffer zones along the Musi River to reduce flood risk and improve air quality",
        "Expand IT corridor zoning from HITEC City toward Shamshabad to decongest Gachibowli-Madhapur",
      ],
      roads: [
        "Propose dedicated BRT corridor from LB Nagar to HITEC City via ORR to reduce commute times by 35%",
        "Add grade-separated junction at Punjagutta to eliminate a bottleneck affecting 180K daily commuters",
        "Implement one-way loop system around Charminar to reduce heritage zone congestion by 40%",
      ],
      greenSpaces: [
        "Develop 50-acre urban forest in Medchal-Malkajgiri to serve 800K residents with zero green access",
        "Create linear park network along existing nala systems in Kukatpally for stormwater management",
        "Plant 25,000 native trees along ORR medians to reduce PM2.5 by 15% in adjacent neighborhoods",
      ],
      confidence: 0.87,
      warnings: [
        "High flooding risk in Musi riverbed areas — avoid residential zoning within 500m",
        "HITEC City infrastructure nearing capacity — new IT zones should target alternate corridors",
      ],
    },
    zones: hyderabadZones,
    landmarks: hyderabadLandmarks,
  },
  delhi: {
    name: "Delhi",
    state: "Delhi NCR",
    coordinates: [28.6139, 77.209],
    population: 32941000,
    area: 1484,
    aqi: 198,
    trafficIndex: 88,
    populationDensity: 11320,
    greenCover: 12.1,
    populationForecast: [
      { year: 2020, value: 30290000 }, { year: 2022, value: 31200000 }, { year: 2024, value: 32941000 },
      { year: 2026, value: 33800000 }, { year: 2028, value: 34700000 }, { year: 2030, value: 35600000 },
      { year: 2032, value: 36400000 }, { year: 2034, value: 37200000 }, { year: 2036, value: 37900000 },
      { year: 2038, value: 38500000 }, { year: 2040, value: 39000000 },
    ],
    emissions: [
      { sector: "Transport", value: 42 }, { sector: "Industry", value: 22 },
      { sector: "Residential", value: 20 }, { sector: "Commercial", value: 10 }, { sector: "Other", value: 6 },
    ],
    trafficByHour: [
      { hour: 0, index: 15 }, { hour: 2, index: 10 }, { hour: 4, index: 12 }, { hour: 6, index: 40 },
      { hour: 8, index: 95 }, { hour: 10, index: 78 }, { hour: 12, index: 65 }, { hour: 14, index: 70 },
      { hour: 16, index: 82 }, { hour: 18, index: 98 }, { hour: 20, index: 70 }, { hour: 22, index: 35 },
    ],
    economicData: { avgPropertyValue: 12500, taxRevenue: 68000, jobCreation: 310000, infrastructureCost: 95000 },
    aiRecommendations: {
      zoning: [
        "Rezone Rajendra Nagar old industrial plots to mixed-use transit-oriented development near metro stations",
        "Create dedicated hawker zones in Chandni Chowk to formalize street commerce and reduce congestion",
        "Expand Dwarka residential density with high-rise permits near metro corridor",
      ],
      roads: [
        "Build elevated corridor connecting Sarai Kale Khan to IGI Airport to bypass 12 traffic signals",
        "Pedestrianize Connaught Place inner circle permanently — model shows 30% revenue increase for businesses",
        "Add cycle lanes on Ring Road stretches near Nehru Place and Lajpat Nagar",
      ],
      greenSpaces: [
        "Restore Yamuna floodplain with 200-acre wetland park for air quality and flood absorption",
        "Create rooftop garden mandate for all new commercial buildings over 5000 sqft in NCR",
        "Develop 30-acre urban park in Rohini Sector 25-28 gap area",
      ],
      confidence: 0.82,
      warnings: [
        "AQI critically high — prioritize green buffer zones and traffic reduction measures",
        "Yamuna floodplain encroachment poses severe flooding risk during monsoon",
      ],
    },
    zones: [
      { name: "Connaught Place CBD", type: "commercial", coordinates: [[28.628, 77.215], [28.638, 77.215], [28.638, 77.225], [28.628, 77.225]], color: "#00D1FF" },
      { name: "India Gate Green Zone", type: "green", coordinates: [[28.610, 77.225], [28.618, 77.225], [28.618, 77.238], [28.610, 77.238]], color: "#22C55E" },
      { name: "Rajendra Nagar Residential", type: "residential", coordinates: [[28.620, 77.195], [28.632, 77.195], [28.632, 77.210], [28.620, 77.210]], color: "#818CF8" },
    ],
    landmarks: [
      { name: "India Gate", coordinates: [28.6129, 77.2295], type: "heritage", info: "National monument, AQI: 195, Green zone" },
      { name: "Connaught Place", coordinates: [28.6315, 77.2167], type: "commercial", info: "CBD, Daily footfall: 500K" },
      { name: "Rajendra Nagar", coordinates: [28.6250, 77.2000], type: "residential", info: "Mixed residential, Pop: 250K, Coaching center hub" },
    ],
  },
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    coordinates: [19.076, 72.8777],
    population: 21297000,
    area: 603,
    aqi: 155,
    trafficIndex: 91,
    populationDensity: 20634,
    greenCover: 7.8,
    populationForecast: [
      { year: 2020, value: 20411000 }, { year: 2022, value: 20800000 }, { year: 2024, value: 21297000 },
      { year: 2026, value: 21800000 }, { year: 2028, value: 22350000 }, { year: 2030, value: 22900000 },
      { year: 2032, value: 23400000 }, { year: 2034, value: 23850000 }, { year: 2036, value: 24250000 },
      { year: 2038, value: 24600000 }, { year: 2040, value: 24900000 },
    ],
    emissions: [
      { sector: "Transport", value: 40 }, { sector: "Industry", value: 25 },
      { sector: "Residential", value: 19 }, { sector: "Commercial", value: 11 }, { sector: "Other", value: 5 },
    ],
    trafficByHour: [
      { hour: 0, index: 18 }, { hour: 2, index: 12 }, { hour: 4, index: 15 }, { hour: 6, index: 45 },
      { hour: 8, index: 98 }, { hour: 10, index: 80 }, { hour: 12, index: 68 }, { hour: 14, index: 72 },
      { hour: 16, index: 85 }, { hour: 18, index: 99 }, { hour: 20, index: 75 }, { hour: 22, index: 38 },
    ],
    economicData: { avgPropertyValue: 18500, taxRevenue: 95000, jobCreation: 420000, infrastructureCost: 125000 },
    aiRecommendations: {
      zoning: [
        "Convert derelict mill lands in Lower Parel to affordable housing with commercial ground floors",
        "Designate Navi Mumbai nodes as satellite CBDs to decongest island city",
        "Create coastal protection zones with mangrove restoration along western suburbs",
      ],
      roads: [
        "Complete coastal road to redistribute traffic from Western Express Highway — 25% reduction projected",
        "Implement congestion pricing in South Mumbai during peak hours 8-11 AM and 5-8 PM",
        "Build dedicated freight corridor from JNPT to bypass city roads entirely",
      ],
      greenSpaces: [
        "Extend Aarey Forest protection zone by 300 acres — serves as city's last major lung space",
        "Create elevated gardens on abandoned rail bridges in central Mumbai",
        "Develop mangrove eco-parks along Thane Creek with public access boardwalks",
      ],
      confidence: 0.84,
      warnings: [
        "Sea level rise projections threaten low-lying areas — avoid new residential zoning below 3m elevation",
        "Local train network at 150% capacity — transit-oriented development critical",
      ],
    },
    zones: [
      { name: "BKC Business District", type: "commercial", coordinates: [[19.063, 72.865], [19.072, 72.865], [19.072, 72.878], [19.063, 72.878]], color: "#00D1FF" },
    ],
    landmarks: [
      { name: "Gateway of India", coordinates: [19.0402, 72.8347], type: "heritage", info: "Iconic landmark, Tourist density: Very High" },
      { name: "BKC", coordinates: [19.0660, 72.8710], type: "commercial", info: "Financial district, 500+ offices" },
    ],
  },
  bengaluru: {
    name: "Bengaluru",
    state: "Karnataka",
    coordinates: [12.9716, 77.5946],
    population: 13193000,
    area: 741,
    aqi: 108,
    trafficIndex: 85,
    populationDensity: 12400,
    greenCover: 14.2,
    populationForecast: [
      { year: 2020, value: 12340000 }, { year: 2022, value: 12750000 }, { year: 2024, value: 13193000 },
      { year: 2026, value: 13700000 }, { year: 2028, value: 14250000 }, { year: 2030, value: 14800000 },
      { year: 2032, value: 15350000 }, { year: 2034, value: 15900000 }, { year: 2036, value: 16400000 },
      { year: 2038, value: 16850000 }, { year: 2040, value: 17250000 },
    ],
    emissions: [
      { sector: "Transport", value: 36 }, { sector: "Industry", value: 24 },
      { sector: "Residential", value: 22 }, { sector: "Commercial", value: 14 }, { sector: "Other", value: 4 },
    ],
    trafficByHour: [
      { hour: 0, index: 10 }, { hour: 2, index: 7 }, { hour: 4, index: 9 }, { hour: 6, index: 32 },
      { hour: 8, index: 90 }, { hour: 10, index: 72 }, { hour: 12, index: 58 }, { hour: 14, index: 62 },
      { hour: 16, index: 78 }, { hour: 18, index: 95 }, { hour: 20, index: 55 }, { hour: 22, index: 28 },
    ],
    economicData: { avgPropertyValue: 8800, taxRevenue: 42000, jobCreation: 285000, infrastructureCost: 68000 },
    aiRecommendations: {
      zoning: [
        "Create tech park buffer zones with affordable housing mandates near Electronic City and Whitefield",
        "Rezone old Peenya industrial area for mixed-use development with metro connectivity",
        "Establish lake buffer zones (75m) to prevent further encroachment of 200+ urban lakes",
      ],
      roads: [
        "Extend metro Phase 3 to airport via Yelahanka — reduces taxi dependency by 40%",
        "Build peripheral ring road to divert inter-state traffic from city core",
        "Convert MG Road-Brigade Road corridor to pedestrian-priority zone weekends",
      ],
      greenSpaces: [
        "Restore 50 degraded lakes with rejuvenation plan — each lake creates 10-acre public park",
        "Develop Cubbon Park extension connecting to Lalbagh via green corridor",
        "Mandate 20% green space in all new layouts exceeding 5 acres",
      ],
      confidence: 0.85,
      warnings: [
        "Groundwater table critically low — lake restoration is urgent for recharge",
        "IT corridor traffic unsustainable without metro extension",
      ],
    },
    zones: [],
    landmarks: [
      { name: "Cubbon Park", coordinates: [12.9763, 77.5929], type: "park", info: "300-acre urban park, Lung of Bengaluru" },
      { name: "Electronic City", coordinates: [12.8399, 77.6770], type: "tech", info: "IT Hub, 200+ companies, Pop: 350K" },
    ],
  },
  chennai: {
    name: "Chennai",
    state: "Tamil Nadu",
    coordinates: [13.0827, 80.2707],
    population: 11503000,
    area: 426,
    aqi: 118,
    trafficIndex: 76,
    populationDensity: 14800,
    greenCover: 10.5,
    populationForecast: [
      { year: 2020, value: 10900000 }, { year: 2022, value: 11180000 }, { year: 2024, value: 11503000 },
      { year: 2026, value: 11850000 }, { year: 2028, value: 12200000 }, { year: 2030, value: 12600000 },
      { year: 2032, value: 13000000 }, { year: 2034, value: 13350000 }, { year: 2036, value: 13650000 },
      { year: 2038, value: 13900000 }, { year: 2040, value: 14100000 },
    ],
    emissions: [
      { sector: "Transport", value: 35 }, { sector: "Industry", value: 30 },
      { sector: "Residential", value: 17 }, { sector: "Commercial", value: 13 }, { sector: "Other", value: 5 },
    ],
    trafficByHour: [
      { hour: 0, index: 14 }, { hour: 2, index: 9 }, { hour: 4, index: 11 }, { hour: 6, index: 38 },
      { hour: 8, index: 82 }, { hour: 10, index: 65 }, { hour: 12, index: 52 }, { hour: 14, index: 56 },
      { hour: 16, index: 70 }, { hour: 18, index: 88 }, { hour: 20, index: 52 }, { hour: 22, index: 25 },
    ],
    economicData: { avgPropertyValue: 6800, taxRevenue: 32000, jobCreation: 195000, infrastructureCost: 52000 },
    aiRecommendations: {
      zoning: [
        "Create flood-resilient residential zones in south Chennai with elevated ground floors",
        "Expand IT corridor in OMR with integrated affordable housing every 5 km",
        "Designate Adyar estuary as protected ecological zone",
      ],
      roads: ["Extend metro Phase 2 to cover OMR tech corridor", "Build storm-resilient roads in low-lying areas with improved drainage", "Create dedicated bus lanes on Anna Salai"],
      greenSpaces: ["Restore Pallikaranai marshland — critical flood buffer for south Chennai", "Create coastal greenway from Marina to Thiruvanmiyur", "Develop urban forest in Perungudi landfill site post-remediation"],
      confidence: 0.81,
      warnings: ["Flood-prone zones in Velachery-Tambaram corridor need urgent drainage infrastructure", "Coastal erosion threatening Marina Beach area"],
    },
    zones: [],
    landmarks: [{ name: "Marina Beach", coordinates: [13.0499, 80.2824], type: "park", info: "World's 2nd longest urban beach" }],
  },
  kolkata: {
    name: "Kolkata",
    state: "West Bengal",
    coordinates: [22.5726, 88.3639],
    population: 15134000,
    area: 1887,
    aqi: 145,
    trafficIndex: 78,
    populationDensity: 24000,
    greenCover: 8.3,
    populationForecast: [
      { year: 2020, value: 14850000 }, { year: 2022, value: 14980000 }, { year: 2024, value: 15134000 },
      { year: 2026, value: 15350000 }, { year: 2028, value: 15580000 }, { year: 2030, value: 15800000 },
      { year: 2032, value: 16000000 }, { year: 2034, value: 16180000 }, { year: 2036, value: 16340000 },
      { year: 2038, value: 16480000 }, { year: 2040, value: 16600000 },
    ],
    emissions: [
      { sector: "Transport", value: 33 }, { sector: "Industry", value: 27 },
      { sector: "Residential", value: 22 }, { sector: "Commercial", value: 12 }, { sector: "Other", value: 6 },
    ],
    trafficByHour: [
      { hour: 0, index: 16 }, { hour: 2, index: 11 }, { hour: 4, index: 13 }, { hour: 6, index: 38 },
      { hour: 8, index: 88 }, { hour: 10, index: 70 }, { hour: 12, index: 60 }, { hour: 14, index: 64 },
      { hour: 16, index: 75 }, { hour: 18, index: 90 }, { hour: 20, index: 62 }, { hour: 22, index: 30 },
    ],
    economicData: { avgPropertyValue: 5200, taxRevenue: 22000, jobCreation: 125000, infrastructureCost: 38000 },
    aiRecommendations: {
      zoning: ["Redevelop abandoned jute mill lands along Hooghly for mixed-use waterfront", "Create transit-oriented zones around East-West Metro stations", "Designate East Kolkata Wetlands as permanent ecological reserve"],
      roads: ["Complete East-West Metro extension to Salt Lake", "Build Howrah-Kolkata elevated connector for freight diversion", "Pedestrianize Park Street on weekends"],
      greenSpaces: ["Preserve East Kolkata Wetlands — world's largest organic sewage recycling system", "Develop riverfront promenade along Hooghly from Howrah to Princep Ghat", "Create urban forests in New Town planned areas"],
      confidence: 0.79,
      warnings: ["East Kolkata Wetlands under severe encroachment threat", "Flooding risk high in low-lying north Kolkata"],
    },
    zones: [],
    landmarks: [{ name: "Howrah Bridge", coordinates: [22.5851, 88.3468], type: "heritage", info: "Iconic cantilever bridge, Daily traffic: 100K vehicles" }],
  },
  pune: {
    name: "Pune",
    state: "Maharashtra",
    coordinates: [18.5204, 73.8567],
    population: 7764000,
    area: 331,
    aqi: 112,
    trafficIndex: 74,
    populationDensity: 9400,
    greenCover: 16.8,
    populationForecast: [
      { year: 2020, value: 7200000 }, { year: 2022, value: 7480000 }, { year: 2024, value: 7764000 },
      { year: 2026, value: 8100000 }, { year: 2028, value: 8450000 }, { year: 2030, value: 8850000 },
      { year: 2032, value: 9250000 }, { year: 2034, value: 9600000 }, { year: 2036, value: 9900000 },
      { year: 2038, value: 10150000 }, { year: 2040, value: 10350000 },
    ],
    emissions: [
      { sector: "Transport", value: 34 }, { sector: "Industry", value: 26 },
      { sector: "Residential", value: 20 }, { sector: "Commercial", value: 15 }, { sector: "Other", value: 5 },
    ],
    trafficByHour: [
      { hour: 0, index: 10 }, { hour: 2, index: 6 }, { hour: 4, index: 8 }, { hour: 6, index: 30 },
      { hour: 8, index: 80 }, { hour: 10, index: 62 }, { hour: 12, index: 50 }, { hour: 14, index: 55 },
      { hour: 16, index: 68 }, { hour: 18, index: 85 }, { hour: 20, index: 50 }, { hour: 22, index: 22 },
    ],
    economicData: { avgPropertyValue: 7500, taxRevenue: 25000, jobCreation: 165000, infrastructureCost: 45000 },
    aiRecommendations: {
      zoning: ["Develop Hinjewadi Phase 4 with integrated residential to reduce commute burden", "Create startup incubation zones near university campuses", "Rezone Kothrud-Karve Nagar for higher density near metro"],
      roads: ["Complete Pune Metro Ring to connect Hinjewadi-Kharadi-Hadapsar tech hubs", "Build elevated road from Swargate to Katraj to bypass tunnel congestion", "Implement smart traffic signals on FC Road corridor"],
      greenSpaces: ["Protect Sahyadri foothills with no-construction buffer", "Create riverfront park along Mula-Mutha river", "Develop Vetal Tekdi as connected hill-park trail system"],
      confidence: 0.83,
      warnings: ["Hinjewadi commute crisis — single-road dependency needs alternate route", "Hill slope construction causing landslide risk"],
    },
    zones: [],
    landmarks: [{ name: "Shaniwar Wada", coordinates: [18.5196, 73.8553], type: "heritage", info: "Historic fort palace, Cultural center" }],
  },
  warangal: {
    name: "Warangal",
    state: "Telangana",
    coordinates: [17.9784, 79.5941],
    population: 811844,
    area: 406,
    aqi: 95,
    trafficIndex: 45,
    populationDensity: 3200,
    greenCover: 22.5,
    populationForecast: [
      { year: 2020, value: 755000 }, { year: 2022, value: 782000 }, { year: 2024, value: 811000 },
      { year: 2026, value: 845000 }, { year: 2028, value: 882000 }, { year: 2030, value: 920000 },
      { year: 2032, value: 960000 }, { year: 2034, value: 1000000 }, { year: 2036, value: 1040000 },
      { year: 2038, value: 1075000 }, { year: 2040, value: 1105000 },
    ],
    emissions: [
      { sector: "Transport", value: 28 }, { sector: "Industry", value: 20 },
      { sector: "Residential", value: 30 }, { sector: "Commercial", value: 12 }, { sector: "Other", value: 10 },
    ],
    trafficByHour: [
      { hour: 0, index: 5 }, { hour: 2, index: 3 }, { hour: 4, index: 5 }, { hour: 6, index: 20 },
      { hour: 8, index: 55 }, { hour: 10, index: 42 }, { hour: 12, index: 35 }, { hour: 14, index: 38 },
      { hour: 16, index: 50 }, { hour: 18, index: 60 }, { hour: 20, index: 35 }, { hour: 22, index: 15 },
    ],
    economicData: { avgPropertyValue: 2800, taxRevenue: 3500, jobCreation: 28000, infrastructureCost: 8500 },
    aiRecommendations: {
      zoning: ["Develop IT park near NIT Warangal to retain local talent", "Create heritage tourism zone around Thousand Pillar Temple and Warangal Fort", "Designate growth corridors toward Kazipet for planned expansion"],
      roads: ["Upgrade NH-163 bypass to reduce city-center heavy vehicle traffic", "Build dedicated cycle lanes connecting university to city center", "Improve connectivity between Warangal and Kazipet with rapid transit"],
      greenSpaces: ["Develop eco-park around Bhadrakali Lake", "Create heritage garden trail connecting historical monuments", "Plant roadside avenue trees on all major arterials"],
      confidence: 0.76,
      warnings: ["Heritage sites need protected buffer zones", "Drainage infrastructure inadequate for monsoon volumes"],
    },
    zones: [],
    landmarks: [{ name: "Warangal Fort", coordinates: [17.9551, 79.5942], type: "heritage", info: "13th century Kakatiya fort, Heritage site" }],
  },
  khammam: {
    name: "Khammam",
    state: "Telangana",
    coordinates: [17.2473, 80.1514],
    population: 315109,
    area: 202,
    aqi: 82,
    trafficIndex: 35,
    populationDensity: 2800,
    greenCover: 28.4,
    populationForecast: [
      { year: 2020, value: 290000 }, { year: 2022, value: 302000 }, { year: 2024, value: 315000 },
      { year: 2026, value: 330000 }, { year: 2028, value: 348000 }, { year: 2030, value: 365000 },
      { year: 2032, value: 383000 }, { year: 2034, value: 400000 }, { year: 2036, value: 415000 },
      { year: 2038, value: 428000 }, { year: 2040, value: 440000 },
    ],
    emissions: [
      { sector: "Transport", value: 22 }, { sector: "Industry", value: 18 },
      { sector: "Residential", value: 35 }, { sector: "Commercial", value: 10 }, { sector: "Other", value: 15 },
    ],
    trafficByHour: [
      { hour: 0, index: 3 }, { hour: 2, index: 2 }, { hour: 4, index: 4 }, { hour: 6, index: 15 },
      { hour: 8, index: 45 }, { hour: 10, index: 35 }, { hour: 12, index: 28 }, { hour: 14, index: 30 },
      { hour: 16, index: 42 }, { hour: 18, index: 50 }, { hour: 20, index: 28 }, { hour: 22, index: 10 },
    ],
    economicData: { avgPropertyValue: 2200, taxRevenue: 1800, jobCreation: 12000, infrastructureCost: 4500 },
    aiRecommendations: {
      zoning: ["Develop agro-processing industrial zone on city outskirts", "Create educational campus zone near Khammam town center", "Plan satellite township on Hyderabad highway corridor"],
      roads: ["Upgrade NH-365 bypass to 4-lane for growing traffic", "Build inner ring road connecting all arterial roads", "Improve rural-urban road connectivity to surrounding mandals"],
      greenSpaces: ["Develop Khammam Fort hilltop as city park and viewpoint", "Create lakefront recreational area at Lakaram Tank", "Establish green belt along Munneru River"],
      confidence: 0.72,
      warnings: ["Flash flood risk from Munneru River during heavy monsoon", "Rapid unplanned growth on Hyderabad highway needs regulation"],
    },
    zones: [],
    landmarks: [{ name: "Khammam Fort", coordinates: [17.2470, 80.1500], type: "heritage", info: "Hilltop fort, City landmark, Panoramic views" }],
  },
  vijayawada: {
    name: "Vijayawada",
    state: "Andhra Pradesh",
    coordinates: [16.5062, 80.648],
    population: 1476931,
    area: 61,
    aqi: 105,
    trafficIndex: 65,
    populationDensity: 15600,
    greenCover: 11.2,
    populationForecast: [
      { year: 2020, value: 1380000 }, { year: 2022, value: 1428000 }, { year: 2024, value: 1477000 },
      { year: 2026, value: 1530000 }, { year: 2028, value: 1590000 }, { year: 2030, value: 1650000 },
      { year: 2032, value: 1710000 }, { year: 2034, value: 1770000 }, { year: 2036, value: 1820000 },
      { year: 2038, value: 1865000 }, { year: 2040, value: 1900000 },
    ],
    emissions: [
      { sector: "Transport", value: 32 }, { sector: "Industry", value: 24 },
      { sector: "Residential", value: 25 }, { sector: "Commercial", value: 12 }, { sector: "Other", value: 7 },
    ],
    trafficByHour: [
      { hour: 0, index: 8 }, { hour: 2, index: 5 }, { hour: 4, index: 7 }, { hour: 6, index: 28 },
      { hour: 8, index: 72 }, { hour: 10, index: 55 }, { hour: 12, index: 45 }, { hour: 14, index: 48 },
      { hour: 16, index: 62 }, { hour: 18, index: 78 }, { hour: 20, index: 42 }, { hour: 22, index: 18 },
    ],
    economicData: { avgPropertyValue: 4200, taxRevenue: 8500, jobCreation: 55000, infrastructureCost: 18000 },
    aiRecommendations: {
      zoning: ["Develop Amaravati capital region with sustainable mixed-use planning", "Create riverside commercial zone along Krishna River with flood-proofing", "Establish IT SEZ near Gannavaram airport corridor"],
      roads: ["Build inner ring road connecting Benz Circle to Kanuru and Gunadala", "Create Krishna River bridge bypass for heavy vehicles", "Implement BRT on MG Road-Eluru Road corridor"],
      greenSpaces: ["Develop Krishna riverfront as 5-km linear park and promenade", "Create hilltop eco-park at Indrakeeladri", "Establish botanical garden in planned Amaravati zone"],
      confidence: 0.77,
      warnings: ["Krishna River flooding risk requires elevated infrastructure in low-lying wards", "Amaravati development needs careful ecological impact assessment"],
    },
    zones: [],
    landmarks: [{ name: "Kanaka Durga Temple", coordinates: [16.5175, 80.6095], type: "heritage", info: "Hilltop temple, Major pilgrimage site" }],
  },
};

export const CITY_NAMES = Object.keys(CITIES);

export function searchCity(query: string): CityData | null {
  const q = query.toLowerCase().trim();
  for (const key of CITY_NAMES) {
    if (key.includes(q) || CITIES[key].name.toLowerCase().includes(q)) {
      return CITIES[key];
    }
  }
  return null;
}

export function getCityByName(name: string): CityData | null {
  const key = name.toLowerCase().replace(/\s+/g, '');
  return CITIES[key] || searchCity(name);
}
