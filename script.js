const arabicElement = document.getElementById('ayat-arabic');
const englishElement = document.getElementById('ayat-english');
const urduElement = document.getElementById('ayat-urdu');
const tafseerElement = document.getElementById('tafseer');
const readMoreButton = document.getElementById('read-more');

let tafseerVisible = false;
let currentAyahNumber = null;

async function fetchDailyAyat() {
  try {
    // 1. Fetch random Arabic Ayah
    const responseArabic = await fetch('https://api.alquran.cloud/v1/ayah/random');
    const dataArabic = await responseArabic.json();

    if (dataArabic.status === 'OK') {
      const ayahNumber = dataArabic.data.number;
      currentAyahNumber = ayahNumber;

      arabicElement.innerText = dataArabic.data.text;

      // 2. Fetch English translation
      const responseEnglish = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.asad`);
      const dataEnglish = await responseEnglish.json();
      englishElement.innerText = dataEnglish.status === 'OK' ? dataEnglish.data.text : 'Unable to fetch English.';

      // 3. Fetch Urdu translation
      const responseUrdu = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ur.jalandhry`);
      const dataUrdu = await responseUrdu.json();
      urduElement.innerText = dataUrdu.status === 'OK' ? dataUrdu.data.text : 'Unable to fetch Urdu.';

    } else {
      arabicElement.innerText = 'Unable to fetch Ayah.';
    }
  } catch (error) {
    console.error('Error fetching Ayat:', error);
    arabicElement.innerText = 'Unable to fetch Ayah.';
  }
}

// Read More Button - Static Tafseer for now
readMoreButton.addEventListener('click', () => {
  if (!tafseerVisible) {
    tafseerElement.innerText = 'یہ آیت ہمیں اللہ کی رحمت اور رہنمائی کی طرف اشارہ دیتی ہے۔ مزید تفصیل کے لیے معتبر تفاسیر کا مطالعہ کریں۔';
    tafseerElement.style.display = 'block';
    readMoreButton.innerText = 'Read Less';
    tafseerVisible = true;
  } else {
    tafseerElement.style.display = 'none';
    readMoreButton.innerText = 'Read More (Tafseer)';
    tafseerVisible = false;
  }
});

// Load Ayat on page load
fetchDailyAyat();
