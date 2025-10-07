import { Language } from '../types/marketplace';

const translations: Record<string, Record<Language, string>> = {
  addToCart: {
    en: 'Add to Cart', hi: 'कार्ट में जोड़ें', bn: 'কার্টে যোগ করুন', ta: 'கார்டில் சேர்', te: 'కార్ట్‌లో జోడించండి', mr: 'कार्टमध्ये जोडा'
  },
  buyNow: {
    en: 'Buy Now', hi: 'अभी खरीदें', bn: 'এখনই কিনুন', ta: 'இப்போது வாங்கவும்', te: 'ఇప్పుడే కొనండి', mr: 'आता खरेदी करा'
  },
  outOfStock: {
    en: 'Out of Stock', hi: 'स्टॉक समाप्त', bn: 'স্টক শেষ', ta: 'ஸ்டாக் இல்லை', te: 'స్టాక్ లేదు', mr: 'साठा संपला'
  },
  platformFee: {
    en: 'Platform Fee', hi: 'प्लेटफ़ॉर्म शुल्क', bn: 'প্ল্যাটফর্ম ফি', ta: 'தளக் கட்டணம்', te: 'వేదిక రుసుము', mr: 'प्लॅटफॉर्म फी'
  }
};

export function getTranslation(key: keyof typeof translations, language: Language): string {
  return translations[key][language] || translations[key].en;
}


