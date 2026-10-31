export interface WeaponSpec {
  id: string;
  name: string;
  designation: string;
  category: 'UNSC Kinetic' | 'UNSC Heavy' | 'Covenant Plasma' | 'Covenant Energy' | 'Forerunner Hardlight';
  ammoType: string;
  magSize: number;
  fireRate: number; // rounds/sec
  effectiveRange: string;
  shieldMultiplier: number;
  fleshMultiplier: number;
  description: string;
  lore: string;
  iconName: string;
  color: string;
}

export interface InstallationPoint {
  id: string;
  name: string;
  type: string;
  coordinates: { x: number; y: number; z: number };
  status: 'Operational' | 'Contained' | 'Critical' | 'Dormant';
  classification: string;
  summary: string;
  tacticalNotes: string;
  historyDate: string;
}

export interface LoreEntry {
  id: string;
  title: string;
  category: 'Installations' | 'Spartans' | 'Covenant' | 'UNSC Navy' | 'Forerunners';
  classification: string;
  subtitle: string;
  content: string[];
  keySpecs: { label: string; value: string }[];
}

export const WEAPONS_DATABASE: WeaponSpec[] = [
  {
    id: 'ma40',
    name: 'MA40 Assault Rifle',
    designation: 'Misriah Armory Individual Combat Weapon System',
    category: 'UNSC Kinetic',
    ammoType: '7.62x51mm FMJ Full Metal Jacket',
    magSize: 36,
    fireRate: 10,
    effectiveRange: 'Medium (150m)',
    shieldMultiplier: 0.8,
    fleshMultiplier: 1.4,
    description: 'The standard-issue UNSC bullpup assault rifle. High rate of fire with dependable kinetic suppression against unshielded targets.',
    lore: 'Manufactured by Misriah Armory, the MA40 is the battle-tested backbone of UNSC Marine and ODST combat operations across two centuries.',
    iconName: 'Crosshair',
    color: '#38bdf8'
  },
  {
    id: 'br75',
    name: 'BR75 Battle Rifle',
    designation: 'Misriah Armory Service Rifle',
    category: 'UNSC Kinetic',
    ammoType: '9.5x40mm HP-SAP High Penetration',
    magSize: 36,
    fireRate: 3.5, // 3-round bursts
    effectiveRange: 'Medium-Long (300m)',
    shieldMultiplier: 1.0,
    fleshMultiplier: 2.2,
    description: 'Gas-operated magazine-fed burst rifle delivering deadly three-round clusters. Revered for pinpoint mid-range marksmanship.',
    lore: 'Favored by Spartan super-soldiers for precision headshots once enemy shields have been stripped.',
    iconName: 'Target',
    color: '#60a5fa'
  },
  {
    id: 'srs99',
    name: 'SRS99-S7 AM Sniper Rifle',
    designation: 'Special Applications Sniper System',
    category: 'UNSC Kinetic',
    ammoType: '14.5x114mm APFSDS Armor-Piercing Fin-Stabilized',
    magSize: 4,
    fireRate: 1.2,
    effectiveRange: 'Extreme (1500m)',
    shieldMultiplier: 2.0,
    fleshMultiplier: 5.0,
    description: 'Devastating anti-matériel sniper rifle capable of piercing thick vehicle armor and neutralizing Covenant commanders with a single round.',
    lore: 'A masterpiece of human ballistics. The muzzle velocity exceeds Mach 4, leaving a telltale acoustic vapor trail in the atmosphere.',
    iconName: 'Eye',
    color: '#3b82f6'
  },
  {
    id: 'spnkr',
    name: 'M41 SPNKr Rocket Launcher',
    designation: 'Surface-to-Surface Missile Delivery System',
    category: 'UNSC Heavy',
    ammoType: '102mm High-Explosive Shaped Charge',
    magSize: 2,
    fireRate: 0.8,
    effectiveRange: 'Long (400m)',
    shieldMultiplier: 3.5,
    fleshMultiplier: 4.5,
    description: 'Iconic twin-tube disposable missile launcher. Fires high-yield tracking or dumbfire warheads capable of turning armored vehicles into slag.',
    lore: 'Affectionately called the "Spanker", its revolving double-tube design allows the operator to fire two rockets before reloading the canister.',
    iconName: 'Zap',
    color: '#f97316'
  },
  {
    id: 'plasma-rifle',
    name: 'Type-25 Directed Energy Rifle',
    designation: 'Sangheili Plasma Combat Rifle',
    category: 'Covenant Plasma',
    ammoType: 'Superheated Toroidal Plasma Core',
    magSize: 100, // percentage battery
    fireRate: 9,
    effectiveRange: 'Short-Medium (80m)',
    shieldMultiplier: 2.5,
    fleshMultiplier: 0.9,
    description: 'Automatic plasma projection rifle. Excels at stripping Spartan energy shields instantly through extreme thermal dissipation.',
    lore: 'Crafted in Sacred Promissory assemblies on High Charity. Fires ionized gas encased in a magnetic envelope that melts through standard titanium plating.',
    iconName: 'Flame',
    color: '#06b6d4'
  },
  {
    id: 'energy-sword',
    name: 'Type-1 Energy Sword',
    designation: 'Sangheili Nobles Holy Blade',
    category: 'Covenant Energy',
    ammoType: 'Shaped Plasma Battery (100 Charges)',
    magSize: 10,
    fireRate: 1.5,
    effectiveRange: 'Melee Lunge (4m)',
    shieldMultiplier: 4.0,
    fleshMultiplier: 5.0,
    description: 'Ceremonial close-quarters plasma weapon. Two curved plasma blades shaped by magnetic containment fields that slice through any known matter.',
    lore: 'Only Sangheili warriors of noble blood or aristocratic lineage are permitted to wield the sword in combat honor.',
    iconName: 'Sword',
    color: '#38bdf8'
  },
  {
    id: 'needler',
    name: 'Type-33 Guided Munitions Launcher',
    designation: 'Subanese Crystal Needler',
    category: 'Covenant Plasma',
    ammoType: 'Suban Blamite Crystalline Shards',
    magSize: 30,
    fireRate: 8,
    effectiveRange: 'Short-Medium (60m)',
    shieldMultiplier: 1.1,
    fleshMultiplier: 2.0,
    description: 'Fires crystalline needles that track organic targets and detonate in a devastating pink Supercombine explosion when sufficient needles impale the foe.',
    lore: 'Mined exclusively from the moon of Suban orbiting the Sangheili homeworld Sanghelios.',
    iconName: 'Sparkles',
    color: '#ec4899'
  }
];

export const INSTALLATION_LOCATIONS: InstallationPoint[] = [
  {
    id: 'control-room',
    name: 'The Control Room',
    type: 'Apex Command Nexus',
    coordinates: { x: 0, y: 3.8, z: 0.5 },
    status: 'Critical',
    classification: 'Class-0 Core Facility',
    summary: 'The primary command apex of Installation 04. Housing the Activation Index receptacle where the ring can be primed for galaxy-cleansing firing.',
    tacticalNotes: 'Defended by heavy automated sentinel forces and security teleportation gates. Master Chief inserted here to prevent Covenant activation.',
    historyDate: 'Discovered September 19, 2552'
  },
  {
    id: 'silent-cartographer',
    name: 'The Silent Cartographer',
    type: 'Planetary Map & Archive',
    coordinates: { x: 3.2, y: -1.2, z: 1.8 },
    status: 'Operational',
    classification: 'Sub-surface Cartographic Spire',
    summary: 'An island fortress facility housing the holographic map of the entire ring superstructure and subterranean transit grid.',
    tacticalNotes: 'UNSC Pelican Echo 419 inserted Spartan-117 onto the beachhead in one of the most celebrated amphibious assaults of the war.',
    historyDate: 'Secured September 20, 2552'
  },
  {
    id: 'the-library',
    name: 'The Library',
    type: 'Flood Containment & Index Vault',
    coordinates: { x: -2.8, y: 2.1, z: -1.4 },
    status: 'Contained',
    classification: 'Biohazard Maximum Security',
    summary: 'Vast subterranean archive containing genetic samples and the sacred Activation Index, watched over by 343 Guilty Spark.',
    tacticalNotes: 'Site of catastrophic Flood containment breach. Heavy sentinel beam grid failed when Flood spore density overwhelmed atmospheric scrubbers.',
    historyDate: 'Breached September 21, 2552'
  },
  {
    id: 'autumn-crash',
    name: 'UNSC Pillar of Autumn Crash Site',
    type: 'Human Cruiser Wreckage',
    coordinates: { x: -1.5, y: -3.5, z: 0.8 },
    status: 'Critical',
    classification: 'Halcyon-class Light Cruiser',
    summary: 'The grounded wreckage of Captain Jacob Keyes ship. Its fusion engines were destabilized by John-117 to obliterate Installation 04.',
    tacticalNotes: 'Epic Warthog dash across the 3km service corridor during final thermal reactor cascade. Core blast shattered the ring into orbital fragments.',
    historyDate: 'Detonated September 22, 2552'
  },
  {
    id: 'zeta-reformer',
    name: 'Reformer Spire 07',
    type: 'Sub-Structure Repair Node',
    coordinates: { x: 2.5, y: 2.7, z: -2.1 },
    status: 'Dormant',
    classification: 'Installation 07 Sub-Array',
    summary: 'Gigantic Forerunner energy conduits on Zeta Halo, synthesizing matter from the ring core to mend structural fractures after the Banished assault.',
    tacticalNotes: 'Emits intense gravitational distortions. Banished forces under Escharum erected anti-aircraft fortifications around the perimeter.',
    historyDate: 'Contested May 2560'
  }
];

export const LORE_DATABASE: LoreEntry[] = [
  {
    id: 'halo-array',
    title: 'The Halo Array (Sacred Rings)',
    category: 'Installations',
    classification: 'Forerunner Megastructure Tier 1',
    subtitle: 'Galactic Superweapons and Biosphere Preserves',
    content: [
      'The Halo Array is a network of seven ring-shaped artificial worlds built over 100,000 years ago by the ancient Forerunners.',
      'Each ring has an outer diameter of 10,000 kilometers (Installation 07 originally spanning 30,000 km) and maintains habitable gravity, atmospheric retention fields, and rich biosphere preserves on its interior surface.',
      'Designed as a weapon of absolute last resort against the parasitic Flood, the rings fire cross-dimensional superluminal radiation that destroys all sentient neural matter within a 25,000 light-year radius.'
    ],
    keySpecs: [
      { label: 'Outer Diameter', value: '10,000 kilometers' },
      { label: 'Surface Width', value: '318 kilometers' },
      { label: 'Effective Firing Range', value: '25,000 light years' },
      { label: 'Surface Gravity', value: '0.98 standard G' },
      { label: 'Atmospheric Mix', value: '78% N2, 21% O2, 1% Ar' }
    ]
  },
  {
    id: 'spartan-117',
    title: 'Master Chief Petty Officer John-117',
    category: 'Spartans',
    classification: 'SPARTAN-II Super-Soldier · Hyper-Lethal',
    subtitle: 'The Legendary UNSC Savior and Symbol of Hope',
    content: [
      'Born on the colony world of Eridanus II, John was selected by Dr. Catherine Halsey at age six as a candidate for the clandestine SPARTAN-II program.',
      'Subjected to intense biological, neurological, and physical augmentations at puberty, John-117 developed carbide ceramic bone ossification, near-instant synaptic reaction times, and supreme tactical intuition.',
      'Clad in the cutting-edge MJOLNIR Powered Assault Armor, he single-handedly dismantled the Covenant military hierarchy, contained the Flood, and saved humanity from extinction.'
    ],
    keySpecs: [
      { label: 'Service Number', value: 'S-117' },
      { label: 'Height (In Armor)', value: '218 cm (7 ft 2 in)' },
      { label: 'Weight (In Armor)', value: '451 kg (995 lbs)' },
      { label: 'Armor Platform', value: 'MJOLNIR Mark VI Gen 3' },
      { label: 'Confirmed Combat Operations', value: '200+ Campaigns' }
    ]
  },
  {
    id: 'covenant-empire',
    title: 'The Covenant Hegemony',
    category: 'Covenant',
    classification: 'Theocratic Alien Alliance',
    subtitle: 'Worshippers of the Forerunners on the Great Journey',
    content: [
      'A massive religious conglomerate of disparate alien species unified by blind reverence for Forerunner relics and the promise of the "Great Journey".',
      'Governed by the SanShyuum (Prophets) and militarily spearheaded by the noble Sangheili (Elites) and ruthless Jiralhanae (Brutes).',
      'Their declaration of holy war against Humanity spanned nearly three decades until civil schism and the revelation of Halo true genocidal purpose collapsed the union.'
    ],
    keySpecs: [
      { label: 'Capital City', value: 'High Charity (Destroyed)' },
      { label: 'Primary Leadership', value: 'Hierarchs (Truth, Regret, Mercy)' },
      { label: 'Fleet Doctrine', value: 'Plasma Bombardment / Glassing' },
      { label: 'Primary Castes', value: 'Sangheili, SanShyuum, Unggoy, Kig-Yar' },
      { label: 'Active Era', value: '852 BCE – 2552 CE' }
    ]
  },
  {
    id: 'unsc-navy',
    title: 'United Nations Space Command (UNSC)',
    category: 'UNSC Navy',
    classification: 'Earth and Colony Military Command',
    subtitle: 'The Shield and Sword of Humanity',
    content: [
      'Established in 2163 to coordinate international space defense, the UNSC became the de facto military government of mankind during the Human-Covenant War.',
      'Heavily reliant on Magnetic Accelerator Cannons (MAC guns), titanium-A armor plating, Archer missile pods, and the indomitable courage of Marines, ODSTs, and Spartans.',
      'Super-carriers like the UNSC Infinity represent the pinnacle of post-war human-Forerunner hybrid engineering.'
    ],
    keySpecs: [
      { label: 'Headquarters', value: 'HIGHCOM Sydney, Earth' },
      { label: 'Flagship Vessel', value: 'UNSC Infinity (5,694m)' },
      { label: 'Primary Weaponry', value: 'Super MAC & Archer Missiles' },
      { label: 'Special Forces', value: 'Naval Special Warfare / SPARTAN' },
      { label: 'Slipspace Drive', value: 'Shaw-Fujikawa Translight Engine' }
    ]
  }
];
