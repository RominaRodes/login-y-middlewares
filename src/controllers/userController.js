const { create } = require('domain');
const fs = require('fs');
const path = require('path');
const ModelUser = require('../model/User');
const {validationResult} = require('express-validator');  //traigo por destructuring la funcion validationResult que nos dice el resultado de las validaciones
const bcryptjs = require('bcryptjs');


const userController = {
                    login: (_req,res)=> {
                        res.render('login');
                    },
                    processLogin: (req,res)=>{

                        const loginResultValidation = validationResult(req);

                        if(loginResultValidation.errors.length>0){
                            res.render('login', 
                            {errors: loginResultValidation.mapped(),
                             old: req.body
                            })
                        };
                       
                        let userToLogin =  ModelUser.findByField('email', req.body.email); 
                        
                        if(userToLogin){
                            let passwordMatch = bcryptjs.compareSync(req.body.password, userToLogin.password);
                            if(passwordMatch){
                                delete userToLogin.password   // elimino e key del password x ser un dato sensible
                                req.session.userLogged = userToLogin; //guardo el userToLogin en session
                                if(req.body.recordame){
                                    res.cookie('userMail', req.body.email, {maxage: (1000 * 60)*2})
                                }
                                res.redirect('/admin')
                            }else{
                                res.render('login', {
                                    errors: {
                                        password: { msg: 'La contraseña ingresada es invalida'}
                                    }
                                })    
                            }   
                        }else{
                            res.render('login', {
                                errors: {
                                    email: { msg: 'El mail ingresado no se encuentra en nuestra base de datos'}
                                }
                            })
                        }

            
                    },
                   register: (_req,res)=> {
                        res.render('register');
                    },
                   postuser: (req,res)=> {
                    const resultValidation = validationResult(req);  //guardo el resultado de las validaciones en una variable
                    // res.send(resultValidation)  puedo hacer console.log para ver que viene en esa variable (me mabda errors que es un array de objtos con cada error)
                    let userInDB = ModelUser.findByField('email', req.body.email); //para ver si ya hay un usuario con ese mail registrado y hacer una validacion
                    
                    if(resultValidation.isEmpty() && !userInDB){    
            
                        const userToCreate = {
                        ...req.body,
                        password: bcryptjs.hashSync(req.body.password, 10),
                        avatar: req.file? req.file.filename : '',
                            }                   
                            ModelUser.createUser(userToCreate)
                        
                                res.render('login')

                    }else{

                        res.render('register', 
                            {errors: resultValidation.mapped(), 
                             errorEmail: { msg: "Este email ya se encuentra registrado"},
                             old: req.body
                            })
                        }                       
                    },
                    auth: (req,res)=>{
                        //console.log(req.session.userLogged) veo que gurado en session
                        console.log(req.cookies.userMail)
                        res.render('admin', { user: req.session.userLogged})
                                    
                    },
                    logout: (req,res)=>{
                        req.session.destroy();
                        res.redirect('/')
                    }
                }




module.exports = userController;