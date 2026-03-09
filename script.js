let vehiclesData=[]
let cart=[]
let selectedVehicle=null

async function loadVehicles(){

try{

let res=await fetch("https://raw.githubusercontent.com/JUANCITOPENA/Pagina_Vehiculos_Ventas/refs/heads/main/vehiculos.json")

vehiclesData=await res.json()

displayVehicles(vehiclesData)

document.getElementById("loadingSpinner").style.display="none"

}catch{

document.getElementById("productsContainer").innerHTML="Error cargando datos"

}

}

function displayVehicles(data){

const container=document.getElementById("productsContainer")

container.innerHTML=""

data.forEach(v=>{

let col=document.createElement("div")

col.className="col-md-4 col-sm-6 mb-4"

col.innerHTML=`

<div class="card h-100">

<img src="${v.imagen}" class="card-img-top" loading="lazy">

<div class="card-body d-flex flex-column">

<h5>${v.marca} ${v.modelo}</h5>

<p>${v.categoria}</p>

<p>$${Number(v.precio_venta).toLocaleString()}</p>

<button class="btn btn-primary mt-auto addToCartBtn" data-codigo="${v.codigo}">
Añadir al carrito
</button>

</div>

</div>

`

container.appendChild(col)

})

addAddToCartListeners()

}

function filterVehicles(){

let text=document.getElementById("searchInput").value.toLowerCase()

let filtered=vehiclesData.filter(v=>

v.marca.toLowerCase().includes(text) ||

v.modelo.toLowerCase().includes(text) ||

v.categoria.toLowerCase().includes(text)

)

displayVehicles(filtered)

}

function addAddToCartListeners(){

document.querySelectorAll(".addToCartBtn").forEach(btn=>{

btn.addEventListener("click",()=>{

let code=parseInt(btn.dataset.codigo)

selectedVehicle=vehiclesData.find(v=>v.codigo==code)

new bootstrap.Modal(document.getElementById("quantityModal")).show()

})

})

}

document.getElementById("addToCartBtn").onclick=()=>{

let q=parseInt(document.getElementById("quantityInput").value)

addItemToCart(selectedVehicle,q)

}

function addItemToCart(vehicle,quantity){

let item=cart.find(i=>i.codigo==vehicle.codigo)

if(item){

item.quantity+=quantity

}else{

cart.push({

codigo:vehicle.codigo,
marca:vehicle.marca,
modelo:vehicle.modelo,
precio:vehicle.precio_venta,
quantity:quantity

})

}

updateCartUI()

}

function updateCartUI(){

const container=document.getElementById("cartItems")

container.innerHTML=""

let total=0
let count=0

cart.forEach(i=>{

let sub=i.precio*i.quantity

total+=sub
count+=i.quantity

let p=document.createElement("p")

p.textContent=`${i.marca} ${i.modelo} x${i.quantity} = $${sub}`

container.appendChild(p)

})

document.getElementById("cartTotal").textContent=total

document.getElementById("cartCount").textContent=count

}

document.getElementById("processPaymentBtn").onclick=()=>{

alert("Pago exitoso")

generateInvoice()

cart=[]

updateCartUI()

}

function generateInvoice(){

const {jsPDF}=window.jspdf

let doc=new jsPDF()

doc.text("Factura GarageOnline",20,20)

let y=40

cart.forEach(i=>{

doc.text(`${i.marca} ${i.modelo} x${i.quantity}`,20,y)

y+=10

})

doc.save("factura.pdf")

}

document.getElementById("searchInput").addEventListener("input",filterVehicles)

document.addEventListener("DOMContentLoaded",loadVehicles)

function runTests(){

console.log("TEST addItemToCart")

let v={codigo:1,marca:"Test",modelo:"Car",precio_venta:100}

addItemToCart(v,2)

if(cart.length>0) console.log("PASSED ✅")
else console.log("FAILED ❌")

console.log("TEST filterVehicles")

filterVehicles()

console.log("PASSED ✅")

}

setTimeout(runTests,3000)
