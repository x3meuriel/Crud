

  
const username = document.getElementById('name') 
const email = document.getElementById('email')
const country = document.getElementById('country')  
const search = document.getElementById('search')
const update = document.getElementById('update')
const insert = document.getElementById('insert')
const del_record = document.getElementById('delete')

// console.log(search)
// console.log(username, email, country);

const data_req = {
    name: username.value,
    email: email.value,
    country: country.value
}

const addInput = ( event, input)=>{
 
    input.value = event.target.value;
    console.log(input.value)
}


username.addEventListener('change', (event)=>addInput(event, username))
email.addEventListener('change', (event)=>addInput(event, email))
country.addEventListener('change', (event)=>addInput(event, country))





const operation = (method, url, data)=>{
       
        const resp = document.getElementById('resp')
        const username = document.getElementById('name')
        const email = document.getElementById('email')
        const country = document.getElementById('country')  
        const response = document.getElementById('response')   
        
        data.name = username.value;
        data.email = email.value;
        data.country = country.value;
        console.log(data)
        let request = new Request(url, {
        method: method,
        body: JSON.stringify(data),
        headers: new Headers({"Content-Type": "application/json;charset=UTF-8"})
    
    })
    fetch(request)
    .then(resp=>resp.json())
    .then(record=>{
        response.style.color= 'green'
        response.innerHTML = record.message
        resp.style.color = 'blue';
        let jsonObj = JSON.parse(JSON.stringify(record.data)) 
        if(!jsonObj.name && !jsonObj.email && !jsonObj.country){
             resp.innerHTML = 'Done' 
        }
        
        resp.innerHTML = `name: ${jsonObj.name},  email:${jsonObj.email},  country: ${jsonObj.country}`
    })
}

const url = `http://localhost:4000`


search.addEventListener('click', (event)=>{event.preventDefault(); operation('POST', url+"/search", data_req)})
insert.addEventListener('click', (event)=>{event.preventDefault(); operation('POST', url+"/insert", data_req)})
update.addEventListener('click', (event)=>{event.preventDefault(); operation('PUT', url + "/update", data_req)})
del_record.addEventListener('click', (event)=>{event.preventDefault(); operation('DELETE', url+"/delete", data_req)})

