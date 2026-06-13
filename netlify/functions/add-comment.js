exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tbly4Eg0RDxpP2iYH';
  try {
    const { postId, auteur, texte } = JSON.parse(event.body);
    if (!postId || !auteur || !texte) return { statusCode: 400, body: JSON.stringify({ error: 'Champs manquants' }) };
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { PostId: postId, Auteur: auteur, Texte: texte } }),
    });
    const data = await res.json();
    if (!data.id) throw new Error(JSON.stringify(data));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, id: data.id, createdTime: data.createdTime }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
