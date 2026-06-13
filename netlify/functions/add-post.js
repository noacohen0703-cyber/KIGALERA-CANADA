exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tblvv7dIzHXSqr46E';

  try {
    const { titre, auteur, contenu, date, photoBase64, photoName, photoType } = JSON.parse(event.body);

    // 1. Créer le post
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: { Name: titre, Auteur: auteur, Contenu: contenu, Date: date },
      }),
    });

    const data = await res.json();
    if (!data.id) throw new Error(JSON.stringify(data));

    // 2. Upload la photo si fournie
    if (photoBase64 && photoName) {
      const fileBuffer = Buffer.from(photoBase64, 'base64');
      const mimeType = photoType || 'image/jpeg';
      const boundary = '----FormBoundary' + Date.now().toString(36);

      const headerPart = Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${photoName}"\r\nContent-Type: ${mimeType}\r\n\r\n`
      );
      const tailPart = Buffer.from(
        `\r\n--${boundary}\r\nContent-Disposition: form-data; name="filename"\r\n\r\n${photoName}` +
        `\r\n--${boundary}\r\nContent-Disposition: form-data; name="contentType"\r\n\r\n${mimeType}` +
        `\r\n--${boundary}--\r\n`
      );

      const body = Buffer.concat([headerPart, fileBuffer, tailPart]);

      await fetch(
        `https://content.airtable.com/v0/${BASE_ID}/${data.id}/Attachments/uploadAttachment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body,
        }
      );
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
