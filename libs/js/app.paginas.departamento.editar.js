var app = { paginas: { departamento: {} } };

app.paginas.departamento.editar = function($el) {
    if (!$el) {
        throw ("Elemento não definido.")
    }

    this.$el = $el;
    this.db = new bd("listaDeDepartamentos");
    
    this.$el.data('paginas-departamento-editar', this);

    this.inicialize();
};

app.paginas.departamento.editar.prototype = {    
    inicialize: function() {
        // mapear os campos
        this.$elSalvar = this.$el.find("[name='salvar']");
        this.$elExcluir = this.$el.find("[name='excluir']");       
        this.$elCancelar = this.$el.find("[name='cancelar']");

        this.$elId = this.$el.find("[name='id']");
        this.$elDescricao = this.$el.find("[name='descricao']");
        
        this.ehFluxoDeCadastro = true;

        // preparar componentes
        this.prepareComponentes();

        // ligar os eventos
        this.ligaEventos();
    },

    prepareComponentes: function() {
        this.preencheDadosDaTela();
        this.habiliteCampos();
    },

    ligaEventos: function() {
        var _this = this;

        this.$elSalvar.on('click', function () {
            _this.salvar();
            _this.voltarParaTelaInicial();
        });
                
        this.$elCancelar.on('click', function () {
            _this.voltarParaTelaInicial();
        });
        
        
        this.$elExcluir.on('click', function () {
            _this.excluir();
            _this.voltarParaTelaInicial();
        });
    },

    preencheDadosDaTela: function() {
        var id = window.location.search.replace("?","").split("=")[1];

        if (id) {               
            var departamento = this.db.obtenhaItemPorId(id);
            
            this.$elId.val(departamento.id);
            this.$elDescricao.val(departamento.descricao);
            
            this.ehFluxoDeCadastro = false;
        }
    },

    habiliteCampos: function() {
        if (this.ehFluxoDeCadastro) {
            this.$elExcluir.hide();
        }

        this.$elId.prop('disabled', true);
        this.$elId.prop('readOnly', true);
        this.$elDescricao.focus();
    },

    salvar: function() {
        var departamento = { 
            id: Number(this.$elId.val()),
            descricao: this.$elDescricao.val()
        };

        if (!departamento.descricao) {
            var mensagem = "O campo Descrição é obrigatório.";
            alert(mensagem);
            throw(mensagem);
        }
        
        this.db.salvar(departamento, departamentoParaAtualizar => departamentoParaAtualizar.descricao =  departamento.descricao);
    },

    excluir: function() {
        var id = Number(this.$elId.val())
        this.db.exclue(id);
    },
    
    voltarParaTelaInicial: function() {
        window.location = "index.html";
    }
};