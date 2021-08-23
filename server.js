
const express= require('express');
const cors= require('cors');
const axios= require('axios');
require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT=process.env.PORT

const mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGO_DB}`, {useNewUrlParser: true, useUnifiedTopology: true});


//============================================================2=======================================================
// const drinkSchema= new mongoose.Schema({
//     drinkName: String,
//     drinkImg: String
// })

// const ownerSchema= new mongoose.Schema({
//     userEmail: String,
//     drinks: [drinkSchema],
// })

// const ownerModel= mongoose.model('drinkss', ownerSchema);


// //Routes

// // http://localhost:3008/
// // server.get('/test', testHandler);

// server.get(`/getAllDrinks`, getAllDrinksHandler);
// server.post(`/addDrinksR`, addDrinksHandler);
// server.get(`/getFavDrinksR`, getFavDrinksHandler);
// // server.delete(`/deletDinksR/:idx`, deletdrinksHandler);
// // server.put(`/updateDrinks/:idx`, updateDrinksHandler);



// // handlers

// // http://localhost:3008/getAllDrinks
// function getAllDrinksHandler(req,res){
// const URL=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`
//     axios
//     .get(URL)
//     .then(result => {
//        res.send(result.data.drinks);
//     })
// }

// // http://localhost:3008/addDrinksR
// function addDrinksHandler(req,res){
//   const {userEmail, drinkObj} = req.body;

//   ownerModel.findOne({userEmail: userEmail}, (err, result)=>{
//         if(!result){
//             const newOwner= new ownerModel({
//                 userEmail: userEmail,
//                 drinks: [drinkObj]
//             })
//             newOwner.save();
//         }else {
//             result.drinks.unshift(drinkObj);
//             result.save();
//         }      
//     })

// }

// // http://localhost:3008/getFavDrinksR
// function getFavDrinksHandler(req,res){
//     const {userEmail} = req.query;

//     ownerModel.findOne({userEmail:userEmail}, (err, result)=>{
//        res.send(result.drinks);
//     })

// }


// // function testHandler(req,res){
// //     res.send('hello f RR')
// // }


// server.listen(PORT,()=>{
//     console.log(`listning on port ${PORT}`)
// })


//====================================================================1================================================
const drinkSchema = new mongoose.Schema({
    drinkName: String,
    drinkImg: String,
})

const ownerSchema= new mongoose.Schema({
    userEmail: String,
    drinks: [drinkSchema]
})

const ownerModel = mongoose.model('drinkss',ownerSchema);


// http://localhost:3008/test
server.get('/test',testHandler);

// get from API
// http://localhost:3008/getallDrinks
server.get('/getallDrinks', getallDrinksHandler);

// serve frontend by add data to database
//http://localhost:3008/addDrink
server.post('/addDrink', addDrinkHandler);


// get fav data from database to frontend
// http://localhost:3008/favDrinksR
server.get('/favDrinksR', getFavDrinkHandler);

// http://localhost:3008/deleteDrinkR/:idx
server.delete('/deleteDrinkR/:idx', DeleteDrinkHandler);

// http://localhost:3008/updateDrinkR/:idx
server.put('/updateDrinkR/:idx', updatDrinkHandler);



// handlers
function updatDrinkHandler(req,res){
    const {idx} = req.params;
    const {userEmail, drinkObj} = req.body; // drinkObj === (drinkName + drinkImg) jdad
    ownerModel.findOne({userEmail: userEmail}, (err, result)=> {
        if(err) console.log(err);
        else{
            result.drinks[idx]= drinkObj;
            result.save().then(
                res.send(result.drinks)
                // () => {
                //     ownerModel.findOne({userEmail: userEmail}, (err,result)=>{
                //         if (err) console.log(err);
                //         else{
                //             console.log('in update', result.drinks);
                //             res.send(result.drinks);
                //         }
                //     })
                // }
            )
        }
    })

}

function DeleteDrinkHandler(req,res){
 const {idx} = req.params;
 const {userEmail} = req.query;

 ownerModel.findOne({userEmail: userEmail}, (err, result)=> {
     if (err) console.log(err);
     else{
         result.drinks.splice(idx,1);
         result.save().then(
            res.send(result.drinks)
            //  ()=>{
            //      ownerModel.findOne({userEmail: userEmail}, (err,result)=>{
            //          if(err) console.log(err);
            //          else{
            //              res.send(result.drinks);
            //          }
            //      })
            //  }
         );
     }
 })
}

// get from database and send it to databse
function getFavDrinkHandler(req,res){
    const {userEmail} = req.query;
  
    ownerModel.findOne({userEmail: userEmail}, (err, result)=>{
      if(err) console.log(err);
      else{
          res.send(result.drinks)
      }
    })
  }

// add fav to database
function addDrinkHandler(req,res){
    const {userEmail, drinkObj} = req.body;

    ownerModel.findOne({userEmail: userEmail},(err,result)=>{
        // if (err) console.log(err)
         if (!result){ // not same user
            const newOwner=new ownerModel({
                userEmail: userEmail,
                drinks: [drinkObj],
            })
            newOwner.save();
            //console.log('in if else', result)
        }else {
            result.drinks.unshift(drinkObj); // unshift mtl push bs bdef 3 awl l array
            result.save();
            // console.log('in else', result)
        }
    })
}


function getallDrinksHandler(req,res){
    const URL=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    axios.get(URL)
    .then(result => {
        res.send(result.data.drinks);
    })
    .catch();
}


function testHandler(req,res){
    res.send('helo from root')
}


server.listen(PORT, () => {
console.log(`listning on port ${PORT}`)
})