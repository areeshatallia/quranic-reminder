const arabicElement = document.getElementById('ayat-arabic');
const englishElement = document.getElementById('ayat-english');
const urduElement = document.getElementById('ayat-urdu');

// Fetch Ayah
async function fetchDailyAyat() {
  try {
    const responseArabic = await fetch('https://api.alquran.cloud/v1/ayah/random');
    const dataArabic = await responseArabic.json();

    if (dataArabic.status === 'OK') {
      const ayahNumber = dataArabic.data.number;
      const ayahArabic = dataArabic.data.text;

      // Fetch English Translation
      const responseEnglish = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.asad`);
      const dataEnglish = await responseEnglish.json();
      const ayahEnglish = dataEnglish.status === 'OK' ? dataEnglish.data.text : 'Unable to fetch English.';

      // Fetch Urdu Translation
      const responseUrdu = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ur.jalandhry`);
      const dataUrdu = await responseUrdu.json();
      const ayahUrdu = dataUrdu.status === 'OK' ? dataUrdu.data.text : 'Unable to fetch Urdu.';

      const ayahData = {
        arabic: ayahArabic,
        english: ayahEnglish,
        urdu: ayahUrdu,
        fetchedAt: new Date().getTime()
      };

      localStorage.setItem('dailyAyah', JSON.stringify(ayahData));
      displayAyah(ayahData);
      showNotification(ayahEnglish);
    } else {
      showError();
    }
  } catch (error) {
    console.error('Error fetching Ayah:', error);
    showError();
  }
}

// Display Ayah
function displayAyah(ayahData) {
  arabicElement.innerText = ayahData.arabic;
  englishElement.innerText = ayahData.english;
  urduElement.innerText = ayahData.urdu;
}

// Show Notification
function showNotification(message) {
  if (Notification.permission === 'granted') {
    new Notification('📖 Today\'s Quranic Reminder', {
      body: message,
      icon: 'quran', // apna icon file
      badge: 'quran' // optional small badge
    });
  }
}

// Error handling
function showError() {
  arabicElement.innerText = 'Unable to fetch Ayah.';
  englishElement.innerText = '';
  urduElement.innerText = '';
}

// Load Ayah
function loadDailyAyat() {
  const storedData = JSON.parse(localStorage.getItem('dailyAyah'));
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (storedData && (now - storedData.fetchedAt) < oneDay) {
    displayAyah(storedData);
  } else {
    fetchDailyAyat();
  }
}

// Notification permission
if ('Notification' in window) {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

// Fetch Ayah
loadDailyAyat();

// Install App Button
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installButton = document.createElement('button');
  installButton.innerText = '📲 Install Quranic Reminder';
  installButton.style.position = 'fixed';
  installButton.style.bottom = '20px';
  installButton.style.left = '50%';
  installButton.style.transform = 'translateX(-50%)';
  installButton.style.padding = '12px 25px';
  installButton.style.backgroundColor = '#4CAF50';
  installButton.style.color = 'white';
  installButton.style.fontSize = '16px';
  installButton.style.fontWeight = 'bold';
  installButton.style.border = 'none';
  installButton.style.borderRadius = '30px';
  installButton.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.2)';
  installButton.style.cursor = 'pointer';
  installButton.style.zIndex = '1000';
  installButton.style.transition = '0.3s all ease-in-out';

  installButton.addEventListener('mouseover', () => {
    installButton.style.backgroundColor = '#45a049';
  });
  installButton.addEventListener('mouseout', () => {
    installButton.style.backgroundColor = '#4CAF50';
  });

  document.body.appendChild(installButton);

  installButton.addEventListener('click', () => {
    installButton.remove();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }
      deferredPrompt = null;
    });
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.error('Service Worker registration failed:', error);
    });
}
