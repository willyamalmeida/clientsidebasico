bd = function(chave) {
    if(!chave) {
        throw ("A chave não foi informado.")
    }

    this.chave = chave;
}

bd.prototype = {
    obtenhaLista: function() {
        var listaBd = localStorage.getItem(this.chave);

        if (!listaBd) {            
            this._atualizeLocalStorage([]);
        }

        var lista = listaBd ? JSON.parse(listaBd) : [];

        return lista;        
    },

    obtenhaItemPorId: function(id) {
        var lista = this.obtenhaLista();
        var item = lista.find(x => x.id == Number(id));
        
        return item;
    },

    obtenhaItem: function(filtro) {
        var lista = this.obtenhaLista();
        var item = lista.find(filtro);

        return item;
    },

    exclueLista: function() {
        this._atualizeLocalStorage([]);
    },

    exclue: function(id) {        
        var lista = this.obtenhaLista();          
        var novaLista = lista.filter(x => x.id != id);
    
        this._atualizeLocalStorage(novaLista);
    },

    salvar: function(item, callbackParaAtualizar) {
        if (!item) {
            throw("O item não pode ser nulo.")
        }

        var ehNovoItem = Number(item.id) === 0;
        var lista = this.obtenhaLista();
        
        if (ehNovoItem) {            
            var maiorId = lista && lista.length > 0 ? Math.max(...lista.map(x => x.id)) : 0;
            item.id = maiorId + 1;

            lista.push(item);            
        } else {
            var id = Number(item.id);
            var itemJaCadastrado = lista.find(x => x.id == id);
            callbackParaAtualizar(itemJaCadastrado);
        }
        
        this._atualizeLocalStorage(lista);
    },

    _atualizeLocalStorage: function(lista) {
        var novaLista = JSON.stringify(lista);
        localStorage.setItem(this.chave, novaLista);
    }
}