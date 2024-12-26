const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const mysql = require("mysql2");
const { error } = require("console");

const app = express();
const port = 3000;

//Middleware to parse JSON
app.use(express.json());
app.use(cors());//Allow request from any origin

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Kunal2005",
    port: 3306,
})

db.connect((err)=>{
    if(err){
    console.log("Error While connecting to DataBase!",err);
    return;
    }
    console.log("Connection to the DataBase is Successfull!");


    //Starting writing query
    db.query("CREATE DATABASE IF NOT EXISTS elearning", (err)=>{
        if(err){
            console.log("Error While Creating the DataBase",err);
            return;
        }
        console.log("Database Created Successfully!");

        //Use the Database
        db.changeUser({database: "elearning"},(err)=>{
            if(err){
                console.log("Error while changing the database!",err);
                return;
            }
            console.log("Database Changed Successfully!");

            //Creating table if not exists
            const creatingTable = `CREATE TABLE IF NOT EXISTS  student(
            name VARCHAR(255) NOT NULL,
            year INT NOT NULL,
            course VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            studentId INT NOT NULL,
            password VARCHAR(255) NOT NULL
            )`;

            db.query(creatingTable,(err)=>{
                if(err){
                    console.log("Error while creating table",err);
                    return;
                }
                console.log("First Table Created Successfully!");
            });
            const second_query = `CREATE TABLE IF NOT EXISTS teachers(
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            teacherId INT NOT NULL,
            subject VARCHAR(255) NOT NULL,
            department VARCHAR(255) NOT NULL
            )`;
            db.query(second_query,(err)=>{
                if(err){
                    console.log("Error While creating second Table");
                    return;
                }
                console.log("Second table Created Successfully");
            })
        });
    });
});

//Endpoint for student login
app.post("/student",(req,res)=>{
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({error: "Username and password Required!"});
    }

    //Query to fire
    const query = "SELECT * FROM student WHERE studentId = ? AND password = ?";
    db.query(query,[username,password],(err,result)=>{
        if(err){
            console.log("Error in Server File");
            return res.status(500).json({error: "Database Error in Server file:"});
        }

        //If user not found
        if(result.length == 0){
            return res.status(400).json({success: false,error: 'Invalid Username and password'});
        }

        //If username is correct
        return res.status(200).json({success: true, message: "Login Successfull"});
    });
})
app.post("/teachers",(req,res)=>{
    const {username,password} = req.body; 
    
    if(!username || !password){
        return res.status(400).json({error: "Username and Password Required!"});
    }
    //Query to fire
    const query = "SELECT * FROM teachers WHERE teacherId = ? AND password = ?";
    db.query(query,[username,password],(err,result)=>{
        if(err){
            console.log("Error in Teacher!");
            return res.status(500).json({error: "DataBase query fail!"});
        }
        //If user not found
        if(result.length==0){
            return res.status(400).json({success: false, error: 'Invalid username and password!'});
        }
        //If user is correct
        return res.status(200).json({success: true, message: "Login Successfully!"});
    })
})



//Insert into Student Table
app.post("/register_stu",(req,res)=>{
    console.log("Request Received: ",req.body);
    const {name,email,password,studentId,year,course} = req.body;

    const query = "INSERT INTO student(name, year, course, email,studentId, password) VALUES(?, ?, ?, ?, ?, ?)";
    db.query(query,[name,year,course,email,studentId,password],(err,result)=>{
        if(err){
            console.log("Error while inserting value!",err);
            return res.status(400).json({error: "Database Error"});
        }
        res
            .status(200)
            .json({
                message: "Report added Successfully",
                reportId: result.insertId,
            });
    });
});

app.post("/register_tea",(req,res)=>{
    console.log("Received Request: ",req.body);
    const {name,email,password,teacherId,subject,department} = req.body;

    const query = "INSERT INTO teachers(name,email,password,teacherId,subject,department) VALUES(?,?,?,?,?,?)";
    db.query(query,[name,email,password,teacherId,subject,department],(err,result)=>{
        if(err){
            console.log("Error While Inserting value in Teachers Table");
            return res.status(400).json({error: "Inserting Error In Table"});
        }
        res
            .status(200)
            .json({
                message: "Report added Successfully",
                reportId: result.insertId,
            })
    })
})
//Starts the server
app.listen(port,()=>{
    console.log("Server Starts Successfully");
})