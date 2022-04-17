const express =  require("express");
const app = express();
const mongoose = require("mongoose");
const helmet =   require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const userRoute = require("./router/users")
const authRoute = require("./router/auth")
const postsRoute = require("./router/posts")

/*create a mongodb connection  
 mongoose.connect(
     process.env.MONGO_URL,
     {
         userNewUrlParser:true , useUnifiedTopology:true},
         ()=>{
             console.log("Connected to MongoDB");
         }

     
 )

*/

mongoose.connect("mongodb://localhost/facebook")
.then(()=>console.log('connected to mongodb'))
.catch((err)=>console.log('failed to connect ' , err));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

dotenv.config();
app.listen(
    8800, ()=>{
        console.log("backend server is running");
    }
)