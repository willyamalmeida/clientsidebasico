app = { paginas: { funcionario: {} } };
app.paginas.funcionario.editar = function($el) {
    if (!$el) {
        throw("Element não definido");
    }

    this.$el = $el;
    this.db = new bd("listaDeFuncionarios");
    this.dbDepartamento = new bd("listaDeDepartamentos");

    this.inicialize();
};

app.paginas.funcionario.editar.prototype = {
    inicialize: function() {
        this.$elSalvar = this.$el.parentElement.querySelector("[name='salvar']");
        this.$elExcluir = this.$el.parentElement.querySelector("[name='excluir']");
        this.$elCancelar = this.$el.parentElement.querySelector("[name='cancelar']");

        this.$elId = this.$el.parentElement.querySelector("[name='id']");
        this.$elNome = this.$el.parentElement.querySelector("[name='nome']");
        this.$elDepartamento = this.$el.parentElement.querySelector("[name='departamento']");

        this.preencheListaDeDepartamentos();

        if(location.search){
            this.preencheDados();
        }

        this.ligaEventos();
    },

    preencheListaDeDepartamentos: function() {
        var listaDeDepartamentos = this.dbDepartamento.obtenhaLista();
        var options = listaDeDepartamentos.reduce(function(opts, departamento){
            opts = opts
              .concat("<option value='")
              .concat(departamento.id)
              .concat("'>")
              .concat(departamento.descricao)
              .concat("</option>");
            return opts;
        }, "");

        this.$elDepartamento.innerHTML = "<option value='0'></option>".concat(options);
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
            var item = this.db.obtenhaItemPorId(data.id);
            this.$elNome.value = item.nome;

            var elOption = this.$elDepartamento.parentElement.querySelector("option[value='" + item.departamento.id + "']");

            if(elOption){
                elOption.selected = true;
            }
        }

        this.$elId.disabled = true;
        this.$elId.readOnly = true;
        this.$elNome.focus();
        this.$elExcluir.hidden = ehNovoItem;
    },

    valide: function(funcionario) {
        if (!funcionario.nome) {
            var msg = "O campo Nome é obrigatório";
            alert(msg);
            throw(msg);
        }

        if (!funcionario.departamento) {
            var msg = "O campo Departamento é obrigatório";
            alert(msg);
            throw(msg);
        }
    },

    salvar: function() {
        var funcionario = {
            id: Number(this.$elId.value),
            nome: this.$elNome.value,
            departamento: {}
        };

        var idDepartamento = this.$elDepartamento.selectedOptions[0].value;
        var departamento = this.dbDepartamento.obtenhaItemPorId(idDepartamento);
        funcionario.departamento = departamento;

        this.valide(funcionario);

        this.db.salvar(funcionario, function(item) {
            item.nome = funcionario.nome;
            item.departamento = funcionario.departamento;
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