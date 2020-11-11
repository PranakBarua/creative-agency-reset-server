const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8xwq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static('doctors'));


const port = 5000;
app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const reviewCollection = client.db("creativeAgency").collection("review");
  const serviceCollection = client.db("creativeAgency").collection("service");
  const adminCollection = client.db("creativeAgency").collection("admin");
  const enrollServiceCollection = client.db("creativeAgency").collection("shipment");

  app.post("/addReview",(req,res)=>{
    const review=req.body
    console.log(review)
    reviewCollection.insertOne(review)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
  });

  app.get('/reviews',(req,res)=>{
    reviewCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
    
  })

  app.get('/services',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
    
  })

  app.post('/serviceByTitle',(req,res)=>{
    const title = req.body.title;
    serviceCollection.find({ title: title })
    .toArray((err,documents)=>{
        res.send(documents)
    })
    
  })

  app.post('/ServiceEnrollByCustomer', (req, res) => {
    const email = req.body.email;
    enrollServiceCollection.find({ email: email })
        .toArray((err, documents) => {
            res.send(documents);
        })
  })

  app.post('/addService', (req, res) => {
    const file=req.files.file;
    const title=req.body.title;
    const description=req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        console.log( title, description, image )

        serviceCollection.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
  })

  app.post("/shipment",(req,res)=>{
    const shipment=req.body
    console.log(shipment)
    enrollServiceCollection.insertOne(shipment)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
  });

  app.get('/allServices',(req,res)=>{
    enrollServiceCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
    
  })

  app.post("/addAdmin",(req,res)=>{
    const admin=req.body
    console.log(admin)
    adminCollection.insertOne(admin)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
  });

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })

});


app.listen(process.env.PORT || port)






// const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
// client.connect(err => {
//   const appointmentCollection = client.db("doctorsPortal").collection("appointments");
//   const doctorCollection = client.db("doctorsPortal").collection("doctors");
  
//   app.post("/addAppointment",(req,res)=>{
//       const appointment=req.body
//       console.log(appointment)
//       appointmentCollection.insertOne(appointment)
//       .then(result=>{
//           res.send(result.insertedCount>0)
//       })

//   });

//   app.post('/AppointmentsByDate',(req,res)=>{
//     const date=req.body
//     const email=req.body.email
//     console.log(date)
//     doctorCollection.find({email:email})
//     .toArray((err,doctors)=>{
//         console.log(doctors)
//         const filter={date:date.date}
//         if(doctors.length===0){
//             filter.email=email
//         }
//         appointmentCollection.find(filter)
//         .toArray((err,documents)=>{
//             console.log(documents)
//         res.send(documents)
//     })
//     })
    
    
//   })

//   app.get('/patients',(req,res)=>{
//     appointmentCollection.find({})
//     .toArray((err,documents)=>{
//         res.send(documents)
//     })
    
//   })

//   app.post('/addDoctor', (req, res) => {
//     const file=req.files.file;
//     const name=req.body.name;
//     const email=req.body.email;
//     const newImg = file.data;
//     const encImg = newImg.toString('base64');

//         var image = {
//             contentType: file.mimetype,
//             size: file.size,
//             img: Buffer.from(encImg, 'base64')
//         };
//         console.log( name, email, image )

//         doctorCollection.insertOne({ name, email, image })
//             .then(result => {
//                 res.send(result.insertedCount > 0);
//             })
//   })

//   app.get('/doctors', (req, res) => {
//     doctorCollection.find({})
//         .toArray((err, documents) => {
//             res.send(documents);
//         })
//   });

//   app.post('/isDoctor', (req, res) => {
//     const email = req.body.email;
//     doctorCollection.find({ email: email })
//         .toArray((err, doctors) => {
//             res.send(doctors.length > 0);
//         })
// })
// app.delete("/delete/:id",(req,res)=>{
//     const eventId=req.params.id.toString()
//     console.log(eventId)
//     eventCollection.deleteOne({_id:ObjectId(req.params.id)})
//     .then(result=>{
//       console.log(result)
//       res.send(result.deletedCount>0)
//     })
//   })

// });