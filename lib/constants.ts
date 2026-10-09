export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  image: string;
  icon: string;
  isHome?: boolean;
}

export interface ProductItem {
  id: string;
  category: 'SOLAR PANELS' | 'INVERTERS' | 'CABLES & WIRING' | 'SWITCHGEAR' | 'LED LIGHTING' | 'CONTROL PANELS';
  name: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
  image: string;
  isFeatured?: boolean;
}

export const BRAND = {
  name: "BRAHMANI",
  tagline: "POWERING TOMORROW",
  subtitle: "Electrical & Solar Solutions",
  logoHorizontal: "/images/brahmani-logo-horizontal.png",
  logoDark: "/images/brahmani-logo-dark.png",
  logoOriginal: "/images/brahmani-logo-original.png",
  logoMark: "/images/brahmani-mark-dark.png",
  contact: {
    // TODO_VERIFY: Confirm official primary business landline before production
    phone: "+91 79 4890 2811",
    // TODO_VERIFY: Confirm registered WhatsApp & emergency line before production
    phoneMobile: "+91 98250 14892",
    // TODO_VERIFY: Confirm designated inquiry mailbox domain before production
    email: "info@brahmani.com",
    // TODO_VERIFY: Confirm exact registered facility / corporate park street address before production
    address: "Brahmani Corporate Park, S.G. Highway, Ahmedabad, Gujarat 380054, India",
    city: "Ahmedabad, Gujarat, India",
    hours: "Mon to Sat, 9:00 to 18:00"
  }
};

export const NAV_ITEMS = [
  { name: "HOME", path: "/" },
  { name: "SERVICES", path: "/services" },
  { name: "PRODUCTS", path: "/products" },
  { name: "CONTACT US", path: "/contact" },
];

// TODO_VERIFY: Confirm all company operational statistics and capacities with client executives prior to final marketing release
export const STATISTICS = [
  {
    value: 500,
    suffix: "+",
    label: "PROJECTS COMPLETED",
    description: "Executed across industrial, commercial & residential sectors",
  },
  {
    value: 12,
    suffix: " MW+",
    label: "SOLAR CAPACITY INSTALLED",
    description: "Rooftop and ground-mounted utility arrays",
  },
  {
    value: 100,
    suffix: "+",
    label: "SKILLED PROFESSIONALS",
    description: "Certified electrical engineers & licensed technicians",
  },
  {
    value: 99,
    suffix: "%",
    label: "CLIENT SATISFACTION",
    description: "Guaranteed uptime and dedicated SLA support",
  },
];

export const HOME_SERVICES: ServiceItem[] = [
  {
    id: "electrical-systems",
    number: "01",
    title: "ELECTRICAL SYSTEMS",
    tagline: "End-to-end electrical infrastructure",
    description: "Design, installation and maintenance of safe, efficient and reliable electrical systems for industrial and commercial facilities.",
    features: ["HT / LT Power Distribution", "Substation Automation", "Transformer Substations", "Busbar Trunking Systems"],
    specs: [
      { label: "Voltage Ratings", value: "415V to 66kV" },
      { label: "Compliance", value: "IEC 61439 / IS Standards" }
    ],
    image: "/images/service-electrical-systems.jpg",
    icon: "zap",
  },
  {
    id: "solar-solutions",
    number: "02",
    title: "SOLAR SOLUTIONS",
    tagline: "Clean, high-yield photovoltaic generation",
    description: "Custom solar power systems for homes, businesses and industries sized to actual load patterns with complete net-metering support.",
    features: ["Commercial Rooftop Arrays", "Ground-Mounted Solar Parks", "Bifacial High-Yield Modules", "Net-Metering Approvals"],
    specs: [
      { label: "System Efficiency", value: "Up to 22.8%" },
      { label: "Warranty", value: "25-Year Performance" }
    ],
    image: "/images/service-solar-solutions.jpg",
    icon: "sun",
  },
  {
    id: "industrial-power",
    number: "03",
    title: "INDUSTRIAL POWER",
    tagline: "Uninterrupted continuous operation",
    description: "High-performance electrical solutions for industrial and commercial facilities requiring rugged, non-stop power delivery.",
    features: ["Heavy Motor Control Centers (MCC)", "PCC & Power Distribution", "Harmonic Mitigation Filters", "Reactive Power Compensation"],
    specs: [
      { label: "Fault Level", value: "Up to 65kA / 1 sec" },
      { label: "Enclosure Class", value: "IP54 / IP55 Standard" }
    ],
    image: "/images/service-industrial-power.jpg",
    icon: "cpu",
  },
  {
    id: "maintenance-support",
    number: "04",
    title: "MAINTENANCE & SUPPORT",
    tagline: "Predictive, preventive & emergency response",
    description: "Preventive and corrective maintenance for uninterrupted performance, including thermography surveys and rapid fault rectification.",
    features: ["Thermal Imaging Diagnostics", "Relay Calibration & Testing", "24/7 Breakdown Response", "Annual Maintenance Contracts (AMC)"],
    specs: [
      { label: "Response SLA", value: "< 2 Hours Critical" },
      { label: "Safety Rating", value: "Zero Loss Time" }
    ],
    image: "/images/service-maintenance.jpg",
    icon: "shield-check",
  },
];

export const ALL_SERVICES: ServiceItem[] = [
  ...HOME_SERVICES,
  {
    id: "electrical-installation",
    number: "05",
    title: "ELECTRICAL INSTALLATION",
    tagline: "Precision execution by certified teams",
    description: "Certified crews build it safely and tidy up after. End-to-end cabling, containment, earthing grids, and switchgear commissioning.",
    features: ["Underground Power Cabling", "Perforated Cable Tray Runs", "Earth Pit Resistance Testing", "Lighting Protection Grids"],
    specs: [
      { label: "Testing Standard", value: "Megger & Hi-Pot Verified" },
      { label: "Earthing System", value: "Chemical Pipe & Copper Strip" }
    ],
    image: "/images/service-installation.jpg",
    icon: "wrench",
  },
  {
    id: "energy-efficiency",
    number: "06",
    title: "ENERGY EFFICIENCY",
    tagline: "Load optimization and power factor control",
    description: "Smart monitoring and automated power factor correction panels to reduce maximum demand charges and optimize power factor near unity.",
    features: ["Automatic Power Factor Control (APFC)", "Energy Audit & Load Balancing", "Harmonic Distortion Analysis", "Smart Cloud Telemetry"],
    specs: [
      { label: "Power Factor Target", value: "> 0.99 Continuous" },
      { label: "Payback Period", value: "8 - 14 Months" }
    ],
    image: "/images/service-energy-efficiency.jpg",
    icon: "gauge",
  },
];

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: "bifacial-solar-panel",
    category: "SOLAR PANELS",
    name: "Brahmani Ultra-Power 580W Bifacial",
    subtitle: "N-Type TOPCon Photovoltaic Module",
    description: "High-performance solar panels engineered for long life and maximum output under harsh ambient temperature conditions.",
    specs: [
      { label: "Max Efficiency", value: "Up to 22.8%" },
      { label: "Rated Power", value: "580 Watts" },
      { label: "Cell Type", value: "N-Type TOPCon Bifacial" },
      { label: "Warranty", value: "25 Year Performance" },
      { label: "Durability", value: "5400 Pa Snow / 2400 Pa Wind" },
      { label: "Glass", value: "Anti-reflective 3.2mm Tempered" }
    ],
    image: "/images/product-solar-panel.jpg",
    isFeatured: true,
  },
  {
    id: "commercial-solar-inverter",
    category: "INVERTERS",
    name: "Brahmani SolarMax IS-50000",
    subtitle: "Three-Phase Grid-Tied Commercial Inverter",
    description: "High-efficiency string inverter with multi-MPPT tracking, integrated DC disconnect, and intelligent cloud IoT monitoring.",
    specs: [
      { label: "Peak Efficiency", value: "98.8%" },
      { label: "Nominal AC Power", value: "50 kW" },
      { label: "MPPT Trackers", value: "4 Independent MPPTs" },
      { label: "Protection", value: "IP66 Rugged Enclosure" },
      { label: "Telemetry", value: "4G / Wi-Fi / RS485 Modbus" },
      { label: "Cooling", value: "Smart Forced Air Cooling" }
    ],
    image: "/images/product-inverter.jpg",
  },
  {
    id: "armored-power-cables",
    category: "CABLES & WIRING",
    name: "Brahmani DuraCore Armored Cables",
    subtitle: "XLPE Insulated Heavy-Duty Copper Power Cable",
    description: "Multi-conductor steel wire armored power and solar DC cables engineered for extreme subterranean and outdoor installations.",
    specs: [
      { label: "Conductor", value: "99.99% Electrolytic Copper" },
      { label: "Insulation", value: "Cross-Linked Polyethylene (XLPE)" },
      { label: "Armoring", value: "Galvanized Steel Wire Armor (GSWA)" },
      { label: "Voltage Grade", value: "1.1 kV / 11 kV / 33 kV" },
      { label: "Flame Retardant", value: "FRLS-H Zero Halogen" },
      { label: "Operating Temp", value: "-40°C to +90°C" }
    ],
    image: "/images/product-cables.jpg",
  },
  {
    id: "vacuum-switchgear-panel",
    category: "SWITCHGEAR",
    name: "Brahmani ArcGuard 11kV Switchgear",
    subtitle: "Metal-Clad Indoor Medium Voltage Switchgear",
    description: "Air-insulated cubicle fitted with vacuum circuit breakers, micro-processor numerical protection relays, and copper busbars.",
    specs: [
      { label: "Rated Voltage", value: "11 kV / 12 kV" },
      { label: "Short Circuit Breaking", value: "26.3 kA (3 sec)" },
      { label: "Busbar Rating", value: "1250A / 2000A Copper" },
      { label: "Internal Arc Class", value: "IAC AFLR 25kA 1s" },
      { label: "Protection Relays", value: "IEC 61850 Numerical" },
      { label: "Standards", value: "IEC 62271-200 Compliant" }
    ],
    image: "/images/product-switchgear.jpg",
  },
  {
    id: "industrial-highbay-led",
    category: "LED LIGHTING",
    name: "Brahmani Lumina Pro 200W",
    subtitle: "High-Bay Industrial Die-Cast Luminaire",
    description: "Engineered for high-ceiling industrial warehouses and fabrication bays with precision optical distribution and thermal fins.",
    specs: [
      { label: "Luminous Efficacy", value: "160 Lumens / Watt" },
      { label: "Total Lumens", value: "32,000 lm" },
      { label: "Color Temp (CCT)", value: "4000K / 5700K Natural" },
      { label: "Beam Angle", value: "90° / 120° Precision Optics" },
      { label: "Surge Protection", value: "10 kV Built-in SPD" },
      { label: "Lifespan", value: "> 50,000 Hours (L80B10)" }
    ],
    image: "/images/product-led-lighting.jpg",
  },
  {
    id: "automation-control-panel",
    category: "CONTROL PANELS",
    name: "Brahmani AutoLogic PLC Control Panel",
    subtitle: "Custom Engineered Automation & Motor Control",
    description: "Tailor-designed PLC and VFD motor control panels with segregated compartments, clear wire labeling, and HMI touch display.",
    specs: [
      { label: "Controller", value: "Siemens / Allen-Bradley PLC" },
      { label: "HMI Interface", value: "7\" / 10\" Industrial Touchscreen" },
      { label: "VFD Integration", value: "Sensorless Vector Drives" },
      { label: "Enclosure Sheet", value: "2.0mm CRCA Sheet Steel" },
      { label: "Ingress Protection", value: "IP54 / IP55 Gasketed" },
      { label: "Wiring Standard", value: "Ferruled & Color Coded" }
    ],
    image: "/images/product-control-panels.jpg",
  },
];
