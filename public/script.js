// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const carInfoInput = document.getElementById('car-info-input');
    const loader = document.getElementById('loader');
    const resultsArea = document.getElementById('results-area');
    const marketplaceOutput = document.getElementById('marketplace-output');
    const socialMediaOutput = document.getElementById('social-media-output');

    generateBtn.addEventListener('click', async () => {
        const infoCarro = carInfoInput.value;
        if (!infoCarro.trim()) {
            alert('Por favor, insira as informações do veículo.');
            return;
        }

        loader.style.display = 'block';
        resultsArea.style.display = 'none';

        try {
            // A chamada agora é para o nosso proxy seguro, não para a API do Gemini!
            // O caminho '/.netlify/functions/generate' é um endereço mágico do Netlify.
            const response = await fetch('/.netlify/functions/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ info_carro: infoCarro }),
            });
            
            if (!response.ok) {
                throw new Error('Falha na resposta do servidor.');
            }

            const data = await response.json();
            
            // Limpa a resposta (a IA pode retornar ```json)
            const cleanedMarketplace = data.marketplace.replace(/```json\n?|\n?```/g, '').trim();
            const cleanedSocial = data.redes_sociais.replace(/```json\n?|\n?```/g, '').trim();

            marketplaceOutput.textContent = cleanedMarketplace;
            socialMediaOutput.textContent = cleanedSocial;

            loader.style.display = 'none';
            resultsArea.style.display = 'block';

        } catch (error) {
            loader.style.display = 'none';
            alert(`Ocorreu um erro: ${error.message}`);
            console.error('Erro ao chamar a função proxy:', error);
        }
    });
    
    // A função de copiar texto continua a mesma
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
            });
        });
    });
});