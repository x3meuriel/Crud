
const cors = require('cors')
const express = require('express');
const knex = require('knex');  
const dotenv = require('dotenv').config()


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'papacy',
      database : 'records'
    }
  });

const app = express(); 
app.use(express.json())
app.use('/frontend', express.static(__dirname +'/frontend'))
app.use(cors()) 






app.get('/search', (req, res)=>{
    const {name, userEmail, country} = req.body;
    if(!name && !userEmail && !country){
        return res.status(400).json('incomplete data')
    }
    else{
        // db.select('name', 'email','country').from('crud_app_tb')
        try{
            db('crud_app_tb').where({name: name, email: userEmail, country: country}).select('*').then(
              data =>{
                if(data[0].name){
                    res.status(200).json(data[0]) }
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
    const {name, userEmail, country} = req.body;
    if(!name && !email && !country){
        return res.status(400).json('incomplete data')
    }
    else{
    db('crud_app_tb').returning('*')
        .where('email', '=', userEmail)
        .update({
         name: name,
         email: userEmail,
         country: country
        }).then(data=>{
            try{
                if(data == 1){
                  res.status(200).json('update successful')
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
    const {name, userEmail, country} = req.body;
    if(!name && !email && !country){
        return res.status(400).json('incomplete data')
    }
    else{
        db('crud_app_tb').returning("*").insert({name: name, email: userEmail, country: country}).then(
            data=>{
                 try{
                     if(data[0]){
                          res.status(200).json(data[0])
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
    const {name, userEmail, country} = req.body;
    if(!name && !userEmail && !country){
        return res.status(400).json('incomplete data')
    }
    else{
         db('crud_app_tb')
        .where('email', userEmail)
        .del().then(data=>{
          res.status(200).json({message: "record deleted"})
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