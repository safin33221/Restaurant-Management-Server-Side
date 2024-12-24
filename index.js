const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookieParse = require('cookie-parser')
const port = process.env.PORT || 8080
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


//middle Ware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParse())


const verifyToken = (req, res, next) => {
    console.log(req?.cookie?.token);
    const token = req?.cookies?.token
    if (!token) {
        return res.status(401).send({ message: "UnAuthorize Accessed" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "UnAuthorize Accessed" })
        }
        req.user = decoded

        next()
    })
}




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.blz8y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        //Data collection


        //FoodCollection
        const foodCollection = client.db('RestaurantManagement').collection('foods')

        //Food Parchase collection
        const foodParchaseColleciton = client.db('RestaurantManagement').collection('parchase')



        //Json web token api's
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '3h' })
            res.cookie('token', token, {
                httpOnly: true,
                secure: false

            }).send({ success: true })
        })

        app.post('/logOut', async (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: false
            }).send({ success: true })
        })

        //<<<<<<<<<<<<<< Get Oparation >>>>>>>>>>>>>>>>

        //get Foods Data from DB
        app.get('/foods', async (req, res) => {
            const search = req.query.search || ''
            let query = {
                foodName: {
                    $regex: search,
                    $options: 'i'
                }
            }

            const result = await foodCollection.find(query).toArray()
            res.send(result)
        })
        //get single food by id
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result)
        })
        //get food data by email
        app.get('/my-foods/:email', verifyToken, async (req, res) => {
            console.log(req?.cookies?.token)
            const email = req.params.email

            if (req.user.email !== req.params.email) {
                return res.status(403).send({ message: "Forbidden Access" })
            }
            const query = { email: email }
            const result = await foodCollection.find(query).toArray()
            res.send(result)
        })
        // get food parchase data from food parchase collection
        app.get('/food-parchase', verifyToken, async (req, res) => {
            const result = await foodParchaseColleciton.find().toArray()
            res.send(result)
        })




        //get food parchase ordered by email
        app.get('/parchases-food/:email', async (req, res) => {

            // if (req.user.email !== req.params.email) {
            //     return res.status(403).send({ message: "Forbidden Access" })
            // }
            const email = req.params.email
            const filter = { email: email }
            const result = await foodParchaseColleciton.find(filter).toArray()
            res.send(result)
        })

        //get top 6 parchased foods
        app.get('/top-foods', async (req, res) => {
            const result = await foodCollection.find().sort({ Purchase_count: -1 }).limit(6).toArray()
            res.send(result)
        })



        //<<<<<<<<<<<<<< Post Oparation >>>>>>>>>>>>>>>>

        //add Foods data in db
        app.post('/foods', verifyToken, async (req, res) => {

            const foodData = req.body
            const result = await foodCollection.insertOne(foodData)
            res.send(result)
        })

        //add Food parchase data in DB
        app.post('/food-parchase', async (req, res) => {

            const parchaseData = req.body
            const foodQuantity = parchaseData.quantity
            const foodId = parchaseData.foodId
            const result = await foodParchaseColleciton.insertOne(parchaseData)


            //update parchase count

            const filter = { _id: new ObjectId(foodId) }
            const updateDoc = {
                $inc: {
                    Purchase_count: foodQuantity,
                    quantity: -foodQuantity
                }
            }

            const updateParchaseCount = await foodCollection.updateOne(filter, updateDoc)
            res.send(result)
        })



        //<<<<<<<<<<<<<< Put Oparation >>>>>>>>>>>>>>>>

        //update data in foodcollection
        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id
            const newData = req.body
            const filter = { _id: new ObjectId(id) }


            const updateDoc = {
                $set: {
                    foodName: newData.foodName,
                    foodImage: newData.foodImage,
                    foodCategory: newData.foodCategory,
                    quantity: newData.quantity,
                    price: newData.price,
                    foodOrigin: newData.foodOrigin,
                    description: newData.description,
                }
            }
            const result = await foodCollection.updateOne(filter, updateDoc)
            res.send(result)

        })




        //<<<<<<<<<<<<<< Delete Oparation >>>>>>>>>>>>>>>>


        //delete food from foodcollection
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await foodCollection.deleteOne(filter)
            res.send(result)
        })
        //delete parchases food data
        app.delete('/food-parchase/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await foodParchaseColleciton.deleteOne(filter)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



//test 

app.get('/', (req, res) => {
    res.send(`server is running now`)
})

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})
