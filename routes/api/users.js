const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { checkIfAuthenticatedJWT } = require('../../middlewares');

const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign({
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email
    }, secret, {
        expiresIn: expiresIn
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User, BlacklistedToken } = require('../../models');

router.post('/login', async (req, res) => {
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    })

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        // const userObject = {
        //     'email': user.get('email'),
        //     'id': user.get('id')
        // }

        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '1h');
        let refreshToken = generateAccessToken(user, process.env.REFRESH_TOKEN_SECRET, '7d');
        let user_id = user.get('id');

        res.status(200);
        res.send({
            accessToken, refreshToken, id:user_id, first_name:user.first_name, last_name: user.last_name
        })
    } else {
        res.status(204);
        res.send("Wrong email or password");
    }
});

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    let user = await User.where({
        'id': req.user.id
    }).fetch({
        require: true
    });

    res.send(user)
})

router.post('/refresh', async(req,res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '1h');
        res.send({
            accessToken
        });
    })
})

router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();
            token.set('token', refreshToken);
            token.set('date_created', new Date());
            await token.save();
            res.send({
                'message': 'logged out'
            })
        })
    }
})

router.post('/register', async (req, res) => {
    let user = new User({
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'email': req.body.email,
        'password': req.body.password
    })

    await user.save()
    res.send(user);
})

router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    }

    // check if the refresh token has been blacklisted
    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })

    // check if the refresh token has already been blacklisted
    if (blacklistedToken) {
        res.status(401);
        return res.send('The refresh token has already been expired');
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '1h');
        res.send({
            accessToken
        })
    })
})

module.exports = router;