exports.handler = async function () {
  const SHEET_ID = '1sv-RfAlgtw1FaiI5hMBosJ3OzHOA2mXW06gwZfw_9UU';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const rows = json.table.rows.slice(1);
    const posts = rows
      .filter(row => row.c[0]?.v)
      .map(row => ({
        titre: row.c[0]?.v || '',
        auteur: row.c[1]?.v || '',
        date: row.c[2]?.v || '',
        contenu: row.c[3]?.v || '',
        photo: row.c[4]?.v || '',
      }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
