app = { paginas: { departamento: {} } };

app.paginas.departamento.editar = function($el) {
    if (!$el) {
        throw("Element não definido");
    }

    this.$el = $el;
    this.db = new bd("listaDeDepartamentos");

    this.inicialize();
};

app.paginas.departamento.editar.prototype = {
    inicialize: function() {
        this.$elSalvar = this.$el.parentElement.querySelector("[name='salvar']");
        this.$elExcluir = this.$el.parentElement.querySelector("[name='excluir']");
        this.$elCancelar = this.$el.parentElement.querySelector("[name='cancelar']");

        this.$elId = this.$el.parentElement.querySelector("[name='id']");
        this.$elDescricao = this.$el.parentElement.querySelector("[name='descricao']");

        if(location.search){
            this.preencheDados();
        }

        this.ligaEventos();
    },

    preencheDados: function() {
        var props = window.location.search.replace("?", "").split("&");
        var data = props.reduce(function(acc, x) {
            var y = x.split("=");
            acc[y[0]] = y[1];
            return acc; }, {});

        this.$elId.value = data.id;

        var ehNovoItem = Number(data.id) === 0;

        if(!ehNovoItem) {
            var departamento = this.db.obtenhaItemPorId(data.id);
            this.$elDescricao.value = departamento.descricao;
        }

        this.$elId.disabled = true;
        this.$elId.readOnly = true;
        this.$elDescricao.focus();
        this.$elExcluir.hidden = ehNovoItem;
    },

    valide: function(departamento) {
        if (!departamento.descricao) {
            var msg = "O campo Descrição é obrigatório.";
            alert(msg);
            throw(msg);
        }
    },

    salvar: function() {
        var departamento = {
            id: Number(this.$elId.value),
            descricao: this.$elDescricao.value
        };

        this.valide(departamento);

        this.db.salvar(departamento, function(item) {
            item.descricao = departamento.descricao;
        });
    },

    excluir: function() {
        this.db.removeItem(Number(this.$elId.value));
    },

    voltarParaTelaInicial: function() {
        window.location = "index.html";
    },

    ligaEventos: function() {
        var _this = this;

        this.$elSalvar.addEventListener("click", function() {
            _this.salvar();
            _this.voltarParaTelaInicial();
        });

        this.$elExcluir.addEventListener("click", function() {
            _this.excluir();
            _this.voltarParaTelaInicial();
        });

        this.$elCancelar.addEventListener("click", function() {
            _this.voltarParaTelaInicial();
        });
    }
}