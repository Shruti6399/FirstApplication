//defining the packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const mailchimp = require('@mailchimp/mailchimp_marketing');
require("dotenv").config();


const app= express();

//applying static files
app.use(express.static("public"))



//configuring the port number to listen 
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is up and runnning");
})


//connecting it to the html page
app.get("/" , function(req , res){
    res.sendFile(__dirname + "/signup.html");
})

const apiKey = process.env.API_KEY

const list_Id = process.env.LIST_ID

const server = process.env.API_SERVER

//defining config for mailchimp
// mailchimp.setConfig({
//     apiKey: "c98cb1e58a9f0475f3ce316fabb8ce2e-us12",
//     server: "us12"
//   });


//required below to fetch the data from the user 
app.use(bodyParser.urlencoded({extended : true}));

app.post("/" , function(req , res){
    const listId = list_Id;
    const subscriber = {
         firstname : req.body.fname,
         lastname : req.body.lname,
         email : req.body.email
    }

    // console.log(firstname . secondname . email)
    
    async function run(){
        try{
            const response = await mailchimp.lists.addListMember(listId , {
                email_address :subscriber.email,
                status: "subscribed",
                merge_fields:{
                    FNAME :subscriber.firstname,
                    LNAME : subscriber.lastname
                }
            })
            
            res.sendFile(__dirname + "/success.html");
            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
              );
        }
        catch{
            console.log("error")
            res.sendFile(__dirname +"/faiure.html")
        }
    }

    run();

})

app.post("/failure" , function(req , res){
    res.sendFile(__dirname + "/signup.html")
})
