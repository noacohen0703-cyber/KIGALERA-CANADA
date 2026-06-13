exports.handler = async function () {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tbly4Eg0RDxpP2iYH';
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?sort[0][field]=PostId&sort[0][direction]=asc`,
      { headers: { 'Authorization': `Bearer ${TOKEN}` } }
    );
    const data = await res.json();
    if (!data.records) return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([]) };
    const comments = data.records.map(r => ({
      id: r.id,
      postId: r.fields.PostId || '',
      auteur: r.fields.Auteur || '',
      texte: r.fields.Texte || '',
      createdTime: r.createdTime,
    }));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(comments) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
