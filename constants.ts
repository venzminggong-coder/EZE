import { DisasterModule, DisasterType, RegionData, Character } from './types';

export const DATA_SOURCES = "Authored by READYPH Safety Board & National Authorities (2025)";

export const RANDOM_FACTS = [
  "The Philippines is located along the Pacific Ring of Fire, making it prone to earthquakes.",
  "There are about 20 typhoons that enter the Philippine Area of Responsibility (PAR) every year.",
  "PHIVOLCS monitors over 20 active volcanoes in the Philippines.",
  "The West Valley Fault is a major seismic threat capable of a Magnitude 7.2 earthquake.",
  "PAGASA's rainfall warning system uses Yellow, Orange, and Red color codes.",
  "Mangroves act as natural barriers against storm surges and coastal erosion."
];

export const CHARACTERS: Character[] = [
  { type: 'Fireman', name: 'Chief Ramos', emoji: '🧑‍🚒', role: 'Response Chief', color: 'bg-orange-500', description: 'Emergency response lead with 20 years experience.' },
  { type: 'Scientist', name: 'Dr. Solidum', emoji: '👩‍🔬', role: 'Seismology Expert', color: 'bg-blue-600', description: 'Monitors fault lines and volcanic tremors.' },
  { type: 'Researcher', name: 'Prof. Amihan', emoji: '👨‍💻', role: 'Climate Scientist', color: 'bg-cyan-500', description: 'Expert in typhoon tracking and rainfall modeling.' },
  { type: 'Worker', name: 'Kuya Bert', emoji: '👷', role: 'Infrastructure Tech', color: 'bg-slate-700', description: 'Ensures building safety and utility resilience.' },
  { type: 'NGO', name: 'Sister Grace', emoji: '👩‍💼', role: 'Community Relief', color: 'bg-purple-500', description: 'Coordinates logistics and psycho-social support.' },
  { type: 'Student', name: 'Pao', emoji: '🧑‍🎓', role: 'Safety Ambassador', color: 'bg-indigo-500', description: 'Youth lead for school preparedness programs.' },
  { type: 'Teacher', name: 'Maam Reyes', emoji: '👩‍🏫', role: 'Safety Educator', color: 'bg-emerald-600', description: 'Trains families on Go-Bag and evacuation routes.' }
];

export const CHARACTER_QUOTES: Record<string, string[]> = {
  'Fireman': [
    "Check your Go-Bag batteries every 3 months!",
    "Never cross a flooded road on foot or in a car.",
    "Fire exits must always be clear and accessible.",
    "Practice 'Stop, Drop, and Roll' with your siblings!",
    "Always know two ways out of every room."
  ],
  'Scientist': [
    "The ground speaks through small tremors. Listen to them.",
    "Volcanic ash is basically pulverized rock and glass. Protect your lungs.",
    "Fault systems move in cycles. Preparedness is the only shield."
  ],
  'Researcher': [
    "Sea level rise makes storm surges more dangerous.",
    "El Niño patterns increase the risk of extreme droughts.",
    "Red rainfall warnings mean immediate action is required."
  ]
};

export const MODULES: DisasterModule[] = [
  {
    id: 'mod_eq',
    type: DisasterType.Earthquake,
    title: 'Earthquake & Tsunami',
    description: 'Master seismic resilience.',
    icon: '🏚️', 
    color: 'bg-amber-700',
    learningContent: `### Seismic Hazards
The Philippines is situated on the Ring of Fire. This means we are prone to frequent tremors.
### Drop, Cover, Hold
The standard protocol during shaking. Find a sturdy table and stay there.
### Tsunami Warning
Roar from the sea, receding water, or strong shaking are signs.
### Structural Safety
Check your walls for cracks. Anchoring heavy furniture prevents them from falling.
### Post-Quake Safety
Expect aftershocks. Check yourself for injuries before helping others.`,
    quizItems: [
      { id: 'eq1', question: 'What is the standard action during an earthquake?', choices: ['Run outside', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Hide in a closet'], correctIndex: 1, explanation: 'Drop, Cover, and Hold On is the safest way to protect yourself from falling debris.' },
      { id: 'eq2', question: 'What is a tsunami warning sign?', choices: ['Strong wind', 'Heavy rain', 'Sea water receding rapidly', 'Dark clouds'], correctIndex: 2, explanation: 'A rapid withdrawal of the sea is a natural warning sign that a tsunami wave is coming.' },
      { id: 'eq3', question: 'Who monitors earthquakes in the Philippines?', choices: ['PAGASA', 'PHIVOLCS', 'MMDA', 'NDRRMC'], correctIndex: 1, explanation: 'PHIVOLCS is the primary agency for monitoring seismic and volcanic activity.' },
      { id: 'eq4', question: 'What is "Liquefaction"?', choices: ['Solid ground turning fluid during shaking', 'Heavy rainfall', 'Lava flow', 'Wind gusts'], correctIndex: 0, explanation: 'During shaking, loose saturated soil loses strength and acts like a liquid.' },
      { id: 'eq5', question: 'Where is the safest place during an earthquake tremor?', choices: ['Near a window', 'Under a sturdy table', 'In an elevator', 'On a balcony'], correctIndex: 1, explanation: 'A sturdy table provides cover from falling objects, the main cause of injury.' },
      { id: 'eq6', question: 'What does the PEIS Scale measure?', choices: ['Magnitude', 'Intensity', 'Wind Speed', 'Water Depth'], correctIndex: 1, explanation: 'The PHIVOLCS Earthquake Intensity Scale measures how much the shaking is felt by people.' },
      { id: 'eq7', question: 'If you are driving during a quake, you should:', choices: ['Speed up', 'Stop in an open area', 'Park under a bridge', 'Drive faster to a tunnel'], correctIndex: 1, explanation: 'Bridges and buildings are collapse hazards. Find an open space.' }
    ]
  },
  {
    id: 'mod_ty',
    type: DisasterType.Typhoon,
    title: 'Typhoon & Floods',
    description: 'Weather and water safety.',
    icon: '🌀',
    color: 'bg-blue-600',
    learningContent: `### Storm Signals
PAGASA signals range from 1 to 5. Higher signals mean stronger winds.
### Flood Depth
6 inches of water can knock you down. 2 feet can float a car.
### Go-Bag
Must have 72 hours of supplies including food, water, and medicine.
### Electrical Safety
Turn off the main power switch if flooding enters your home.
### Rainfall Warning
Yellow = Monitor. Orange = Alert. Red = Evacuate.`,
    quizItems: [
      { id: 'ty1', question: 'What rainfall color means "Evacuate"?', choices: ['Yellow', 'Orange', 'Red', 'Blue'], correctIndex: 2, explanation: 'Red rainfall warning indicates severe flooding is imminent; evacuate immediately.' },
      { id: 'ty2', question: 'How much water can sweep a car away?', choices: ['1 inch', '2 feet', '6 inches', '1 foot'], correctIndex: 1, explanation: 'Two feet of moving water can float and sweep away most vehicles.' },
      { id: 'ty3', question: 'What is the calm center of a typhoon called?', choices: ['The Core', 'The Eye', 'The Wall', 'The Tail'], correctIndex: 1, explanation: 'The Eye is the calmest part, but the strongest winds follow immediately in the eyewall.' },
      { id: 'ty4', question: 'A Signal No. 4 typhoon has winds of:', choices: ['30-60 kph', '118-184 kph', 'Over 185 kph', 'Over 220 kph'], correctIndex: 1, explanation: 'Signal No. 4 corresponds to very strong winds capable of significant damage.' },
      { id: 'ty5', question: 'Which agency provides weather forecasts?', choices: ['PHIVOLCS', 'PAGASA', 'DENR', 'DOH'], correctIndex: 1, explanation: 'PAGASA is the national agency for weather and climate information.' }
    ]
  },
  {
    id: 'mod_ss',
    type: DisasterType.StormSurge,
    title: 'Storm Surge',
    description: 'Coastal flood protection.',
    icon: '🌊',
    color: 'bg-sky-700',
    learningContent: `### Marine Hazard
Sudden rise in sea level caused by cyclone winds and low atmospheric pressure.
### Protection
Evacuate at least 500m inland or to high ground before the storm makes landfall.
### Myth
It is NOT a tsunami. Tsunami is seismic; Storm Surge is meteorological.
### Vulnerable Areas
Coastal communities with shallow shorelines are at highest risk.
### Safety Action
Never stay in a beach house during a Signal 3 or higher typhoon if storm surges are warned.`,
    quizItems: [
      { id: 'ss1', question: 'What causes a storm surge?', choices: ['Earthquakes', 'Cyclone winds and low pressure', 'Underwater landslides', 'Melting ice'], correctIndex: 1, explanation: 'Storm surges are primarily driven by the intense winds of a tropical cyclone pushing water toward the coast.' },
      { id: 'ss2', question: 'Which city suffered massive storm surges in 2013?', choices: ['Davao', 'Manila', 'Tacloban', 'Baguio'], correctIndex: 2, explanation: 'Super Typhoon Yolanda (Haiyan) brought catastrophic surges to Tacloban City.' },
      { id: 'ss3', question: 'How far inland should you evacuate if a surge is expected?', choices: ['5 meters', '500 meters or more', 'Stay at the shore', '10 meters'], correctIndex: 1, explanation: 'Storm surges can reach several kilometers inland. 500m is the minimum recommended safe distance.' }
    ]
  },
  {
    id: 'mod_vo',
    type: DisasterType.Volcano,
    title: 'Volcanic Eruption',
    description: 'Ash and lahar protection.',
    icon: '🌋',
    color: 'bg-red-700',
    learningContent: `### Alert Levels
Range from 0 to 5. Level 5 means a hazardous eruption is in progress.
### Ashfall
Fine rock fragments. They are abrasive and dangerous for lungs and eyes.
### Lahar
Volcanic mudflows triggered by heavy rain. They move very fast down mountain slopes.
### Safety Gear
Wear N95 masks, goggles, and long-sleeved clothing during ashfall.
### Exclusion Zone
Always respect the Permanent Danger Zone (PDZ) around active volcanoes.`,
    quizItems: [
      { id: 'vo1', question: 'What is the best mask for ashfall?', choices: ['Surgical mask', 'N95 mask', 'Cloth mask', 'Gas mask'], correctIndex: 1, explanation: 'N95 masks filter the fine, glass-like particles of volcanic ash.' },
      { id: 'vo2', question: 'What is Lahar?', choices: ['Hot lava', 'Volcanic mudflow', 'Smoke cloud', 'Acid rain'], correctIndex: 1, explanation: 'Lahar is a mixture of water and volcanic debris that flows like wet concrete.' },
      { id: 'vo3', question: 'Alert Level 4 means:', choices: ['Normal', 'Quiet', 'Hazardous eruption imminent', 'Quiet status'], correctIndex: 2, explanation: 'Alert Level 4 indicates that a hazardous eruption is expected within hours or days.' }
    ]
  },
  {
    id: 'mod_ls',
    type: DisasterType.Landslide,
    title: 'Landslide',
    description: 'Slope stability and soil hazards.',
    icon: '⛰️',
    color: 'bg-emerald-800',
    learningContent: `### Warning Signs
New cracks in ground, tilting trees or poles, or sudden water seepage.
### Triggers
Heavy rain, earthquakes, or excavation near slopes.
### Survival
If caught, curl into a ball and protect your head. Stay away from valleys and paths.
### Prevention
Planting deep-rooted trees helps stabilize soil. Avoid building houses at the base of steep hills.
### Immediate Action
If you hear a rumbling sound, evacuate the area immediately.`,
    quizItems: [
      { id: 'ls1', question: 'What is a major warning sign of an impending landslide?', choices: ['New cracks in the ground', 'Falling leaves', 'Cold weather', 'Low humidity'], correctIndex: 0, explanation: 'Cracks in the ground or foundations indicate the soil is beginning to shift.' },
      { id: 'ls2', question: 'What should you do if you are inside during a landslide?', choices: ['Run outside immediately', 'Stay inside and get under a sturdy table', 'Open all windows', 'Go to the basement'], correctIndex: 1, explanation: 'Debris moves fast; staying under a sturdy object protects you from structural collapse.' }
    ]
  },
  {
    id: 'mod_fi',
    type: DisasterType.Fire,
    title: 'Fire Hazards',
    description: 'Prevention and response.',
    icon: '🔥',
    color: 'bg-orange-600',
    learningContent: `### PASS Method
Pull the pin, Aim the nozzle, Squeeze the handle, Sweep side to side.
### Stop, Drop, Roll
If your clothes catch fire, do not run. It fuels the flames.
### Smoke Survival
Crawl low under the smoke. Cleaner air is found near the floor.
### Fire Exit
Never lock fire exits with a key that is not nearby. Keep pathways clear.
### Cooking Safety
Never leave an open flame unattended. Keep flammable items away from the stove.`,
    quizItems: [
      { id: 'fi1', question: 'What does PASS stand for?', choices: ['Push, Aim, Stop, Stay', 'Pull, Aim, Squeeze, Sweep', 'Point, Aim, Start, Stop', 'Pull, Ask, Sit, Smile'], correctIndex: 1, explanation: 'PASS is the universal method for using a fire extinguisher effectively.' },
      { id: 'fi2', question: 'What should you do if your clothes catch fire?', choices: ['Run fast', 'Stop, Drop, and Roll', 'Jump in water', 'Take them off'], correctIndex: 1, explanation: 'Stop, Drop, and Roll smothers the flames and prevents them from reaching your face.' }
    ]
  }
];

export const PH_REGIONS: RegionData[] = [
  { id: 'R1', name: 'Ilocos Region', islandGroup: 'Luzon', riskLevel: 'Medium', commonHazards: [DisasterType.Typhoon, DisasterType.Earthquake], info: 'Vulnerable to northern typhoons and Manila Trench tremors.', details: ['High coastal erosion', 'Manila Trench seismic risk', 'Frequent typhoon Landfalls'], coordinates: { x: 75, y: 80 }, color: '#27ae60' },
  { id: 'CAR', name: 'Cordillera (CAR)', islandGroup: 'Luzon', riskLevel: 'High', commonHazards: [DisasterType.Landslide], info: 'Mountainous terrain prone to massive landslides.', details: ['Frequent road blockages', 'Soil saturation risks', 'Sinkholes in Baguio'], coordinates: { x: 100, y: 95 }, color: '#1e8449' },
  { id: 'R2', name: 'Cagayan Valley', islandGroup: 'Luzon', riskLevel: 'High', commonHazards: [DisasterType.Flood, DisasterType.Typhoon], info: 'Major river basin prone to widespread flooding.', details: ['Cagayan River overflow', 'Direct typhoon landfall path', 'Agricultural damage risk'], coordinates: { x: 135, y: 105 }, color: '#2ecc71' },
  { id: 'R3', name: 'Central Luzon', islandGroup: 'Luzon', riskLevel: 'High', commonHazards: [DisasterType.Volcano, DisasterType.Flood], info: 'Low-lying floodplains and home to Mt. Pinatubo.', details: ['Lahar risks from Pinatubo', 'Pampanga River flooding', 'Storm surges in Aurora'], coordinates: { x: 95, y: 155 }, color: '#229954' },
  { id: 'NCR', name: 'Metro Manila', islandGroup: 'Luzon', riskLevel: 'High', commonHazards: [DisasterType.Earthquake, DisasterType.Flood], info: 'High density urban center atop the West Valley Fault.', details: ['West Valley Fault (The Big One)', 'Severe urban flooding', 'Liquefaction risks'], coordinates: { x: 110, y: 180 }, color: '#e74c3c' },
  { id: 'R4A', name: 'CALABARZON', islandGroup: 'Luzon', riskLevel: 'High', commonHazards: [DisasterType.Volcano, DisasterType.Typhoon], info: 'Active volcanoes and large industrial hubs.', details: ['Taal Volcano unrest', 'Industrial chemical risks', 'Laguna de Bay flooding'], coordinates: { x: 125, y: 210 }, color: '#c0392b' },
  { id: 'R4B', name: 'MIMAROPA', islandGroup: 'Luzon', riskLevel: 'Medium', commonHazards: [DisasterType.Typhoon, DisasterType.StormSurge], info: 'Archipelagic region vulnerable to sea hazards.', details: ['Island isolation in storms', 'Marine safety risks', 'Storm surges in Palawan'], coordinates: { x: 70, y: 250 }, color: '#27ae60' },
  { id: 'R5', name: 'Bicol Region', islandGroup: 'Luzon', riskLevel: 'High', commonHazards: [DisasterType.Typhoon, DisasterType.Volcano], info: 'Typhoon Alley and home to the active Mayon Volcano.', details: ['Mayon Lahar flows', 'Strong Pacific landfalls', 'Coastal flooding'], coordinates: { x: 190, y: 235 }, color: '#a93226' },
  { id: 'R6', name: 'Western Visayas', islandGroup: 'Visayas', riskLevel: 'Medium', commonHazards: [DisasterType.Flood, DisasterType.Typhoon], info: 'Vulnerable to riverine floods and coastal surges.', details: ['Panay River flooding', 'Boracay coastal erosion', 'Maritime disaster risk'], coordinates: { x: 115, y: 320 }, color: '#2ecc71' },
  { id: 'R7', name: 'Central Visayas', islandGroup: 'Visayas', riskLevel: 'High', commonHazards: [DisasterType.Earthquake, DisasterType.Typhoon], info: 'Bohol and Cebu are seismically active with several faults.', details: ['Bohol Fault activity', 'Urban flooding in Cebu', 'Coral reef degradation'], coordinates: { x: 170, y: 360 }, color: '#d35400' },
  { id: 'R8', name: 'Eastern Visayas', islandGroup: 'Visayas', riskLevel: 'High', commonHazards: [DisasterType.Typhoon, DisasterType.StormSurge], info: 'The frequent gateway for super typhoons.', details: ['Extreme storm surge risk', 'Landslide prone mountains', 'Tacloban coastal risk'], coordinates: { x: 220, y: 325 }, color: '#e67e22' },
  { id: 'R9', name: 'Zamboanga', islandGroup: 'Mindanao', riskLevel: 'Medium', commonHazards: [DisasterType.Flood, DisasterType.Earthquake], info: 'Coastal cities at risk of surge and tremors.', details: ['Sulu Trench seismic risk', 'Coastal flooding', 'Landslide in mountains'], coordinates: { x: 85, y: 430 }, color: '#27ae60' },
  { id: 'R10', name: 'Northern Mindanao', islandGroup: 'Mindanao', riskLevel: 'Medium', commonHazards: [DisasterType.Flood, DisasterType.Landslide], info: 'Flash flood risk from mountain rivers.', details: ['CDO River flooding', 'Camiguin volcanic monitoring', 'Mountain landslides'], coordinates: { x: 170, y: 430 }, color: '#2ecc71' },
  { id: 'R11', name: 'Davao Region', islandGroup: 'Mindanao', riskLevel: 'High', commonHazards: [DisasterType.Earthquake, DisasterType.Flood], info: 'Seismically active with recent strong tremors.', details: ['Mount Apo monitoring', 'Davao River flooding swarms', 'Coastal surge risk'], coordinates: { x: 235, y: 470 }, color: '#ba4a00' },
  { id: 'R12', name: 'SOCCSKSARGEN', islandGroup: 'Mindanao', riskLevel: 'Medium', commonHazards: [DisasterType.Earthquake, DisasterType.Flood], info: 'Prone to tremors and river basin flooding.', details: ['Cotabato basin flooding', 'High seismic activity', 'Agricultural drought'], coordinates: { x: 185, y: 495 }, color: '#28b463' },
  { id: 'R13', name: 'Caraga', islandGroup: 'Mindanao', riskLevel: 'High', commonHazards: [DisasterType.Flood, DisasterType.Typhoon], info: 'The gateway for typhoons entering Mindanao.', details: ['Agusan River floods', 'Pacific storm landfalls', 'Earthquake swarms'], coordinates: { x: 245, y: 415 }, color: '#1d8348' },
  { id: 'BARMM', name: 'BARMM', islandGroup: 'Mindanao', riskLevel: 'High', commonHazards: [DisasterType.Flood], info: 'Severe flooding risk in the Liguasan Marsh areas.', details: ['Marshland flooding', 'Typhoon landfall (Sulu)', 'Landslide in Basilan'], coordinates: { x: 135, y: 475 }, color: '#145a32' }
];