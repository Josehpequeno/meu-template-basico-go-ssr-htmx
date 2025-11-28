function spinner() {
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("submit").disabled = true;
}

function resetMensages(noClear) {
  const message = document.getElementById("message");
  const sucessDiv = document.getElementById("sucess");
  const infoDiv = document.getElementById("info");
  if (!message.classList.contains("hidden") && noClear !== "message") {
    message.classList.add("hidden");
  }
  if (!sucessDiv.classList.contains("hidden") && noClear !== "sucess") {
    sucessDiv.classList.add("hidden");
  }
  if (!infoDiv.classList.contains("hidden") && noClear !== "info") {
    sucessDiv.classList.add("hidden");
  }
}

// Captura a resposta após o envio do formulário
htmx.on("htmx:afterOnLoad", function (event) {
  try {
    resetMensages("message");
    var response = event.detail.xhr.responseText;
    var jsonResponse = JSON.parse(response);
    // Se a resposta indicar sucesso, redireciona para a rota de home
    if (jsonResponse.user && jsonResponse.redirect) {
      localStorage.setItem("user", JSON.stringify(jsonResponse.user));
      window.location.href = jsonResponse.redirect;
    }
  } catch (e) {
    // console.log(e);
  }
});

htmx.on("htmx:beforeSwap", function (event) {
  try {
    var response = event.detail.xhr.responseText;
    var jsonResponse = JSON.parse(response);

    // Se a resposta indicar erro, exibe a mensagem
    if (!jsonResponse.user && jsonResponse.error) {
      document.getElementById("submit").disabled = false;
      document.getElementById("spinner").classList.add("hidden");
      document.getElementById("message").classList.remove("hidden");
      document.querySelector(
        "#message"
      ).innerHTML = `<span class="block sm:inline">${jsonResponse.error}</span>`;
      event.preventDefault(); // Evita troca de conteúdo se houver erro
    }
  } catch (e) {
    // console.log(e);
  }
});

function changeVisility() {
  var show = document.getElementById("show");
  var close = document.getElementById("close");
  var password = document.getElementById("password");
  if (show.classList.contains("hidden")) {
    show.classList.remove("hidden");
    close.classList.add("hidden");
    password.type = "text";
  } else {
    show.classList.add("hidden");
    close.classList.remove("hidden");
    password.type = "password";
  }
}

htmx.onLoad(function () {
  const message = sessionStorage.getItem("message");
  if (message) {
    const sucessDiv = document.getElementById("sucess");
    sucessDiv.querySelector("span").textContent = message;
    sucessDiv.classList.remove("hidden");
    sessionStorage.removeItem("message"); // Remove a mensagem para evitar exibições futuras
  }
});

if (window.location.pathname !== "/login") {
  window.location.reload();
}

function handleCredentialResponse(response) {
  // console.log(
  //     "Token de ID recebido:",
  //     response.credential,
  //     response,
  // );

  // Enviar o token para o backend
  fetch("/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: response.credential,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.user && data.redirect) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = data.redirect;
      } else {
        resetMensages("info");
        document.getElementById("submit").disabled = false;
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("info").classList.remove("hidden");
        document.querySelector(
          "#info"
        ).innerHTML = `<span class="block sm:inline">${data.message}</span>`;
        // event.preventDefault(); // Evita troca de conteúdo se houver erro
      }
    })
    .catch((err) => {
      console.error("Erro ao enviar token:", err.response);
    });
}

let supportsFedCmMode = false;
try {
  navigator.credentials.get({
    identity: Object.defineProperty(
      // Check if this Chrome version supports the Mode API.
      {},
      "mode",
      {
        get: function () {
          supportsFedCmMode = true;
        },
      }
    ),
  });
} catch (e) {
  console.log(e);
}

if (supportsFedCmMode) {
  // The button mode is supported. Call the API with mode property:
  (async () => {
    return await navigator.credentials.get({
      identity: {
        context: "login",
        providers: [
          {
            configURL:
              "https://accounts.google.com/.well-known/openid-configuration",
            clientId:
              "client_id.apps.googleusercontent.com",
            nonce: "nonce",
          },
        ],
        // The 'mode' value defines the UX mode of FedCM.
        // - 'active': Must be initiated by user interaction (e.g., clicking a button).
        // - 'passive': Can be initiated without direct user interaction.
        mode: "active",
      },
    });
  })();
}

function setWithExpiry(key, value, ttlInMs) {
  const now = Date.now();

  const item = {
    value: value,
    expiry: now + ttlInMs,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = Date.now();

  if (now > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

function handleLoginSuccess(json) {
  // salva tokens e usuário
  setWithExpiry("access_token", json.access_token, 6 * 60 * 60 * 1000);
  setWithExpiry("refresh_token", json.refresh_token, 6 * 60 * 60 * 1000);
  setWithExpiry(
    "user",
    JSON.stringify({ password: null, ...json.user }),
    6 * 60 * 60 * 1000
  );

  // redireciona conforme role
  const role = json.user.Role.toLowerCase();
  if (role === "normal") {
    console.log("User normal detected, redirecting to /aluno");
    window.location.href = "/";
  } else if (role === "master") {
    console.log("User master detected, redirecting to /");
    window.location.href = "/";
  } else {
    console.warn("Role desconhecido:", json.user.Role);
    window.location.href = "/";
  }
}

// 2) Escuta todos os afterRequest do HTMX
htmx.on("htmx:afterRequest", function (evt) {
  // filtra só o submit do nosso form
  if (evt.detail.elt.id !== "loginForm") return;

  // recupera o texto bruto da resposta
  const text = evt.detail.xhr.responseText;

  try {
    const json = JSON.parse(text);

    console.log("Resposta do login:", json);
    // se vier user + tokens, aciona nosso handler
    if (json.user && json.access_token && json.refresh_token) {
      handleLoginSuccess(json);
    }
    // caso contrário, deixa o seu código de erro normal rodar
  } catch (e) {
    // resposta não JSON? ignora
    console.error("Resposta inválida no login:", e);
  }
});
