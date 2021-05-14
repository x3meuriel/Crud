
const cors = require('cors')
const express = require('express');
const knex = require('knex');  
const dotenv = require('dotenv').config()


const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
  });


  const { Client } = require('pg');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  client.connect();
  
  client.query(`CREATE TABLE public.crud_app_tb
  (
      name character varying(100) COLLATE pg_catalog."default" NOT NULL,
      email character varying(100) COLLATE pg_catalog."default" NOT NULL,
      country character varying(100) COLLATE pg_catalog."default" NOT NULL
  )`, (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });
  
 


  

const app = express(); 
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/', express.static(__dirname +'/frontend'))
app.use(cors()) 






app.post('/search', (req, res)=>{
    const {name, email, country} = req.body;

    console.log(name, email, country);

    // changing request to lowercase
    const username = name.toLowerCase();
    const userEmail = email.toLowerCase();
    const userCountry= country.toLowerCase()
    
    // if request data is incomplete
    if(!name && !email && !country){
        return res.status(400).json('incomplete data')
    }
    else{
        try{
            db('crud_app_tb').where({name: username, email: userEmail, country: userCountry}).select('*').then(
              data =>{
                if(data[0].name){
                    res.status(200).json({message: 'success', data: data[0]}) }
                else{
                  res.status(500).json({message: 'error fetching record, try again'})
                }
              })      
            .catch(err=>{
              res.status(404).json({message: "record not found"})
            })
        }
        catch(err){
          res.status(500).json({message: 'error fetching record, try again'})
        }    
    }
})

app.put('/update', (req, res)=>{

    const {name, email, country} = req.body;
    //changing the request tolowercase
    const username = name.toLowerCase();
    const userEmail = email.toLowerCase();
    const userCountry= country.toLowerCase()

    // if request data is incomplete
    if(!name && !email && !country){
        return res.status(400).json('incomplete data')
    }
    else{
    db('crud_app_tb')
        .where('email', '=', userEmail)
        .update({
         name: name,
        //  email: userEmail,
         country: country
        }).then(data=>{
            try{
                if(data == 1){
                  res.status(200).json({message: "update successful", data: data[0]})
                 
                }
                else if(data.length == 0){
                  console.log(data)
                  res.status(400).json("email not in record")
                }
                else{
                  res.status(400).json("email not in record")
                }
                
            }
            catch (err){
                res.status(400).json('unable to update, try again')
            }
        })
        .catch(err=>{
          res.status(500).json({message: 'error updating record, try again'})
        })
    }
})


app.post('/insert', (req, res)=>{
    const {name, email, country} = req.body;
    // changing requests to lowerCase
    const username = name.toLowerCase();
    const userEmail = email.toLowerCase();
    const userCountry= country.toLowerCase()

    // if request data is incomplete
    if(!name && !email && !country){
        return res.status(400).json('incomplete data')
    }
    else{
        db('crud_app_tb').returning("*").insert({name: username, email: userEmail, country: userCountry}).then(
            data=>{
                 try{
                     if(data[0]){
                          res.status(200).json({message: "success", data: data[0]})
                     }
                 }
                 catch (err){
                     res.status(500).json('something went wrong, try again')
                 }  
            }
        )
        .catch(err=>{
          res.status(400).json({message: 'unsuccessful, try again'})
        })
    }
})

app.delete('/delete', (req, res)=>{
    const {name, email, country} = req.body;
    // changing requests to lowerCase
    const username = name.toLowerCase();
    const userEmail = email.toLowerCase();
    const userCountry= country.toLowerCase()
    
    // if request data is incomplete
    if(!name && !email && !country){
        return res.status(400).json('incomplete data')
    }
    else{
         db('crud_app_tb')
        .where('email', userEmail)
        .del().then(data=>{
          res.status(200).json({message: "record deleted", data: data})
        })
        .catch(err=>{
            res.status(400).json({message: 'delete not successful, try again'})
        })
    }
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
  console.log(` APP is running on port ${PORT}`) 
})