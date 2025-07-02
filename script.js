// Importa a classe principal do SDK do Google AI
import { GoogleGenerativeAI } from "https://sdk.withgoogle.com/genai/js/v1/google-genai.js";

// #######################################################################
// # COLE SUA CHAVE DE API AQUI (LEIA O AVISO DE SEGURANÇA NO TOPO!)     #
// #######################################################################
const API_KEY = "AIzaSyC44QgdNXGF_fwyt4AEmXUoffxm3E0SdH0"; 
// #######################################################################

// --- Início da configuração do App ---

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

document.addEventListener('DOMContentLoaded', () => {
    // Pega os elementos da página
    const generateBtn = document.getElementById('generate-btn');
    const carInfoInput = document.getElementById('car-info-input');
    const loader = document.getElementById('loader');
    const resultsArea = document.getElementById('results-area');
    const marketplaceOutput = document.getElementById('marketplace-output');
    const socialMediaOutput = document.getElementById('social-media-output');

    // Adiciona o evento de clique no botão principal
    generateBtn.addEventListener('click', async () => {
        const infoCarro = carInfoInput.value;

        if (!infoCarro.trim()) {
            alert('Por favor, insira as informações do veículo.');
            return;
        }

        // Mostra o loader e esconde os resultados antigos
        loader.style.display = 'block';
        resultsArea.style.display = 'none';

        // Monta o prompt para o Gemini (a instrução)
        const prompt = `
        Você é um assistente especialista em criar descrições de carros para vendas em uma loja chamada Guaru Prime.
        Analise as informações do carro a seguir e gere dois textos, um para "Marketplace" e outro para "Redes Sociais", seguindo EXATAMENTE os modelos fornecidos abaixo.
        Extraia todas as informações necessárias do texto de entrada. Se alguma informação específica não for fornecida (ex: número de portas, cor), deixe o campo correspondente como "[não informado]".

        **Informações do carro fornecidas pelo usuário:**
        ---
        ${infoCarro}
        ---

        **MODELO PARA MARKETPLACE:**
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

        **MODELO PARA REDES SOCIAIS:**
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

        Retorne a resposta em formato JSON com duas chaves: "marketplace" e "redes_sociais".
        `;

        try {
            // Gera o conteúdo usando o SDK
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            
            // Limpa e converte a resposta para JSON
            const cleanedResponse = text.trim().replace("```json", "").replace("```", "");
            const parsedJson = JSON.parse(cleanedResponse);

            // Coloca os textos gerados nos seus lugares
            marketplaceOutput.textContent = parsedJson.marketplace;
            socialMediaOutput.textContent = parsedJson.redes_sociais;

            // Esconde o loader e mostra os resultados
            loader.style.display = 'none';
            resultsArea.style.display = 'block';

        } catch (error) {
            loader.style.display = 'none';
            alert(`Ocorreu um erro ao conectar com a API do Gemini. Verifique sua chave de API e a conexão com a internet.\n\nDetalhes: ${error.message}`);
            console.error('Erro ao gerar descrições:', error);
        }
    });

    // Adiciona a funcionalidade de "Copiar" para todos os botões
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const textToCopy = document.getElementById(targetId).textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copiado!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar texto: ', err);
                alert('Não foi possível copiar o texto.');
            });
        });
    });
});