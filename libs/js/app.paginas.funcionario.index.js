definaNamespace("app.paginas.funcionario.index", this);

app.paginas.funcionario.index = function($el) {
    if (!$el) {
        throw ("Elemento não definido.")
    }

    this.$el = $el;
    this.db = new bd("listaDeFuncionarios");
    
    $(this.$el).data('paginas-funcionario-index', this);

    this.inicialize();
};

app.paginas.funcionario.index.prototype = {    
    inicialize: function() {
        // mapear os campos
        this.$elFiltro = this.$el.find("[name='filtro']");
        this.$elPesquisar = this.$el.find("[name='pesquisar']");

        this.$elGrid = this.$el.find('[name="grid"]');
        this.$elTbody = this.$el.find('[name="grid"] tbody');
        this.$elTotal = this.$el.find('[name="grid"] tfoot span'); 

        // preparar componentes
        this.prepareComponentes();

        // ligar os eventos
        this.ligaEventos();
    },

    prepareComponentes: function() {
        var lista = this.db.obtenhaLista();
        this.preencheGrid(lista);
    },

    ligaEventos: function() {
        var _this = this;
        
        this.$elGrid.on('click', 'tbody .item', function(e) {
            var id = e.target.parentElement.querySelector("td").innerText;
            location = "editar.html?id=" + id;
        });
        
        this.$elFiltro.on("keyup", function() {    
            _this.pesquisar();
        });

        this.$elPesquisar.on("click", function(){
            _this.pesquisar(); 
        });
    },

    preencheGrid: function(lista) {        
        lista = lista.sort(x => x.id);

        var strTbody = lista.reduce(function(linha, funcionario){
            linha = linha
            .concat("<tr class='item'>")
            .concat("<td>").concat(funcionario.id).concat("</td>")
            .concat("<td>").concat(funcionario.nome).concat("</td>")
            .concat("<td>").concat(funcionario.departamento.id + " - " + funcionario.departamento.descricao).concat("</td>")
            .concat("</tr>")
            
            return linha;
        }, "");
        
        this.$elTbody.html(strTbody.concat("<tr><td></td><td></td><td></td></tr>"));
        this.$elTotal.text(lista.length);    
    },

    pesquisar: function() {
        var filtro = this.$elFiltro.val().toUpperCase();
        var listaDeFuncionarios = this.db.obtenhaLista();
        var lista = listaDeFuncionarios.filter(x => x.nome.toLocaleUpperCase().startsWith(filtro) || x.id.toString().toLocaleUpperCase().startsWith(filtro));
        
        this.preencheGrid(lista);
    }
};