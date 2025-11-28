function pesquisarTabela(tabelaNome) {
  // Obtém o valor do campo de pesquisa
  const input = document.getElementById("inputPesquisa");
  var filtro = input.value.toLowerCase(); // Convertido para minúsculo para pesquisa case-insensitive
  
  const tabela = document.getElementById(tabelaNome);
  const linhas = tabela.getElementsByTagName("tr");

  // Percorre todas as linhas (menos o cabeçalho)
  for (let i = 1; i < linhas.length; i++) {
    let linha = linhas[i];
    let textoLinha = normalize(linha.textContent.toLowerCase());

    // Se o input estiver vazio, mostra todas as linhas
    if (filtro === "") {
      linha.classList.remove("hidden");
    } else {
      filtro = normalize(filtro); // Normaliza o filtro para comparação
      // Verifica se o texto da linha inclui o filtro
      if (textoLinha.indexOf(filtro) > -1) {
        linha.classList.remove("hidden"); // Mostra a linha se corresponder
      } else {
        linha.classList.add("hidden"); // Esconde a linha se não corresponder
      }
    }
  }

 
  // updateRowCount("inscritos", "quantInscritos");
}


function submitForm() {
  // Adiciona um evento para submeter o formulário ao pressionar Enter
  var formPesquisa = document.getElementById("formPesquisa");
  var inputValue = document.getElementById("inputPesquisa").value; // Captura o valor do input
  console.log(inputValue);
  var url = new URL(formPesquisa.action); // Captura a URL da ação do formulário
  url.searchParams.append("textoBusca", inputValue); // Adiciona o valor como parâmetro GET
  window.location.href = url; // Redireciona para a nova URL
  return false;
}

function handleClickBg() {
  var collapseMenu = document.getElementById("collapseMenu");
  if (collapseMenu.style.display === "block") {
    collapseMenu.style.display = "none";
  } else {
    collapseMenu.style.display = "block";
  }
}

function loadSpinner(spinner) {
  var el = document.getElementById("spinner" + spinner);
  if (el.classList.contains("hidden")) {
    el.classList.remove("hidden");
  }
}


function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}