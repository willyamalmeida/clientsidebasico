var app = { paginas: { departamento: {} } };

app.paginas.departamento.index = function($el) {
    if (!$el) {
        throw ("Elemento não definido.")
    }

    this.$el = $el;
    this.db = new bd("listaDeDepartamentos");
    
    $(this.$el).data('paginas-departamento-index', this);

    this.inicialize();
};

app.paginas.departamento.index.prototype = {    
    inicialize: function() {
        // mapear os campos
        this.$elFiltro = this.$el.parentElement.querySelector("[name='filtro']");
        this.$elPesquisar = this.$el.parentElement.querySelector("[name='pesquisar']");

        this.$elGrid = this.$el.parentElement.querySelector('[name="grid"]');
        this.$elTbody = this.$el.parentElement.querySelector('[name="grid"] tbody');
        this.$elTotal = this.$el.parentElement.querySelector('[name="grid"] tfoot span'); 

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
        
        $(this.$elGrid).on('click', 'tbody .item', function(e) {
            var id = e.target.parentElement.querySelector("td").innerText;
            location = "editar.html?id=" + id;
        });

        // this.$elGrid.querySelectorAll('tbody .item').forEach(function(item) {
        //     item.addEventListener("click", function(e) {
        //         var id = e.target.parentElement.querySelector("td").innerText;
        //         location = "editar.html?id=" + id;
        //     });
        // });
        
        this.$elFiltro.addEventListener("keyup", function() {    
            _this.pesquisar();
        });

        //this.$elFiltro.addEventListener("keyup", () => this.pesquisar() );
        
        this.$elPesquisar.addEventListener("click", function(){
            _this.pesquisar(); 
        });
    },

    preencheGrid: function(lista) {        
        lista = lista.sort(x => x.id);
        
        var strTbody = lista.reduce(function(linha, departamento){
            linha = linha
            .concat("<tr class='item'>")
            .concat("<td>").concat(departamento.id).concat("</td>")
            .concat("<td>").concat(departamento.descricao).concat("</td>")
            .concat("</tr>")
            
            return linha;
        }, "");
        
        this.$elTbody.innerHTML = strTbody.concat("<tr><td></td><td></td></tr>");
        this.$elTotal.innerText = lista.length;    
    },

    pesquisar: function() {
        var filtro = this.$elFiltro.value.toLocaleUpperCase();
        var listaDeDepartamentos = this.db.obtenhaLista();
        var lista = listaDeDepartamentos.filter(x => x.descricao.toLocaleUpperCase().startsWith(filtro) || x.id.toString().toLocaleUpperCase().startsWith(filtro));
        
        this.preencheGrid(lista);
    }
};