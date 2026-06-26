exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tblvv7dIzHXSqr46E';

  try {
    const { titre, auteur, contenu, date, photo } = JSON.parse(event.body);

    const fields = { Name: titre, Auteur: auteur, Contenu: contenu, Date: date };
    if (photo) fields.Photo = photo;

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    const data = await res.json();
    if (data.id) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, id: data.id }) };
    } else {
      throw new Error(JSON.stringify(data));
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
