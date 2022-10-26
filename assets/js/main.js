const { createApp } = Vue

createApp({
    data() {
        return {
            articulos: [],
            backUpArticulos: [],
            urlApi: "https://apipetshop.herokuapp.com/api/articulos",
            categorias: [],
            articulosFarmacia: [],
            articulosJugueteria: [],

        }
    },
    created() {
        this.traerDatos()
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
                        this.articulos = data.response.find((articulo) => articulo._id == id);
                        console.log(articulos)
                    }


                })
        }
        
    },

    computed: {

    },

}).mount('#app')
