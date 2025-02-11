let txtNombre = document.getElementById("Name");    //Campo input del Nombre del producto
let txtNumber = document.getElementById("Number");  //Campo input de la cantidad del producto

let btnAgregar = document.getElementById("btnAgregar"); //Botón Agregar
let btnClear = document.getElementById("btnClear");     //Botón Limpiar todo

let alertValidacionesTexto = document.getElementById("alertValidacionesTexto"); //Texto que aparece dentro de la alerta
let alertValidaciones = document.getElementById("alertValidaciones");           //Recuadro rojo que aparece (alerta)

let tabla = document.getElementById("tablaListaCompras");   //Encabezado de la tabla (Fila 1)
let cuerpoTabla = tabla.getElementsByTagName("tbody");      //Tabla que se llenará con los productos que se agreguen.

let contadorProductos = document.getElementById("contadorProductos");  //Contador (Suma) de líneas de productos diferentes 
let productosTotal = document.getElementById("productosTotal");        //Contador (Suma( de cantidad de productos
let precioTotal = document.getElementById("precioTotal");              //Suma  de precios

let isValid = true;
let idTimeout;
let precio = 0; //Variable global: Que puedes acceder desde cualquier parte del archivo.
let contador = 0;
let totalEnProductos = 0;
let costoTotal = 0;

let datos = []; //Arreglo vacío --> Aquí se almacenarán los datos de la tabla

// Botón Limpiar todo:
btnClear.addEventListener("click", function(event){
    event.preventDefault();
    txtNombre.value="";
    txtNumber.value="";
    cuerpoTabla[0].innerHTML="";

    contador = 0;
    totalEnProductos = 0;
    costoTotal = 0;
    contadorProductos.innerText="0";
    productosTotal.innerText="0";
    precioTotal.innerText="$ 0";

    localStorage.setItem("contadorProductos", contador);
    localStorage.setItem("totalEnProductos", totalEnProductos);
    localStorage.setItem("costoTotal", costoTotal.toFixed(2));

});

function validarCantidad(){
    if(txtNumber.value.length==0){
        return false;
    }

    if (isNaN(txtNumber.value)){
        return false;
    }

    if (parseFloat(txtNumber.value)<=0){
        return false;
    }

    return true;
}

function getPrecio(){
    return Math.floor(Math.random() *50 *100) / 100; //.floor quita los decimales
}

btnAgregar.addEventListener("click", function(event){
    event.preventDefault();
    isValid = true;
    // console.log(getPrecio());
    clearTimeout(idTimeout);
    alertValidacionesTexto.innerHTML="";    //Limpia el Alert en cada click
    alertValidaciones.style.display="none"; //La oculta
    // console.log("borde: ", txtNombre.style.border); //Muestra en la consola el estilo de un elemento.
    
    // txtNombre.value = txtNombre.value.trim();       //Borra los espacios al principio y al final
    
    let lista = "Los siguientes campos deben ser llenados correctamente: <ul> ";
    if(txtNombre.value.length<2){
        txtNombre.style.border="solid thin red";    //Se pone rojo si el usuario da click y el input está vacío
        lista += "<li>Se debe escribir un nombre válido</li>";
        // alertValidacionesTexto.innerHTML="Se debe escribir un nombre válido";
        alertValidaciones.style.display="block";
        isValid = false;
    }else{
        txtNombre.style.border="";                  //Quitarle el estilo cuando el input es diferente de cero.
    }
    
    if(! validarCantidad()){    // El signo ! significa "==false"
        txtNumber.style.border="solid thin red";
        lista += "<li>Se debe escribir una cantidad válida</li>";
        // alertValidacionesTexto.innerHTML+="Se debe escribir una cantidad válida";
        alertValidaciones.style.display="block";
        isValid = false;
    }else{
        txtNumber.style.border="";
    }
    lista += "</ul>"
    alertValidacionesTexto.insertAdjacentHTML("beforeend", lista);
    idTimeout=setTimeout (function(){       //La variable se agregó como referencia a la tarea.
        alertValidaciones.style.display="none";
     }, 3000);    //La función se va a ejecutar después de 3000mseg.||
     
     if (isValid){
     precio = getPrecio();
     contador ++; 

     //Si se pone th en vez de td lo pone en negritas y centrado;
     //table row, table header, table data(columna)
     let row = ` <tr>
                    <th>${contador}</th>      
                    <td>${txtNombre.value}</td>
                    <td>${txtNumber.value}</td>
                    <td>${precio}</td>
                </tr>`;

    //Aquí se convierte un arreglo a un objeto (con JSON):
    //elemento es un objeto
    let elemento =  `{
                        "id"       :  ${contador},  
                        "nombre"   : "${txtNombre.value}",
                        "cantidad" : "${txtNumber.value}",
                        "precio"   : "${precio}" 
                        }`;
    datos.push(JSON.parse(elemento)); //datos es un arreglo

    localStorage.setItem("datos", JSON.stringify(datos));  //stringify convierte un arreglo a string.
                        //Llave , //Valor                  //Cada llave y su valor se guardan en el localStorage como string.  

     cuerpoTabla[0].insertAdjacentHTML("beforeend", row);
     contadorProductos.innerText=contador;
     totalEnProductos += parseFloat(txtNumber.value);
     productosTotal.innerText= totalEnProductos;
     costoTotal += precio * parseFloat(txtNumber.value);
     precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`;

     //Esto se agregó después.
     let resumen = `{"contadorProductos" : ${contador},                         
                    "totalEnProductos"   : ${totalEnProductos},
                    "costoTotal"         : ${costoTotal.toFixed(2)} }`;
    localStorage.setItem("resumen", resumen);

    //  localStorage.setItem("contadorProductos", contador);                   //Primero se había realizado esta manera
    //  localStorage.setItem("totalEnProductos", totalEnProductos);
    //  localStorage.setItem("costoTotal", costoTotal.toFixed(2));
     
     txtNombre.value ="";
     txtNumber.value ="";
     txtNombre.focus();
     }
 });

txtNumber.addEventListener("blur", function(event){        //evento blur: perder el foco --> salirse del campo
    event.preventDefault();
    txtNumber.value = txtNumber.value.trim();
});

txtNombre.addEventListener("blur", function(event){        //evento blur: perder el foco --> salirse del campo
    event.preventDefault();
    txtNombre.value = txtNombre.value.trim();
});

window.addEventListener("load", function(event){    //Evento de que se cargue una ventana
 //Esto se agregó:
    if (this.localStorage.getItem("resumen") == null ) {
        let resumen = `{"contadorProductos" : ${contador},
        "totalEnProductos"  :  ${totalEnProductos},
        "costoTotal"        :  ${costoTotal.toFixed(2)} }`;
        this.localStorage.setItem("resumen", resumen);
   }//if
   let res = JSON.parse(localStorage.getItem("resumen"));
   if (this.localStorage.getItem("datos") !== null ) {
        datos = JSON.parse(this.localStorage.getItem("datos"));
  
        datos.forEach(r => {
            let row = ` <tr>
            <th>${r.id}</th>      
            <td>${r.nombre}</td>
            <td>${r.cantidad}</td>
            <td>${r.precio}</td>
        </tr>`;

        cuerpoTabla[0].insertAdjacentHTML("beforeend", row);

        });
  
    }//!=null (Si es diferente de null)

   //Esto estaba antes:
    // if (localStorage.getItem("contadorProductos")==null){     //Estos if son para el caso de que se haya borrado el localStorage, al actualizar la página no muestre NaN y en vez de eso muestre ceros
    //     localStorage.setItem("contadorProductos", "0");
    // }
    // if (localStorage.getItem("totalEnProductos")==null){
    //     localStorage.setItem("totalEnProductos", "0");
    // }
    // if (localStorage.getItem("costoTotal")==null){
    //     localStorage.setItem("costoTotal", "0.0");
    // }

    //Esto se agregó y lo que estaba antes se comentó:
    contador = res.contadorProductos;// parseInt(localStorage.getItem("contadorProductos"));
    totalEnProductos = res.totalEnProductos; // parseInt(localStorage.getItem("totalEnProductos"));
    costoTotal = res.costoTotal; //parseFloat(localStorage.getItem("costoTotal"));
         
    contadorProductos.innerText=contador;
    productosTotal.innerText=totalEnProductos;
    precioTotal.innerText=`$ ${costoTotal}`;

});


//En el localStorage todo se almacena como string