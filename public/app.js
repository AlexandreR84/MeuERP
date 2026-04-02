const state = {
  token: localStorage.getItem("micro_erp_token") || "",
  usuarioAtual: null,
  produtos: [],
  clientes: [],
  fornecedores: [],
  usuarios: [],
  planoContas: [],
  contasReceber: []
};

const page = document.body.dataset.page;
const toastElement = document.querySelector("#toast");
let toastTimer;

function showToast(message, type = "success") {
  if (!toastElement) {
    return;
  }

  clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.style.background = type === "error" ? "#8f2d1b" : "#20170f";
  toastElement.classList.add("is-visible");
  toastTimer = setTimeout(() => toastElement.classList.remove("is-visible"), 3000);
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function isAdmin() {
  return state.usuarioAtual?.tipo === "ADMIN";
}

function isVendedor() {
  return state.usuarioAtual?.tipo === "VENDEDOR";
}

function canAccessPage(currentPage) {
  if (isAdmin()) {
    return true;
  }

  const vendedorPages = new Set(["dashboard", "produtos", "clientes", "vendas"]);
  return vendedorPages.has(currentPage);
}

function canEditEntity(entity) {
  if (isAdmin()) {
    return true;
  }

  return isVendedor() && entity === "clientes";
}

function canDisableOrDeleteEntity() {
  return isAdmin();
}

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    headers,
    ...options
  });

  const hasJson = response.headers.get("content-type")?.includes("application/json");
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.error || "Nao foi possivel concluir a operacao.");
  }

  return data;
}

function updateSessionHeader() {
  const sessionUser = document.querySelector("#sessionUser");
  const sessionRole = document.querySelector("#sessionRole");

  if (sessionUser) {
    sessionUser.textContent = state.usuarioAtual?.nome || "Nao autenticado";
  }

  if (sessionRole) {
    sessionRole.textContent = state.usuarioAtual?.tipo || "-";
  }
}

async function loadSession() {
  if (!state.token) {
    state.usuarioAtual = null;
    return false;
  }

  try {
    const data = await apiFetch("/auth/me");
    state.usuarioAtual = data.usuario;
    updateSessionHeader();
    return true;
  } catch (error) {
    localStorage.removeItem("micro_erp_token");
    state.token = "";
    state.usuarioAtual = null;
    updateSessionHeader();
    return false;
  }
}

function requireAuthenticatedPage() {
  if (page !== "login" && !state.usuarioAtual) {
    window.location.href = "/";
    return false;
  }

  if (page === "login" && state.usuarioAtual) {
    window.location.href = "/dashboard.html";
    return false;
  }

  if (page !== "login" && state.usuarioAtual && !canAccessPage(page)) {
    window.location.href = "/dashboard.html";
    return false;
  }

  return true;
}

function hideElement(element) {
  if (!element) {
    return;
  }

  element.style.display = "none";
}

function applyRoleAccess() {
  if (!state.usuarioAtual || isAdmin()) {
    return;
  }

  const adminOnlyLinks = [
    '/fornecedores.html',
    '/usuarios.html',
    '/plano-contas.html',
    '/compras.html',
    '/financeiro.html'
  ];

  document.querySelectorAll(".sidebar__link").forEach((link) => {
    if (adminOnlyLinks.includes(link.getAttribute("href"))) {
      hideElement(link);
    }
  });

  document.querySelectorAll('a.button').forEach((link) => {
    if (adminOnlyLinks.includes(link.getAttribute("href"))) {
      hideElement(link);
    }
  });

  hideElement(document.querySelector("#produtoForm")?.closest(".panel"));
  hideElement(document.querySelector("#fornecedorForm")?.closest(".panel"));
  hideElement(document.querySelector("#usuarioForm")?.closest(".panel"));
  hideElement(document.querySelector("#planoContaForm")?.closest(".panel"));
  hideElement(document.querySelector("#compraForm")?.closest(".panel"));

  const metricFornecedores = document.querySelector("#metricFornecedores");
  if (metricFornecedores) {
    hideElement(metricFornecedores.closest(".metric-card"));
  }
}

function bindLogout() {
  const logoutButton = document.querySelector("#logoutButton");

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("micro_erp_token");
    state.token = "";
    state.usuarioAtual = null;
    window.location.href = "/";
  });
}

function renderList(container, items, formatter, emptyMessage) {
  if (!container) {
    return;
  }

  if (!items.length) {
    container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  container.innerHTML = items.map((item) => formatter(item)).join("");
}

function buildActions(entity, item) {
  if (!canEditEntity(entity) && !canDisableOrDeleteEntity()) {
    return "";
  }

  const actions = [];

  if (canEditEntity(entity)) {
    actions.push(`<button class="button button--ghost" type="button" data-action="edit" data-entity="${entity}" data-id="${item.id}">Editar</button>`);
  }

  if (canDisableOrDeleteEntity()) {
    actions.push(`<button class="button button--ghost" type="button" data-action="disable" data-entity="${entity}" data-id="${item.id}">Inativar</button>`);
    actions.push(`<button class="button button--ghost" type="button" data-action="delete" data-entity="${entity}" data-id="${item.id}">Excluir</button>`);
  }

  return `
    <div class="row-actions">
      ${actions.join("")}
    </div>
  `;
}

async function loadHealthCard() {
  const healthStatus = document.querySelector("#healthStatus");
  const healthText = document.querySelector("#healthText");

  if (!healthStatus || !healthText) {
    return;
  }

  try {
    const data = await fetch("/health").then((response) => response.json());
    healthStatus.textContent = "Online";
    healthText.textContent = data.message;
  } catch (error) {
    healthStatus.textContent = "Indisponivel";
    healthText.textContent = error.message;
  }
}

function bindCrudActions() {
  document.body.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const { entity, id, action } = button.dataset;
    const item =
      entity === "produtos"
        ? state.produtos.find((entry) => entry.id === Number(id))
        : entity === "clientes"
          ? state.clientes.find((entry) => entry.id === Number(id))
          : entity === "fornecedores"
            ? state.fornecedores.find((entry) => entry.id === Number(id))
            : entity === "usuarios"
              ? state.usuarios.find((entry) => entry.id === Number(id))
              : state.planoContas.find((entry) => entry.id === Number(id));

    if (!item) {
      showToast("Registro nao encontrado.", "error");
      return;
    }

    try {
      if (action === "delete") {
        await apiFetch(`/${entity}/${id}`, { method: "DELETE" });
      } else if (action === "disable") {
        await apiFetch(`/${entity}/${id}/desabilitar`, {
          method: "PATCH",
          body: JSON.stringify({})
        });
      } else if (action === "edit") {
        let payload;

        if (entity === "produtos") {
          payload = {
            nome: prompt("Nome do produto:", item.nome) || item.nome,
            codigo: prompt("Codigo:", item.codigo) || item.codigo,
            preco_custo: prompt("Preco de custo:", item.preco_custo) || item.preco_custo,
            preco_venda: prompt("Preco de venda:", item.preco_venda) || item.preco_venda,
            estoque: prompt("Estoque:", item.estoque) || item.estoque,
            estoque_minimo: prompt("Estoque minimo:", item.estoque_minimo) || item.estoque_minimo
          };
        } else if (entity === "clientes") {
          payload = {
            nome: prompt("Nome do cliente:", item.nome) || item.nome,
            cpf: prompt("CPF:", item.cpf) || item.cpf
          };
        } else if (entity === "fornecedores") {
          payload = {
            nome: prompt("Nome do fornecedor:", item.nome) || item.nome,
            cnpj: prompt("CNPJ:", item.cnpj) || item.cnpj
          };
        } else if (entity === "usuarios") {
          payload = {
            nome: prompt("Nome do usuario:", item.nome) || item.nome,
            email: prompt("Email:", item.email) || item.email,
            tipo: (prompt("Perfil (ADMIN ou VENDEDOR):", item.tipo) || item.tipo).toUpperCase()
          };
        } else {
          payload = {
            codigo: prompt("Codigo da conta:", item.codigo) || item.codigo,
            nome: prompt("Nome da conta:", item.nome) || item.nome,
            tipo: (prompt("Tipo da conta:", item.tipo) || item.tipo).toUpperCase(),
            conta_pai_id: prompt("Conta pai ID (vazio para raiz):", item.conta_pai_id || "") || ""
          };
        }

        await apiFetch(`/${entity}/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      }

      await initCurrentPage();
      showToast("Operacao concluida com sucesso.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

async function handleFormSubmit(form, endpoint, successMessage, afterSuccess) {
  const payload = Object.fromEntries(new FormData(form).entries());

  await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  form.reset();
  if (afterSuccess) {
    await afterSuccess();
  }
  showToast(successMessage);
}

function bindLoginPage() {
  const loginForm = document.querySelector("#loginForm");

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = Object.fromEntries(new FormData(loginForm).entries());
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      state.token = data.token;
      state.usuarioAtual = data.usuario;
      localStorage.setItem("micro_erp_token", data.token);
      window.location.href = "/dashboard.html";
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function bindProdutoPage() {
  const form = document.querySelector("#produtoForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await handleFormSubmit(form, "/produtos", "Produto cadastrado com sucesso.", initCurrentPage);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function bindClientePage() {
  const form = document.querySelector("#clienteForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await handleFormSubmit(form, "/clientes", "Cliente cadastrado com sucesso.", initCurrentPage);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function bindFornecedorPage() {
  const form = document.querySelector("#fornecedorForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await handleFormSubmit(form, "/fornecedores", "Fornecedor cadastrado com sucesso.", initCurrentPage);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function bindUsuarioPage() {
  const form = document.querySelector("#usuarioForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await handleFormSubmit(form, "/usuarios", "Usuario cadastrado com sucesso.", initCurrentPage);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function bindPlanoContaPage() {
  const form = document.querySelector("#planoContaForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await handleFormSubmit(form, "/plano-contas", "Conta contabil cadastrada com sucesso.", initCurrentPage);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function createLineItem(kind) {
  const template = document.querySelector(kind === "compra" ? "#compraItemTemplate" : "#vendaItemTemplate");
  const container = template.content.firstElementChild.cloneNode(true);
  const select = container.querySelector('select[name="produto_id"]');

  select.innerHTML = '<option value="">Selecione o produto</option>';
  state.produtos
    .filter((produto) => produto.ativo)
    .forEach((produto) => {
      const option = document.createElement("option");
      option.value = produto.id;
      option.textContent = `${produto.codigo} - ${produto.nome} | estoque ${produto.estoque}`;
      select.appendChild(option);
    });

  if (kind === "venda") {
    select.addEventListener("change", () => {
      const hint = container.querySelector("[data-price-hint]");
      const produto = state.produtos.find((entry) => String(entry.id) === select.value);
      hint.textContent = produto ? `Preco atual: ${formatCurrency(produto.preco_venda)}` : "Preco atual: R$ 0,00";
    });
  }

  container.querySelector("[data-remove-item]").addEventListener("click", () => container.remove());
  return container;
}

function bindCompraPage() {
  const form = document.querySelector("#compraForm");
  const fornecedorSelect = document.querySelector("#compraFornecedor");
  const itemsWrap = document.querySelector("#compraItens");
  const addButton = document.querySelector("#addCompraItem");

  if (!form || !fornecedorSelect || !itemsWrap || !addButton) {
    return;
  }

  fornecedorSelect.innerHTML = '<option value="">Selecione o fornecedor</option>';
  state.fornecedores
    .filter((item) => item.ativo)
    .forEach((fornecedor) => {
      const option = document.createElement("option");
      option.value = fornecedor.id;
      option.textContent = fornecedor.nome;
      fornecedorSelect.appendChild(option);
    });

  if (!itemsWrap.children.length) {
    itemsWrap.appendChild(createLineItem("compra"));
  }

  addButton.onclick = () => itemsWrap.appendChild(createLineItem("compra"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const itens = [...itemsWrap.querySelectorAll(".line-item")].map((item) => ({
      produto_id: item.querySelector('[name="produto_id"]').value,
      quantidade: item.querySelector('[name="quantidade"]').value,
      preco: item.querySelector('[name="preco"]').value
    }));

    const formData = new FormData(form);

    try {
      await apiFetch("/compras", {
        method: "POST",
        body: JSON.stringify({
          fornecedor_id: fornecedorSelect.value,
          desconto: formData.get("desconto"),
          nf_entrada: formData.get("nf_entrada"),
          forma_pagamento: formData.get("forma_pagamento"),
          itens
        })
      });
      await initCurrentPage();
      itemsWrap.innerHTML = "";
      itemsWrap.appendChild(createLineItem("compra"));
      form.reset();
      showToast("Compra registrada com sucesso.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function bindVendaPage() {
  const form = document.querySelector("#vendaForm");
  const clienteSelect = document.querySelector("#vendaCliente");
  const itemsWrap = document.querySelector("#vendaItens");
  const addButton = document.querySelector("#addVendaItem");

  if (!form || !clienteSelect || !itemsWrap || !addButton) {
    return;
  }

  clienteSelect.innerHTML = '<option value="">Selecione o cliente</option>';
  state.clientes
    .filter((item) => item.ativo)
    .forEach((cliente) => {
      const option = document.createElement("option");
      option.value = cliente.id;
      option.textContent = cliente.nome;
      clienteSelect.appendChild(option);
    });

  if (!itemsWrap.children.length) {
    itemsWrap.appendChild(createLineItem("venda"));
  }

  addButton.onclick = () => itemsWrap.appendChild(createLineItem("venda"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const itens = [...itemsWrap.querySelectorAll(".line-item")].map((item) => ({
      produto_id: item.querySelector('[name="produto_id"]').value,
      quantidade: item.querySelector('[name="quantidade"]').value
    }));

    const formData = new FormData(form);

    try {
      await apiFetch("/vendas", {
        method: "POST",
        body: JSON.stringify({
          cliente_id: clienteSelect.value,
          desconto: formData.get("desconto"),
          itens
        })
      });
      await initCurrentPage();
      itemsWrap.innerHTML = "";
      itemsWrap.appendChild(createLineItem("venda"));
      form.reset();
      showToast("Venda registrada com sucesso.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

function bindFinanceiroPage() {
  const table = document.querySelector("#contasReceberTable");
  const contasPagarTable = document.querySelector("#contasPagarTable");

  if (!table) {
    return;
  }

  const handler = async (event) => {
    const contaId = event.target.getAttribute("data-baixar-conta");
    const tipoConta = event.target.getAttribute("data-tipo-conta");
    if (!contaId) {
      return;
    }

    try {
      const endpoint = tipoConta === "pagar" ? "/contas-pagar/baixar" : "/contas-receber/baixar";
      const payload = tipoConta === "pagar" ? { conta_pagar_id: contaId } : { conta_receber_id: contaId };

      await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      await initCurrentPage();
      showToast(`Conta #${contaId} baixada com sucesso.`);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  table.addEventListener("click", handler);
  if (contasPagarTable) {
    contasPagarTable.addEventListener("click", handler);
  }
}

async function initDashboardPage() {
  await loadHealthCard();
  const [produtos, clientes] = await Promise.all([
    apiFetch("/produtos"),
    apiFetch("/clientes")
  ]);

  document.querySelector("#metricProdutos").textContent = produtos.length;
  document.querySelector("#metricClientes").textContent = clientes.length;

  const metricFornecedores = document.querySelector("#metricFornecedores");
  if (metricFornecedores && isAdmin()) {
    const fornecedores = await apiFetch("/fornecedores");
    metricFornecedores.textContent = fornecedores.length;
  }
}

async function initProdutosPage() {
  state.produtos = await apiFetch("/produtos");
  renderList(
    document.querySelector("#produtosList"),
    state.produtos,
    (produto) => {
      const estoqueBaixo = Number(produto.estoque) <= Number(produto.estoque_minimo);
      return `
        <div class="list-item">
          <strong>${produto.nome}</strong>
          <span>Codigo: ${produto.codigo}</span>
          <span>Custo: ${formatCurrency(produto.preco_custo)}</span>
          <span>Venda: ${formatCurrency(produto.preco_venda)}</span>
          <span>Estoque: <strong style="color:${estoqueBaixo ? "#b7472a" : "inherit"}">${produto.estoque}</strong> / minimo ${produto.estoque_minimo}</span>
          <span>Status: ${produto.ativo ? "Ativo" : "Inativo"}</span>
          ${buildActions("produtos", produto)}
        </div>
      `;
    },
    "Nenhum produto cadastrado."
  );
}

async function initClientesPage() {
  state.clientes = await apiFetch("/clientes");
  renderList(
    document.querySelector("#clientesList"),
    state.clientes,
    (cliente) => `
      <div class="list-item">
        <strong>${cliente.nome}</strong>
        <span>CPF: ${cliente.cpf}</span>
        <span>Status: ${cliente.ativo ? "Ativo" : "Inativo"}</span>
        ${buildActions("clientes", cliente)}
      </div>
    `,
    "Nenhum cliente cadastrado."
  );
}

async function initFornecedoresPage() {
  state.fornecedores = await apiFetch("/fornecedores");
  renderList(
    document.querySelector("#fornecedoresList"),
    state.fornecedores,
    (fornecedor) => `
      <div class="list-item">
        <strong>${fornecedor.nome}</strong>
        <span>CNPJ: ${fornecedor.cnpj}</span>
        <span>Status: ${fornecedor.ativo ? "Ativo" : "Inativo"}</span>
        ${buildActions("fornecedores", fornecedor)}
      </div>
    `,
    "Nenhum fornecedor cadastrado."
  );
}

async function initUsuariosPage() {
  state.usuarios = await apiFetch("/usuarios");
  renderList(
    document.querySelector("#usuariosList"),
    state.usuarios,
    (usuario) => `
      <div class="list-item">
        <strong>${usuario.nome}</strong>
        <span>${usuario.email}</span>
        <span>Perfil: ${usuario.tipo}</span>
        <span>Status: ${usuario.ativo ? "Ativo" : "Inativo"}</span>
        ${buildActions("usuarios", usuario)}
      </div>
    `,
    "Nenhum usuario cadastrado."
  );
}

async function initPlanoContasPage() {
  state.planoContas = await apiFetch("/plano-contas");

  const select = document.querySelector("#planoContaPai");
  if (select) {
    select.innerHTML = '<option value="">Sem conta pai</option>';
    state.planoContas
      .filter((item) => item.ativo)
      .forEach((conta) => {
        const option = document.createElement("option");
        option.value = conta.id;
        option.textContent = `${conta.codigo} - ${conta.nome}`;
        select.appendChild(option);
      });
  }

  renderList(
    document.querySelector("#planoContasList"),
    state.planoContas,
    (conta) => `
      <div class="list-item">
        <strong>${conta.codigo} - ${conta.nome}</strong>
        <span>Tipo: ${conta.tipo}</span>
        <span>Conta pai: ${conta.contaPai?.nome || "Raiz"}</span>
        <span>Status: ${conta.ativo ? "Ativa" : "Inativa"}</span>
        ${buildActions("plano-contas", conta)}
      </div>
    `,
    "Nenhuma conta contabil cadastrada."
  );
}

async function initComprasPage() {
  [state.produtos, state.fornecedores] = await Promise.all([
    apiFetch("/produtos"),
    apiFetch("/fornecedores")
  ]);
}

async function initVendasPage() {
  [state.produtos, state.clientes] = await Promise.all([
    apiFetch("/produtos"),
    apiFetch("/clientes")
  ]);
}

async function initFinanceiroPage() {
  const [contasReceber, contasPagar, fluxoCaixa] = await Promise.all([
    apiFetch("/contas-receber"),
    apiFetch("/contas-pagar"),
    apiFetch("/fluxo-caixa")
  ]);

  state.contasReceber = contasReceber;
  const table = document.querySelector("#contasReceberTable");
  const contasPagarTable = document.querySelector("#contasPagarTable");

  const metricEntradasPendentes = document.querySelector("#metricEntradasPendentes");
  const metricSaidasPendentes = document.querySelector("#metricSaidasPendentes");
  const metricSaldoProjetado = document.querySelector("#metricSaldoProjetado");

  if (metricEntradasPendentes) {
    metricEntradasPendentes.textContent = formatCurrency(fluxoCaixa.resumo?.entradasPendentes);
  }

  if (metricSaidasPendentes) {
    metricSaidasPendentes.textContent = formatCurrency(fluxoCaixa.resumo?.saidasPendentes);
  }

  if (metricSaldoProjetado) {
    metricSaldoProjetado.textContent = formatCurrency(fluxoCaixa.resumo?.saldoProjetado);
  }

  if (!state.contasReceber.length) {
    table.innerHTML = `
      <tr>
        <td colspan="6"><div class="empty-state">Nenhuma conta a receber gerada ainda.</div></td>
      </tr>
    `;
  } else {
    table.innerHTML = state.contasReceber
      .map((conta) => {
        const cliente = conta.pedidoVenda?.cliente?.nome || "Sem cliente";
        const pedidoId = conta.pedidoVenda?.id || conta.pedido_venda_id;
        const isPaga = conta.status === "PAGO";

        return `
          <tr>
            <td>${conta.id}</td>
            <td>#${pedidoId}</td>
            <td>${cliente}</td>
            <td>${formatCurrency(conta.valor)}</td>
            <td><span class="badge ${isPaga ? "badge--pago" : "badge--pendente"}">${conta.status}</span></td>
            <td>${isPaga ? '<span class="badge badge--pago">Baixada</span>' : `<button class="button button--ghost" data-baixar-conta="${conta.id}" data-tipo-conta="receber">Baixar</button>`}</td>
          </tr>
        `;
      })
      .join("");
  }

  if (!contasPagar.length) {
    contasPagarTable.innerHTML = `
      <tr>
        <td colspan="6"><div class="empty-state">Nenhuma conta a pagar gerada ainda.</div></td>
      </tr>
    `;
    return;
  }

  contasPagarTable.innerHTML = contasPagar
    .map((conta) => {
      const fornecedor = conta.pedidoCompra?.fornecedor?.nome || "Sem fornecedor";
      const pedidoId = conta.pedidoCompra?.id || conta.pedido_compra_id;
      const isPaga = conta.status === "PAGO";

      return `
        <tr>
          <td>${conta.id}</td>
          <td>#${pedidoId}</td>
          <td>${fornecedor}</td>
          <td>${formatCurrency(conta.valor)}</td>
          <td><span class="badge ${isPaga ? "badge--pago" : "badge--pendente"}">${conta.status}</span></td>
          <td>${isPaga ? '<span class="badge badge--pago">Baixada</span>' : `<button class="button button--ghost" data-baixar-conta="${conta.id}" data-tipo-conta="pagar">Baixar</button>`}</td>
        </tr>
      `;
    })
    .join("");
}

async function initCurrentPage() {
  if (page === "dashboard") {
    await initDashboardPage();
  } else if (page === "produtos") {
    await initProdutosPage();
  } else if (page === "clientes") {
    await initClientesPage();
  } else if (page === "fornecedores") {
    await initFornecedoresPage();
  } else if (page === "usuarios") {
    await initUsuariosPage();
  } else if (page === "plano-contas") {
    await initPlanoContasPage();
  } else if (page === "compras") {
    await initComprasPage();
  } else if (page === "vendas") {
    await initVendasPage();
  } else if (page === "financeiro") {
    await initFinanceiroPage();
  }
}

async function init() {
  bindLoginPage();
  bindLogout();
  bindCrudActions();

  await loadSession();

  if (!requireAuthenticatedPage()) {
    return;
  }

  updateSessionHeader();
  applyRoleAccess();

  if (page !== "login") {
    try {
      await initCurrentPage();
      bindProdutoPage();
      bindClientePage();
      bindFornecedorPage();
      bindUsuarioPage();
      bindPlanoContaPage();
      bindCompraPage();
      bindVendaPage();
      bindFinanceiroPage();
    } catch (error) {
      showToast(error.message, "error");
    }
  }
}

init();
