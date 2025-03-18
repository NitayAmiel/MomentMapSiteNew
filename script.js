const map = L.map('map').setView([32.0853, 34.7818], 10);
const messageBox = document.getElementById('messageBox');
const locationNameEl = document.getElementById('locationName');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
}).addTo(map);

map.on('click', async function(e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  locationNameEl.textContent = "טוען מידע...";
  
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const geoData = await geoRes.json();
    const locationName = geoData.display_name || "מיקום לא נמצא";

    locationNameEl.textContent = locationName;

    const guideRes = await fetch("https://5a5f-5-29-12-67.ngrok-free.app/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `כתוב מדריך קצר בעברית (עד 400 מילים) על ${locationName}. כלול היבט היסטורי והתאמה למשפחות ולמטיילים.` }),
    });

    if (!guideRes.ok) throw new Error("Server error");

    const guideData = await guideRes.json();

    messageBox.innerHTML = `
      <p>${guideData.message}</p>
      <button onclick="closeMessageBox()">סגור</button>`;
    messageBox.style.display = 'block';

  } catch (error) {
    console.error(error);
    locationNameEl.textContent = "שגיאה בטעינת מידע";
    messageBox.innerHTML = `<p>שגיאה בקבלת מידע מהשרת.</p>`;
    messageBox.style.display = 'block';
  }
});

function closeMessageBox() {
  messageBox.style.display = 'none';
}

