// netlify/functions/generate.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function (event, context) {
  // Apenas aceita requisições POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  // Pega a chave de API do ambiente seguro do Netlify
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const body = JSON.parse(event.body);
    const infoCarro = body.info_carro;

    if (!infoCarro) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "A informação do carro não foi fornecida." }),
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um assistente de marketing digital especialista em criar anúncios de carros para a loja "Guaru Prime".
      **Tarefa Principal:**
      Analise as informações do veículo fornecidas: "${infoCarro}"
      Gere dois textos, um para "Marketplace" e outro para "Redes Sociais", seguindo estritamente os modelos que você já conhece.
      **Regras Cruciais:**
      1.  Se uma informação não for encontrada, preencha com "[não informado]".
      2.  Sua resposta final deve ser um objeto JSON puro e válido. NÃO inclua markdown (\`\`\`json).
      **Modelos a Seguir:**
      (Os modelos detalhados que você já me forneceu...)
    `;
    
    // (Omiti os modelos de texto aqui para ser breve, mas eles devem estar no seu arquivo)
    // Cole seu prompt completo que já tínhamos definido aqui.

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (error) {
    console.error("Erro na função Netlify:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ocorreu um erro interno no servidor." }),
    };
  }
};
