const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User } = require('../models');
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');

router.get('/register', async (req, res) => {
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', async (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        success: async (form) => {
            const user = new User({
                'first_name': form.data.first_name,
                'last_name': form.data.last_name,
                'email': form.data.email,
                'password': getHashedPassword(form.data.password),
                'role_id': 2
            });
            await user.save();
            req.flash('success_messages', 'You have signed up successfully!');
            res.redirect('/users/login');
        },
        error: (form) => {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req, res) => {
    const LoginForm = createLoginForm();
    res.render('users/login', {
        'form': LoginForm.toHTML(bootstrapField)
    })
})

router.post('/login', async (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async (form) => {
            // process the form
            //find user by email and pw
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false
            });
            console.log('success', user)

            if (!user) {
                req.flash('error_messages', 'Sorry, the authentication details you entered is incorrect.');
                res.redirect('/users/login');
            } else {
                // check if the password matches
                console.log(user.get('password'))
                console.log(getHashedPassword(form.data.password))
                
                if (user.get('password') === getHashedPassword(form.data.password) && user.get('role_id') == 1) {
                    // store user details
                    req.session.user = {
                        id: user.get('id'),
                        first_name: user.get('first_name'),
                        last_name: user.get('last_name'),
                        email: user.get('email')
                    }
                    req.flash('success_messages', `Welcome back, ${user.get('first_name')} ${user.get('last_name')}!`);
                    res.redirect('/users/profile');
                } else {
                    req.flash("error_messages", "The email or password you entered is incorrect. Please try again.");
                    console.log('error_messages', user)
                    res.redirect('/users/login');
                }
            }
        }, 'error': (form) => {
            console.log('error', user)
            req.flash('error_messages', "There are some problems logging you in. Please fill in the form.");
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })

        }
    })
})

router.get('/profile', async (req, res) => {
    const user = req.session.user;
    console.log('profile', user)
    if (!user) {
        req.flash('error_messages', 'You do not have permission to view this page.');
        res.redirect('/users/login');
    } else {
        res.render('users/profile', {
            'user': user
        })
    }
})

router.get('/logout', async (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "You are now logged out of your account.");
    res.redirect('/users/login');
})

module.exports = router;