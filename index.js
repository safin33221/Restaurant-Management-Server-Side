const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 8080
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


//middle Ware
app.use(cors())
app.use(express.json())




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



        //get Foods Data from DB
        app.get('/foods', async (req, res) => {
            const search = req.query.search
            let query = {
                foodName: {
                    $regex: search, $options: 'i'
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
        app.get('/my-foods/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await foodCollection.find(query).toArray()
            res.send(result)
        })

        //add Foods data in db
        app.post('/foods', async (req, res) => {
            const foodData = req.body
            const result = await foodCollection.insertOne(foodData)
            res.send(result)
        })

        //add Food parchase data in DB
        app.post('/food-parchase', async (req, res) => {
            const parchaseData = req.body
            const result = await foodParchaseColleciton.insertOne(parchaseData)
            res.send(result)
        })

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


        //delete food from foodcollection
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await foodCollection.deleteOne(filter)
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
