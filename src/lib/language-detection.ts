export const getLanguageStats = (text: string) => {
  const arabicRegex = /[\u0600-\u06FF]/g;
  const latinRegex = /[a-zA-Z]/g;
  
  const arabicMatches = text.match(arabicRegex) || [];
  const latinMatches = text.match(latinRegex) || [];
  
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  const englishStopWords = new Set(["the", "and", "is", "in", "it", "you", "that", "he", "was", "for", "on", "are", "with", "i", "to", "of", "a", "this"]);
  const frenchStopWords = new Set(["le", "la", "les", "et", "est", "en", "il", "vous", "que", "un", "une", "pour", "sur", "sont", "avec", "je", "tu", "ce", "dans"]);
  
  let englishCount = 0;
  let frenchCount = 0;
  
  words.forEach(word => {
    const cleanWord = word.replace(/[.,!?]/g, '');
    if (englishStopWords.has(cleanWord)) englishCount++;
    if (frenchStopWords.has(cleanWord)) frenchCount++;
  });
  
  return {
    arabicCount: arabicMatches.length,
    latinCount: latinMatches.length,
    englishCount,
    frenchCount,
    totalChars: text.length,
    wordCount: words.length
  };
};

export const checkLanguageMismatch = (text: string, expectedLanguage: string): { mismatch: boolean; message: string } => {
  const stats = getLanguageStats(text);
  
  if (expectedLanguage.toLowerCase() === "arabic") {
    if (stats.latinCount > stats.arabicCount * 2 || (stats.wordCount > 5 && stats.arabicCount === 0)) {
      return { mismatch: true, message: "Language mismatch detected: Expected Arabic but speech seems to be in another language." };
    }
  } else if (expectedLanguage.toLowerCase() === "french") {
    if (stats.arabicCount > 0) {
      return { mismatch: true, message: `Language mismatch detected: Expected French but found Arabic characters.` };
    } else if (stats.wordCount >= 3 && stats.englishCount > stats.frenchCount) {
      return { mismatch: true, message: `Language mismatch detected: Expected French but speech appears to be in English.` };
    }
  } else if (expectedLanguage.toLowerCase() === "english") {
    if (stats.arabicCount > 0) {
      return { mismatch: true, message: `Language mismatch detected: Expected English but found Arabic characters.` };
    } else if (stats.wordCount >= 3 && stats.frenchCount > stats.englishCount) {
      return { mismatch: true, message: `Language mismatch detected: Expected English but speech appears to be in French.` };
    }
  } else {
    if (stats.arabicCount > 0 && expectedLanguage.toLowerCase() !== "arabic") {
      return { mismatch: true, message: `Language mismatch detected: Expected ${expectedLanguage} but found Arabic characters.` };
    }
  }
  
  return { mismatch: false, message: "" };
};
