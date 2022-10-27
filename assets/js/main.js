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
        }
        
    },

    computed: {

    },

}).mount('#app')
