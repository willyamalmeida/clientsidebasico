app = { paginas: { funcionario: {} } };
app.paginas.funcionario.index = function($el) {
    if (!$el) {
        throw("Element não definido");
    }

    this.$el = $el;
    this.db = new bd("listaDeFuncionarios");

    this.inicialize();
};

app.paginas.funcionario.index.prototype = {
    inicialize: function() {
        this.$elGrid = this.$el.parentElement.querySelector("[name='grid']");
        this.$elTotal = this.$elGrid.parentElement.querySelector("tfoot > tr > th > span");

        this.carregueGrid();
        this.ligaEventos();
    },

    carregueGrid: function() {
        var elTbody = this.$elGrid.parentElement.querySelector("tbody");
        var lista = this.db.obtenhaLista();
        var tbody = lista.reduce(function(linha, funcionario) {
            linha = linha.concat("<tr class='item'><td>"
                .concat(funcionario.id).concat("</td><td>")
                .concat(funcionario.nome).concat("</td><td>")
                .concat(funcionario.departamento.descricao).concat("</td></tr>"));
            return linha;
        }, "");

        elTbody.innerHTML = tbody.concat("<tr><td></td><td></td><td></td></tr>");
        this.$elTotal.innerText = lista.length;
    },

    ligaEventos: function() {
        this.$elGrid.querySelectorAll("tbody .item").forEach(function(row) {
            row.addEventListener("click", function(e) {
                var id = e.target.parentElement.querySelector("td").innerText;
                location = "editar.html?id=".concat(id);
            });
        });
    }
}