/**
 * Amharic translations for Dispatch
 *
 * HOW TO EDIT:
 *  - Mirror every key from `en.ts` here.
 *  - Keep the brand name "Dispatch" in English.
 *  - Amharic script (Ge'ez) is right-to-left within words but the language
 *    itself flows left-to-right at the sentence level in modern digital use,
 *    so no `dir="rtl"` is needed.
 */

import type { Messages } from "./en";

const am: Messages = {
  // ─── Brand ──────────────────────────────────────────────────────────────────
  brand: {
    name: "Dispatch",
    tagline: "የተዋሃደ የሎጂስቲክስ መድረክ",
    description:
      "ነጋዴዎችን ከኩሪየር አቅራቢዎች ጋር የሚያገናኝ ሶፍትዌር፣ የ shipment ፈጠራን፣ ኩሪየር ምርጫን፣ እና የዕቃ ክትትልን በአንድ ኃይለኛ መድረክ ያቃልላል።",
  },

  // ─── Navigation ─────────────────────────────────────────────────────────────
  nav: {
    features: "ባህሪያት",
    howItWorks: "እንዴት ይሰራል",
    portals: "መግቢያዎች",
    login: "ግባ",
    getStarted: "ጀምር",
  },

  // ─── Landing Hero ───────────────────────────────────────────────────────────
  hero: {
    badge: "ለአዲስ አበባ ሎጂስቲክስ የተሰራ",
    headline1: "ለእያንዳንዱ ዕቃ አቅርቦት",
    headline2: "ትክክለኛው አቋራጭ።",
    downloadDriverApp: "የሾፌር መተግበሪያ አውርድ",
    merchantLogin: "ነጋዴ ግባ",
    scroll: "ወደታች ሸብልል",
  },

  // ─── Stats ──────────────────────────────────────────────────────────────────
  stats: {
    courierPartners: "የኩሪየር አጋሮች",
    activeMerchants: "ንቁ ነጋዴዎች",
    deliveriesCompleted: "የተጠናቀቁ ዕቃ አቅርቦቶች",
    avgDeliveryTime: "አማካይ የማቅረቢያ ጊዜ",
  },

  // ─── Features Section ────────────────────────────────────────────────────────
  features: {
    sectionLabel: "መድረክ",
    headline1: "የሚያስፈልጉዎት ሁሉ።",
    headline2: "የማይሻሉትን ሳይጨምር።",
    shipmentManagement: {
      title: "የ Shipment አወዳደር",
      description:
        "ከብዙ የኩሪየር አቅራቢዎች በአንድ ወጥ ዳሽቦርድ shipmentዎችን ፍጠር፣ ክትተለ፣ እና አስተዳድር።",
    },
    fleetCoordination: {
      title: "የፍሊት ቅንጅት",
      description:
        "በቅጽበታዊ ሾፌር ክትትል፣ ብልጥ የመንገድ አወዳደር፣ እና የዕቃ አቅርቦት ማረጋገጫ ዓሠራሮች።",
    },
    performanceAnalytics: {
      title: "የአፈጻጸም ትንታኔ",
      description:
        "በይነተገናኝ ትንታኔ አማካይነት የኩሪየር አፈጻጸምን፣ የዕቃ አቅርቦት ጊዜን፣ እና የስኬት ደረጃዎችን አወዳድር።",
    },
    apiIntegration: {
      title: "የ API ውህደት",
      description:
        "ከ e-commerce መድረኮች ጋር ቀላል ውህደት ለማድረግ ቁልፍ አወዳደር ያለው RESTful API።",
    },
    locationIntelligence: {
      title: "የቦታ ብልህነት",
      description:
        "ለአዲስ አበባ ልዩ አድራሻ ስርዓት የተዘጋጀ የምልክት-ቦታ መፍቻ።",
    },
    courierRatings: {
      title: "የኩሪየር ደረጃ አሰጣጥ",
      description:
        "ከእውነተኛ የዕቃ አቅርቦት አፈጻጸም ውሂብ ተመስርቶ የኩሪየር አቅራቢዎችን ደምድም እና አወዳድር።",
    },
  },

  // ─── How It Works ───────────────────────────────────────────────────────────
  howItWorks: {
    sectionLabel: "ሂደት",
    headline: "በደቂቃዎች ጀምር።",
    step1: {
      title: "ተመዝገብ",
      description:
        "የነጋዴ ሂሳብህን በንግድ ዝርዝሮችህ ፍጠር እና ወዲያው የመድረኩን ተደራሽነት አግኝ።",
    },
    step2: {
      title: "ኩሪየር ምረጥ",
      description:
        "ያሉ ኩሪየሮችን ዳስስ፣ ዋጋዎችን፣ የአፈጻጸም መለኪያዎችን፣ እና የዕቃ አቅርቦት ቦታዎችን አወዳድር።",
    },
    step3: {
      title: "ላክ እና ክትተለ",
      description:
        "Shipmentዎችን ፍጠር፣ በቅጽበት ክትተለ፣ የማቅረቢያ ማረጋገጫ አግኝ፣ እና ሎጂስቲክስ ተንተን።",
    },
  },

  // ─── Portals Section ────────────────────────────────────────────────────────
  portals: {
    sectionLabel: "መግቢያዎች",
    headline: "ለእያንዳንዱ ሚና የተሰራ።",
    subheading:
      "በዕቃ አቅርቦት ሰንሰለት ውስጥ ላለ እያንዳንዱ ባለድርሻ አካል የተለዩ ዳሽቦርዶች።",
    merchant: {
      title: "ነጋዴ",
      description: "Shipmentዎችን ፍጠር፣ ኩሪየሮችን አወዳድር፣ እና ዕቃ አቅርቦቶችን ክትተለ።",
    },
    supervisor: {
      title: "የኩሪየር ተቆጣጣሪ",
      description: "ሾፌሮችን አስተዳድር፣ Shipmentዎችን ምደብ፣ እና ፍሊቱን ክትተለ።",
    },
    admin: {
      title: "አስተዳዳሪ",
      description: "መድረኩን፣ ኩሪየሮችን፣ እና የሲስተም መለኪያዎችን ተቆጣጠር።",
    },
  },

  // ─── CTA Section ────────────────────────────────────────────────────────────
  cta: {
    headline1: "ሎጂስቲክስህን ለማቅለል",
    headline2: "ዝግጁ ነህ?",
    subheading:
      "Dispatchን ተቀላቀልና ዛሬ ንግዱን ከአዲስ አበባ ኩሪየር መረብ ጋር አገናኝ።",
    createAccount: "የነጋዴ ሂሳብ ፍጠር",
    courierLogin: "የኩሪየር ግቢያ",
  },

  // ─── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    copyright: "© 2026 Dispatch. ለአዲስ አበባ የተሰራ።",
    merchant: "ነጋዴ",
    supervisor: "ተቆጣጣሪ",
    downloadDriverApp: "የሾፌር መተግበሪያ አውርድ",
    admin: "አስተዳዳሪ",
  },

  // ─── Login Page ─────────────────────────────────────────────────────────────
  login: {
    welcomeBack: "እንኳን ደህና ተመለሱ",
    platformDescription:
      "ነጋዴዎችን እና የኩሪየር አቅራቢዎችን በአዲስ አበባ የሚያገናኝ የተዋሃደ የሎጂስቲክስ መድረክ።",
    back: "ተመለስ",
    usernameLabel: "ተጠቃሚ ስም",
    usernamePlaceholder: "ተጠቃሚ ስምዎን ያስገቡ",
    emailLabel: "ኢሜይል",
    emailPlaceholder: "you@example.com",
    passwordLabel: "የሚስጥር ቁጥር",
    forgotPassword: "የሚስጥር ቁጥርዎን ረሱ?",
    signIn: "ግባ",
    signingIn: "በመግባት ላይ...",
    loginSuccess: "በትክክል ገብተዋል!",
    redirecting: "ወደ ዳሽቦርዱ በመቀየር ላይ...",
    passwordPlaceholder: "የሚስጥር ቁጥርዎን ያስገቡ",
    switchPortal: "ወደ ሌላ መግቢያ ቀይር",

    roles: {
      merchant: {
        label: "ነጋዴ",
        subtitle: "Shipmentዎችን ያስተዳድሩ እና ዕቃ አቅርቦቶችን ይከታተሉ",
      },
      supervisor: {
        label: "የኩሪየር ተቆጣጣሪ",
        subtitle: "ሾፌሮችን እና የፍሊት ስራዎችን ያስተዳድሩ",
      },
      admin: {
        label: "አስተዳዳሪ",
        subtitle: "የመድረኩን ስራዎች እና መለኪያዎች ይቆጣጠሩ",
      },
    },

    validation: {
      usernameRequired: "ተጠቃሚ ስም ያስፈልጋል።",
      emailRequired: "ኢሜይል ያስፈልጋል።",
      emailInvalid: "እባክዎ ትክክለኛ ኢሜይል አድራሻ ያስገቡ።",
      emailTooLong: "ኢሜይሉ ከ 255 ፊደሎች ያነሰ መሆን አለበት።",
      passwordRequired: "የሚስጥር ቁጥር ያስፈልጋል።",
      passwordTooShort: "የሚስጥር ቁጥሩ ቢያንስ 8 ቁምፊዎች ሊኖሩት ይገባል።",
    },

    lockout: {
      message: "ብዙ ስህተታ ሙከራዎች። እባክዎ በ {time} ውስጥ እንደገና ይሞክሩ።",
    },
  },

  // ─── Dashboard Stubs ────────────────────────────────────────────────────────
  dashboards: {
    merchant: {
      title: "የነጋዴ ዳሽቦርድ",
      welcome: "ወደ Dispatch የነጋዴ መግቢያ እንኳን ደህና ተመለሱ።",
    },
    supervisor: {
      title: "የኩሪየር ተቆጣጣሪ ዳሽቦርድ",
      welcome: "ወደ Dispatch የተቆጣጣሪ መግቢያ እንኳን ደህና ተመለሱ።",
    },
    admin: {
      title: "አጠቃላይ እይታ",
      welcome: "ወደ Dispatch አስተዳደር መግቢያ እንኳን ደህና ተመለሱ።",
      totalMerchants: "ጠቅላላ ነጋዴዎች",
      totalCouriers: "ጠቅላላ ኩሪየሮች",
      totalShipments: "ጠቅላላ ጭነቶች",
      activeShipments: "ንቁ ጭነቶች",
      platformGrowth: "የፕላትፎርም እድገት",
      platformGrowthSubtitle: "የነጋዴ እና የኩሪየር ብዛት በጊዜ ሂደት እንዴት እየጨመረ እንደሆነ ይከታተሉ።",
      shipmentVolume: "የጭነት መጠን",
      shipmentVolumeSubtitle: "በኔትወርኩ ውስጥ ያለውን እለታዊ የጥቅል ፍሰት ይቆጣጠሩ።",
      shipmentsTitle: "ጭነቶች",
      shipmentsSubtitle: "በኔትወርኩ ውስጥ ያሉ ሁሉንም አቅርቦቶች ይከታተሉ እና ያስተዳድሩ።",
      code: "ኮድ",
      merchant: "ነጋዴ",
      status: "ሁኔታ",
      fee: "ክፍያ",
      created: "የተፈጠረበት",
      advancedFilters: "የተራቀቁ ማጣሪያዎች",
      advancedFiltersDescription: "ጭነቶችን በሁኔታ፣ በክብደት እና በክፍያ ያጣሩ።",
      filterStatus: "ሁኔታ",
      filterMinWeight: "ዝቅተኛ ክብደት (ኪ.ግ)",
      filterMaxWeight: "ከፍተኛ ክብደት (ኪ.ግ)",
      filterMinFee: "ዝቅተኛ ክፍያ (ብር)",
      filterMaxFee: "ከፍተኛ ክፍያ (ብር)",
      filterPending: "በጥበቃ ላይ",
      filterAssignedToCourier: "ለኩሪየር ተሰጥቷል",
      filterAssignedToDriver: "ለአሽከርካሪ ተሰጥቷል",
      filterPickedUp: "ተነስቷል",
      filterDelivered: "ደረሰ",
      filterFailed: "አልተሳካም",
      filterCancelled: "ተሰርዟል",
      filterAssigned: "ተመድቧል",
      filterInTransit: "በጉዞ ላይ",
      filterOutForDelivery: "ለማድረስ ወጥቷል",
      filterReturned: "ተመልሷል",
      clearFilters: "ማጣሪያዎችን አጽዳ",
      applyFilters: "ማጣሪያዎችን ተግብር",
      loadingShipments: "ጭነቶች በመጫን ላይ...",
      noShipments: "ምንም ጭነቶች አልተገኙም።",
      showingOfShipments: "ከ{total} ጭነቶች ውስጥ {count} እየታዩ ነው",
      unknownMerchant: "ያልታወቀ ነጋዴ",
      weight: "ክብደት",
      pickupAddress: "የመነሻ አድራሻ",
      deliveryAddress: "የመድረሻ አድራሻ",
      description: "መግለጫ",
      noDescription: "ምንም መግለጫ አልተሰጠም።",
      items: "እቃዎች",
    },
    returnToWebsite: "ወደ ድረ-ገጹ ተመለስ",
    logout: "ውጣ",
  },

  merchants: {
    title: "ነጋዴዎች",
    subtitle: "የነጋዴ ሂሳቦችን ያስተዳድሩ እና ይቆጣጠሩ።",
    list: "የነጋዴዎች ዝርዝር",
    details: "የነጋዴ ዝርዝሮች",
    status: "ሁኔታ",
    statusActive: "ንቁ",
    statusBanned: "የታገደ",
    actions: "እርምጃዎች",
    ban: "ነጋዴውን እገድ",
    unban: "ነጋዴውን አንቃ",
    industry: "የስራ መስክ",
    email: "ኢሜይል",
    phone: "ስልክ",
    address: "አድራሻ",
    description: "መግለጫ",
    searchPlaceholder: "ነጋዴዎችን ፈልግ...",
    showingOf: "{total} ከሚሆኑ ነጋዴዎች {count} ታይተዋል",
    loading: "ነጋዴዎችን በመጫን ላይ...",
    noResults: "ምንም ነጋዴ አልተገኘም።",
    filterStatus: "የመለያ ሁኔታ",
    filterIndustry: "የንግድ መስክ",
    advancedFilters: "የተራቀቁ ማጣሪያዎች",
    advancedFiltersDescription: "ነጋዴዎችን በመለያ ሁኔታ እና በንግድ ዘርፍ ያጣሩ።",
    statusPending: "ይሁንታ በመጠባበቅ ላይ",
  },

  couriers: {
    title: "ኩሪየሮች",
    subtitle: "የኩሪየር ኩባንያዎችን ያስተዳድሩ እና ይቆጣጠሩ።",
    list: "የኩሪየሮች ዝርዝር",
    details: "የኩሪየር ዝርዝሮች",
    status: "ሁኔታ",
    statusActive: "ንቁ",
    statusBanned: "የታገደ",
    actions: "እርምጃዎች",
    ban: "ኩሪየሩን እገድ",
    unban: "ኩሪየሩን አንቃ",
    rating: "ደረጃ",
    basePrice: "መነሻ ዋጋ",
    maxWeight: "ከፍተኛ ክብደት",
    contact: "ግንኙነት",
    address: "አድራሻ",
    website: "ድረ-ገጽ",
    searchPlaceholder: "ኩሪየሮችን ፈልግ...",
    showingOf: "{total} ከሚሆኑ ኩሪየሮች {count} ታይተዋል",
    loading: "ኩሪየሮችን በመጫን ላይ...",
    noResults: "ምንም ኩሪየር አልተገኘም።",
    filterStatus: "የስራ ሁኔታ",
    filterMinRating: "ዝቅተኛ ደረጃ",
    filterMinBasePrice: "ዝቅተኛ መነሻ ዋጋ (ብር)",
    advancedFilters: "የተራቀቁ ማጣሪያዎች",
    advancedFiltersDescription: "ኩሪየሮችን በስራ ሁኔታ፣ በደረጃ እና በዋጋ ያጣሩ።",
    createCourier: "ኩሪየር ፍጠር",
    createTitle: "የኩሪየር ኩባንያ ፍጠር",
    createSubtitle: "አዲስ የኩሪየር ኩባንያ እና የባለቤት ሂሳብ ይመዝግቡ።",
    reviewTitle: "ዝርዝሮችን ይከልሱ",
    reviewSubtitle: "ኩባንያውን ከመመዝገብዎ በፊት እባክዎ መረጃውን ያረጋግጡ።",
    confirmAndRegister: "አረጋግጥ እና መዝግብ",
    backToEdit: "ወደ ማስተካከያ ተመለስ",
    businessDetails: "የንግድ ዝርዝሮች",
    businessDetailsDescription: "የኩባንያ መረጃ እና የግንኙነት ዝርዝሮች።",
    ownerAccount: "የባለቤት ሂሳብ",
    ownerAccountDescription: "ዋና የአስተዳዳሪ ሂሳብ ምስክርነቶች።",
    pricingConfig: "የዋጋ አወቃቀር",
    pricingConfigDescription: "የመላኪያ ዋጋዎችን እና ገደቦችን ይግለጹ።",
    companyName: "የኩባንያ ስም",
    companyAddress: "የኩባንያ አድራሻ",
    phoneNumber: "ስልክ ቁጥር",
    email: "ኢሜይል አድራሻ",
    websiteUrl: "ድረ-ገጽ",
    ownerFirstName: "የባለቤት ስም",
    ownerLastName: "የባለቤት የአባት ስም",
    firstNamePlaceholder: "ስም",
    lastNamePlaceholder: "የአባት ስም",
    ownerPassword: "የሚስጥር ቁጥር",
    confirmPassword: "የሚስጥር ቁጥሩን ያረጋግጡ",
    maximumWeight: "ከፍተኛ ክብደት (ኪ.ግ)",
    pricingBasePrice: "መነሻ ዋጋ (ብር)",
    weightRate: "የክብደት ተመን (ብር/ኪ.ግ)",
    distanceRate: "የርቀት ተመን (ብር/ኪ.ሜ)",
    timeRate: "የጊዜ ተመን (ብር/ደቂቃ)",
    createButton: "ኩባንያውን መዝግብ",
    successMessage: "የኩሪየር ኩባንያ በትክክል ተፈጥሯል",
    errorMessage: "የኩሪየር ኩባንያ መፍጠር አልተቻለም",
    validation: {
      required: "ይህ መስክ ያስፈልጋል",
      invalidEmail: "እባክዎ ትክክለኛ ኢሜይል አድራሻ ያስገቡ",
      invalidUrl: "እባክዎ ትክክለኛ የድረ-ገጽ አድራሻ ያስገቡ",
      minLength: "ቢያንስ {count} ፊደላት መሆን አለበት",
      positiveNumber: "ትክክለኛ ቁጥር መሆን አለበት",
      passwordMismatch: "የሚስጥር ቁጥሮቹ አይዛመዱም",
    },
  },

  // ─── Profile Page ───────────────────────────────────────────────────────────
  profile: {
    title: "የነጋዴ መገለጫ",
    subtitle: "የንግድ መረጃዎን እና ብራንዲንግዎን ያስተዳድሩ።",
    companyName: "የኩባንያ ስም",
    companyAddress: "የኩባንያ አድራሻ",
    industry: "የስራ መስክ",
    description: "መግለጫ",
    phoneNumber: "ስልክ ቁጥር",
    email: "ኢሜይል አድራሻ",
    websiteUrl: "የድረ-ገጽ አድራሻ",
    companyLogo: "የኩባንያ አርማ",
    uploadLogo: "አርማ ስቀል",
    changeLogo: "አርማ ቀይር",
    saveChanges: "ለውጦችን አስቀምጥ",
    saving: "በማስቀመጥ ላይ...",
    success: "መገለጫው በትክክል ተዘምኗል",
    error: "መገለጫውን ማዘመን አልተቻለም",
  },

  // ─── Common ─────────────────────────────────────────────────────────────────
  common: {
    language: "ቋንቋ",
    theme: "ገጽታ",
    switchLanguage: "ቋንቋ ቀይር",
    darkMode: "ጨለማ ሁናቴ",
    lightMode: "ብርሃን ሁናቴ",
    systemMode: "ስርዓት",
    refresh: "አድስ",
    prev: "ወደ ኋላ",
    next: "ቀጣይ",
    reviews: "ግምገማዎች",
    systemSettings: "የሲስተም ቅንብሮች",
    monitoring: "ክትትል",
    back: "ተመለስ",
    cancel: "ሰርዝ",
    saving: "በማስቀመጥ ላይ...",
    authRequired: "ማረጋገጫ ያስፈልጋል",
    units: "ክፍሎች",
    kg: "ኪ.ግ",
    etb: "ብር",
    etbPerKg: "ብር/ኪ.ግ",
    etbPerKm: "ብር/ኪ.ሜ",
    etbPerMin: "ብር/ደቂቃ",
    logout: "ውጣ",
    success: "ተሳክቷል",
    error: "ስህተት",
    search: "ፈልግ",
    searchPlaceholder: "ፈልግ...",
    selectStatus: "ሁኔታ ይምረጡ",
    allStatuses: "ሁሉም ሁኔታዎች",
    all: "ሁሉም",
    min: "ዝቅተኛ",
    max: "ከፍተኛ",
    visitWebsite: "ድረ-ገጹን ይጎብኙ",
    noData: "ምንም መረጃ የለም",
  },

  adminNav: {
    dashboard: "ዳሽቦርድ",
    merchants: "ነጋዴዎች",
    couriers: "ኩሪየሮች",
    shipments: "ጭነቶች",
  },
};

export default am;
