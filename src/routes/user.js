// ************ Require's ************
const express = require('express');
const router = express.Router();
const path = require('path');
const multer  = require('multer');  //para subir imagenes npm i multer

// ************ middlewares de rutas Require ************
const middlewares = require('../middlewares/validationsMiddleware') //se creo una carpeta mddleware con los middlewares y la requiero donde la quiero aplicar
const userLogs = require('../middlewares/userLogs')
const guestMiddleware = require('../middlewares/guestMiddleware'); 
const authMiddleware = require('../middlewares/authMiddleware')

// ************ Controller Require ************
const userController = require('../controllers/userController');

// ************ Express Validator Require ************
//const {check} = require('express-validator');  //Solo requiero la funcion check() pero tambien puedo usar body que es mejor semanticamente para hacer las validadciones. se paso a middlewares
const { filename } = require('../model/User');


// ************ Seteo cdonde se guardan y el nombre de los archivos que se suben con multer ************
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../../public/images'))
    },
    filename: function (_req, file, cb) {
      const fileName = 'img-user' + Date.now() + path.extname(file.originalname)
      cb(null, fileName)
    }
  })
  const upload = multer({ storage: storage })   //le digo a multer donde se sube el archivo y como se llama


  // ************ Validaciones de register las pase a la carpeta middlewares************
/*const validateRegister = [
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
   

]*/



router.get('/login',userLogs, guestMiddleware ,userController.login); 
router.post('/login', middlewares.validateLogin, userController.processLogin);

router.get('/admin', authMiddleware, userController.auth );

router.get('/register',userLogs, guestMiddleware, userController.register); 
router.post('/register',upload.single('avatar'), middlewares.validateRegister , userController.postuser); //upload.single('name del input') y tambien paso la const de validaciones

router.get('/logout', userController.logout)

module.exports = router;