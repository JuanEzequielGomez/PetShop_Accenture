const { createApp } = Vue

createApp({
    data() {
        return {
            urlApi: "https://apipetshop.herokuapp.com/api/articulos",
            backUpArticulos: [],
            articulos: [],
            categorias: [],
            detalleArt: [],
            carrito: [],
            filtro: '',
            busqueda: '',
            msjCarrito: {
                clases: {
                    display: 'd-none',
                    color: 'danger'
                },
                msj:''
            }
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
                    this.backUpArticulos = data.response;
                    let juguetes = data.response.filter((articulo) => articulo.tipo == "Juguete");
                    let farmacia = data.response.filter((articulo) => articulo.tipo == 'Medicamento');
                    let path = location.pathname;

                    switch(true){
                        case path.includes('jugueteria'):
                            this.backUpArticulos = juguetes;
                            break;
                        case path.includes('farmacia'):
                            this.backUpArticulos = farmacia;
                            break;
                        case path.includes('detalle'):
                            let id = new URLSearchParams(location.search).get("_id");
                            this.detalleArt = data.response.find((articulo) => articulo._id == id);
                            break;
                        /* case path.includes('past'):
                            break; */
                    }
                    
                    this.articulos = this.backUpArticulos;



                })
        },
        addItem(event) {
            if(!this.carrito.some(element => element.nombre == event.nombre)){
                this.carrito.push(event);
                this.carrito[this.carrito.length - 1].unit = 1;
                this.msjCarrito.clases.display = 'd-flex';
                this.msjCarrito.clases.color = 'alert-success';
                this.msjCarrito.msj = 'Se agrego el producto al carrito.';
                setTimeout(() => {
                    this.msjCarrito.clases.display = 'd-none';
                }, 1500);
            } else {
                this.carrito.map(prod => {
                    if(prod.nombre == event.nombre && prod.unit < event.stock){
                        prod.unit += 1;
                        this.msjCarrito.clases.display = 'd-flex';
                        this.msjCarrito.clases.color = 'alert-success';
                        this.msjCarrito.msj = 'Se ha sumado una unidad al carrito.';
                        setTimeout(() => {
                            this.msjCarrito.clases.display = 'd-none';
                        }, 1500);
                    } else {
                        this.msjCarrito.clases.display = 'd-flex';
                        this.msjCarrito.clases.color = 'alert-danger';
                        this.msjCarrito.msj = 'No hay mas unidades en stock.';
                        setTimeout(() => {
                            this.msjCarrito.clases.display = 'd-none';
                        }, 1500);
                    }
                    //prod.nombre == event.nombre  ? prod.unit += 1 : ''
                })
            }
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        deleteItem(event) {
            this.carrito = this.carrito.filter(eventf => eventf != event);
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        deleteCart() {
            this.carrito.length = 0;
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        eduContador(){
            return this.carrito.reduce((acc, prod) => acc + prod.unit, 0);
        },
        sendForm() {
            Swal.fire({
                title: 'Formulario enviado!',
                text: 'Gracias por su tiempo.',
                icon: 'success',
                confirmButtonText: 'Continúe'
            }).then((result) =>{
                location.reload()
            })
        },
        sendFormLog() {
            Swal.fire({
                icon: 'error',
                title: 'Ups...',
                text: '¡Sección en construcción!',
                }).then((result) =>{
                    location.reload()
            })
        },
        sendFormReg() {
            Swal.fire({
                position: 'center-center',
                icon: 'success',
                title: 'Registro realizado con éxito',
                showConfirmButton: false,
                timer: 1500
            }).then((result) =>{
                location.reload()
            })
        },
        suscriptionForm() {
            Swal.fire({
                title: '¡Suscripción realizada!',
                text: '¡Muchas gracias!',
                width: 800,
                padding: '3em',
                color: '#8F584D',
                background: '#fff url("https://img.freepik.com/vector-gratis/fondo-vida-silvestre-acuarela_23-2149425667.jpg?w=2000")',
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("https://i.pinimg.com/originals/ca/63/06/ca6306b31bc56423fd716406deed3b3d.gif")
                  left center
                  no-repeat
                `
              })
        }

        
    },
    
    computed: {
        sort() {
            switch(this.filtro) {
                case 'menor':
                    this.articulos.sort((a, b) => a.precio - b.precio);
                break;
                case 'mayor':
                    this.articulos.sort((a, b) => b.precio - a.precio);
                break;
                case 'A - Z':
                    this.articulos.sort((a, b) => {
                        if(a.nombre == b.nombre) {
                            return 0; 
                        }
                        if(a.nombre < b.nombre) {
                            return -1;
                        }
                        return 1;
                    });
                break;
                case 'Z - A':
                    this.articulos.sort((a, b) => {
                        if(a.nombre == b.nombre) {
                            return 0; 
                        }
                        if(a.nombre > b.nombre) {
                            return -1;
                        }
                        return 1;
                    });
                break;
            }
        },
        superFiltro() {
            let filter1 = this.backUpArticulos.filter(event => event.nombre.toLowerCase().includes(this.busqueda.toLowerCase().trim()));
            /* let filter2 = this.checksOn.length > 0 ? filter1.filter(event => this.checksOn.includes(event.category)) : filter1; */
            this.articulos = filter1;
        }      
    }
}).mount('#app')