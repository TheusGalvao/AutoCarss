// public/script-fipe.js
document.addEventListener('DOMContentLoaded', () => {
  // Pega os elementos da página
  const brandSelect = document.getElementById('brand-select');
  const modelSelect = document.getElementById('model-select');
  const yearSelect = document.getElementById('year-select');
  const loader = document.getElementById('loader');
  const resultsArea = document.getElementById('results-area');
  const errorArea = document.getElementById('error-area');

  // Função genérica para chamar nosso proxy
  async function fetchFipeData(path) {
    loader.style.display = 'block';
    errorArea.style.display = 'none';
    try {
      const response = await fetch(`/.netlify/functions/fipe-proxy?path=${path}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados.');
      }
      return await response.json();
    } catch (error) {
      errorArea.textContent = error.message;
      errorArea.style.display = 'block';
      console.error('Erro:', error);
    } finally {
      loader.style.display = 'none';
    }
  }

  // Função para popular um dropdown
  function populateSelect(selectElement, items) {
    // Limpa opções antigas, exceto a primeira
    selectElement.innerHTML = `<option value="">${selectElement.options[0].textContent}</option>`;
    
    // A API de modelos retorna um objeto com 'modelos' e 'anos', pegamos o correto
    const dataList = items.modelos || items;
    
    dataList.forEach(item => {
      const option = document.createElement('option');
      option.value = item.codigo;
      option.textContent = item.nome;
      selectElement.appendChild(option);
    });
    selectElement.disabled = false;
  }
  
  // Reseta e desabilita os selects seguintes
  function resetSelects(selectsToReset) {
      selectsToReset.forEach(sel => {
        sel.innerHTML = `<option value="">${sel.options[0].textContent}</option>`;
        sel.disabled = true;
      });
      resultsArea.style.display = 'none';
  }

  // 1. Carrega as marcas quando a página abre
  fetchFipeData('marcas').then(data => {
    if (data) populateSelect(brandSelect, data);
  });

  // 2. Evento: quando uma marca é selecionada
  brandSelect.addEventListener('change', async () => {
    resetSelects([modelSelect, yearSelect]);
    if (!brandSelect.value) return;
    const data = await fetchFipeData(`marcas/${brandSelect.value}/modelos`);
    if (data) populateSelect(modelSelect, data);
  });

  // 3. Evento: quando um modelo é selecionado
  modelSelect.addEventListener('change', async () => {
    resetSelects([yearSelect]);
    if (!modelSelect.value) return;
    const data = await fetchFipeData(`marcas/${brandSelect.value}/modelos/${modelSelect.value}/anos`);
    if (data) populateSelect(yearSelect, data);
  });
  
  // 4. Evento: quando um ano é selecionado
  yearSelect.addEventListener('change', async () => {
    if (!yearSelect.value) return;
    const data = await fetchFipeData(`marcas/${brandSelect.value}/modelos/${modelSelect.value}/anos/${yearSelect.value}`);
    if (data) {
        document.getElementById('vehicle-model').textContent = `${data.Marca} ${data.Modelo}`;
        document.getElementById('vehicle-fipe-price').textContent = data.Valor;
        document.getElementById('vehicle-fipe-month').textContent = data.MesReferencia;
        document.getElementById('vehicle-fipe-code').textContent = data.CodigoFipe;
        document.getElementById('vehicle-fuel').textContent = data.Combustivel;
        resultsArea.style.display = 'block';
    }
  });
});