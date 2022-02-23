definaNamespace("app.paginas.funcionario.editar", this);

app.paginas.funcionario.editar = function($el) {
    if (!$el) {
        throw ("Elemento não definido.")
    }

    this.$el = $el;
    this.db = new bd("listaDeFuncionarios");
    this.dbDepartamento = new bd("listaDeDepartamentos");
    
    this.$el.data('paginas-funcionario-editar', this);

    this.inicialize();
};

app.paginas.funcionario.editar.prototype = {    
    inicialize: function() {
        // mapear os campos
        this.$elSalvar = this.$el.find("[name='salvar']");
        this.$elExcluir = this.$el.find("[name='excluir']");       
        this.$elCancelar = this.$el.find("[name='cancelar']");

        this.$elId = this.$el.find("[name='id']");
        this.$elNome = this.$el.find("[name='nome']");
        this.$elDepartamento = this.$el.find("[name='departamento']");
        
        this.ehFluxoDeCadastro = true;

        // preparar componentes
        this.prepareComponentes();

        // ligar os eventos
        this.ligaEventos();
    },

    prepareComponentes: function() {
        this.preencheListaDeDepartamentos();
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

    preencheListaDeDepartamentos: function() {
        var lista = this.dbDepartamento.obtenhaLista();
        
        lista = lista.sort(d => d.id);

        var options = lista.reduce(function(opts, departamento) {
            opts = opts
                .concat("<option value='").concat(departamento.id).concat("'>")
                .concat(departamento.id + " - " + departamento.descricao)
                .concat("</option>");
            
                return opts;                   
        }, "");

        this.$elDepartamento.html("<option value='0'></option>" + options);        
    },

    preencheDadosDaTela: function() {
        var id = window.location.search.replace("?","").split("=")[1];

        if (id) {               
            var funcionario = this.db.obtenhaItemPorId(id);
            
            this.$elId.val(funcionario.id);
            this.$elNome.val(funcionario.nome);

            var elSelecionado = this.$elDepartamento.find('option[value="'+ funcionario.departamento.id + '"]');
            
            if (elSelecionado) {
                elSelecionado.prop('selected', true);
            }
            
            this.ehFluxoDeCadastro = false;
        }
    },

    habiliteCampos: function() {
        if (this.ehFluxoDeCadastro) {
            this.$elExcluir.hide();
        }

        this.$elId.prop('disabled', true);
        this.$elId.prop('readOnly', true);
        this.$elNome.focus();
    },

    salvar: function() {
        var funcionario = { 
            id: Number(this.$elId.val()),
            nome: this.$elNome.val(),
            departamento: {}
        };

        if (!funcionario.nome) {
            var mensagem = "O campo Nome é obrigatório.";
            alert(mensagem);
            throw(mensagem);
        }

        var idDepartamento = Number(this.$elDepartamento.val());
        funcionario.departamento = this.dbDepartamento.obtenhaItemPorId(idDepartamento);
        
        this.db.salvar(funcionario, function(funcionarioParaAtualizar) {
            funcionarioParaAtualizar.nome =  funcionario.nome;
            funcionarioParaAtualizar.departamento = funcionario.departamento;
        });
    },

    excluir: function() {
        var id = Number(this.$elId.val())
        this.db.exclue(id);
    },
    
    voltarParaTelaInicial: function() {
        window.location = "index.html";
    }
};