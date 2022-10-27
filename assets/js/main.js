const { createApp } = Vue

createApp({
    data() {
        return {
            urlApi: "https://apipetshop.herokuapp.com/api/articulos",
            backUpArticulos: [],
            articulos: [],
            articulosFarmacia: [],
            articulosJugueteria: [],
            categorias: [],
            detalleArt: [],
            carrito: []
        }
    },
    created() {
        this.traerDatos();
        if(localStorage.getItem('carrito')){
            this.carrito = JSON.parse(localStorage.getItem('carrito'));
        }
    },
    mounted() {

    },
    methods: {
        traerDatos() {
            fetch(this.urlApi).then(response => response.json())
                .then(data => {
                    this.articulos = data.response
                    if (document.title == "PLEM Farmacia") {
                        this.articulos = data.response.filter((articulo) => articulo.tipo == "Medicamento")
                    } else if (document.title == "PLEM Jugueteria") {
                        this.articulos = data.response.filter((articulo) => articulo.tipo == "Juguete")
                    } else if (document.title == "PLEM Detalle") {
                        let id = new URLSearchParams(location.search).get("_id");
                        this.detalleArt = data.response.find((articulo) => articulo._id == id);

                    }


                })
        },
        addItem(event) {
            if(!this.carrito.includes(event)){
                this.carrito.push(event)
                this.carrito[this.carrito.length - 1].unit = 1
            } else {
                this.carrito.map(prod => {
                    prod == event ? prod.unit += 1 : ''
                })
            }
            /* this.carrito.forEach(prod =>{
                if(prod.nombre == event.nombre) {
                    prod.unit += 1;
                } else {
                    this.carrito.push(event);
                    this.carrito[this.carrito.length - 1].unit = 1;
                }
            }) */
            console.log(this.carrito);
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        deleteItem(event) {
            this.carrito = this.carrito.filter(eventf => eventf != event);
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        deleteCart() {
            this.carrito.length = 0;
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        }
    },

    computed: {

    },

}).mount('#app')
