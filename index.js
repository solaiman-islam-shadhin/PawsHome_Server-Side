import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Firebase setup
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  })
});

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@assignmetn-10.is3vjll.mongodb.net/?retryWrites=true&w=majority&appName=Assignmetn-10`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Collections
const Pets = client.db("PawsHome").collection("Pets");
const Donations = client.db("PawsHome").collection("Donations");
const Adoptions = client.db("PawsHome").collection("Adoptions");
const Users = client.db("PawsHome").collection("Users");

// Pet APIs
app.get('/api/pets', async (req, res) => {
    const result = await Pets.find({ adopted: false }).toArray();
    res.send({ data: result, total: result.length });
});

app.get('/api/pets/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Pets.findOne(query);
    res.send(result);
});

app.get('/api/pets/user/my-pets', auth, async (req, res) => {
    const query = { owner: req.user.uid };
    const result = await Pets.find(query).toArray();
    res.send({ data: result, total: result.length });
});

app.get('/api/pets/admin/all', auth, async (req, res) => {
    const result = await Pets.find().toArray();
    res.send(result);
});

app.post('/api/pets', auth, async (req, res) => {
    const pet = { ...req.body, owner: req.user.uid, adopted: false, createdAt: new Date() };
    const result = await Pets.insertOne(pet);
    res.send(result);
});

app.put('/api/pets/:id', auth, async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedPet = req.body;
    const updateDoc = { $set: updatedPet };
    const result = await Pets.updateOne(filter, updateDoc);
    res.send(result);
});

app.patch('/api/pets/:id/adopted', auth, async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const pet = await Pets.findOne(filter);
    const updateDoc = { $set: { adopted: !pet.adopted } };
    const result = await Pets.updateOne(filter, updateDoc);
    res.send(result);
});

app.delete('/api/pets/:id', auth, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Pets.deleteOne(query);
    res.send(result);
});

// Donation APIs
app.get('/api/donations', async (req, res) => {
    const result = await Donations.find({ isPaused: false }).toArray();
    res.send({ data: result, total: result.length });
});

app.get('/api/donations/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Donations.findOne(query);
    res.send(result);
});

app.get('/api/donations/user/my-campaigns', auth, async (req, res) => {
    const query = { creator: req.user.uid };
    const result = await Donations.find(query).toArray();
    res.send(result);
});

app.get('/api/donations/user/my-donations', auth, async (req, res) => {
    const query = { 'donations.donor': req.user.uid };
    const result = await Donations.find(query).toArray();
    res.send(result);
});

app.get('/api/donations/admin/all', auth, async (req, res) => {
    const result = await Donations.find().toArray();
    res.send(result);
});

app.get('/api/donations/:id/recommended', async (req, res) => {
    const id = req.params.id;
    const query = { _id: { $ne: new ObjectId(id) }, isPaused: false };
    const result = await Donations.find(query).limit(3).toArray();
    res.send(result);
});

app.post('/api/donations', auth, async (req, res) => {
    const donation = { ...req.body, creator: req.user.uid, isPaused: false, currentAmount: 0, donations: [], createdAt: new Date() };
    const result = await Donations.insertOne(donation);
    res.send(result);
});

app.put('/api/donations/:id', auth, async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDonation = req.body;
    const updateDoc = { $set: updatedDonation };
    const result = await Donations.updateOne(filter, updateDoc);
    res.send(result);
});

app.patch('/api/donations/:id/pause', auth, async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const donation = await Donations.findOne(filter);
    const updateDoc = { $set: { isPaused: !donation.isPaused } };
    const result = await Donations.updateOne(filter, updateDoc);
    res.send(result);
});

app.delete('/api/donations/:id', auth, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Donations.deleteOne(query);
    res.send(result);
});

app.post('/api/donations/:id/donate', async (req, res) => {
    res.send({ success: true, message: 'Donation processed' });
});

app.delete('/api/donations/:id/refund', async (req, res) => {
    res.send({ message: 'Refund processed' });
});

// Adoption APIs
app.get('/api/adoptions/my-requests', auth, async (req, res) => {
    const query = { adopter: req.user.uid };
    const result = await Adoptions.find(query).toArray();
    res.send(result);
});

app.get('/api/adoptions/for-my-pets', auth, async (req, res) => {
    const query = { petOwner: req.user.uid };
    const result = await Adoptions.find(query).toArray();
    res.send(result);
});

app.post('/api/adoptions', auth, async (req, res) => {
    const adoption = { ...req.body, adopter: req.user.uid, status: 'pending', createdAt: new Date() };
    const result = await Adoptions.insertOne(adoption);
    res.send(result);
});

app.patch('/api/adoptions/:id/accept', auth, async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: { status: 'accepted' } };
    const result = await Adoptions.updateOne(filter, updateDoc);
    res.send(result);
});

app.patch('/api/adoptions/:id/reject', auth, async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: { status: 'rejected' } };
    const result = await Adoptions.updateOne(filter, updateDoc);
    res.send(result);
});

// User APIs
app.get('/api/users/profile', async (req, res) => {
    res.send({ message: 'User profile' });
});

app.put('/api/users/profile', async (req, res) => {
    res.send({ message: 'Profile updated' });
});

app.get('/api/users', auth, async (req, res) => {
    const result = await Users.find().toArray();
    res.send(result);
});

app.patch('/api/users/:id/make-admin', async (req, res) => {
    res.send({ message: 'User promoted to admin' });
});

app.patch('/api/users/:id/ban', async (req, res) => {
    res.send({ message: 'User banned' });
});

// Auth APIs
app.post('/api/auth/register', auth, async (req, res) => {
    res.send({ message: 'User registered', user: req.user });
});

app.get('/api/auth/me', auth, async (req, res) => {
    res.send({ id: req.user.uid, email: req.user.email });
});

// Health check
app.get('/api/health', (req, res) => {
    res.send({ message: 'Server running', status: 'OK' });
});

app.get('/', (req, res) => {
    res.send('PawsHome API Server is Running!')
});

app.listen(port, () => {
    console.log(`PawsHome server listening on port ${port}`);
});
