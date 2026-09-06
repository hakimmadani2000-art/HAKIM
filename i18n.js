/**
 * Sudan University Portal - Internationalization (i18n) Engine
 * Handles dynamic language switching between English and Arabic (RTL / LTR)
 */

(function () {
  const STORAGE_KEY = 'portal_lang';

  // Get saved language or default to 'en'
  function getSavedLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  // Apply translations to a specific container or entire document
  function applyTranslations(root, lang) {
    if (!lang) lang = getSavedLang();
    const container = root || document;
    
    container.querySelectorAll('[data-en][data-ar]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.setAttribute('placeholder', text);
          }
        } else {
          el.textContent = text;
        }
      }
    });
  }

  // Set language and update UI
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = 'en';
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update active state in nav language switchers
    document.querySelectorAll('.nav-lang').forEach(container => {
      const enBtn = container.querySelector('.lang-en');
      const arBtn = container.querySelector('.lang-ar');
      if (enBtn && arBtn) {
        if (lang === 'en') {
          enBtn.classList.add('active');
          arBtn.classList.remove('active');
        } else {
          arBtn.classList.add('active');
          enBtn.classList.remove('active');
        }
      }
    });

    // Update all translatable elements
    applyTranslations(document, lang);

    // Trigger custom event for page-specific JS hooks
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  // Toggle language
  function toggleLanguage() {
    const current = getSavedLang();
    setLanguage(current === 'en' ? 'ar' : 'en');
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getSavedLang();
    setLanguage(initialLang);

    // Bind language switcher buttons
    document.querySelectorAll('.nav-lang').forEach(container => {
      container.style.cursor = 'pointer';
      
      const enBtn = container.querySelector('.lang-en') || container.children[0];
      const arBtn = container.querySelector('.lang-ar') || container.children[2];

      if (enBtn) {
        enBtn.classList.add('lang-en');
        enBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setLanguage('en');
        });
      }

      if (arBtn) {
        arBtn.classList.add('lang-ar');
        arBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setLanguage('ar');
        });
      }

      // If clicking container itself toggles
      if (!enBtn && !arBtn) {
        container.addEventListener('click', () => toggleLanguage());
      }
    });
  });

  // Expose global helper
  window.i18n = {
    setLanguage,
    getLanguage: getSavedLang,
    toggleLanguage,
    applyTranslations
  };
})();

