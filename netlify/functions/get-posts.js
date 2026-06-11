exports.handler = async function () {
  const TOKEN = process.env.NOTION_TOKEN;
  const DB_ID = process.env.NOTION_DATABASE_ID;

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [{ property: 'Date', direction: 'descending' }],
      }),
    });

    const data = await res.json();

    if (!data.results) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debug: data }),
      };
    }

    const posts = data.results.map((page) => {
      const props = page.properties;
      return {
        titre: props.Nom?.title?.[0]?.plain_text || 'Sans titre',
        auteur: props.Auteur?.rich_text?.[0]?.plain_text || '',
        date: props.Date?.date?.start || '',
        contenu: props.Contenu?.rich_text?.[0]?.plain_text || '',
        photo: props.Photo?.files?.[0]?.file?.url || props.Photo?.files?.[0]?.external?.url || '',
      };
    });

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
