function requerLogin(event) {
  const xhr = event.detail.xhr;
  const responseURL = xhr.responseURL;

  // Verifica se a URL de resposta é a página de login
  if (responseURL.includes("/login")) {
    // Redireciona o usuário para a página de login
    window.location.href = responseURL;
    return true;
  }
  return false;
}

var controller;
window.addEventListener("popstate", function () {
  if (controller) {
    controller.abort(); // Cancela a requisição ao mudar de rota
  }
});

// Listener para detectar saídas ou recarregamentos
window.addEventListener("beforeunload", function () {
  if (controller) {
    controller.abort(); // Cancela a requisição ao mudar de rota
  }
});

document.addEventListener("htmx:beforeRequest", function (event) {
  if (controller) {
    controller.abort(); // Cancela a requisição anterior
  }
});
// document.addEventListener("htmx:afterOnLoad", function (event) {
//     if (controller) {
//         controller.abort(); // Cancela a requisição anterior
//     }
// });

function loadScriptsFromHTML(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const scripts = tempDiv.getElementsByTagName("script");
  for (let script of scripts) {
    const newScript = document.createElement("script");

    // Se o script tiver um src, copie o src; caso contrário, execute o conteúdo inline
    if (script.src) {
      newScript.src = script.src; // Para scripts externos
    } else {
      newScript.textContent = script.innerHTML; // Para scripts inline
    }

    document.body.appendChild(newScript); // Executa o script
  }
}

var currentFetchControllerHome = null;

function reloadHome() {
  console.log("reload home", window.location.pathname);
  if (currentFetchControllerHome) {
    currentFetchControllerHome.abort();
    console.log("Requisição anterior abortada");
  }

  currentFetchControllerHome = new AbortController();
  const { signal } = currentFetchControllerHome;

  if (window.location.pathname !== "/") {
    console.log("Função cancelada: rota diferente de '/'");
    if (currentFetchControllerHome) {
      currentFetchControllerHome.abort();
      console.log("Requisição anterior abortada");
    }
    return; // Cancela a execução da função
  }
  window.route = "home";
  fetch(`/homeReload`, {
    method: "GET",
    signal: signal,
  })
    .then((response) => {
      return response.text(); // Corrigi também a atribuição da resposta
    })
    .then((html) => {
      if (window.location.pathname == "/") {
        // Insere o HTML no elemento com id "content"
        const resultDiv = document.getElementById("html");
        resultDiv.outerHTML = html;
        // Após inserir o conteúdo, processa ele com HTMX para aplicar
        loadScriptsFromHTML(html);
        htmx.process(resultDiv);
        // resultDiv.getElementById("divSwitch").classList.remove("hidden");
      }
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("Requisição cancelada:", error.message);
        const elements = document.querySelectorAll(".animate-spin");

        let list = [
          "spinner",
          "spinnerAdicionar",
          "spinnerEtiqueta",
          "spinnerTelefone",
          "spinnerEtiquetaRemove",
          "spinnerEtiquetaUpdate",
          "spinnerAtribuir",
          "spinnerLoad",
        ];

        // Itera sobre os elementos e remove a classe
        elements.forEach((element) => {
          if (!list.includes(element.id)) {
            element.classList.remove("animate-spin");
          }
        });
      } else {
        console.error("Erro na requisição:", error);
        // window.location.reload();
      }
    })
    .finally(() => {
      // Limpa o controlador ao finalizar a requisição
      currentFetchControllerUsers = null;
    });
}

function reloadHomeUpdate() {
  console.log("reload home", window.location.pathname);

  if (currentFetchControllerHome) {
    currentFetchControllerHome.abort();
    console.log("Requisição anterior abortada");
  }

  currentFetchControllerHome = new AbortController();
  const { signal } = currentFetchControllerHome;

  if (window.location.pathname !== "/") {
    console.log("Função cancelada: rota diferente de '/'");
    if (currentFetchControllerHome) {
      currentFetchControllerHome.abort();
      console.log("Requisição anterior abortada");
    }
    return; // Cancela a execução da função
  }
  window.route = "home";
  fetch(`/`, {
    method: "GET",
    signal: signal,
  })
    .then((response) => {
      return response.text(); // Corrigi também a atribuição da resposta
    })
    .then((html) => {
      if (window.location.pathname == "/") {
        // Insere o HTML no elemento com id "content"
        const resultDiv = document.getElementById("html");
        resultDiv.outerHTML = html;
        // Após inserir o conteúdo, processa ele com HTMX para aplicar
        loadScriptsFromHTML(html);
        htmx.process(resultDiv);
        // resultDiv.getElementById("divSwitch").classList.remove("hidden");
      }
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("Requisição cancelada:", error.message);
        const elements = document.querySelectorAll(".animate-spin");

        let list = [
          "spinner",
          "spinnerAdicionar",
          "spinnerEtiqueta",
          "spinnerTelefone",
          "spinnerEtiquetaRemove",
          "spinnerEtiquetaUpdate",
          "spinnerAtribuir",
          "spinnerLoad",
        ];

        // Itera sobre os elementos e remove a classe
        elements.forEach((element) => {
          if (!list.includes(element.id)) {
            element.classList.remove("animate-spin");
          }
        });
      } else {
        console.error("Erro na requisição:", error);
        // window.location.reload();
      }
    })
    .finally(() => {
      // Limpa o controlador ao finalizar a requisição
      currentFetchControllerUsers = null;
    });
}

var currentFetchControllerArquivados = null;

function reloadArquivados() {
  if (currentFetchControllerArquivados) {
    currentFetchControllerArquivados.abort();
    console.log("Requisição anterior abortada");
  }

  currentFetchControllerArquivados = new AbortController();
  const { signal } = currentFetchControllerArquivados;

  console.log("reload arquivados", window.location.pathname);
  if (window.location.pathname !== "/arquivados") {
    console.log("Função cancelada: rota diferente de '/arquivados'");
    if (currentFetchControllerArquivados) {
      currentFetchControllerArquivados.abort();
      console.log("Requisição anterior abortada");
    }
    return; // Cancela a execução da função
  }
  window.route = "arquivados";
  fetch(`/arquivados`, {
    method: "GET",
    signal: signal,
  })
    .then((response) => {
      return response.text(); // Corrigi também a atribuição da resposta
    })
    .then((html) => {
      if (window.location.pathname == "/arquivados") {
        // Insere o HTML no elemento com id "content"
        const resultDiv = document.getElementById("html");
        resultDiv.outerHTML = html;
        // Após inserir o conteúdo, processa ele com HTMX para aplicar
        loadScriptsFromHTML(html);
        htmx.process(resultDiv);
      }
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("Requisição cancelada:", error.message);
        const elements = document.querySelectorAll(".animate-spin");

        let list = [
          "spinner",
          "spinnerAdicionar",
          "spinnerEtiqueta",
          "spinnerTelefone",
          "spinnerEtiquetaRemove",
          "spinnerEtiquetaUpdate",
          "spinnerAtribuir",
          "spinnerLoad",
        ];

        // Itera sobre os elementos e remove a classe
        elements.forEach((element) => {
          if (!list.includes(element.id)) {
            element.classList.remove("animate-spin");
          }
        });
      } else {
        console.error("Erro na requisição:", error);
        // window.location.reload();
      }
    })
    .finally(() => {
      // Limpa o controlador ao finalizar a requisição
      currentFetchControllerArquivados = null;
    });
}

var currentFetchControllerUsers = null;

function reloadUsers() {
  if (currentFetchControllerUsers) {
    currentFetchControllerUsers.abort();
    console.log("Requisição anterior abortada");
  }

  currentFetchControllerUsers = new AbortController();
  const { signal } = currentFetchControllerUsers;

  console.log("reload users", window.location.pathname);
  if (window.location.pathname !== "/usersManager") {
    console.log("Função cancelada: rota diferente de '/usersManager'");
    if (currentFetchControllerUsers) {
      currentFetchControllerUsers.abort();
      console.log("Requisição anterior abortada");
    }
    return; // Cancela a execução da função
  }

  // document.getElementById("data").classList.add("hidden");
  // document.getElementById("onload").classList.remove("hidden");
  window.route = "usersManager";
  fetch(`/usersManager`, {
    method: "GET",
    signal: signal,
  })
    .then((response) => {
      return response.text(); // Corrigi também a atribuição da resposta
    })
    .then((html) => {
      if (window.location.pathname == "/usersManager") {
        // Insere o HTML no elemento com id "content"
        const resultDiv = document.getElementById("html");
        resultDiv.outerHTML = html;
        // Após inserir o conteúdo, processa ele com HTMX para aplicar
        loadScriptsFromHTML(html);
        htmx.process(resultDiv);
        // window.location.pathname = "/usersManager";
      }
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("Requisição cancelada:", error.message);
        const elements = document.querySelectorAll(".animate-spin");

        let list = [
          "spinner",
          "spinnerAdicionar",
          "spinnerEtiqueta",
          "spinnerTelefone",
          "spinnerEtiquetaRemove",
          "spinnerEtiquetaUpdate",
          "spinnerAtribuir",
          "spinnerLoad",
        ];

        // Itera sobre os elementos e remove a classe
        elements.forEach((element) => {
          if (!list.includes(element.id)) {
            element.classList.remove("animate-spin");
          }
        });
      } else {
        console.error("Erro na requisição:", error);
        // window.location.reload();
      }
    })
    .finally(() => {
      // Limpa o controlador ao finalizar a requisição
      currentFetchControllerUsers = null;
    });
}

var currentFetchControllerUserProfile = null;

function reloadUserProfile() {
  if (currentFetchControllerUserProfile) {
    currentFetchControllerUserProfile.abort();
    console.log("Requisição anterior abortada");
  }

  currentFetchControllerUserProfile = new AbortController();
  const { signal } = currentFetchControllerUserProfile;

  console.log("reload users profile", window.location.pathname);
  if (window.location.pathname !== "/userProfile") {
    console.log("Função cancelada: rota diferente de '/userProfile'");
    if (currentFetchControllerUserProfile) {
      currentFetchControllerUserProfile.abort();
      console.log("Requisição anterior abortada");
    }
    return; // Cancela a execução da função
  }

  // document.getElementById("data").classList.add("hidden");
  // document.getElementById("onload").classList.remove("hidden");
  window.route = "userProfile";
  fetch(`/userProfile`, {
    method: "GET",
    signal: signal,
  })
    .then((response) => {
      return response.text(); // Corrigi também a atribuição da resposta
    })
    .then((html) => {
      if (window.location.pathname == "/userProfile") {
        // Insere o HTML no elemento com id "content"
        const resultDiv = document.getElementById("html");
        resultDiv.outerHTML = html;
        // Após inserir o conteúdo, processa ele com HTMX para aplicar
        loadScriptsFromHTML(html);
        htmx.process(resultDiv);
        // window.location.pathname = "/usersManager";
      }
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("Requisição cancelada:", error.message);
        const elements = document.querySelectorAll(".animate-spin");

        let list = [
          "spinner",
          "spinnerAdicionar",
          "spinnerEtiqueta",
          "spinnerTelefone",
          "spinnerEtiquetaRemove",
          "spinnerEtiquetaUpdate",
          "spinnerAtribuir",
          "spinnerLoad",
        ];

        // Itera sobre os elementos e remove a classe
        elements.forEach((element) => {
          if (!list.includes(element.id)) {
            element.classList.remove("animate-spin");
          }
        });
      } else {
        console.error("Erro na requisição:", error);
        // window.location.reload();
      }
    })
    .finally(() => {
      // Limpa o controlador ao finalizar a requisição
      currentFetchControllerUserProfile = null;
    });
}

document.addEventListener("htmx:pushedIntoHistory", function () {
  if (currentFetchControllerUsers) {
    currentFetchControllerUsers.abort(); // Aborta a requisição se a URL mudar
    console.log("Requisição abortada devido a mudança de URL.");
    // window.location.pathname = document.location.pathname;
    // window.location.reload();
  }

  if (currentFetchControllerUserProfile) {
    currentFetchControllerUserProfile.abort(); // Aborta a requisição se a URL mudar
    console.log("Requisição abortada devido a mudança de URL.");
    // window.location.pathname = document.location.pathname;
    // window.location.reload();
  }

  if (currentFetchControllerHome) {
    currentFetchControllerHome.abort(); // Aborta a requisição se a URL mudar
    console.log("Requisição abortada devido a mudança de URL.");
    // window.location.pathname = document.location.pathname;
    // window.location.reload();
  }

  if (currentFetchControllerArquivados) {
    currentFetchControllerArquivados.abort(); // Aborta a requisição se a URL mudar
    console.log("Requisição abortada devido a mudança de URL.");
    // window.location.pathname = document.location.pathname;
    // window.location.reload();
  }

  // console.log("Alteração no histórico detectada.");
  // console.log("URL atual:", window.location.pathname, window.route);
  // console.log(
  //   ">>>>>",
  //   window.location.pathname,
  //   document.location.pathname,
  //   window.route,
  // );
  if (window.route === "home" && document.location.pathname !== "/") {
    console.log("deve recarregar");
    window.location.reload();
  }

  if (
    window.route === "arquivados" &&
    document.location.pathname !== "/arquivados"
  ) {
    console.log("deve recarregar");
    window.location.reload();
  }

  if (
    window.route === "usersManager" &&
    document.location.pathname !== "/usersManager"
  ) {
    console.log("deve recarregar");
    window.location.reload();
  }

  if (
    window.route === "userProfile" &&
    document.location.pathname !== "/userProfile"
  ) {
    console.log("deve recarregar");
    window.location.reload();
  }
});

// Função para abrir/fechar os dropdowns
function toggleDropdown() {
  // Seleciona todos os dropdowns com a classe 'dropdown-content'
  var dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("hidden");
  // var dropdowns = document.querySelectorAll(".dropdown-content");
  // dropdowns.forEach(function(dropdown) {
  //   console.log("toggleDropdown", dropdown);
  //   dropdown.classList.toggle("hidden"); // Alterna a classe 'show' em todos os dropdowns
  // });
}

function toggleMenuMobile() {
  // Seleciona todos os dropdowns com a classe 'dropdown-content'
  var mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("hidden");
  // var dropdowns = document.querySelectorAll(".dropdown-content");
  // dropdowns.forEach(function(dropdown) {
  //   console.log("toggleDropdown", dropdown);
  //   dropdown.classList.toggle("hidden"); // Alterna a classe 'show' em todos os dropdowns
  // });
}
// // Fecha os dropdowns se clicar fora deles
// window.onclick = function(event) {
//   if (
//     !event.target.matches("#dropdownDefaultButton") &&
//     !event.target.matches("#dropdownDefaultButton2")
//   ) {
//     var dropdowns = document.querySelectorAll(".dropdown-content");
//     dropdowns.forEach(function(dropdown) {
//       if (dropdown.classList.contains("show")) {
//         dropdown.classList.remove("show"); // Remove a classe 'show' se estiver visível
//       }
//     });
//   }
// };

// Fecha o modal ao clicar fora
// function closeModal(event, element) {
//   if (event) {
//     event.stopPropagation();
//   }
//   console.log("closeModal", element);
//   element.classList.add("hidden");
// }

function changeSvgDirection(columnIndex, column) {
  var svgProtocolo = document.getElementById("protocolo" + column);
  var svgUnidade = document.getElementById("unidade" + column);
  var svgDescricao = document.getElementById("descricao" + column);
  var svgTipo = document.getElementById("tipo" + column);
  var svgFR = document.getElementById("fr" + column);
  var svgDias = document.getElementById("dias" + column) || null;
  var svgEtiquetas = document.getElementById("etiquetas" + column);
  var svgData = document.getElementById("data" + column);
  switch (columnIndex) {
    case 0:
      if (svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgProtocolo.classList.contains("rotate-180")) {
          svgProtocolo.classList.remove("rotate-180");
        }
      } else {
        if (!svgProtocolo.classList.contains("rotate-180")) {
          svgProtocolo.classList.add("rotate-180");
        }
      }

      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }
      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (!svgTipo.classList.contains("hidden")) {
        svgTipo.classList.add("hidden");
      }
      if (!svgFR.classList.contains("hidden")) {
        svgFR.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;
    case 1:
      if (svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgUnidade.classList.contains("rotate-180")) {
          svgUnidade.classList.remove("rotate-180");
        }
      } else {
        if (!svgUnidade.classList.contains("rotate-180")) {
          svgUnidade.classList.add("rotate-180");
        }
      }

      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (!svgTipo.classList.contains("hidden")) {
        svgTipo.classList.add("hidden");
      }
      if (!svgFR.classList.contains("hidden")) {
        svgFR.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;
    case 2:
      if (svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgDescricao.classList.contains("rotate-180")) {
          svgDescricao.classList.remove("rotate-180");
        }
      } else {
        if (!svgDescricao.classList.contains("rotate-180")) {
          svgDescricao.classList.add("rotate-180");
        }
      }

      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }
      if (!svgTipo.classList.contains("hidden")) {
        svgTipo.classList.add("hidden");
      }
      if (!svgFR.classList.contains("hidden")) {
        svgFR.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;

    case 3:
      if (svgTipo.classList.contains("hidden")) {
        svgTipo.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgTipo.classList.contains("rotate-180")) {
          svgTipo.classList.remove("rotate-180");
        }
      } else {
        if (!svgTipo.classList.contains("rotate-180")) {
          svgTipo.classList.add("rotate-180");
        }
      }

      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }

      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (!svgFR.classList.contains("hidden")) {
        svgFR.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;

    case 4:
      if (svgFR.classList.contains("hidden")) {
        svgFR.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgFR.classList.contains("rotate-180")) {
          svgFR.classList.remove("rotate-180");
        }
      } else {
        if (!svgFR.classList.contains("rotate-180")) {
          svgFR.classList.add("rotate-180");
        }
      }

      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }

      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (!svgTipo.classList.contains("hidden")) {
        svgTipo.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;

    case 5:
      if (svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgEtiquetas.classList.contains("rotate-180")) {
          svgEtiquetas.classList.remove("rotate-180");
        }
      } else {
        if (!svgEtiquetas.classList.contains("rotate-180")) {
          svgEtiquetas.classList.add("rotate-180");
        }
      }

      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }
      if (!svgTipo.classList.contains("hidden")) {
        svgTipo.classList.add("hidden");
      }
      if (!svgFR.classList.contains("hidden")) {
        svgFR.classList.add("hidden");
      }
      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;
    case 6:
      if (svgData.classList.contains("hidden")) {
        svgData.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgData.classList.contains("rotate-180")) {
          svgData.classList.remove("rotate-180");
        }
      } else {
        if (!svgData.classList.contains("rotate-180")) {
          svgData.classList.add("rotate-180");
        }
      }

      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }
      if (!svgTipo.classList.contains("hidden")) {
        svgTipo.classList.add("hidden");
      }
      if (!svgFR.classList.contains("hidden")) {
        svgFR.classList.add("hidden");
      }
      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      break;
    case 7:
      if (svgDias.classList.contains("hidden")) {
        svgDias.classList.remove("hidden");
      }

      if (!sortDirection[column]) {
        if (svgDias.classList.contains("rotate-180")) {
          svgDias.classList.remove("rotate-180");
        }
      } else {
        if (!svgDias.classList.contains("rotate-180")) {
          svgDias.classList.add("rotate-180");
        }
      }

      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }
      if (!svgTipo.classList.contains("hidden")) {
        svgTipo.classList.add("hidden");
      }
      if (!svgFR.classList.contains("hidden")) {
        svgFR.classList.add("hidden");
      }
      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;
    default:
      if (!svgProtocolo.classList.contains("hidden")) {
        svgProtocolo.classList.add("hidden");
      }
      if (!svgUnidade.classList.contains("hidden")) {
        svgUnidade.classList.add("hidden");
      }
      if (!svgDescricao.classList.contains("hidden")) {
        svgDescricao.classList.add("hidden");
      }
      if (svgDias && !svgDias.classList.contains("hidden")) {
        svgDias.classList.add("hidden");
      }
      if (svgEtiquetas && !svgEtiquetas.classList.contains("hidden")) {
        svgEtiquetas.classList.add("hidden");
      }
      if (svgData && !svgData.classList.contains("hidden")) {
        svgData.classList.add("hidden");
      }
      break;
  }
}

var sortDirection = {
  Atrasados: true,
  Prazo: true,
  Concluidos: true,
};

function sortTable(columnIndex, column) {
  const tableBody = document.getElementById("tbody" + column);
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  // console.log(
  //     "sort",
  //     sortDirection[column],
  //     column,
  //     columnIndex,
  //     sortDirection,
  // );

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].innerText.toLowerCase();
    const cellB = b.cells[columnIndex].innerText.toLowerCase();

    // Detecta se é uma data no formato dd/mm/yyyy
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (dateRegex.test(cellA) && dateRegex.test(cellB)) {
      const [dayA, monthA, yearA] = cellA.split("/").map(Number);
      const [dayB, monthB, yearB] = cellB.split("/").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return sortDirection[column] ? dateA - dateB : dateB - dateA;
    }

    if (!isNaN(cellA) && !isNaN(cellB) && cellA !== "" && cellB !== "") {
      return sortDirection[column] ? cellA - cellB : cellB - cellA;
    }

    if (!isNaN(cellA) && !isNaN(cellB) && cellA !== "" && cellB === "") {
      return sortDirection[column] ? cellA - -1 : -1 - cellA;
    }

    if (!isNaN(cellA) && !isNaN(cellB) && cellA === "" && cellB !== "") {
      return sortDirection[column] ? -1 - cellB : cellB - -1;
    }

    return sortDirection[column]
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });
  sortDirection[column] = !sortDirection[column];
  tableBody.innerHTML = "";
  rows.forEach((row) => tableBody.appendChild(row));
  // changeSvgDirection(columnIndex, column);
}

function expand(el) {
  if (el.classList.contains("truncate")) {
    el.classList.remove("truncate");
    el.classList.add("break-words");
  } else {
    el.classList.remove("break-words");
    el.classList.add("truncate");
  }
}

function imprimirTabela(tabelaId) {
  var searchInput = document.getElementById("inputPesquisa");
  var searchValue = searchInput.value;
  // Seleciona a tabela específica
  const tabela = document.getElementById(tabelaId);

  // Guarda o conteúdo original da página
  const conteudoOriginal = document.body.innerHTML;

  // Define o HTML da tabela como o único conteúdo visível
  document.body.innerHTML = tabela.outerHTML;

  // Abre a janela de impressão
  window.print();

  // Restaura o conteúdo original e a coluna oculta
  document.body.innerHTML = conteudoOriginal;
  var searchInput = document.getElementById("inputPesquisa");
  searchInput.value = searchValue || "";
  var checkbox = document.getElementById("checkbox_modo_dark");
  var checkbox2 = document.getElementById("checkbox_modo_dark_mobile");
  var isDark = JSON.parse(localStorage.getItem("modo_dark")) == 1;

  checkbox.checked = isDark;
  checkbox2.checked = isDark;
  //console.log("isDark", isDark, localStorage.getItem("modo_dark"));
  if (isDark) {
    document.documentElement.classList.add("dark");
  }
}

function updateRowCount(tableId, headerId) {
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName("tr");
  let visibleRowCount = 0;

  // Conta apenas as linhas visíveis (sem a classe 'hidden')
  for (let row of rows) {
    if (!row.classList.contains("hidden")) {
      visibleRowCount++;
    }
  }

  const header = document.getElementById(headerId);
  header.textContent = ` ${visibleRowCount - 1}`; // Subtrai 1 para ignorar o cabeçalho
}

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "f") {
    event.preventDefault(); // Impede a funcionalidade padrão do navegador
    const searchInput = document.getElementById("inputPesquisa");
    searchInput.focus(); // Foca no campo de entrada
    searchInput.select(); // (Opcional) Seleciona o texto existente no campo
  }
});

function isColorDark(hexColor) {
  // Remove o # se estiver presente
  hexColor = hexColor.replace("#", "");

  // Extrai os valores R, G e B
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Calcula a luminância perceptual
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Retorna true para escuro, false para claro
  return luminance < 128;
}

document.addEventListener("htmx:load", function (event) {
  // Encontra todas as divs que precisam de ajuste no contexto do evento HTMX
  const divs = event.target.querySelectorAll("[data-cor-hex]");
  divs.forEach((div) => {
    const corHex = div.getAttribute("data-cor-hex");
    changeTextColor(div, corHex); // Aplica a função para ajustar a cor
  });
});

function changeTextColor(ele, hexColor) {
  if (isColorDark(hexColor)) {
    ele.classList.add("text-gray-100");
    ele.classList.add("border-gray-200");
  } else {
    ele.classList.add("text-slate-900");
    ele.classList.add("border-slate-900");
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function toggleTheme(changedCheckbox) {
  // console.log("chamou toggle");
  // document.getElementById("html").classList.toggle("dark");
  //document.getElementById("body").classList.toggle("dark");
  // console.log("alterou toggle");
  // const resultDiv = document.getElementById("html");
  // // Após inserir o conteúdo, processa ele com HTMX para aplicar
  // loadScriptsFromHTML(html);
  // htmx.process(resultDiv);

  const checkboxes = [
    document.getElementById("checkbox_modo_dark_mobile"),
    document.getElementById("checkbox_modo_dark"),
  ];

  const newValue = changedCheckbox.checked;

  checkboxes.forEach((cb) => {
    if (cb !== changedCheckbox) cb.checked = newValue;
  });

  localStorage.setItem("modo_dark", newValue);

  // var modo_dark = JSON.parse(localStorage.getItem("modo_dark"));
  //  localStorage.setItem("modo_dark", !modo_dark);
  if (newValue === true) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function loadTabelas(atualizando) {
  var tabelas_index = document.getElementById("tabelas_index");
  var s = document.getElementById("switchVisualizacao");

  if (s.checked) {
    tabelas_index.innerHTML = `<div class="tabela-container " id="tabela_atribuicao"></div>`;
    var url = atualizando
      ? `/tabela_atribuicao?atualizando=${atualizando}`
      : `/tabela_atribuicao`;
    htmx
      .ajax("GET", url, {
        target: "#tabela_atribuicao",
        swap: "innerHTML swap:200ms settle:200ms",
      })
      .then(() => {
        if (atualizando) {
          atualizarAcompanhamentos(true);
        }
      })
      .catch(function (error) {
        console.error("Erro ao atualizar tabela:", error);
        stopSpinnerLoad(); // ainda assim para o spinner
      });
  } else {
    tabelas_index.innerHTML = `<div class="tabela-container " id="tabela_atrasado">
                </div>
                <div class="tabela-container " id="tabela_prazo">
                </div>
                <div class="tabela-container " id="tabela_concluido">
                </div>`;
    var url_add = atualizando ? `?atualizando=${atualizando}` : "";
    htmx
      .ajax("GET", `/tabela_atrasados` + url_add, {
        target: "#tabela_atrasado",
        swap: "innerHTML swap:200ms settle:200ms",
      })
      .then(function () {
        htmx
          .ajax("GET", `/tabela_prazos` + url_add, {
            target: "#tabela_prazo",
            swap: "innerHTML swap:200ms settle:200ms",
          })
          .then(function () {
            htmx
              .ajax("GET", `/tabela_concluidos` + url_add, {
                target: "#tabela_concluido",
                swap: "innerHTML swap:200ms settle:200ms",
              })
              .then(() => {
                if (atualizando) {
                  atualizarAcompanhamentos(false);
                }
              })
              .catch(function (error) {
                console.error("Erro ao atualizar tabela:", error);
                stopSpinnerLoad(); // ainda assim para o spinner
              });
          });
      })
      .catch(function (error) {
        console.error("Erro ao atualizar tabela:", error);
        stopSpinnerLoad(); // ainda assim para o spinner
      });
  }
  document.getElementById("spinnerLoadDiv").classList.add("hidden");
}

async function gerarBoleto(elementId, parcela = null, isUser = false) {
  console.log(`Gerando boleto para o ID: ${elementId}`);

  const spinner = document.getElementById(`spinner${elementId}`);
  const check = document.getElementById(`check${elementId}`);
  const boleto = document.getElementById(`boleto${elementId}`);

  // Esconde/mostra ícones iniciais
  check.classList.add("hidden");
  boleto.classList.add("hidden");
  spinner.classList.remove("hidden");

  try {
    const id = elementId.split("_")[1];
    const payload = { id };
    if (parcela) payload.parcela = parcela;

    const response = await fetch("/gerar-boleto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Erro ao gerar boleto. Status:", response.status);
      return renderErrorButton(elementId, isUser);
    }

    console.log("Boleto gerado com sucesso!");

    // Ajusta status visual
    spinner.classList.add("hidden");
    check.classList.remove("hidden");

    setTimeout(async () => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/pdf")) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        const htmlContent = await response.text();
        const newWindow = window.open("", "_blank");
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }

      // Reseta ícones após abrir boleto
      check.classList.add("hidden");
      boleto.classList.remove("hidden");
    }, 250);
  } catch (error) {
    console.error("Erro na requisição:", error);
    renderErrorButton(elementId, isUser);
  }
}

function renderErrorButton(elementId, isUser) {
  console.log("Renderizando botão de erro para:", elementId);
  const button = document.getElementById(`gerarBoletoButton${elementId}`);
  button.outerHTML = `
    <button
    
      class="bg-red-500 rounded-md text-white p-2 border text-center flex text-md gap-1 justify-center items-center ${
        isUser ? "" : "m-auto"
      }"
      id="gerarBoletoButton${elementId}" 
      title="Gerar boleto"
      onclick="gerarBoleto('${elementId}', 0, ${isUser})">
      
      <div id="boleto${elementId}">
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4 ${
          isUser ? "m-1" : ""
        }">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M4.5 5.25C4.5 4.00736 5.50736 3 6.75 3H17.25C18.4926 3 19.5 4.00736 
            19.5 5.25V20.25C19.5 20.5266 19.3478 20.7807 19.1039 20.9113C18.86 
            21.0418 18.5641 21.0275 18.334 20.874L16.5 19.6514L14.666 
            20.874C14.4141 21.042 14.0859 21.042 13.834 20.874L12 
            19.6514L10.166 20.874C9.9141 21.042 9.5859 21.042 
            9.33397 20.874L7.5 19.6514L5.66602 20.874C5.43588 
            21.0275 5.13997 21.0418 4.89611 20.9113C4.65224 
            20.7807 4.5 20.5266 4.5 20.25V5.25ZM8.25 
            10.5C7.83579 10.5 7.5 10.8358 7.5 
            11.25C7.5 11.6642 7.83579 12 
            8.25 12L15.75 12C16.1642 12 
            16.5 11.6642 16.5 11.25C16.5 
            10.8358 16.1642 10.5 15.75 
            10.5L8.25 10.5Z" 
            fill="#ffffff"></path>
        </svg>
      </div>
      <svg id="spinner${elementId}" class="animate-spin h-4 w-4 text-white hidden m-1"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 
          0 0 5.373 0 12h4zm2 
          5.291A7.962 7.962 0 014 
          12H0c0 3.042 1.135 5.824 
          3 7.938l3-2.647z"></path>
      </svg>
      <svg id="check${elementId}" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white hidden m-1">
        <path d="M4 12.6111L8.92308 17.5L20 6.5" 
          stroke="#ffffff" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span class="${
        isUser ? "" : "hidden"
      }" id="text${elementId}">Erro ao gerar boleto.</span>
    </button>
  `;
}

function openModal() {
  document.getElementById("uploadModal").classList.remove("hidden");
  document.getElementById("uploadModal").classList.add("flex");
}

function closeModal() {
  if (!document.getElementById("uploadModal").classList.contains("hidden")) {
    document.getElementById("uploadModal").classList.add("hidden");
    document.getElementById("uploadModal").classList.remove("flex");
  }
}

// Arrastar e soltar
var dropArea = document.getElementById("dropArea");
var fileInput = document.getElementById("fileInput");
var fileName = document.getElementById("fileName");

if (dropArea && fileInput && fileName) {
  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("border-blue-500");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("border-blue-500");
  });

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("border-blue-500");
    if (event.dataTransfer.files.length > 0) {
      fileInput.files = event.dataTransfer.files;
      fileName.textContent = `Arquivo: ${event.dataTransfer.files[0].name}`;
      fileName.classList.remove("hidden");
    }
  });

  var allowedExtensions = ["txt", "ret"];
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {
        fileName.textContent = `Arquivo: ${fileInput.files[0].name}`;
        fileName.classList.remove("hidden");
      }
    }
  });
}
function uploadFile() {
  const statusMessage = document.getElementById("statusMessage");
  if (fileInput.files.length === 0) {
    statusMessage.textContent = "Nenhum arquivo selecionado!";
    statusMessage.classList.add("text-red-500");
    return;
  }

  const file = fileInput.files[0];
  const fileExtension = file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    statusMessage.textContent = "Arquivo em formato inválido!";
    statusMessage.classList.add("text-red-500");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        statusMessage.textContent = "Arquivo enviado com sucesso!";
        statusMessage.classList.add("text-green-500");
        fileName.textContent = "";
        fileInput.value = "";
      } else {
        statusMessage.textContent = "Erro ao enviar o arquivo.";
        statusMessage.classList.add("text-red-500");
      }
    })
    .catch((error) => {
      statusMessage.textContent = "Erro de conexão.";
      statusMessage.classList.add("text-red-500");
    });
}

// Mostrar alertas
function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");
  const alertClass =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  const alertDiv = document.createElement("div");
  alertDiv.className = `border-l-4 p-4 mb-4 ${alertClass}`;
  alertDiv.textContent = message;

  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}