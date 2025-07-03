// netlify/functions/generate.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // ----> CORREÇÃO IMPORTANTE AQUI <----
    // Garante que o corpo da requisição seja interpretado corretamente.
    const body = JSON.parse(event.body);
    const infoCarro = body.info_carro;

    // Se por algum motivo a informação do carro não chegar, retorna um erro claro.
    if (!infoCarro) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "A informação do carro não foi fornecida no corpo da requisição." }),
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um assistente especialista em criar descrições de carros para vendas.
      Analise as informações do carro a seguir: "${infoCarro}"
      Gere dois textos, um para "Marketplace" e outro para "Redes Sociais", seguindo os modelos que você já conhece.
      Retorne a resposta em formato JSON com duas chaves: "marketplace" e "redes_sociais". Não inclua a formatação de código markdown (\`\`\`) na sua resposta.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: text, // O texto do Gemini já deve ser um JSON limpo
    };
  } catch (error) {
    console.error("Erro na função Netlify:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ocorreu um erro interno no servidor ao processar sua solicitação." }),
    };
  }
};
