function userLoggedMiddleware (req,res,next){
    res.locals.isLogged = false;
    //locals es una variable que se comparte en todas las vistas. Seteada por defalult en false
    
    if(req.session.userLogged){     //pero si hay algien loggeado, entonces la pones en true y mostras segun corresponda en las vistas
        res.locals.isLogged = true;
        res.locals.userLogged = req.session.userLogged;
    }

    next()
};

module.exports= userLoggedMiddleware;