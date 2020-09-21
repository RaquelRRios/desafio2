const Koa = require ("koa");

const bodyparser = require("koa-bodyparser");

const server = new Koa();

server.use(bodyparser());

const formatarSucesso = (ctx, dados, status = 200) => {
  ctx.status = status;
  ctx.body = {
    status: "sucesso",
    dados: dados,
  };
};

const formatarErro = (ctx, mensagem, status = 404) => {
  ctx.status = status;
  ctx.body = {
    status: "erro",
    dados: {
      mensagem: mensagem,
    },
  };
};

const product = {
    id: 1,
    nome: "Short Godê",
    quantidade: 1,
    valor: 35,
    deletado: false,
  };

  const order = {
    id: 1,
    produtos: "Short Godê",
    estado: "Completo",
    idCliente: 1,
    deletado: false,
    valorTotal: 35,
  };

const produtos = [];
produtos.push(product);

const pedidos = [];
pedidos.push(order);

const obterProdutos = () => {
  return produtos.filter((product) => !product.deletado);
};

const adicionarProduct = (ctx) => { //adicionar produto
  const body = ctx.request.body;

if (!body.nome || !body.quantidade || !body.valor) {
  formatarErro(ctx, "Pedido mal-formatado", 400);
  return;
}

const product = {
  id: produtos.length + 1,
  nome: body.nome,
  quantidade: body.quantidade,
  valor: body.valor,
  deletado: false,
};

produtos.push(product);

return product;
};

const atualizarProduct = (ctx) => {
  const id = ctx.url.split("/")[2];
  const body = ctx.request.body;

  if (!body.nome && !body.quantidade && !body.valor) {
    formatarErro(ctx, "Pedido mal-formatado", 400);
    return;
  }

  if (id) {
    const productAtual = produtos[id - 1];
    if (productAtual) {
      const productAtualizado = {
        id: Number(id),
        nome: body.nome ? body.nome : productAtual.nome,
        quantidade: body.quantidade ? body.quantidade : productAtual.quantidade,
        valor: body.valor ? body.valor : productAtual.valor,
        deletado: productAtual.deletado,
      };

      produtos[id - 1] = productAtualizado;

      return productAtualizado;
    }
  } else {
    formatarErro(ctx, "Produto não encontrado", 404);
  }
};



const obterPedidosDeProduct = (productId) => {
  const pedidosDeProduct = pedidos.filter((order) => {
    return order.product == productId && order.deletado === false;
  });

  console.log(pedidosDeProduct);
  return pedidosDeProduct;
};

const deletarProduct = (ctx) => {
  const id = ctx.url.split("/")[2];
  const body = ctx.request.body;

  if (typeof body.estado !== "boolean") {
    formatarErro(ctx, "Pedido mal-formatado", 400);
    return;
  }

  if (id) {
    const productAtual = produtos[id - 1];
    if (productAtual) {
      if (body.estado === true && obterPedidosDeProduct(id).length > 0) {
        formatarErro(ctx, "Ação proibida", 403);
        return;
      }

      const productAtualizado = {
        id: productAtual.id,
        nome: productAtual.nome,
        quantidade: productAtual.quantidade,
        valor: productAtual.valor,
        deletado: body.estado,
      };
      
      produtos[id - 1] = productAtualizado;

      return productAtualizado;
    }
  } else {
    formatarErro(ctx, "Usuário não encontrado", 404);
  }
};

const obterPedidos = (ctx, path) => {
  return pedidos.filter((order) => !order.deletado);
};

const adicionarOrder = (ctx) => {
  const body = ctx.request.body;

  if (!body.idCliente) {
    formatarErro(ctx, "Pedido mal-formatado", 400);
    return;
  } 

  const order = {
    id: pedidos.length + 1,
    produtos: [],
    estado: "incompleto",
    idCliente: body.idCliente,
    valorTotal: 0,
    deletado: false,
  };

  pedidos.unshift(order);

  return order;
};

const atualizarEstado = (ctx) => {
  const id = ctx.url.split("/")[2];
  const body = ctx.request.body;

  if 
    (!body.estado)  {
    formatarErro(ctx, "Pedido mal-formatado", 400);
    return;
  };

const atualizarOrder = (ctx) => {
  const id = ctx.url.split("/")[2];
  const body = ctx.request.body;

  if 
    (!body.id || !body.quantidade)  {
    formatarErro(ctx, "Pedido mal-formatado", 400);
    return;
  }
}

  if (id) {
    const orderAtual = pedidos[id - 1];
    if (orderAtual) {
      const orderAtualizado = {
        id: Number(id),
        produtos: body.produtos ? body.produtos : orderAtual.produtos,
        estado: body.estado ? body.estado : orderAtual.estado,
        idCliente: body.idCliente ? body.idCliente : orderAtual.idCliente,
        product: orderAtual.product,
        deletado: orderAtual.deletado,
        quantidade: body.quantidade ? body.quantidade : orderAtual.quantidade,
        valorTotal: body.valorTotal ? body.valorTotal : orderAtual.valorTotal,
      };

      pedidos[id - 1] = orderAtualizado;

      return orderAtualizado;
    }
  } else {
    formatarErro(ctx, "Produto não encontrado", 404);
  }
};

const deletarOrder = (ctx) => {
  const id = ctx.url.split("/")[2];
  const body = ctx.request.body;

  if (typeof body.deletado !== "boolean") {
    formatarErro(ctx, "Pedido mal-formatado", 400);
    return;
  }

  if (id) {
    const orderAtual = pedidos[id - 1];
    if (orderAtual) {
      const orderAtualizado = {
        id: orderAtual.id,
        produtos: orderAtual.produtos,
        estado: orderAtual.estado,
        idCliente: orderAtual.idCliente,
        product: orderAtual. product,
        valorTotal: orderAtual.valorTotal,
        deletado: body.deletado,
      };

      pedidos[id - 1] = orderAtualizado;

      return orderAtualizado;
    }
  } else {
    formatarErro(ctx, "Pedido não encontrado", 404);
  }
};

const rotasProdutos = (ctx, path) => {
    switch (ctx.method) {
      case "GET": //obter informações de um produto
        const id = path[2];
      if (id) {
        const productAtual = produtos[id - 1];
        if (productAtual) {
          formatarSucesso(ctx, productAtual);
        } else {
          formatarErro(ctx, "Produto não encontrado", 404);
        }
      } else {
        const produtos = obterProdutos(); //obter lista de produtos
        formatarSucesso(ctx, produtos);
      }        
        break;
      case "POST":
        const product = adicionarProduct(ctx);

      if (product) {
        formatarSucesso(ctx, product, 201);
      }
        break;
      case "PUT":
        const productAtualizado = atualizarProduct(ctx);

      if (productAtualizado) {
        formatarSucesso(ctx, productAtualizado, 200);
      }
        break;
      case "DELETE":
        const productDeletado = deletarProduct(ctx);
      if (productDeletado) {
        formatarSucesso(ctx, productDeletado, 200);
      }
        break;
      default:
        formatarErro(ctx, "Método não permitido", 405);
        break;
    }
  };

const rotasPedidos = (ctx, path) => {
    switch (ctx.method) {
        case "GET":
          const id = path[2];
      if (id) {
        const orderAtual = pedidos[id - 1];
        if (orderAtual) {
          formatarSucesso(ctx, orderAtual);
        } else {
          formatarErro(ctx, "Produto não encontrado", 404);
        }
      } else {
        const pedidos = obterPedidos(); //obter lista de produtos
        formatarSucesso(ctx, pedidos);
      }   
            break;
          case "POST":
            const order = adicionarOrder(ctx);

          if (order) {
          formatarSucesso(ctx, order, 201);
          }
            break;
          case "PUT":
            //
        break;
          case "DELETE":
            const orderDeletado = deletarOrder(ctx);
      if (orderDeletado) {
        formatarSucesso(ctx, orderDeletado, 200);
      }
            break;
          default:
            formatarErro(ctx, "Método não permitido", 405);
            break;
        }
      };

const rotas = (ctx) => {
    const path = ctx.url.split("/"); 
  
    if (path[1] === "product") {
      rotasProdutos(ctx, path);
    } else if (path[1] === "order") {
      rotasPedidos(ctx, path);
    } else {
      formatarErro(ctx, "Conteúdo não encontrado", 404);
    }
  };

server.use((ctx) => {
    rotas (ctx);
});

server.listen(8081, () => console.log("Servidor rodando..."));