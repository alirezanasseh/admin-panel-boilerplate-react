Object.defineProperty(String.prototype, "isEmail", {
    value: function () {
        const email = this
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});


Object.defineProperty(Object.prototype, "isEmpty", {
    value: function () {
        return Object.keys(this).length === 0
    }
});


Object.defineProperty(Object.prototype, "getKey", {
    value: function (key, def = undefined) {
        return this[key] || def
    }
});


Object.defineProperty(Object.prototype, "removeKey", {
    value: function (key) {
        delete this[key];
        return this
    }
});

Object.defineProperty(Object.prototype, "change", {
    value: function (key, value) {
        return {...this, [key]: value}
    }
});

Object.defineProperty(Object.prototype, "changeBatch", {
    value: function (object) {
        return {...this, ...object}
    }
});

Object.defineProperty(Array.prototype, "change", {
    value: function (inx, object) {
        const newTodos = [...this];
        newTodos[inx] = {...newTodos[inx], ...object};
        return newTodos
    }
});