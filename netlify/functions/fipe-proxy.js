// netlify/functions/fipe-proxy.js

// Importa o fetch se estiver usando uma versão mais antiga do Node,
// mas o Netlify já o tem disponível globalmente.
// const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // Pega o caminho da consulta que o front-end enviou (ex: 'marcas' ou 'marcas/59/modelos')
  const apiPath = event.queryStringParameters.path || 'marcas';

  // URL base da API gratuita
  const API_ENDPOINT = `https://parallelum.com.br/fipe/api/v1/carros/${apiPath}`;

  try {
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: "Falha ao buscar dados na API FIPE." }) };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Erro no proxy FIPE:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno no servidor." }),
    };
  }
};