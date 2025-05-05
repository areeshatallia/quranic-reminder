const arabicElement = document.getElementById('ayat-arabic');
const englishElement = document.getElementById('ayat-english');
const urduElement = document.getElementById('ayat-urdu');

async function fetchDailyAyat() {
  try {
    const responseArabic = await fetch('https://api.alquran.cloud/v1/ayah/random');
    const dataArabic = await responseArabic.json();

    if (dataArabic.status === 'OK') {
      const ayahNumber = dataArabic.data.number;

      arabicElement.innerText = dataArabic.data.text;

      const responseEnglish = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.asad`);
      const dataEnglish = await responseEnglish.json();
      englishElement.innerText = dataEnglish.status === 'OK' ? dataEnglish.data.text : 'Unable to fetch English.';

      const responseUrdu = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ur.jalandhry`);
      const dataUrdu = await responseUrdu.json();
      urduElement.innerText = dataUrdu.status === 'OK' ? dataUrdu.data.text : 'Unable to fetch Urdu.';

      showNotification("New Quranic Ayah Loaded!");
    } else {
      arabicElement.innerText = 'Unable to fetch Ayah.';
    }
  } catch (error) {
    console.error('Error fetching Ayat:', error);
    arabicElement.innerText = 'Unable to fetch Ayah.';
  }
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  }
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Load Ayat on page load
fetchDailyAyat();
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default mini-infobar
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block'; // Show the install button
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    deferredPrompt = null;
  }
});
