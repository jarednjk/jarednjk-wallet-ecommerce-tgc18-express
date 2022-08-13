const express = require('express');
const router = express.Router();

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
                'password': form.data.password,
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

            if (!user) {
                req.flash('error_messages', 'Sorry, the authentication details you entered is incorrect.');
                res.redirect('/users/login');
            } else {
                // check if the password matches
                if (user.get('password') === form.data.password) {
                    // store user details
                    req.session.user = {
                        id: user.get('id'),
                        first_name: user.get('first_name'),
                        last_name: user.get('last_name'),
                        email: user.get('email')
                    }
                    req.flash('success_messages', `Welcome back, ${user.get('first_name')} ${user.get('last_name')}!`)
                    res.redirect('/users/profile');
                } else {
                    req.flash("error_messages", "The email or password you entered is incorrect. Please try again.")
                    res.redirect('/users/login')
                }
            }
        }, 'error': (form) => {
            req.flash('error_messages', "There are some problems logging you in. Please fill in the form again")
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })

        }
    })
})

router.get('/profile', async (req, res) => {
    const user = req.session.user;
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