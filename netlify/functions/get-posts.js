exports.handler = async function () {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appjhI65p9SqdeC2L';
  const TABLE_ID = 'tblvv7dIzHXSqr46E';
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?sort[0][field]=Date&sort[0][direction]=desc`,
      { headers: { 'Authorization': `Bearer ${TOKEN}` } }
    );
    const data = await res.json();
    // Return raw data for debugging
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
