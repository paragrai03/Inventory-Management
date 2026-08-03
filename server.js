import express from 'express';
import ProductController from "./src/controllers/product.controller.js";
import ejsLayouts from 'express-ejs-layouts'; //library
import path from "path";
import validationMiddleware from './src/middlewares/validation.middleware.js';
import  {uploadFile}  from './src/middlewares/file-upload.middleware.js';
import UserController from './src/controllers/user.controller.js';
import session from 'express-session';  //Library
import { auth } from './src/middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import { setLastVisit } from './src/middlewares/lastVisit.middleware.js';

const server = express();
server.use(cookieParser());
server.use(setLastVisit);
server.use(
  session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);


server.use(express.static('public'));
server.use(session({
  secret:'SecretKey',
  resave: false,
  saveUninitialized: true,
  cookie:{secure:false},
}));


const usersController = new UserController();
server.use(express.static('src/views'));
server.use(express.json());
//parse form data
// This is a built-in middleware function in Express. It is used to parse incoming requests with URL-encoded payloads.
//  URL encoding is a method to encode data in a URL, and this middleware parses the data encoded in this way into a JavaScript object, 

server.use(express.urlencoded({"extended": true}))

// setup view engine settings
server.set('view engine', 'ejs');
server.set("views", path.join(path.resolve(),"src", "views"));

server.use(ejsLayouts);

// Create an instance of ProductController
const productController = new ProductController();

server.get('/register', usersController.getRegister);
 server.get('/login', usersController.getLogin);
server.post('/login', usersController.postLogin);
server.post('/register',usersController.postRegister);
server.get('/logout', usersController.logout);

server.get('/',setLastVisit,auth, productController.getProducts);
server.get('/new-product',auth,productController.getAddProduct);

server.get('/update-product/:id',auth,productController.getUpdateProductView);

server.post('/delete-product/:id',auth,productController.deleteProduct);

server.post(
  '/',auth,
  uploadFile.single('imageUrl'),
  validationMiddleware,
  productController.postAddProduct
);

// server.post(
//   '/update-product',auth,
//   productController.postUpdateProduct
// );
server.post(
  '/update-product',auth,
  uploadFile.single('imageUrl'),
  validationMiddleware,
  productController.postUpdateProduct
   );

server.listen(3400, () => {
    console.log('Server is running on port 3400');
  });