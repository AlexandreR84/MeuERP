const { Produto } = require("../models");

function calcularMargemLucro(precoCusto, precoVenda) {
  const custo = Number(precoCusto || 0);
  const venda = Number(precoVenda || 0);

  if (!Number.isFinite(custo) || !Number.isFinite(venda) || venda <= 0) {
    return 0;
  }

  return Number((((venda - custo) / venda) * 100).toFixed(2));
}

class ProdutoService {
  static async criar(dados) {
    const { nome, codigo, preco_custo, preco_venda, estoque, estoque_minimo } = dados;

    if (!nome || !codigo || preco_custo === undefined || preco_venda === undefined) {
      throw { status: 400, message: "Nome, codigo, preco_custo e preco_venda sao obrigatorios." };
    }

    const produtoExistente = await Produto.findOne({
      where: {
        codigo
      }
    });

    if (produtoExistente) {
      throw { status: 400, message: "Ja existe um produto cadastrado com esse codigo." };
    }

    return Produto.create({
      nome,
      codigo,
      preco_custo,
      preco_venda,
      margem_lucro: calcularMargemLucro(preco_custo, preco_venda),
      estoque: estoque || 0,
      estoque_minimo: estoque_minimo || 0,
      ativo: dados.ativo !== undefined ? Boolean(dados.ativo) : true
    });
  }

  static async listar() {
    return Produto.findAll({
      order: [["id", "ASC"]]
    });
  }

  static async obterPorId(id) {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      throw { status: 404, message: "Produto nao encontrado." };
    }
    return produto;
  }

  static async atualizar(id, dados) {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      throw { status: 404, message: "Produto nao encontrado." };
    }

    if (dados.codigo && dados.codigo !== produto.codigo) {
      const produtoExistente = await Produto.findOne({
        where: {
          codigo: dados.codigo
        }
      });

      if (produtoExistente) {
        throw { status: 400, message: "Ja existe um produto cadastrado com esse codigo." };
      }
    }

    Object.assign(produto, {
      nome: dados.nome ?? produto.nome,
      codigo: dados.codigo ?? produto.codigo,
      preco_custo: dados.preco_custo ?? produto.preco_custo,
      preco_venda: dados.preco_venda ?? produto.preco_venda,
      estoque: dados.estoque ?? produto.estoque,
      estoque_minimo: dados.estoque_minimo ?? produto.estoque_minimo
    });

    produto.margem_lucro = calcularMargemLucro(produto.preco_custo, produto.preco_venda);

    if (dados.ativo !== undefined) {
      produto.ativo = Boolean(dados.ativo);
    }

    await produto.save();
    return produto;
  }

  static async desabilitar(id) {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      throw { status: 404, message: "Produto nao encontrado." };
    }

    produto.ativo = false;
    await produto.save();
    return produto;
  }

  static async remover(id) {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      throw { status: 404, message: "Produto nao encontrado." };
    }

    await produto.destroy();
    return { message: "Produto removido com sucesso." };
  }
}

ProdutoService.calcularMargemLucro = calcularMargemLucro;

module.exports = ProdutoService;
