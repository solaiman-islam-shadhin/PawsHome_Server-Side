import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  })
});

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

let Pets, Donations, Adoptions, Users;

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    Pets = client.db("PawsHome").collection("Pets");
    Donations = client.db("PawsHome").collection("Donations");
    Adoptions = client.db("PawsHome").collection("Adoptions");
    Users = client.db("PawsHome").collection("Users");

    app.get('/api/pets', async (req, res) => {
        try {
          const { page = 1, limit = 10, search = '', category = '' } = req.query;
          const query = { adopted: false };
          
          if (search) query.name = { $regex: search, $options: 'i' };
          if (category) query.category = { $regex: category, $options: 'i' };
          
          const pageNum = parseInt(page);
          const limitNum = parseInt(limit);
          const skip = (pageNum - 1) * limitNum;
          const result = await Pets.find(query).skip(skip).limit(limitNum).toArray();
          const total = await Pets.countDocuments(query);
          const totalPages = Math.ceil(total / limitNum);
          
          res.send({ 
            data: result, 
            total, 
            totalPages, 
            currentPage: pageNum,
            nextPage: pageNum < totalPages ? pageNum + 1 : null
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/pets/user/my-pets', auth, async (req, res) => {
        try {
          const { page = 1, limit = 10 } = req.query;
          const query = { owner: req.user.uid };
          
          const pageNum = parseInt(page);
          const limitNum = parseInt(limit);
          const skip = (pageNum - 1) * limitNum;
          const result = await Pets.find(query).skip(skip).limit(limitNum).toArray();
          const total = await Pets.countDocuments(query);
          const totalPages = Math.ceil(total / limitNum);
          
          res.send({ 
            data: result, 
            total, 
            totalPages, 
            currentPage: pageNum,
            nextPage: pageNum < totalPages ? pageNum + 1 : null
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/pets/admin/all', auth, async (req, res) => {
        try {
          const result = await Pets.find().toArray();
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/pets/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await Pets.findOne(query);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/pets', auth, async (req, res) => {
        try {
          const pet = { ...req.body, owner: req.user.uid, adopted: false, createdAt: new Date() };
          const result = await Pets.insertOne(pet);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.put('/api/pets/:id', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updatedPet = req.body;
          const updateDoc = { $set: updatedPet };
          const result = await Pets.updateOne(filter, updateDoc);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.patch('/api/pets/:id/adopted', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const pet = await Pets.findOne(filter);
          const updateDoc = { $set: { adopted: !pet.adopted } };
          const result = await Pets.updateOne(filter, updateDoc);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.delete('/api/pets/:id', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await Pets.deleteOne(query);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/donations', async (req, res) => {
        try {
          const { page = 1, limit = 10, search = '' } = req.query;
          const query = { isPaused: false };
          
          if (search) query.petName = { $regex: search, $options: 'i' };
          
          const pageNum = parseInt(page);
          const limitNum = parseInt(limit);
          const skip = (pageNum - 1) * limitNum;
          const result = await Donations.find(query).skip(skip).limit(limitNum).toArray();
          const total = await Donations.countDocuments(query);
          const totalPages = Math.ceil(total / limitNum);
          
          res.send({ 
            data: result, 
            total, 
            totalPages, 
            currentPage: pageNum,
            nextPage: pageNum < totalPages ? pageNum + 1 : null
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/donations/user/my-campaigns', auth, async (req, res) => {
        try {
          const query = { creator: req.user.uid };
          const result = await Donations.find(query).toArray();
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/donations/user/my-donations', auth, async (req, res) => {
        try {
          const allDonations = await Donations.find().toArray();
          const filtered = allDonations.map(campaign => ({
            ...campaign,
            donations: campaign.donations?.filter(d => d.donor === req.user.uid) || []
          })).filter(c => c.donations.length > 0);
          res.send(filtered);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/donations/admin/all', auth, async (req, res) => {
        try {
          const result = await Donations.find().toArray();
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/donations/:id/recommended', async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: { $ne: new ObjectId(id) }, isPaused: false };
          const result = await Donations.find(query).limit(3).toArray();
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/donations/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await Donations.findOne(query);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/donations', auth, async (req, res) => {
        try {
          const donation = { ...req.body, creator: req.user.uid, isPaused: false, currentAmount: 0, donations: [], createdAt: new Date() };
          const result = await Donations.insertOne(donation);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.put('/api/donations/:id', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updatedDonation = req.body;
          const updateDoc = { $set: updatedDonation };
          const result = await Donations.updateOne(filter, updateDoc);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.patch('/api/donations/:id/pause', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const donation = await Donations.findOne(filter);
          const updateDoc = { $set: { isPaused: !donation.isPaused } };
          const result = await Donations.updateOne(filter, updateDoc);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.delete('/api/donations/:id', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await Donations.deleteOne(query);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/donations/:id/donate', auth, async (req, res) => {
        try {
          const { id } = req.params;
          const { amount } = req.body;
          
          const user = await Users.findOne({ uid: req.user.uid });
          
          const donationRecord = {
            donor: req.user.uid,
            donorName: user?.name || req.user.email,
            donorPhoto: user?.photoURL,
            amount: parseFloat(amount),
            donatedAt: new Date(),
            refundRequested: false
          };
          
          const result = await Donations.updateOne(
            { _id: new ObjectId(id) },
            { 
              $push: { donations: donationRecord },
              $inc: { currentAmount: parseFloat(amount) }
            }
          );
          
          res.send({ success: true, message: 'Donation recorded', result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.patch('/api/donations/:id/refund', auth, async (req, res) => {
        try {
          const { id } = req.params;
          const { donor } = req.body;
          
          const result = await Donations.updateOne(
            { _id: new ObjectId(id), 'donations.donor': donor },
            { 
              $set: { 'donations.$.refundRequested': true }
            }
          );
          
          res.send({ success: true, message: 'Refund requested', result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/adoptions/my-requests', auth, async (req, res) => {
        try {
          const query = { adopter: req.user.uid };
          const result = await Adoptions.find(query).toArray();
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/adoptions/for-my-pets', auth, async (req, res) => {
        try {
          const query = { petOwner: req.user.uid };
          const result = await Adoptions.find(query).toArray();
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/adoptions', auth, async (req, res) => {
        try {
          const { petId, phoneNumber, address } = req.body;
          
          const pet = await Pets.findOne({ _id: new ObjectId(petId) });
          const user = await Users.findOne({ uid: req.user.uid });
          
          const adoption = {
            petId: new ObjectId(petId),
            petName: pet?.name,
            petImage: pet?.image,
            adopter: req.user.uid,
            adopterName: user?.name || req.user.email,
            adopterEmail: req.user.email,
            adopterPhone: phoneNumber,
            adopterAddress: address,
            petOwner: pet?.owner,
            status: 'pending',
            createdAt: new Date()
          };
          
          const result = await Adoptions.insertOne(adoption);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.patch('/api/adoptions/:id/accept', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updateDoc = { $set: { status: 'accepted' } };
          const result = await Adoptions.updateOne(filter, updateDoc);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.patch('/api/adoptions/:id/reject', auth, async (req, res) => {
        try {
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) };
          const updateDoc = { $set: { status: 'rejected' } };
          const result = await Adoptions.updateOne(filter, updateDoc);
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/users/profile', auth, async (req, res) => {
        try {
          const user = await Users.findOne({ uid: req.user.uid });
          res.send(user || { uid: req.user.uid, email: req.user.email });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.put('/api/users/profile', auth, async (req, res) => {
        try {
          const filter = { uid: req.user.uid };
          const updateDoc = { $set: { ...req.body, uid: req.user.uid } };
          const result = await Users.updateOne(filter, updateDoc, { upsert: true });
          res.send(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/users', auth, async (req, res) => {
        try {
          const result = await Users.find().toArray();
          const usersWithDefaults = result.map(user => ({
            ...user,
            isActive: user.isActive !== false
          }));
          res.send(usersWithDefaults);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.patch('/api/users/:id/make-admin', auth, async (req, res) => {
        try {
          const filter = { _id: new ObjectId(req.params.id) };
          const updateDoc = { $set: { role: 'admin' } };
          const result = await Users.updateOne(filter, updateDoc);
          res.send({ success: true, message: 'User promoted to admin', result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.patch('/api/users/:id/ban', auth, async (req, res) => {
        try {
          const filter = { _id: new ObjectId(req.params.id) };
          const updateDoc = { $set: { isActive: false } };
          const result = await Users.updateOne(filter, updateDoc);
          res.send({ success: true, message: 'User banned', result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/auth/register', auth, async (req, res) => {
        try {
          const userData = {
            uid: req.user.uid,
            email: req.user.email,
            name: req.body.name,
            photoURL: req.body.photoURL,
            role: 'user',
            isActive: true,
            createdAt: new Date()
          };
          
          const filter = { uid: req.user.uid };
          const updateDoc = { $set: userData };
          const result = await Users.updateOne(filter, updateDoc, { upsert: true });
          
          res.send({ success: true, user: userData });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/auth/me', auth, async (req, res) => {
        try {
          const user = await Users.findOne({ uid: req.user.uid });
          res.send({ id: req.user.uid, email: req.user.email, ...user });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/health', (req, res) => {
        res.send({ message: 'Server running', status: 'OK' });
    });

    app.get('/', (req, res) => {
        res.send('PawsHome API Server is Running!');
    });

    app.listen(port, () => {
        console.log(`PawsHome server listening on port ${port}`);
    });

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
})();
