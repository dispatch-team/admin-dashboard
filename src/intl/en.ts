/**
 * English translations for Dispatch
 *
 * HOW TO EDIT:
 *  - All user-facing strings live here.
 *  - Add a matching key in `am.ts` for every key you add here.
 *  - Nest keys by feature/page so the file stays easy to navigate.
 *  - Never use em dashes (--) in strings; use commas or colons instead.
 */

const en = {
  // ─── Brand ──────────────────────────────────────────────────────────────────
  brand: {
    name: "Dispatch",
    tagline: "Unified Logistics Platform",
    description:
      "The middleware that bridges merchants with courier providers, simplifying shipment creation, courier selection, and delivery tracking through one powerful platform.",
  },

  // ─── Navigation ─────────────────────────────────────────────────────────────
  nav: {
    features: "Features",
    howItWorks: "How It Works",
    portals: "Portals",
    login: "Log in",
    getStarted: "Get Started",
  },

  // ─── Landing Hero ───────────────────────────────────────────────────────────
  hero: {
    badge: "Built for Addis Ababa's logistics",
    headline1: "Your shortcut to",
    headline2: "every delivery.",
    downloadDriverApp: "Download Driver App",
    merchantLogin: "Merchant Log In",
    scroll: "Scroll",
  },

  // ─── Stats ──────────────────────────────────────────────────────────────────
  stats: {
    courierPartners: "Courier Partners",
    activeMerchants: "Active Merchants",
    deliveriesCompleted: "Deliveries Completed",
    avgDeliveryTime: "Avg Delivery Time",
  },

  // ─── Features Section ────────────────────────────────────────────────────────
  features: {
    sectionLabel: "Platform",
    headline1: "Everything you need.",
    headline2: "Nothing you don't.",
    shipmentManagement: {
      title: "Shipment Management",
      description:
        "Create, track, and manage shipments across multiple courier providers from one unified dashboard.",
    },
    fleetCoordination: {
      title: "Fleet Coordination",
      description:
        "Real-time driver tracking, intelligent route management, and delivery confirmation workflows.",
    },
    performanceAnalytics: {
      title: "Performance Analytics",
      description:
        "Compare courier performance, delivery times, and success rates with interactive analytics.",
    },
    apiIntegration: {
      title: "API Integration",
      description:
        "RESTful API with key management for seamless e-commerce platform integration.",
    },
    locationIntelligence: {
      title: "Location Intelligence",
      description:
        "Landmark-based location resolution tailored for Addis Ababa's unique addressing system.",
    },
    courierRatings: {
      title: "Courier Ratings",
      description:
        "Rate and compare courier providers based on real delivery performance data.",
    },
  },

  // ─── How It Works ───────────────────────────────────────────────────────────
  howItWorks: {
    sectionLabel: "Process",
    headline: "Get started in minutes.",
    step1: {
      title: "Register",
      description:
        "Create your merchant account with business details and get instant platform access.",
    },
    step2: {
      title: "Choose Courier",
      description:
        "Browse available couriers, compare pricing, performance metrics, and delivery zones.",
    },
    step3: {
      title: "Ship and Track",
      description:
        "Create shipments, track in real-time, get proof of delivery, and analyze logistics.",
    },
  },

  // ─── Portals Section ────────────────────────────────────────────────────────
  portals: {
    sectionLabel: "Portals",
    headline: "Built for every role.",
    subheading:
      "Dedicated dashboards tailored to each stakeholder in the delivery chain.",
    merchant: {
      title: "Merchant",
      description: "Create shipments, compare couriers, and track deliveries.",
    },
    supervisor: {
      title: "Courier Supervisor",
      description: "Manage drivers, assign shipments, and monitor fleet.",
    },
    admin: {
      title: "Administrator",
      description: "Oversee the platform, couriers, and system metrics.",
    },
  },

  // ─── CTA Section ────────────────────────────────────────────────────────────
  cta: {
    headline1: "Ready to streamline",
    headline2: "your logistics?",
    subheading:
      "Join Dispatch and connect your business to Addis Ababa's courier network today.",
    createAccount: "Create Merchant Account",
    courierLogin: "Courier Login",
  },

  // ─── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    copyright: "© 2026 Dispatch. Built for Addis Ababa.",
    merchant: "Merchant",
    supervisor: "Supervisor",
    downloadDriverApp: "Download Driver App",
    admin: "Admin",
  },

  // ─── Login Page ─────────────────────────────────────────────────────────────
  login: {
    welcomeBack: "Welcome back",
    platformDescription:
      "Unified logistics platform connecting merchants and courier providers in Addis Ababa.",
    back: "Back",
    usernameLabel: "Username",
    usernamePlaceholder: "Enter your username",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    signIn: "Sign In",
    signingIn: "Signing in...",
    loginSuccess: "Login successful!",
    redirecting: "Redirecting to your dashboard...",
    passwordPlaceholder: "Enter your password",
    switchPortal: "Switch portal",

    // Role labels and subtitles
    roles: {
      merchant: {
        label: "Merchant",
        subtitle: "Manage shipments and track deliveries",
      },
      supervisor: {
        label: "Courier Supervisor",
        subtitle: "Manage drivers and fleet operations",
      },
      admin: {
        label: "Administrator",
        subtitle: "Oversee platform operations and metrics",
      },
    },

    // Validation errors
    validation: {
      usernameRequired: "Username is required.",
      emailRequired: "Email is required.",
      emailInvalid: "Please enter a valid email address.",
      emailTooLong: "Email must be less than 255 characters.",
      passwordRequired: "Password is required.",
      passwordTooShort: "Password must be at least 8 characters.",
    },

    // Lockout
    lockout: {
      message: "Too many failed attempts. Please try again in {time}.",
    },
  },

  // ─── Dashboard Stubs ────────────────────────────────────────────────────────
  dashboards: {
    merchant: {
      title: "Merchant Dashboard",
      welcome: "Welcome to the streamlined Dispatch Merchant portal.",
    },
    supervisor: {
      title: "Courier Supervisor Dashboard",
      welcome: "Welcome to the streamlined Dispatch Supervisor portal.",
    },
    admin: {
      title: "Overview",
      welcome: "Welcome back to your administration dashboard.",
      totalMerchants: "Total Merchants",
      totalCouriers: "Total Couriers",
      totalShipments: "Total Shipments",
      activeShipments: "Active Shipments",
      platformGrowth: "Platform Growth",
      platformGrowthSubtitle: "Track how your merchant and courier base is expanding over time.",
      shipmentVolume: "Shipment Volume",
      shipmentVolumeSubtitle: "Monitor the daily flow of packages across the network.",
      shipmentsTitle: "Shipments",
      shipmentsSubtitle: "Track and manage all deliveries in the network.",
      code: "Code",
      merchant: "Merchant",
      status: "Status",
      fee: "Fee",
      created: "Created",
      advancedFilters: "Advanced Filters",
      advancedFiltersDescription: "Filter shipments by status, weight, and fees.",
      filterStatus: "Status",
      filterPending: "Pending",
      filterAssignedToCourier: "Assigned to Courier",
      filterAssignedToDriver: "Assigned to Driver",
      filterPickedUp: "Picked Up",
      filterDelivered: "Delivered",
      filterFailed: "Failed",
      filterCancelled: "Cancelled",
      filterAssigned: "Assigned",
      filterInTransit: "In Transit",
      filterOutForDelivery: "Out for Delivery",
      filterReturned: "Returned",
      filterMinWeight: "Min Weight (kg)",
      filterMaxWeight: "Max Weight (kg)",
      filterMinFee: "Min Fee (ETB)",
      filterMaxFee: "Max Fee (ETB)",
      clearFilters: "Clear Filters",
      applyFilters: "Apply Filters",
      loadingShipments: "Loading shipments...",
      noShipments: "No shipments found.",
      showingOfShipments: "Showing {count} of {total} shipments",
      unknownMerchant: "Unknown Merchant",
      weight: "Weight",
      pickupAddress: "Pickup Address",
      deliveryAddress: "Delivery Address",
      description: "Description",
      noDescription: "No description provided.",
      items: "Items",
    },
    returnToWebsite: "Return to Website",
    logout: "Sign Out",
  },

  merchants: {
    title: "Merchants",
    subtitle: "Manage and monitor merchant accounts.",
    list: "Merchant List",
    details: "Merchant Details",
    status: "Status",
    statusActive: "Active",
    statusBanned: "Restricted",
    actions: "Actions",
    ban: "Restrict Merchant",
    unban: "Activate Merchant",
    industry: "Industry",
    email: "Email",
    phone: "Phone",
    address: "Address",
    description: "Description",
    searchPlaceholder: "Search merchants...",
    showingOf: "Showing {count} of {total} merchants",
    loading: "Loading merchants...",
    noResults: "No merchants found.",
    filterStatus: "Account Status",
    filterIndustry: "Business Industry",
    advancedFilters: "Advanced Filters",
    advancedFiltersDescription: "Filter merchants by account status and business sector.",
    statusPending: "Pending Approval",
  },

  couriers: {
    title: "Couriers",
    subtitle: "Manage and monitor courier companies.",
    list: "Courier List",
    details: "Courier Details",
    status: "Status",
    statusActive: "Active",
    statusBanned: "Restricted",
    actions: "Actions",
    ban: "Restrict Courier",
    unban: "Activate Courier",
    rating: "Rating",
    basePrice: "Base Price",
    maxWeight: "Max Weight",
    contact: "Contact",
    address: "Address",
    website: "Website",
    searchPlaceholder: "Search couriers...",
    showingOf: "Showing {count} of {total} couriers",
    loading: "Loading couriers...",
    noResults: "No couriers found.",
    filterStatus: "Operation Status",
    filterMinRating: "Minimum Rating",
    filterMinBasePrice: "Minimum Base Price (ETB)",
    advancedFilters: "Advanced Filters",
    advancedFiltersDescription: "Filter couriers by operational status, rating, and pricing.",
    createCourier: "Create Courier",
    createTitle: "Create Courier Company",
    createSubtitle: "Register a new courier company and its owner account.",
    reviewTitle: "Review Details",
    reviewSubtitle: "Please confirm the information before registering the company.",
    confirmAndRegister: "Confirm & Register",
    backToEdit: "Back to Edit",
    businessDetails: "Business Details",
    businessDetailsDescription: "Company information and contact details.",
    ownerAccount: "Owner Account",
    ownerAccountDescription: "Primary administrator account credentials.",
    pricingConfig: "Pricing Configuration",
    pricingConfigDescription: "Define shipping rates and limits.",
    companyName: "Company Name",
    companyAddress: "Company Address",
    phoneNumber: "Phone Number",
    email: "Email Address",
    websiteUrl: "Website URL",
    ownerFirstName: "Owner First Name",
    ownerLastName: "Owner Last Name",
    firstNamePlaceholder: "First Name",
    lastNamePlaceholder: "Last Name",
    ownerPassword: "Owner Password",
    confirmPassword: "Confirm Password",
    maxWeight: "Maximum Weight (kg)",
    basePrice: "Base Price (ETB)",
    weightRate: "Weight Rate (ETB/kg)",
    distanceRate: "Distance Rate (ETB/km)",
    timeRate: "Time Rate (ETB/min)",
    createButton: "Register Company",
    successMessage: "Courier company created successfully",
    errorMessage: "Failed to create courier company",
    validation: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidUrl: "Please enter a valid URL",
      minLength: "Must be at least {count} characters",
      positiveNumber: "Must be a positive number",
      passwordMismatch: "Passwords do not match",
    },
  },

  // ─── Profile Page ───────────────────────────────────────────────────────────
  profile: {
    title: "Merchant Profile",
    subtitle: "Manage your business information and branding.",
    companyName: "Company Name",
    companyAddress: "Company Address",
    industry: "Industry",
    description: "Description",
    phoneNumber: "Phone Number",
    email: "Email Address",
    websiteUrl: "Website URL",
    companyLogo: "Company Logo",
    uploadLogo: "Upload Logo",
    changeLogo: "Change Logo",
    saveChanges: "Save Changes",
    saving: "Saving...",
    success: "Profile updated successfully",
    error: "Failed to update profile",
  },

  // ─── Common ─────────────────────────────────────────────────────────────────
  common: {
    language: "Language",
    theme: "Theme",
    switchLanguage: "Switch language",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    systemMode: "System",
    refresh: "Refresh",
    prev: "Prev",
    next: "Next",
    reviews: "reviews",
    systemSettings: "System Settings",
    monitoring: "Monitoring",
    back: "Back",
    cancel: "Cancel",
    saving: "Saving...",
    authRequired: "Authentication required",
    units: "units",
    kg: "kg",
    etb: "ETB",
    etbPerKg: "ETB/kg",
    etbPerKm: "ETB/km",
    etbPerMin: "ETB/min",
    allStatuses: "All Statuses",
    all: "All",
    min: "Min",
    max: "Max",
    visitWebsite: "Visit Website",
    logout: "Log Out",
    success: "Success",
    error: "Error",
    search: "Search",
    searchPlaceholder: "Search...",
    noData: "No data available",
  },

  adminNav: {
    dashboard: "Dashboard",
    merchants: "Merchants",
    couriers: "Couriers",
    shipments: "Shipments",
  },
} as const;

// DeepStringify converts all leaf string literals to `string`,
// so am.ts can satisfy this type with different string values.
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
    ? DeepStringify<T[K]>
    : T[K];
};

export type Messages = DeepStringify<typeof en>;
export default en;
