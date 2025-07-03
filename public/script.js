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
            const response = await fetch('/.netlify/functions/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ info_carro: infoCarro }),
            });
            
            // Pega o corpo da resposta como JSON
            const data = await response.json();

            // Se a resposta não for OK (ex: erro 400 ou 500), o 'data' conterá a mensagem de erro.
            if (!response.ok) {
                // Usa a mensagem de erro vinda do servidor, se existir.
                throw new Error(data.error || 'Falha na resposta do servidor.');
            }
            
            // ----> CORREÇÃO IMPORTANTE AQUI <----
            // Acessa as propriedades corretas do objeto 'data'
            marketplaceOutput.textContent = data.marketplace;
            socialMediaOutput.textContent = data.redes_sociais;

            loader.style.display = 'none';
            resultsArea.style.display = 'block';

        } catch (error) {
            loader.style.display = 'none';
            // Mostra o erro de forma mais clara para o usuário
            alert(`Ocorreu um erro ao gerar a descrição: ${error.message}`);
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
