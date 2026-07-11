require("dotenv").config()

const express = require("express")
const workoutRoutes = require("./routes/workouts")
const userRoutes = require("./routes/user")
const mongoose = require("mongoose")
const dns= require("node:dns/promises")
dns.setServers(["1.1.1.1"]);


//express app
const app = express()


//middleware
app.use(express.json())
app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

//routes
app.use("/api/workouts", workoutRoutes)
app.use("/api/user", userRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{

        //listen for requests
        app.listen(process.env.PORT, ()=>{
            console.log("Listening on port", process.env.PORT)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
