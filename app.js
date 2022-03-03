const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
  },
  filters: {
    convertToBrl(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  methods: {
    fecthProdutos() {
      fetch("./api/produtos.json")
        .then((r) => r.json())
        .then((r) => (this.produtos = r));
    },
  },
  created() {
    this.fecthProdutos();
  },
});
