const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: "Item Adicionado",
    statusMensagem: false,
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => (total += item.preco));
      }
      return total;
    },
  },
  filters: {
    convertToBrl(valor) {
      if (valor >= 0) {
        return valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }
    },
  },

  methods: {
    fecthProdutos() {
      fetch("./api/produtos.json")
        .then((r) => r.json())
        .then((r) => (this.produtos = r));
    },
    fetchProduto(id) {
      fetch(`/api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((r) => (this.produto = r));
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.produto = false;
    },
    adicionaCarrinho() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.ativaMensagem(`${nome} foi adicinado ao carrinho`);
    },
    removerCarrinho(index) {
      this.carrinho.splice(index, 1);
    },
    recuperarCarrinhoStorage() {
      if (window.localStorage.carrinho)
        this.carrinho = JSON.parse(window.localStorage.carrinho);
    },
    ativaMensagem(mensagem) {
      this.mensagemAlerta = mensagem;
      this.statusMensagem = true;
      setTimeout(() => {
        this.statusMensagem = false;
      }, 1500);
    },
    router() {
      const rota = document.location.hash;
      if (rota) {
        this.fetchProduto(rota.replace("#", ""));
      }
    },
  },
  watch: {
    produto() {
      document.title = `Tecno - ${this.produto.id}` || "Tecno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      if (document.title === "Tecno - undefined") {
        document.title = "Tecno";
      }
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
  },
  created() {
    this.fecthProdutos();
    this.router();
    this.recuperarCarrinhoStorage();
  },
});
