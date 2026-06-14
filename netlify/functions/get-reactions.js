exports.handler = async function () {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tblUhc2fzWRYIXmyL';
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
      { headers: { 'Authorization': `Bearer ${TOKEN}` } }
    );
    const data = await res.json();
    if (!data.records) return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([]) };
    const reactions = data.records.map(r => ({
      id: r.id,
      postId: r.fields.PostId || '',
      type: r.fields.Type || '',
    }));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reactions) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
