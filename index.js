const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())


// const uri = "mongodb+srv://abujayed007:@cluster0.yyytqsz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb+srv://abujayed007:Xbj8Mj2ePcGQSKyr@cluster0.yyytqsz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        await client.connect();
        const projectCollection = client.db('portfolio').collection('projects')


        app.post('/project', async (req, res) => {
            const project = req.body
            const result = await projectCollection.insertOne(project)
            res.send(result)
        })

        app.get('/project', async (req, res) => {
            const query = req.body
            const data = projectCollection.find(query)
            const result = await data.toArray();
            res.send(result); 
        })
        // app.get('/project', async (req, res) => {
        //     try {
        //         const query = req.body
        //       const projects = await projectCollection.find(query).sort({ createdAt: -1 });
        //       res.json(projects);
        //     } catch (error) {
        //       res.status(500).send('Server error');
        //     }
        //   });

        app.get('/project/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await projectCollection.findOne(query)
            res.send(result)
        })

        app.patch('/project/:id', async (req, res) => {
            const id = req.params.id
            const userData = req.body
            const query = { _id: new ObjectId(id) }
            const updateData = { $set: userData }
            const filter = { upsert: true }
            const result = await projectCollection.updateOne(query, updateData, filter)
            res.send(result)
        })

        app.delete('/project/:id', async (req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await projectCollection.deleteOne(query)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('App Running')
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
