exports.handler = async function (event) {
  try {
    const cuit = event.queryStringParameters?.cuit;

    if (!cuit) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Falta el parámetro cuit" })
      };
    }

    const apiKey = process.env.INDICADORES_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No está configurada INDICADORES_API_KEY en Netlify" })
      };
    }

    const response = await fetch(
      `https://indicadores.ar/v1/persona?cuit=${encodeURIComponent(cuit)}`,
      {
        method: "GET",
        headers: {
          "api-key": apiKey,
          "Accept": "application/json"
        }
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: "Indicadores Argentina devolvió una respuesta no JSON" };
    }

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Error al consultar Indicadores Argentina",
        detail: error.message
      })
    };
  }
};
