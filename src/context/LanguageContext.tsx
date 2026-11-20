"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "en" | "hi" | "gu" | "mr" | "ar";

const DICTIONARY: Record<Locale, Record<string, string>> = {
  en: {
    hero_title: "ELEGANCE IN EVERY SURFACE",
    hero_subtitle: "Crafting International Premium Ceramic Slabs & Luxury Tiles",
    explore_collections: "Explore Collections",
    visualiser_studio: "Visualiser Studio",
    calculator_title: "Tile Calculator Pro",
    dealer_portal: "Dealer Portal",
    architect_portal: "Architect Studio",
    wishlist: "Wishlist",
    compare: "Compare",
    search_placeholder: "Search code, color, or design...",
  },
  hi: {
    hero_title: "हर सतह में भव्यता",
    hero_subtitle: "अंतर्राष्ट्रीय प्रीमियम सिरेमिक स्लैब और लक्जरी टाइल्स का निर्माण",
    explore_collections: "संग्रह खोजें",
    visualiser_studio: "विज़ुअलाइज़र स्टूडियो",
    calculator_title: "टाइल्स कैलकुलेटर प्रो",
    dealer_portal: "डीलर पोर्टल",
    architect_portal: "आर्किटेक्ट स्टूडियो",
    wishlist: "पसंदीदा",
    compare: "तुलना करें",
    search_placeholder: "कोड, रंग या डिज़ाइन खोजें...",
  },
  gu: {
    hero_title: "દરેક સપાટી પર ભવ્યતા",
    hero_subtitle: "આંતરરાષ્ટ્રીય પ્રીમિયમ સિરામિક સ્લેબ અને લક્ઝરી ટાઇલ્સનું નિર્માણ",
    explore_collections: "સંગ્રહ શોધો",
    visualiser_studio: "વિઝ્યુઅલાઇઝર સ્ટુડિયો",
    calculator_title: "ટાઇલ્સ કેલ્ક્યુલેટર પ્રો",
    dealer_portal: "ડીલર પોર્ટલ",
    architect_portal: "આર્કિટેક્ટ સ્ટુડિયો",
    wishlist: "પસંદગી",
    compare: "સરખામણી કરો",
    search_placeholder: "કોડ, રંગ અથવા ડિઝાઇન શોધો...",
  },
  mr: {
    hero_title: "प्रत्येक पृष्ठभागावर भव्यता",
    hero_subtitle: "आंतरराष्ट्रीय प्रीमियम सिरॅमिक स्लॅब आणि लक्झरी टाइल्सचे डिझाइन",
    explore_collections: "संग्रह एक्सप्लोर करा",
    visualiser_studio: "व्हिज्युअलायझर स्टुडिओ",
    calculator_title: "टाईल कॅल्क्युलेटर प्रो",
    dealer_portal: "डीलर पोर्टल",
    architect_portal: "आर्किटेक्ट स्टुडिओ",
    wishlist: "आवडते",
    compare: "तुलना करा",
    search_placeholder: "कोड, रंग किंवा डिझाइन शोधा...",
  },
  ar: {
    hero_title: "الأناقة في كل مساحة",
    hero_subtitle: "صناعة الألواح الخزفية الفاخرة والبلاط الفاخر بمعايير عالمية",
    explore_collections: "استكشاف المجموعات",
    visualiser_studio: "استوديو المصمم المرئي",
    calculator_title: "حاسبة البلاط الاحترافية",
    dealer_portal: "بوابة الوكلاء",
    architect_portal: "استوديو المهندسين",
    wishlist: "المفضلة",
    compare: "مقارنة",
    search_placeholder: "ابحث عن الرمز، اللون، أو التصميم...",
  },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    // Automatically apply HTML dir and lang attributes
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string) => {
    return DICTIONARY[locale][key] || DICTIONARY["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
