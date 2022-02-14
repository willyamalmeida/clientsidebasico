bd = function (chave) {
    if (!chave) {
        throw ("A chave não foi informado.");
    }

    this.chave = chave;
    this.inicialize();
};

bd.prototype = {
    inicialize: function () {
        if (!localStorage.getItem(this.chave)) {
            this.atualizeLocalStorage([]);
        }

        this.lista = this.obtenhaLista();
    },


    valideItemCadastrado: function(id) {
        var item = this.obtenhaItemPorId(id);

        if(!item) {
            throw("O item com id " + id + " não existe.");
        }
    },

    salvar: function (item, callbackParaUpdate) {
        if(!item) {
            throw("O item não pode ser nulo.");
        }

        var ehNovoItem = item.id === 0;
        var lista = this.obtenhaLista();

        if (ehNovoItem) {
            item.id = this.obtenhaProximoId(lista);
            lista.push(item);
        }
        else {
            var itemAtualizado = this.obtenhaItem(lista, item.id);
            callbackParaUpdate(itemAtualizado);
        }

        this.atualizeLocalStorage(lista);
    },

    atualizeLocalStorage: function(lista) {
        var novaLista = JSON.stringify(lista);
        localStorage.setItem(this.chave, novaLista);
    },

    obtenhaLista: function () {
        var listaBd = localStorage.getItem(this.chave);
        var lista = JSON.parse(listaBd);

        return lista;
    },

    obtenhaItemPorId: function (id) {
        var lista = this.obtenhaLista();
        var item = this.obtenhaItem(lista, id);

        return item;
    },

    obtenhaItem: function(lista, id) {
        var item = lista.find(function(x) { return x.id === Number(id); });
        return item;
    },

    obtenhaProximoId: function(lista) {
        var listaDeIds = lista.reduce(function(ids, item) {
            ids.push(item.id);
            return ids;
        }, [0]);

        var maiorId = listaDeIds.reduce(function(a, b) {
             return Math.max(a, b);
        });

        var proximoId = maiorId + 1;

        return proximoId;
    },

    exclueTodos: function () {
        localStorage.removeItem(this.chave);
    },

    removeItem: function (id) {
        this.valideItemCadastrado(id);

        var lista = this.obtenhaLista();
        var item = this.obtenhaItemPorId(id);

        lista.pop(item);

        this.atualizeLocalStorage(lista);
    }
};