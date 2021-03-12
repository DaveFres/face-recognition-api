const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'dave',
      password : '',
      database : 'smart-brain'
    }
});

console.log(db.select('*').from('users').then(data => console.log(data)));

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {

    const { email, name, password } = req.body;

    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(() => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    database.users.forEach(user => {
        if (user.id === id) {
            // как только находим нужного юзера --- выходим из цикла возвращая его
            return res.json(user);
        }
    });
    res.status(400).json('not found');

});

app.put('/image', (req, res) => {
    const { id } = req.body;
    database.users.forEach(user => {
        if (user.id === id) {
            user.entries++;
            return res.json(user.entries);
        }
    });

    res.status(400).json('not found');
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
