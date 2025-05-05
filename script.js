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

      showNotification("🌸 New Quranic Ayah Loaded!");
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

fetchDailyAyat();

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Create Install Button
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
