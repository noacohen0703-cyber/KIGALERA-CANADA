exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tblvv7dIzHXSqr46E';
  const CODE_SECRET = process.env.POST_CODE || 'kigalera26';
  try {
    const { titre, auteur, date, contenu, photoBase64, photoName, photoType, code } = JSON.parse(event.body);
    if (!titre || !auteur || !contenu) return { statusCode: 400, body: JSON.stringify({ error: 'Champs manquants' }) };
    if (!code || code.trim().toLowerCase() !== CODE_SECRET.toLowerCase()) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Code incorrect' }) };
    }
    const fields = { Name: titre, Auteur: auteur, Contenu: contenu };
    if (date) fields.Date = date;
    if (photoBase64) {
      const dataUrl = `data:${photoType || 'image/jpeg'};base64,${photoBase64}`;
      fields.Photo = dataUrl;
    }
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    const data = await res.json();
    if (!data.id) throw new Error(JSON.stringify(data));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
