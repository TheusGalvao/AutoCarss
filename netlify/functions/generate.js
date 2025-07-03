// netlify/functions/generate.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function (event, context) {
  // 1. Apenas aceita requisições do tipo POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  // 2. Pega a chave de API do ambiente seguro do Netlify
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // 3. Pega as informações enviadas pelo front-end
    const body = JSON.parse(event.body);
    const infoCarro = body.info_carro;

    // 4. Valida se a informação do carro foi recebida
    if (!infoCarro) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "A informação do carro não foi fornecida." }),
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    // 5. O prompt final e refinado que instrui a IA
    const prompt = `
      Você é um assistente de marketing digital especialista em criar anúncios de carros para a loja "Guaru Prime", localizada em Guarulhos - SP. Seu trabalho é gerar textos otimizados para vendas.

      **Tarefa Principal:**
      Analise as informações do veículo fornecidas pelo usuário e gere dois textos de anúncio, um para "Marketplace" e outro para "Redes Sociais", seguindo estritamente os modelos e regras abaixo.

      **Diretrizes Essenciais:**
      1.  **Factual vs. Criativo:** Seja estritamente factual ao preencher os campos de dados ([Ano], [Cor], etc.). Sua criatividade deve ser usada APENAS para a [Breve descrição chamativa] e a [Frase final de reforço] no modelo Marketplace.
      2.  **Inferência:** Para o modelo de Redes Sociais, deduza o [tipo de carro] (como Hatch, Sedan, SUV, Picape) com base no nome do modelo do veículo.
      3.  **Dados Ausentes:** Se uma informação específica não for fornecida no texto do usuário, preencha o campo correspondente com a frase "[não informado]".
      4.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON puro e válido, começando com "{" e terminando com "}". NÃO inclua nenhuma formatação extra, como blocos de código markdown (\`\`\`json ou \`\`\`).

      **Informações do carro fornecidas pelo usuário:**
      ---
      ${infoCarro}
      ---

      **MODELO PARA MARKETPLACE (Siga EXATAMENTE):**
      ---
      [Marca e Modelo] [Versão] [Ano] | [Combustível] | [Câmbio]

      [Breve descrição chamativa com pontos fortes do veículo. Ex: Hatch compacto, econômico e ideal para o dia a dia. Ótima opção para quem busca conforto e baixo custo de manutenção.]

      Informações do veículo:

      Ano: [Ano]
      Cor: [Cor]
      Combustível: [Combustível]
      Quilometragem: [XX.XXX] km
      Câmbio: [Manual ou Automático]
      Motorização: [1.X]
      Número de portas: [4]
      Final da placa: [XX]

      Principais equipamentos:

      Ar-condicionado
      Direção elétrica/hidráulica
      Vidros elétricos
      Travas elétricas
      Retrovisores elétricos
      Central multimídia
      Câmera de ré
      Sensores de estacionamento
      Bancos em couro
      Rodas de liga leve
      Faróis de neblina
      Airbags
      Freios ABS

      [Frase final de reforço. Ex: Veículo em ótimo estado de conservação, ideal para quem busca economia, conforto e segurança.]
      ---

      **MODELO PARA REDES SOCIAIS (Siga EXATAMENTE):**
      ---
      [Marca e Modelo] - [Versão] [Motor]

      Ano: [Ano]
      [Quilometragem] Km Rodados
      WhatsApp: 11 2440-2166

      Os melhores seminovos de Guarulhos - SP 🚗
      Olha que incrível esse [tipo de carro], completíssimo, um SONHO!! 💙✨

      ✔ Flex
      ✔ Central Multimídia
      ✔ Motor [1.X]
      ✔ Câmbio [Automático ou Manual]
      ✔ Ar-condicionado
      ✔ Direção [Elétrica ou Hidráulica]
      ✔ Câmera de Ré
      ✔ Sensores de Estacionamento
      ✔ Vidros Elétricos
      ✔ Travas Elétricas
      ✔ Airbags
      ✔ Freios ABS
      ✔ Rodas de Liga Leve

      Também aceitamos carros na troca 🚗
      Agende sua visita agora! 🏃‍♂️

      📍 AutoShopping Internacional Guarulhos | R. Anton Philips, 186 | Prédio B, Vila Hermínia - Guarulhos/SP (Localizado no 2° piso próximo à Wincar)

      Mais informações no link da nossa bio 🔥

      #guaruprime #carros #guarulhos #autoshoppinginternacional #multimarcas #seucarronovo #carrobarato #[marca] #[modelo] #[versao] #fotosdecarros
      ---
      
      Agora, gere a resposta em formato JSON com as chaves "marketplace" e "redes_sociais".
    `;

    // 6. Chama a IA com o prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 7. Retorna a resposta limpa para o front-end
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (error) {
    // 8. Em caso de erro, retorna uma mensagem clara
    console.error("Erro na função Netlify:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ocorreu um erro interno no servidor ao processar sua solicitação." }),
    };
  }
};
