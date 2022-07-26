const {check} = require('express-validator');
const fs = require('fs');
const path = require('path')


const middlewares = {
                      validateRegister: [
                        check('name').notEmpty().withMessage('Debes completar este campo').bail(),
                        check('surname').notEmpty().withMessage('Debes completar este campo').bail(),
                        check('email').isEmail().withMessage('Debes completar este campo con una direccion de mail valida').bail(),
                        check('password').notEmpty().withMessage('Debes completar este campo').bail(),
                        check('password').isLength({min:8}).withMessage('La contraseña debe tener al menos 8 carracteres').bail(),
                        check('avatar').custom((_value, {req})=>{
                            let file = req.file //archivo que viene gracias a multer
                            let acceptedExtensions =['.jpg', '.png', '.gif' ];
                            
                            if (!file) {
                                throw new Error('Debes subir una imagen');
                            }else{
                              let fileExtension = path.extname(file.originalname)  //else porque vino el archivo entonces..
                              if(!acceptedExtensions.includes(fileExtension)){
                                throw new Error(`Las extensiones permitidas son ${acceptedExtensions.join(', ')}`);
                              }
                    
                            }
                           
                            return true //siempe cuando es custom tiene que devolver eso
                        })
                       
                        ],
                        validateLogin: [
                          check('email').isEmail().withMessage('Debes ingresar un formato de mail valido').bail(),
                          check('password').isLength({min:8}).withMessage('La contraseña debe tener al menos 8 carracteres').bail(),


                        ],
        
              
                   

                    
}






module.exports = middlewares