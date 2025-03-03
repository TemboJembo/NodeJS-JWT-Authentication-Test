const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const secretKey = 'Super Secret Key';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

const PORT = 3000;

let users=[
    {
        id: 1,
        username: 'thomas',
        password: '123'
    },
    {
        id: 2,
        username: 'benfield',
        password: '456'
    }
]

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    
    for(let user of users){
        if(username == user.username && password == user.password){
            let token = jwt.sign({id: user.id, username: user.username }, secretKey, { expiresIn: '7d'});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }else{
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or Password is Incorrect'
            });
        }
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            err
        });
    }else{
        next(err);
    }
});

app.listen(PORT, () => {
    console.log('Serving on port ${PORT}');
});