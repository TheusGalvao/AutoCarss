// netlify/functions/generate.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { infoCarro } = JSON.parse(event.body);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // O prompt continua o mesmo
    const prompt = `
      Você é um assistente especialista em criar descrições de carros para vendas.
      Analise as informações do carro a seguir: "${infoCarro}"
      Gere dois textos, um para "Marketplace" e outro para "Redes Sociais", seguindo os modelos que você já conhece.
      Retorne a resposta em formato JSON com duas chaves: "marketplace" e "redes_sociais".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // ---->  A MÁGICA DA CORREÇÃO ACONTECE AQUI  <----
    // Limpa a string para remover a formatação de código do Markdown (os ```)
    const cleanedJsonString = text.replace(/```json|```/g, "").trim();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      // Envia a string JSON JÁ LIMPA para o front-end
      body: cleanedJsonString,
    };
  } catch (error) {
    console.error("Erro na função Netlify:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ocorreu um erro ao processar sua solicitação." }),
    };
  }
};
