  function updateContent() {
    const allEl = document.getElementsByClassName("trans");
    for (let i = 0; i < allEl.length; i++) {
      const el = allEl[i];
      const key = el.getAttribute("translate-key");
      el.innerHTML = i18next.t(key);
    }
  }
document.addEventListener('DOMContentLoaded', function () {

  const LANGUAGE_KEY = 'preferredLang';
  const TIMESTAMP_KEY = 'langSetTime';
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  // 🔁 MOVE THIS FUNCTION ABOVE


  i18next.use(i18nextBrowserLanguageDetector);
  i18next.init({
    lng: 'en',
    resources: {
      en: { translation: translation_dict_en },
      cn: { translation: translation_dict_cn }
    }
  }, function (err, t) {
    updateContent();
  });

  i18next.on('languageChanged', updateContent);

  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  const savedLang = localStorage.getItem(LANGUAGE_KEY);
  const savedTime = localStorage.getItem(TIMESTAMP_KEY);
  const now = Date.now();

  if (langParam) {
    i18next.changeLanguage(langParam);
  } else if (savedLang && savedTime && (now - parseInt(savedTime)) <= THIRTY_DAYS_MS) {
    i18next.changeLanguage(savedLang);
  } else {
    showLanguagePrompt();
  }

  function showLanguagePrompt() {
    Swal.fire({
      title: 'Select Your Language / 选择语言',
      html: `
        <button id="lang-en" class="swal2-confirm swal2-styled" style="margin: 5px;">English</button>
        <button id="lang-cn" class="swal2-confirm swal2-styled" style="margin: 5px;">中文</button>
        <div style="margin-top:10px">
          <input type="checkbox" id="rememberLang">
          <label for="rememberLang">Remember my choice / 记住我的选择</label>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        document.getElementById('lang-en').addEventListener('click', () => selectLang('en'));
        document.getElementById('lang-cn').addEventListener('click', () => selectLang('cn'));
      }
    });
  }

  function selectLang(lang) {
    i18next.changeLanguage(lang);

    const remember = document.getElementById('rememberLang').checked;
    if (remember) {
      localStorage.setItem(LANGUAGE_KEY, lang);
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    } else {
      localStorage.removeItem(LANGUAGE_KEY);
      localStorage.removeItem(TIMESTAMP_KEY);
    }

    Swal.close();

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('lang', lang);
    window.history.replaceState(null, '', newUrl);
    Swal.fire({
    icon: 'success',
    title: lang === 'en' ? 'Language changed to English' : '语言已切换为中文',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
  }

});
    function switchingLang(lang) {
    i18next.changeLanguage(lang);
    updateContent();

    // Optional: store to localStorage to remember
    localStorage.setItem('preferredLang', lang);
    localStorage.setItem('langSetTime', Date.now().toString());

    // Optional: update ?lang in the URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('lang', lang);
    window.history.replaceState(null, '', newUrl);
    Swal.fire({
    icon: 'success',
    title: lang === 'en' ? 'Language changed to English' : '语言已切换为中文',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
    }