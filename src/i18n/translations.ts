import type { Language } from '../types';

export interface TranslationBundle {
  brand: string;
  tagline: string;
  languages: Record<Language, string>;
  auth: {
    loginTab: string;
    registerTab: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    rolePrompt: string;
    farmerRole: string;
    farmerDesc: string;
    buyerRole: string;
    buyerDesc: string;
    fullName: string;
    email: string;
    password: string;
    state: string;
    organization: string;
    signInBtn: string;
    createAccountBtn: string;
    instantDemoTitle: string;
    demoFarmerBtn: string;
    demoBuyerBtn: string;
  };
  topbar: {
    farmerPortal: string;
    buyerPortal: string;
    switchPortal: string;
    signOut: string;
    liveSync: string;
  };
  farmerNav: {
    storage: string;
    ochratoxin: string;
    pest: string;
    quality: string;
    labs: string;
    irrigation: string;
    yieldProfit: string;
    indiaMap: string;
    blockchain: string;
    community: string;
  };
  buyerNav: {
    marketplace: string;
    scanner: string;
    traceability: string;
    messages: string;
    ordersMap: string;
  };
  storage: {
    title: string;
    subtitle: string;
    totalStock: string;
    avgHumidity: string;
    activeAlerts: string;
    avgShelfLife: string;
    temperature: string;
    humidity: string;
    moisture: string;
    weightLoss: string;
    shelfLife: string;
    daysLeft: string;
    exhaustFan: string;
    dehumidifier: string;
    simulateSpike: string;
    stabilizeChamber: string;
    humidityHistory: string;
    ochratoxinRiskNote: string;
  };
  vision: {
    ochratoxinTitle: string;
    ochratoxinSubtitle: string;
    pestTitle: string;
    pestSubtitle: string;
    buyerTitle: string;
    buyerSubtitle: string;
    startCamera: string;
    stopCamera: string;
    captureFrame: string;
    uploadPhoto: string;
    useSample: string;
    analyzeBtn: string;
    analyzing: string;
    confidence: string;
    affectedArea: string;
    riskLevel: string;
    markers: string;
    actions: string;
    safeMarket: string;
    quarantineRequired: string;
  };
  quality: {
    title: string;
    subtitle: string;
    publishLot: string;
    variety: string;
    grade: string;
    quantityKg: string;
    pricePerKg: string;
    district: string;
    curingPct: string;
    dryMatterPct: string;
    bulbDiameter: string;
    submitLot: string;
  };
  labs: {
    title: string;
    subtitle: string;
    logSample: string;
    growthStage: string;
    labName: string;
    submitSample: string;
    stageGuide: string;
  };
  irrigation: {
    title: string;
    subtitle: string;
    weatherTitle: string;
    rainPause: string;
    valveControl: string;
    soilMoisture: string;
    targetMoisture: string;
    flowRate: string;
  };
  yieldProfit: {
    title: string;
    subtitle: string;
    yieldChartTitle: string;
    calcTitle: string;
    acreage: string;
    expectedYieldQ: string;
    seedCost: string;
    fertilizerCost: string;
    irrigationPower: string;
    laborStorage: string;
    expectedPriceQ: string;
    grossRevenue: string;
    totalCost: string;
    netProfit: string;
    breakEvenKg: string;
    roiPct: string;
  };
  indiaMap: {
    title: string;
    subtitle: string;
    hoverPrompt: string;
    synopsis: string;
    yieldForecast: string;
    pestAdvice: string;
    onionBelts: string;
    humidityRisk: string;
  };
  blockchain: {
    title: string;
    subtitle: string;
    filterBatch: string;
    allBatches: string;
    verifiedChain: string;
    prevHash: string;
    blockHash: string;
  };
  community: {
    title: string;
    subtitle: string;
    forumTab: string;
    exchangeTab: string;
    expertTab: string;
    askForum: string;
    postTitle: string;
    postBody: string;
    publishPost: string;
    replyPlaceholder: string;
    listResource: string;
    bookResource: string;
    releaseResource: string;
    expertPrompt: string;
    askExpertBtn: string;
  };
  buyer: {
    marketTitle: string;
    marketSubtitle: string;
    availableKg: string;
    orderQty: string;
    buyNow: string;
    ochratoxinVerified: string;
    traceBatchTitle: string;
    traceBatchSubtitle: string;
    chatTitle: string;
    chatSubtitle: string;
    sendMessage: string;
    ordersTitle: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    brand: 'PyazNet',
    tagline: 'Onion Supply Chain, Mycotoxin Vision & Direct Trade',
    languages: { en: 'English', hi: 'हिन्दी', or: 'ଓଡ଼ିଆ' },
    auth: {
      loginTab: 'Login',
      registerTab: 'Register',
      welcomeTitle: 'Precision Onion Supply Chain & Direct Marketplace',
      welcomeSubtitle:
        'Prevent Ochratoxin A spoilage, monitor live storage humidity, detect crop pests with ML vision, and trade directly with verified farms across India.',
      rolePrompt: 'Select Your Account Role',
      farmerRole: 'Farmer / FPO',
      farmerDesc: '10 agronomy, sensor, ML lab & blockchain modules',
      buyerRole: 'Buyer / Consumer',
      buyerDesc: 'Direct produce sourcing, adulteration camera & traceability',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password (min 6 chars)',
      state: 'State / Region',
      organization: 'Farm / Business Name',
      signInBtn: 'Sign In to Portal',
      createAccountBtn: 'Create Account & Enter',
      instantDemoTitle: 'Instant Workspace Preview',
      demoFarmerBtn: 'Enter as Demo Farmer',
      demoBuyerBtn: 'Enter as Demo Buyer',
    },
    topbar: {
      farmerPortal: 'Farmer Operations',
      buyerPortal: 'Buyer Marketplace',
      switchPortal: 'Switch Role',
      signOut: 'Sign Out',
      liveSync: 'Live Inventory Sync',
    },
    farmerNav: {
      storage: '01. Storage & Shelf-Life',
      ochratoxin: '02. Ochratoxin A Camera',
      pest: '03. Pest & Disease AI',
      quality: '04. Onion Quality & Lots',
      labs: '05. Crop Growth Labs',
      irrigation: '06. Irrigation & Weather',
      yieldProfit: '07. Yield & Profit Calc',
      indiaMap: '08. India Crop Map',
      blockchain: '09. Blockchain Ledger',
      community: '10. Forum, P2P & Expert',
    },
    buyerNav: {
      marketplace: 'Direct Marketplace',
      scanner: 'Adulteration & Pest Camera',
      traceability: 'Farm-to-Table Traceability',
      messages: 'Direct Farmer Messaging',
      ordersMap: 'Orders & India Supply Map',
    },
    storage: {
      title: 'Automated Storage Environment & Shelf-Life Telemetry',
      subtitle:
        'Real-time chawl moisture, temperature, and weight-loss tracking to block Aspergillus niger and carcinogenic Ochratoxin A formation.',
      totalStock: 'Monitored Stock',
      avgHumidity: 'Mean Relative Humidity',
      activeAlerts: 'Moisture Alerts',
      avgShelfLife: 'Mean Shelf-Life',
      temperature: 'Temperature',
      humidity: 'Rel. Humidity',
      moisture: 'Bulb Moisture',
      weightLoss: 'Weight Shrinkage',
      shelfLife: 'Est. Shelf-Life',
      daysLeft: 'days left',
      exhaustFan: 'Exhaust Louvers',
      dehumidifier: 'Dehumidifier',
      simulateSpike: 'Test Moisture Spike Alert',
      stabilizeChamber: 'Auto-Stabilize Chamber',
      humidityHistory: '24-Hour Humidity & Thermal Curve',
      ochratoxinRiskNote:
        'Ochratoxin A prevention threshold: Keep storage RH below 68% and bulb moisture under 13.5% to halt Aspergillus niger spore germination.',
    },
    vision: {
      ochratoxinTitle: 'Ochratoxin A & Aspergillus Niger ML Vision Camera',
      ochratoxinSubtitle:
        'Analyze high-resolution onion bulb imagery using Gemini Vision ML to detect black mold spores, neck rot, and mycotoxin risk before storage contamination.',
      pestTitle: 'Automated Crop Disease & Pest Detection Camera',
      pestSubtitle:
        'Identify Purple Blotch, Stemphylium Blight, Onion Thrips, and Basal Rot from leaf or bulb photographs with localized treatment guidance.',
      buyerTitle: 'Consumer Produce Adulteration & Pest ML Scanner',
      buyerSubtitle:
        'Real-time image inspection for artificial dye coating, chemical bleaching, hidden insect borers, and Aspergillus niger spoilage.',
      startCamera: 'Open Live Camera',
      stopCamera: 'Close Camera',
      captureFrame: 'Capture Frame',
      uploadPhoto: 'Upload High-Res Image',
      useSample: 'Load Reference Specimen',
      analyzeBtn: 'Run ML Vision Analysis',
      analyzing: 'Processing high-resolution optical markers...',
      confidence: 'Model Confidence',
      affectedArea: 'Affected Surface',
      riskLevel: 'Risk Classification',
      markers: 'Detected Biological / Chemical Markers',
      actions: 'Recommended Protocol',
      safeMarket: 'Safe for Market / Consumption',
      quarantineRequired: 'Quarantine / Reject Batch',
    },
    quality: {
      title: 'Onion Quality Grading & Live Inventory Publishing',
      subtitle:
        'Track curing %, dry matter, and bulb caliber. Newly published lots synchronize immediately with the Buyer Direct Marketplace and Blockchain ledger.',
      publishLot: 'Publish New Cured Lot',
      variety: 'Onion Variety',
      grade: 'Quality Grade',
      quantityKg: 'Quantity (kg)',
      pricePerKg: 'Direct Price (₹/kg)',
      district: 'District / Cluster',
      curingPct: 'Curing %',
      dryMatterPct: 'Dry Matter %',
      bulbDiameter: 'Bulb Size (mm)',
      submitLot: 'Publish to Marketplace & Chain',
    },
    labs: {
      title: 'All-Stage Crop Growth Labs & Soil Diagnostics',
      subtitle:
        'Comprehensive agronomy testing across Nursery, Vegetative, Bulb Initiation, and Curing stages including NPK, pH, and ELISA Ochratoxin screening.',
      logSample: 'Submit Lab Sample',
      growthStage: 'Crop Growth Stage',
      labName: 'Testing Facility',
      submitSample: 'Record Lab Report',
      stageGuide: 'Allium Cepa 4-Stage Growth Protocol',
    },
    irrigation: {
      title: 'Automated Soil-Feedback Irrigation & Live Weather',
      subtitle:
        'Drip valve automation guided by tensiometer soil moisture feedback and rain-probability scheduling alerts.',
      weatherTitle: 'Station Weather & Rain Scheduling Alerts',
      rainPause: 'Rain-Auto-Pause',
      valveControl: 'Drip Valve',
      soilMoisture: 'Soil Moisture',
      targetMoisture: 'Target Threshold',
      flowRate: 'Flow Rate',
    },
    yieldProfit: {
      title: 'Real-Time Yield Prediction & Onion Profit Calculator',
      subtitle:
        'Compare seasonal output curves and model net farm profit per acre after curing weight shrinkage and storage costs.',
      yieldChartTitle: 'Projected Yield Curve (Quintals / Acre)',
      calcTitle: 'Interactive Onion Economics & Break-Even Calculator',
      acreage: 'Cultivated Area (Acres)',
      expectedYieldQ: 'Yield (Quintals / Acre)',
      seedCost: 'Seeds & Nursery (₹)',
      fertilizerCost: 'Nutrients & Bio-Control (₹)',
      irrigationPower: 'Drip & Electricity (₹)',
      laborStorage: 'Labor, Curing & Storage (₹)',
      expectedPriceQ: 'Direct Sale Price (₹ / Quintal)',
      grossRevenue: 'Gross Revenue',
      totalCost: 'Total Input Cost',
      netProfit: 'Projected Net Profit',
      breakEvenKg: 'Break-Even Price / kg',
      roiPct: 'Return on Cost (ROI)',
    },
    indiaMap: {
      title: 'India State-Level Agriculture & Crop Intelligence Map',
      subtitle:
        'Hover over any Indian state to inspect its agricultural synopsis, real-time crop yield forecast, onion belt status, and localized pest control advisory.',
      hoverPrompt: 'Hover or click any state on the map to inspect regional intelligence.',
      synopsis: 'Agriculture Synopsis',
      yieldForecast: 'Real-Time Crop Yield Forecast',
      pestAdvice: 'Localized Pest Control Advice',
      onionBelts: 'Key Production Belts',
      humidityRisk: 'Storage Humidity Risk',
    },
    blockchain: {
      title: 'Immutable Farm-to-Table Blockchain Supply Chain',
      subtitle:
        'Cryptographic SHA-256 linked audit trail from harvest lot creation and Ochratoxin ML verification through buyer dispatch.',
      filterBatch: 'Filter by Batch Code',
      allBatches: 'All Verified Batches',
      verifiedChain: 'SHA-256 Chain Integrity Verified',
      prevHash: 'Prev Hash',
      blockHash: 'Block Hash',
    },
    community: {
      title: 'Farmer Forum, P2P Resource Exchange & Expert Consultation',
      subtitle:
        'Share field techniques, rent solar dryers or moisture meters peer-to-peer, and consult the multilingual onion agronomy specialist.',
      forumTab: 'Community Forum',
      exchangeTab: 'P2P Equipment & Input Exchange',
      expertTab: 'Personalized Expert Consultation',
      askForum: 'Start a Knowledge Thread',
      postTitle: 'Topic Title',
      postBody: 'Field observation or question...',
      publishPost: 'Post to Community',
      replyPlaceholder: 'Write a helpful reply...',
      listResource: 'List Equipment or Supply',
      bookResource: 'Reserve / Rent',
      releaseResource: 'Release Booking',
      expertPrompt: 'Ask an agronomy, irrigation, pest, or Ochratoxin storage question...',
      askExpertBtn: 'Get Expert Guidance',
    },
    buyer: {
      marketTitle: 'Direct-from-Farm Verified Onion Marketplace',
      marketSubtitle:
        'Real-time cured inventory synchronized directly with farmer chawls. Every listed lot carries Ochratoxin-free verification and blockchain provenance.',
      availableKg: 'Available Stock',
      orderQty: 'Order Qty (kg)',
      buyNow: 'Place Direct Order',
      ochratoxinVerified: 'Ochratoxin-Free Verified',
      traceBatchTitle: 'Farm-to-Table Blockchain Provenance Lookup',
      traceBatchSubtitle:
        'Inspect every cryptographic stage from harvest curing and ML mycotoxin clearance to direct transit.',
      chatTitle: 'Direct Marketplace Messaging with Farmers',
      chatSubtitle: 'Coordinate bulk grading, mesh bagging, and dispatch windows directly with growers.',
      sendMessage: 'Send Message',
      ordersTitle: 'Your Active Direct Orders & Regional Supply Map',
    },
  },
  hi: {
    brand: 'प्याज़नेट (PyazNet)',
    tagline: 'प्याज़ आपूर्ति श्रृंखला, मायकोटॉक्सिन विज़न और सीधा बाज़ार',
    languages: { en: 'English', hi: 'हिन्दी', or: 'ଓଡ଼ିଆ' },
    auth: {
      loginTab: 'लॉगिन',
      registerTab: 'पंजीकरण',
      welcomeTitle: 'स्मार्ट प्याज़ आपूर्ति श्रृंखला और सीधा बाज़ार मंच',
      welcomeSubtitle:
        'ओक्राटॉक्सिन-ए सड़न रोकें, लाइव भंडारण नमी की निगरानी करें, एमएल कैमरे से कीट पहचानें और भारत भर के किसानों से सीधे जुड़ें।',
      rolePrompt: 'अपनी भूमिका चुनें',
      farmerRole: 'किसान / FPO',
      farmerDesc: '10 कृषि, सेंसर, एमएल लैब और ब्लॉकचेन अनुभाग',
      buyerRole: 'खरीदार / उपभोक्ता',
      buyerDesc: 'सीधी खरीद, मिलावट जांच कैमरा और ब्लॉकचेन ट्रैकिंग',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      password: 'पासवर्ड (न्यूनतम 6 अक्षर)',
      state: 'राज्य / क्षेत्र',
      organization: 'फार्म / व्यवसाय का नाम',
      signInBtn: 'पोर्टल में प्रवेश करें',
      createAccountBtn: 'खाता बनाएं और शुरू करें',
      instantDemoTitle: 'तत्काल डेमो प्रीव्यू',
      demoFarmerBtn: 'डेमो किसान के रूप में प्रवेश करें',
      demoBuyerBtn: 'डेमो खरीदार के रूप में प्रवेश करें',
    },
    topbar: {
      farmerPortal: 'किसान संचालन केंद्र',
      buyerPortal: 'खरीदार बाज़ार पोर्टल',
      switchPortal: 'भूमिका बदलें',
      signOut: 'लॉग आउट',
      liveSync: 'लाइव इन्वेंटरी सिंक',
    },
    farmerNav: {
      storage: '01. भंडारण और शेल्फ-लाइफ',
      ochratoxin: '02. ओक्राटॉक्सिन-ए कैमरा',
      pest: '03. कीट और रोग पहचान',
      quality: '04. प्याज़ गुणवत्ता व लॉट',
      labs: '05. फसल विकास प्रयोगशाला',
      irrigation: '06. सिंचाई और मौसम',
      yieldProfit: '07. उपज और लाभ कैलकुलेटर',
      indiaMap: '08. भारत कृषि मानचित्र',
      blockchain: '09. ब्लॉकचेन ट्रैकर',
      community: '10. मंच, P2P और विशेषज्ञ',
    },
    buyerNav: {
      marketplace: 'सीधा किसान बाज़ार',
      scanner: 'मिलावट व कीट कैमरा',
      traceability: 'फार्म-टू-टेबल ट्रैकिंग',
      messages: 'किसान से सीधा संवाद',
      ordersMap: 'ऑर्डर और भारत मानचित्र',
    },
    storage: {
      title: 'स्वचालित भंडारण वातावरण और शेल्फ-लाइफ निगरानी',
      subtitle:
        'एस्परजिलस नाइजर और घातक ओक्राटॉक्सिन-ए को रोकने के लिए चॉल नमी, तापमान और वजन घटाव की लाइव निगरानी।',
      totalStock: 'निगरानी में कुल स्टॉक',
      avgHumidity: 'औसत सापेक्ष आर्द्रता',
      activeAlerts: 'नमी चेतावनी अलर्ट',
      avgShelfLife: 'औसत शेल्फ-लाइफ',
      temperature: 'तापमान',
      humidity: 'सापेक्ष आर्द्रता',
      moisture: 'कंद की नमी',
      weightLoss: 'वजन में कमी',
      shelfLife: 'अनुमानित शेल्फ-लाइफ',
      daysLeft: 'दिन शेष',
      exhaustFan: 'निकास पंखे',
      dehumidifier: 'डीह्यूमिडिफायर',
      simulateSpike: 'नमी अलर्ट परीक्षण करें',
      stabilizeChamber: 'चॉल वातावरण स्थिर करें',
      humidityHistory: '24-घंटे की आर्द्रता और तापमान ग्राफ',
      ochratoxinRiskNote:
        'ओक्राटॉक्सिन-ए सुरक्षा सीमा: एस्परजिलस नाइजर फफूंद रोकने के लिए भंडारण आर्द्रता 68% से कम और कंद नमी 13.5% से नीचे रखें।',
    },
    vision: {
      ochratoxinTitle: 'ओक्राटॉक्सिन-ए और एस्परजिलस नाइजर एमएल विज़न कैमरा',
      ochratoxinSubtitle:
        'भंडारण खराब होने से पहले काली फफूंद, गर्दन सड़न और मायकोटॉक्सिन जोखिम पहचानने के लिए उच्च-रिज़ॉल्यूशन छवि विश्लेषण।',
      pestTitle: 'स्वचालित फसल रोग और कीट पहचान कैमरा',
      pestSubtitle:
        'पत्ती या कंद की फोटो से पर्पल ब्लॉच, थ्रिप्स, स्टेमफीलियम झुलसा और बेसल रॉट की तुरंत पहचान व उपचार।',
      buyerTitle: 'खरीदार मिलावट और कीट एमएल विज़न स्कैनर',
      buyerSubtitle:
        'कृत्रिम रंग मिलावट, रासायनिक ब्लीचिंग, अंदरूनी कीट और काली फफूंद की वास्तविक समय जांच।',
      startCamera: 'लाइव कैमरा खोलें',
      stopCamera: 'कैमरा बंद करें',
      captureFrame: 'फोटो कैप्चर करें',
      uploadPhoto: 'उच्च-रिज़ॉल्यूशन फोटो अपलोड',
      useSample: 'नमूना छवि लोड करें',
      analyzeBtn: 'एमएल विश्लेषण चलाएं',
      analyzing: 'उच्च-रिज़ॉल्यूशन ऑप्टिकल जांच जारी है...',
      confidence: 'मॉडल सटीकता',
      affectedArea: 'प्रभावित क्षेत्र',
      riskLevel: 'जोखिम स्तर',
      markers: 'पहचाने गए जैविक / रासायनिक संकेत',
      actions: 'सुझाए गए सुरक्षा कदम',
      safeMarket: 'बाज़ार और उपभोग के लिए सुरक्षित',
      quarantineRequired: 'लॉट को अलग रखें / अस्वीकार करें',
    },
    quality: {
      title: 'प्याज़ गुणवत्ता ग्रेडिंग और लाइव इन्वेंटरी प्रकाशन',
      subtitle:
        'क्योरिंग %, सूखा पदार्थ और कंद का आकार ट्रैक करें। नए लॉट तुरंत खरीदार बाज़ार और ब्लॉकचेन में जुड़ते हैं।',
      publishLot: 'नया क्योर्ड लॉट प्रकाशित करें',
      variety: 'प्याज़ की किस्म',
      grade: 'गुणवत्ता ग्रेड',
      quantityKg: 'मात्रा (किग्रा)',
      pricePerKg: 'सीधा मूल्य (₹/किग्रा)',
      district: 'जिला / क्लस्टर',
      curingPct: 'क्योरिंग %',
      dryMatterPct: 'ड्राई मैटर %',
      bulbDiameter: 'कंद व्यास (मिमी)',
      submitLot: 'बाज़ार और ब्लॉकचेन में जोड़ें',
    },
    labs: {
      title: 'सभी फसल विकास चरण प्रयोगशालाएं और मृदा जांच',
      subtitle:
        'नर्सरी, वानस्पतिक विकास, कंद निर्माण और क्योरिंग चरणों के लिए NPK, pH और ELISA ओक्राटॉक्सिन जांच रिपोर्ट।',
      logSample: 'लैब सैंपल दर्ज करें',
      growthStage: 'फसल विकास चरण',
      labName: 'प्रयोगशाला का नाम',
      submitSample: 'रिपोर्ट सहेजें',
      stageGuide: 'प्याज़ फसल के 4 मुख्य विकास चरण',
    },
    irrigation: {
      title: 'स्वचालित मृदा-आधारित सिंचाई और लाइव मौसम',
      subtitle:
        'मिट्टी की नमी सेंसर और बारिश की संभावना अलर्ट के आधार पर स्वचालित ड्रिप वाल्व नियंत्रण।',
      weatherTitle: 'मौसम केंद्र और सिंचाई शेड्यूल अलर्ट',
      rainPause: 'बारिश ऑटो-रोक',
      valveControl: 'ड्रिप वाल्व',
      soilMoisture: 'मिट्टी की नमी',
      targetMoisture: 'लक्ष्य नमी सीमा',
      flowRate: 'प्रवाह दर',
    },
    yieldProfit: {
      title: 'रियल-टाइम उपज अनुमान और प्याज़ लाभ कैलकुलेटर',
      subtitle:
        'मौसमी उपज ग्राफ देखें और क्योरिंग वजन घटाव व भंडारण खर्च के बाद शुद्ध मुनाफे की गणना करें।',
      yieldChartTitle: 'अनुमानित उपज वक्र (क्विंटल / एकड़)',
      calcTitle: 'इंटरैक्टिव प्याज़ लाभ और लागत कैलकुलेटर',
      acreage: 'खेती का क्षेत्र (एकड़)',
      expectedYieldQ: 'उपज (क्विंटल / एकड़)',
      seedCost: 'बीज और नर्सरी लागत (₹)',
      fertilizerCost: 'खाद और जैव-नियंत्रण (₹)',
      irrigationPower: 'सिंचाई और बिजली (₹)',
      laborStorage: 'श्रम, क्योरिंग व भंडारण (₹)',
      expectedPriceQ: 'अपेक्षित बिक्री मूल्य (₹ / क्विंटल)',
      grossRevenue: 'कुल आय',
      totalCost: 'कुल लागत',
      netProfit: 'अनुमानित शुद्ध लाभ',
      breakEvenKg: 'ब्रेक-ईवन मूल्य / किग्रा',
      roiPct: 'लागत पर लाभ (ROI)',
    },
    indiaMap: {
      title: 'भारत राज्य-स्तरीय कृषि और फसल बुद्धिमत्ता मानचित्र',
      subtitle:
        'किसी भी भारतीय राज्य पर माउस ले जाएं और कृषि सारांश, लाइव फसल उपज पूर्वानुमान और स्थानीय कीट नियंत्रण सलाह देखें।',
      hoverPrompt: 'क्षेत्रीय जानकारी देखने के लिए मानचित्र पर किसी भी राज्य पर होवर या क्लिक करें।',
      synopsis: 'कृषि सारांश',
      yieldForecast: 'रियल-टाइम फसल उपज पूर्वानुमान',
      pestAdvice: 'स्थानीय कीट नियंत्रण सलाह',
      onionBelts: 'प्रमुख उत्पादन क्षेत्र',
      humidityRisk: 'भंडारण नमी जोखिम',
    },
    blockchain: {
      title: 'पारदर्शी फार्म-टू-टेबल ब्लॉकचेन आपूर्ति श्रृंखला',
      subtitle:
        'फसल कटाई, ओक्राटॉक्सिन एमएल जांच और खरीदार डिस्पैच तक SHA-256 क्रिप्टोग्राफिक ऑडिट रिकॉर्ड।',
      filterBatch: 'बैच कोड द्वारा फ़िल्टर करें',
      allBatches: 'सभी सत्यापित बैच',
      verifiedChain: 'SHA-256 श्रृंखला अखंडता सत्यापित',
      prevHash: 'पिछला हैश',
      blockHash: 'ब्लॉक हैश',
    },
    community: {
      title: 'किसान मंच, P2P उपकरण विनिमय और कृषि विशेषज्ञ परामर्श',
      subtitle:
        'खेती के अनुभव साझा करें, सोलर ड्रायर या नमी मीटर किराए पर लें और प्याज़ विशेषज्ञ से सलाह पाएं।',
      forumTab: 'किसान ज्ञान मंच',
      exchangeTab: 'P2P उपकरण व सामग्री बाज़ार',
      expertTab: 'व्यक्तिगत विशेषज्ञ परामर्श',
      askForum: 'नया प्रश्न या अनुभव लिखें',
      postTitle: 'विषय शीर्षक',
      postBody: 'अपना अनुभव या प्रश्न लिखें...',
      publishPost: 'मंच पर प्रकाशित करें',
      replyPlaceholder: 'उपयोगी उत्तर लिखें...',
      listResource: 'उपकरण या बीज सूचीबद्ध करें',
      bookResource: 'बुक / किराए पर लें',
      releaseResource: 'बुकिंग मुक्त करें',
      expertPrompt: 'सिंचाई, कीट, रोग या ओक्राटॉक्सिन भंडारण से जुड़ा प्रश्न पूछें...',
      askExpertBtn: 'विशेषज्ञ सलाह लें',
    },
    buyer: {
      marketTitle: 'सीधे खेत से सत्यापित प्याज़ बाज़ार',
      marketSubtitle:
        'किसान चॉल से लाइव जुड़ाव। हर बैच ओक्राटॉक्सिन-मुक्त प्रमाणित और ब्लॉकचेन से ट्रैक किया गया है।',
      availableKg: 'उपलब्ध स्टॉक',
      orderQty: 'मात्रा (किग्रा)',
      buyNow: 'सीधा ऑर्डर दें',
      ochratoxinVerified: 'ओक्राटॉक्सिन-मुक्त सत्यापित',
      traceBatchTitle: 'फार्म-टू-टेबल ब्लॉकचेन ट्रैकिंग जांच',
      traceBatchSubtitle: 'कटाई, एमएल फफूंद परीक्षण और परिवहन के हर चरण की सत्यता जांचें।',
      chatTitle: 'किसानों से सीधा बाज़ार संवाद',
      chatSubtitle: 'ग्रेडिंग, पैकिंग और डिलीवरी समय पर सीधे किसान से बात करें।',
      sendMessage: 'संदेश भेजें',
      ordersTitle: 'आपके सक्रिय ऑर्डर और क्षेत्रीय आपूर्ति मानचित्र',
    },
  },
  or: {
    brand: 'ପିଆଜନେଟ୍ (PyazNet)',
    tagline: 'ପିଆଜ ଯୋଗାଣ ଶୃଙ୍ଖଳା, ଏମଏଲ ଭିଜନ ଓ ସିଧାସଳଖ ବଜାର',
    languages: { en: 'English', hi: 'हिन्दी', or: 'ଓଡ଼ିଆ' },
    auth: {
      loginTab: 'ଲଗଇନ୍',
      registerTab: 'ପଞ୍ଜୀକରଣ',
      welcomeTitle: 'ସ୍ମାର୍ଟ ପିଆଜ ଯୋଗାଣ ଶୃଙ୍ଖଳା ଓ ସିଧାସଳଖ ବଜାର',
      welcomeSubtitle:
        'ଓକ୍ରାଟକ୍ସିନ୍-ଏ ନଷ୍ଟ ରୋକନ୍ତୁ, ଲାଇଭ୍ ସଂରକ୍ଷଣ ଆର୍ଦ୍ରତା ଦେଖନ୍ତୁ, ଏମଏଲ କ୍ୟାମେରାରେ ରୋଗ ପୋକ ଚିହ୍ନନ୍ତୁ ଏବଂ ଚାଷୀଙ୍କଠାରୁ ସିଧାସଳଖ କିଣନ୍ତୁ ।',
      rolePrompt: 'ଆପଣଙ୍କ ଭୂମିକା ବାଛନ୍ତୁ',
      farmerRole: 'ଚାଷୀ / FPO',
      farmerDesc: '୧୦ଟି କୃଷି, ସେନ୍ସର, ଏମଏଲ ଲ୍ୟାବ ଓ ବ୍ଲକଚେନ୍ ବିଭାଗ',
      buyerRole: 'କ୍ରେତା / ଗ୍ରାହକ',
      buyerDesc: 'ସିଧାସଳଖ କ୍ରୟ, ଅପମିଶ୍ରଣ କ୍ୟାମେରା ଓ ଟ୍ରାକିଂ',
      fullName: 'ପୂର୍ଣ୍ଣ ନାମ',
      email: 'ଇମେଲ୍ ଠିକଣା',
      password: 'ପାସୱାର୍ଡ (ସର୍ବନିମ୍ନ ୬ ଅକ୍ଷର)',
      state: 'ରାଜ୍ୟ / ଅଞ୍ଚଳ',
      organization: 'ଫାର୍ମ / ବ୍ୟବସାୟ ନାମ',
      signInBtn: 'ପୋର୍ଟାଲରେ ପ୍ରବେଶ କରନ୍ତୁ',
      createAccountBtn: 'ଆକାଉଣ୍ଟ ଖୋଲନ୍ତୁ',
      instantDemoTitle: 'ତୁରନ୍ତ ଡେମୋ ପ୍ରିଭ୍ୟୁ',
      demoFarmerBtn: 'ଡେମୋ ଚାଷୀ ଭାବରେ ପ୍ରବେଶ କରନ୍ତୁ',
      demoBuyerBtn: 'ଡେମୋ କ୍ରେତା ଭାବରେ ପ୍ରବେଶ କରନ୍ତୁ',
    },
    topbar: {
      farmerPortal: 'ଚାଷୀ ପରିଚାଳନା କେନ୍ଦ୍ର',
      buyerPortal: 'କ୍ରେତା ବଜାର ପୋର୍ଟାଲ',
      switchPortal: 'ଭୂମିକା ବଦଳାନ୍ତୁ',
      signOut: 'ଲଗ୍ ଆଉଟ୍',
      liveSync: 'ଲାଇଭ୍ ଷ୍ଟକ୍ ସିଙ୍କ୍',
    },
    farmerNav: {
      storage: '01. ସଂରକ୍ଷଣ ଓ ସେଲ୍ଫ-ଲାଇଫ୍',
      ochratoxin: '02. ଓକ୍ରାଟକ୍ସିନ୍-ଏ କ୍ୟାମେରା',
      pest: '03. ରୋଗ ଓ ପୋକ ଚିହ୍ନଟ',
      quality: '04. ପିଆଜ ଗୁଣବତ୍ତା ଓ ଲଟ୍',
      labs: '05. ଫସଲ ବୃଦ୍ଧି ଲ୍ୟାବ୍',
      irrigation: '06. ଜଳସେଚନ ଓ ପାଣିପାଗ',
      yieldProfit: '07. ଅମଳ ଓ ଲାଭ ହିସାବ',
      indiaMap: '08. ଭାରତ କୃଷି ମାନଚିତ୍ର',
      blockchain: '09. ବ୍ଲକଚେନ୍ ଟ୍ରାକର',
      community: '10. ଫୋରମ୍, P2P ଓ ବିଶେଷଜ୍ଞ',
    },
    buyerNav: {
      marketplace: 'ସିଧାସଳଖ ଚାଷୀ ବଜାର',
      scanner: 'ଅପମିଶ୍ରଣ ଓ ପୋକ କ୍ୟାମେରା',
      traceability: 'ଫାର୍ମ-ଟୁ-ଟେବୁଲ୍ ଟ୍ରାକିଂ',
      messages: 'ଚାଷୀଙ୍କ ସହ ସିଧା କଥାବାର୍ତ୍ତା',
      ordersMap: 'ଅର୍ଡର ଓ ଭାରତ ମାନଚିତ୍ର',
    },
    storage: {
      title: 'ସ୍ୱୟଂଚାଳିତ ସଂରକ୍ଷଣ ପରିବେଶ ଓ ସେଲ୍ଫ-ଲାଇଫ୍ ନିରୀକ୍ଷଣ',
      subtitle:
        'ଆସ୍ପରଜିଲସ୍ ନାଇଜର ଓ ଘାତକ ଓକ୍ରାଟକ୍ସିନ୍-ଏ ରୋକିବା ପାଇଁ ଆର୍ଦ୍ରତା, ତାପମାତ୍ରା ଓ ଓଜନ ହ୍ରାସର ଲାଇଭ୍ ଟ୍ରାକିଂ ।',
      totalStock: 'ମୋଟ ସଂରକ୍ଷିତ ଷ୍ଟକ୍',
      avgHumidity: 'ହାରାହାରି ଆପେକ୍ଷିକ ଆର୍ଦ୍ରତା',
      activeAlerts: 'ଆର୍ଦ୍ରତା ସତର୍କତା',
      avgShelfLife: 'ହାରାହାରି ସେଲ୍ଫ-ଲାଇଫ୍',
      temperature: 'ତାପମାତ୍ରା',
      humidity: 'ଆପେକ୍ଷିକ ଆର୍ଦ୍ରତା',
      moisture: 'ପିଆଜ ଆର୍ଦ୍ରତା',
      weightLoss: 'ଓଜନ ହ୍ରାସ',
      shelfLife: 'ଆନୁମାନିକ ସେଲ୍ଫ-ଲାଇଫ୍',
      daysLeft: 'ଦିନ ବାକି',
      exhaustFan: 'ଏଗଜଷ୍ଟ୍ ଫ୍ୟାନ୍',
      dehumidifier: 'ଡିହ୍ୟୁମିଡିଫାୟର୍',
      simulateSpike: 'ଆର୍ଦ୍ରତା ସତର୍କତା ପରୀକ୍ଷା',
      stabilizeChamber: 'ପରିବେଶ ସ୍ଥିର କରନ୍ତୁ',
      humidityHistory: '୨୪-ଘଣ୍ଟା ଆର୍ଦ୍ରତା ଓ ତାପମାତ୍ରା ଗ୍ରାଫ୍',
      ochratoxinRiskNote:
        'ଓକ୍ରାଟକ୍ସିନ୍-ଏ ସୁରକ୍ଷା ସୀମା: କଳା ଫିମ୍ପି ରୋକିବା ପାଇଁ ସଂରକ୍ଷଣ ଆର୍ଦ୍ରତା 68% ତଳେ ଏବଂ ପିଆଜ ଆର୍ଦ୍ରତା 13.5% ତଳେ ରଖନ୍ତୁ ।',
    },
    vision: {
      ochratoxinTitle: 'ଓକ୍ରାଟକ୍ସିନ୍-ଏ ଓ ଆସ୍ପରଜିଲସ୍ ନାଇଜର ଏମଏଲ କ୍ୟାମେରା',
      ochratoxinSubtitle:
        'ସଂରକ୍ଷଣ ନଷ୍ଟ ହେବା ପୂର୍ବରୁ କଳା ଫିମ୍ପି, ଗଣ୍ଠି ସଢ଼ା ଓ ମାଇକୋଟକ୍ସିନ୍ ବିପଦ ଚିହ୍ନଟ ପାଇଁ ଉଚ୍ଚ-ରିଜୋଲ୍ୟୁସନ୍ ଚିତ୍ର ବିଶ୍ଳେଷଣ ।',
      pestTitle: 'ସ୍ୱୟଂଚାଳିତ ଫସଲ ରୋଗ ଓ ପୋକ ଚିହ୍ନଟ କ୍ୟାମେରା',
      pestSubtitle:
        'ପତ୍ର ବା ପିଆଜ ଫଟୋରୁ ପର୍ପଲ ବ୍ଲଚ୍, ଥ୍ରିପ୍ସ ଓ ବେସାଲ ରଟ୍ ଚିହ୍ନଟ ସହିତ ସ୍ଥାନୀୟ ଉପଚାର ପରାମର୍ଶ ।',
      buyerTitle: 'ଗ୍ରାହକ ଅପମିଶ୍ରଣ ଓ ପୋକ ଏମଏଲ ସ୍କାନର',
      buyerSubtitle:
        'କୃତ୍ରିମ ରଙ୍ଗ, ରାସାୟନିକ ବ୍ଲିଚିଂ, ଭିତର ପୋକ ଏବଂ କଳା ଫିମ୍ପିର ତୁରନ୍ତ ପରୀକ୍ଷା ।',
      startCamera: 'ଲାଇଭ୍ କ୍ୟାମେରା ଖୋଲନ୍ତୁ',
      stopCamera: 'କ୍ୟାମେରା ବନ୍ଦ କରନ୍ତୁ',
      captureFrame: 'ଫଟୋ ନିଅନ୍ତୁ',
      uploadPhoto: 'ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
      useSample: 'ନମୁନା ଚିତ୍ର ଲୋଡ୍ କରନ୍ତୁ',
      analyzeBtn: 'ଏମଏଲ ବିଶ୍ଳେଷଣ କରନ୍ତୁ',
      analyzing: 'ଉଚ୍ଚ-ରିଜୋଲ୍ୟୁସନ୍ ଅପ୍ଟିକାଲ ପରୀକ୍ଷା ଚାଲିଛି...',
      confidence: 'ମଡେଲ୍ ସଠିକତା',
      affectedArea: 'ପ୍ରଭାବିତ ଅଂଶ',
      riskLevel: 'ବିପଦ ସ୍ତର',
      markers: 'ଚିହ୍ନଟ ହୋଇଥିବା ଜୈବିକ / ରାସାୟନିକ ସଙ୍କେତ',
      actions: 'ସୁରକ୍ଷା ପଦକ୍ଷେପ',
      safeMarket: 'ବଜାର ଓ ଖାଇବା ପାଇଁ ସୁରକ୍ଷିତ',
      quarantineRequired: 'ଅଲଗା ରଖନ୍ତୁ / ବାତିଲ୍ କରନ୍ତୁ',
    },
    quality: {
      title: 'ପିଆଜ ଗୁଣବତ୍ତା ଗ୍ରେଡିଂ ଓ ଲାଇଭ୍ ଇନଭେଣ୍ଟରି ପ୍ରକାଶନ',
      subtitle:
        'କ୍ୟୁରିଂ %, ଡ୍ରାଏ ମ୍ୟାଟର ଓ ଆକାର ଟ୍ରାକ୍ କରନ୍ତୁ । ନୂଆ ଲଟ୍ ସିଧାସଳଖ କ୍ରେତା ବଜାର ଓ ବ୍ଲକଚେନରେ ଯୋଡ଼ି ହୁଏ ।',
      publishLot: 'ନୂଆ କ୍ୟୋର୍ଡ ଲଟ୍ ପ୍ରକାଶ କରନ୍ତୁ',
      variety: 'ପିଆଜ କିସମ',
      grade: 'ଗୁଣବତ୍ତା ଗ୍ରେଡ୍',
      quantityKg: 'ପରିମାଣ (କିଗ୍ରା)',
      pricePerKg: 'ସିଧା ମୂଲ୍ୟ (₹/କିଗ୍ରା)',
      district: 'ଜିଲ୍ଲା / କ୍ଲଷ୍ଟର',
      curingPct: 'କ୍ୟୁରିଂ %',
      dryMatterPct: 'ଡ୍ରାଏ ମ୍ୟାଟର %',
      bulbDiameter: 'ବ୍ୟାସ (ମିମି)',
      submitLot: 'ବଜାର ଓ ବ୍ଲକଚେନରେ ପ୍ରକାଶ କରନ୍ତୁ',
    },
    labs: {
      title: 'ସମସ୍ତ ଫସଲ ବୃଦ୍ଧି ଲ୍ୟାବ୍ ଓ ମାଟି ପରୀକ୍ଷା',
      subtitle:
        'ନର୍ସରୀ, ବୃଦ୍ଧି, କନ୍ଦ ଗଠନ ଓ କ୍ୟୁରିଂ ପର୍ଯ୍ୟାୟ ପାଇଁ NPK, pH ଏବଂ ELISA ଓକ୍ରାଟକ୍ସିନ୍ ପରୀକ୍ଷା ରିପୋର୍ଟ ।',
      logSample: 'ଲ୍ୟାବ୍ ନମୁନା ଦାଖଲ କରନ୍ତୁ',
      growthStage: 'ଫସଲ ବୃଦ୍ଧି ପର୍ଯ୍ୟାୟ',
      labName: 'ପରୀକ୍ଷାଗାର ନାମ',
      submitSample: 'ରିପୋର୍ଟ ସଂରକ୍ଷଣ କରନ୍ତୁ',
      stageGuide: 'ପିଆଜ ଫସଲର ୪ଟି ମୁଖ୍ୟ ବୃଦ୍ଧି ପର୍ଯ୍ୟାୟ',
    },
    irrigation: {
      title: 'ସ୍ୱୟଂଚାଳିତ ମାଟି-ଆଧାରିତ ଜଳସେଚନ ଓ ପାଣିପାଗ',
      subtitle:
        'ମାଟି ଆର୍ଦ୍ରତା ସେନ୍ସର ଓ ବର୍ଷା ପୂର୍ବାନୁମାନ ସତର୍କତା ଆଧାରରେ ସ୍ୱୟଂଚାଳିତ ଡ୍ରିପ୍ ନିୟନ୍ତ୍ରଣ ।',
      weatherTitle: 'ପାଣିପାଗ କେନ୍ଦ୍ର ଓ ଜଳସେଚନ ସତର୍କତା',
      rainPause: 'ବର୍ଷା ଅଟୋ-ବିରାମ',
      valveControl: 'ଡ୍ରିପ୍ ଭାଲ୍ଭ୍',
      soilMoisture: 'ମାଟି ଆର୍ଦ୍ରତା',
      targetMoisture: 'ଲକ୍ଷ୍ୟ ଆର୍ଦ୍ରତା',
      flowRate: 'ଜଳ ପ୍ରବାହ ହାର',
    },
    yieldProfit: {
      title: 'ଲାଇଭ୍ ଅମଳ ପୂର୍ବାନୁମାନ ଓ ପିଆଜ ଲାଭ କ୍ୟାଲକୁଲେଟର',
      subtitle:
        'ଋତୁକାଳୀନ ଅମଳ ଦେଖନ୍ତୁ ଏବଂ ସଂରକ୍ଷଣ ଖର୍ଚ୍ଚ ପରେ ଏକର ପିଛା ନିଟ୍ ଲାଭ ହିସାବ କରନ୍ତୁ ।',
      yieldChartTitle: 'ଆନୁମାନିକ ଅମଳ ଗ୍ରାଫ୍ (କ୍ୱିଣ୍ଟାଲ୍ / ଏକର)',
      calcTitle: 'ପିଆଜ ଲାଭ ଓ ଖର୍ଚ୍ଚ କ୍ୟାଲକୁଲେଟର',
      acreage: 'ଚାଷ ଜମି (ଏକର)',
      expectedYieldQ: 'ଅମଳ (କ୍ୱିଣ୍ଟାଲ୍ / ଏକର)',
      seedCost: 'ବିହନ ଓ ତଳି ଖର୍ଚ୍ଚ (₹)',
      fertilizerCost: 'ସାର ଓ ଜୈବ-ନିୟନ୍ତ୍ରଣ (₹)',
      irrigationPower: 'ଜଳସେଚନ ଓ ବିଦ୍ୟୁତ୍ (₹)',
      laborStorage: 'ଶ୍ରମ, କ୍ୟୁରିଂ ଓ ସଂରକ୍ଷଣ (₹)',
      expectedPriceQ: 'ବିକ୍ରୟ ମୂଲ୍ୟ (₹ / କ୍ୱିଣ୍ଟାଲ୍)',
      grossRevenue: 'ମୋଟ ଆୟ',
      totalCost: 'ମୋଟ ଖର୍ଚ୍ଚ',
      netProfit: 'ଆନୁମାନିକ ନିଟ୍ ଲାଭ',
      breakEvenKg: 'ବ୍ରେକ୍-ଇଭେନ୍ ମୂଲ୍ୟ / କିଗ୍ରା',
      roiPct: 'ଲାଭ ହାର (ROI)',
    },
    indiaMap: {
      title: 'ଭାରତ ରାଜ୍ୟ-ସ୍ତରୀୟ କୃଷି ଓ ଫସଲ ସୂଚନା ମାନଚିତ୍ର',
      subtitle:
        'ଯେକୌଣସି ଭାରତୀୟ ରାଜ୍ୟ ଉପରେ ମାଉସ୍ ରଖି କୃଷି ସାରାଂଶ, ଲାଇଭ୍ ଅମଳ ପୂର୍ବାନୁମାନ ଏବଂ ସ୍ଥାନୀୟ ପୋକ ନିୟନ୍ତ୍ରଣ ପରାମର୍ଶ ଦେଖନ୍ତୁ ।',
      hoverPrompt: 'ଆଞ୍ଚଳିକ ସୂଚନା ଦେଖିବା ପାଇଁ ମାନଚିତ୍ରରେ ଯେକୌଣସି ରାଜ୍ୟ ଉପରେ ହୋଭର୍ ବା କ୍ଲିକ୍ କରନ୍ତୁ ।',
      synopsis: 'କୃଷି ସାରାଂଶ',
      yieldForecast: 'ଲାଇଭ୍ ଫସଲ ଅମଳ ପୂର୍ବାନୁମାନ',
      pestAdvice: 'ସ୍ଥାନୀୟ ପୋକ ନିୟନ୍ତ୍ରଣ ପରାମର୍ଶ',
      onionBelts: 'ମୁଖ୍ୟ ଉତ୍ପାଦନ ଅଞ୍ଚଳ',
      humidityRisk: 'ସଂରକ୍ଷଣ ଆର୍ଦ୍ରତା ବିପଦ',
    },
    blockchain: {
      title: 'ସ୍ୱଚ୍ଛ ଫାର୍ମ-ଟୁ-ଟେବୁଲ୍ ବ୍ଲକଚେନ୍ ଯୋଗାଣ ଶୃଙ୍ଖଳା',
      subtitle:
        'ଅମଳ ଠାରୁ ଓକ୍ରାଟକ୍ସିନ୍ ଏମଏଲ ପରୀକ୍ଷା ଓ କ୍ରେତା ପ୍ରେରଣ ପର୍ଯ୍ୟନ୍ତ SHA-256 ସୁରକ୍ଷିତ ରେକର୍ଡ ।',
      filterBatch: 'ବ୍ୟାଚ୍ କୋଡ୍ ଦ୍ୱାରା ବାଛନ୍ତୁ',
      allBatches: 'ସମସ୍ତ ସତ୍ୟାପିତ ବ୍ୟାଚ୍',
      verifiedChain: 'SHA-256 ଶୃଙ୍ଖଳା ସତ୍ୟାପିତ',
      prevHash: 'ପୂର୍ବ ହ୍ୟାଶ୍',
      blockHash: 'ବ୍ଲକ୍ ହ୍ୟାଶ୍',
    },
    community: {
      title: 'ଚାଷୀ ଫୋରମ୍, P2P ଯନ୍ତ୍ରପାତି ବିନିମୟ ଓ ବିଶେଷଜ୍ଞ ପରାମର୍ଶ',
      subtitle:
        'ଚାଷ ଅନୁଭୂତି ବାଣ୍ଟନ୍ତୁ, ସୋଲାର ଡ୍ରାୟର ବା ମଇଶ୍ଚର ମିଟର ଭଡ଼ାରେ ନିଅନ୍ତୁ ଏବଂ ବିଶେଷଜ୍ଞଙ୍କଠାରୁ ପରାମର୍ଶ ପାଆନ୍ତୁ ।',
      forumTab: 'ଚାଷୀ ଜ୍ଞାନ ଫୋରମ୍',
      exchangeTab: 'P2P ଯନ୍ତ୍ରପାତି ଓ ସାମଗ୍ରୀ ବଜାର',
      expertTab: 'ବ୍ୟକ୍ତିଗତ ବିଶେଷଜ୍ଞ ପରାମର୍ଶ',
      askForum: 'ନୂଆ ପ୍ରଶ୍ନ ବା ଅନୁଭୂତି ଲେଖନ୍ତୁ',
      postTitle: 'ବିଷୟ ଶୀର୍ଷକ',
      postBody: 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ବା ଅନୁଭୂତି ଲେଖନ୍ତୁ...',
      publishPost: 'ପୋଷ୍ଟ କରନ୍ତୁ',
      replyPlaceholder: 'ଉତ୍ତର ଲେଖନ୍ତୁ...',
      listResource: 'ଯନ୍ତ୍ରପାତି ବା ବିହନ ଯୋଗ କରନ୍ତୁ',
      bookResource: 'ବୁକ୍ / ଭଡ଼ା ନିଅନ୍ତୁ',
      releaseResource: 'ବୁକିଂ ଛାଡ଼ନ୍ତୁ',
      expertPrompt: 'ଜଳସେଚନ, ରୋଗ ପୋକ ବା ଓକ୍ରାଟକ୍ସିନ୍ ସଂରକ୍ଷଣ ବିଷୟରେ ପଚାରନ୍ତୁ...',
      askExpertBtn: 'ବିଶେଷଜ୍ଞ ପରାମର୍ଶ ନିଅନ୍ତୁ',
    },
    buyer: {
      marketTitle: 'ସିଧାସଳଖ ଚାଷୀଙ୍କଠାରୁ ସତ୍ୟାପିତ ପିଆଜ ବଜାର',
      marketSubtitle:
        'ଚାଷୀ ଗୋଦାମ ସହ ଲାଇଭ୍ ସଂଯୁକ୍ତ । ପ୍ରତିଟି ଲଟ୍ ଓକ୍ରାଟକ୍ସିନ୍-ମୁକ୍ତ ପ୍ରମାଣିତ ଓ ବ୍ଲକଚେନରେ ଟ୍ରାକ୍ ହୋଇଛି ।',
      availableKg: 'ଉପଲବ୍ଧ ଷ୍ଟକ୍',
      orderQty: 'ପରିମାଣ (କିଗ୍ରା)',
      buyNow: 'ସିଧାସଳଖ ଅର୍ଡର କରନ୍ତୁ',
      ochratoxinVerified: 'ଓକ୍ରାଟକ୍ସିନ୍-ମୁକ୍ତ ସତ୍ୟାପିତ',
      traceBatchTitle: 'ଫାର୍ମ-ଟୁ-ଟେବୁଲ୍ ବ୍ଲକଚେନ୍ ଟ୍ରାକିଂ',
      traceBatchSubtitle: 'ଅମଳ, ଏମଏଲ ଫିମ୍ପି ପରୀକ୍ଷା ଓ ପରିବହନର ପ୍ରତିଟି ସ୍ତର ଯାଞ୍ଚ କରନ୍ତୁ ।',
      chatTitle: 'ଚାଷୀଙ୍କ ସହ ସିଧାସଳଖ ବଜାର କଥାବାର୍ତ୍ତା',
      chatSubtitle: 'ଗ୍ରେଡିଂ, ପ୍ୟାକିଂ ଓ ପ୍ରେରଣ ସମୟ ବିଷୟରେ ସିଧାସଳଖ କଥା ହୁଅନ୍ତୁ ।',
      sendMessage: 'ବାର୍ତ୍ତା ପଠାନ୍ତୁ',
      ordersTitle: 'ଆପଣଙ୍କ ସକ୍ରିୟ ଅର୍ଡର ଓ ଆଞ୍ଚଳିକ ଯୋଗାଣ ମାନଚିତ୍ର',
    },
  },
};
