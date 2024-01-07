// index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Replace the connection string with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://pk:pk@cluster0.8lulz4b.mongodb.net/?retryWrites=true&w=majority';
// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas', err);
    });

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isDeleted: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/register', async (req, res) => {
    try {
        // Handle registration logic (save user data to MongoDB Atlas)
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            isDeleted: false
        });

        console.log('User saved:', newUser);
        res.redirect('/users');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Error saving user');
    }
});

app.get('/users', async (req, res) => {
    try {
        // Fetch all users (including deleted ones)
        const users = await User.find();
        
        // Render HTML to display user data
        res.send(`
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        h1 {
            color: #333;
        }

        ul {
            list-style-type: none;
            padding: 0;
        }

        li {
            background-color: #fff;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        a {
            text-decoration: none;
            color: #3498db;
            margin-left: 10px;
        }

        a:hover {
            color: #2980b9;
        }
    </style>

            <h1>User List</h1>
            <ul>
                ${users.map(user => `<li>${user.username} - ${user.email} 
                    <a href="/delete/${user._id}">Delete</a></li>`).join('')}
            </ul>
            
        `);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});// index.js
// index.js

// ... (previous code)

// ... (previous code)
app.get('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID and update isDeleted to true
        const result = await User.deleteOne({ _id: userId }, { $set: { isDeleted: true } });

        if (result.deletedCount > 0) {
            res.redirect('/users');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});


// ... (previous code)

// Update user route
app.get('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (user) {
            // Render HTML form to update user data
            res.send(`
            <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }

                    h1 {
                        color: #333;
                    }

                    form {
                        max-width: 400px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: bold;
                    }

                    input {
                        width: 100%;
                        padding: 8px;
                        margin-bottom: 16px;
                        box-sizing: border-box;
                    }

                    button {
                        background-color: #4caf50;
                        color: #fff;
                        padding: 10px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: #45a049;
                    }
                </style>
                <h1>Update User</h1>
                <form action="/update/${userId}" method="post">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" value="${user.username}" required><br>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${user.email}" required><br>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" value="${user.password}" required><br>
                    <button type="submit">Update User</button>
                </form>
            `);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

// Handle update user data
app.post('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID and update data
        const result = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                }
            }
        );

        if (result.modifiedCount > 0) {
            res.redirect('/users');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
