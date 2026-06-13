exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tblvv7dIzHXSqr46E';
  const PHOTO_FIELD_ID = 'fldpFnTylVS83IsQt';
  try {
    const { titre, auteur, contenu, date, photoBase64, photoName, photoType } = JSON.parse(event.body);
    // 1. Créer le post
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { Name: titre, Auteur: auteur, Contenu: contenu, Date: date } }),
    });
    const data = await res.json();
    if (!data.id) throw new Error(JSON.stringify(data));
    // 2. Upload la photo si fournie
    let uploadError = null;
    if (photoBase64 && photoName) {
      try {
        const fileBuffer = Buffer.from(photoBase64, 'base64');
        const mimeType = photoType || 'image/jpeg';
        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: mimeType });
        formData.append('file', blob, photoName);
        formData.append('filename', photoName);
        formData.append('contentType', mimeType);
        const uploadRes = await fetch(
          `https://content.airtable.com/v0/${BASE_ID}/${data.id}/${PHOTO_FIELD_ID}/uploadAttachment`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${TOKEN}` },
            body: formData,
          }
        );
        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          uploadError = `Upload failed: ${uploadRes.status} ${errText}`;
        }
      } catch (uploadErr) {
        uploadError = uploadErr.message;
      }
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, id: data.id, uploadError }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
