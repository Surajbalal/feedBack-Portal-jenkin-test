const express = require("express");
const app = express();
const cors = require("cors");

const MAX_REQUEST_PER_MINUT = 100;
const MAX_TIME = 60000;

let ip_mapping = { };

setInterval(()=>{
  console.log("resetting ip mapping");
ip_mapping= {}
},MAX_TIME);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const port = 3000;
const adminRouter = require("./routes/admin");
const facultyRouter = require("./routes/facuty");
const studentRouter = require("./routes/student");

const courseRouter = require("./routes/course");
const session = require("express-session");
const crypto = require("crypto");

const secretKey = crypto.randomBytes(32).toString("hex");

dotenv.config();
app.use(helmet());
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());

app.use((req,res,next) =>{
  const user_ip = req.ip;
  
  if(ip_mapping[user_ip] > MAX_REQUEST_PER_MINUT){
    console.log("to many request from",user_ip,ip_mapping[user_ip]);
    return res.status(429).json({message:"To many request"});
  }

  ip_mapping[user_ip] = ip_mapping[user_ip] + 1 || 1;

  next();

})


app.use(
  cors({
    credentials: true,
    origin: "http://localhost:1234",
  }),
);

app.use("/api/admin", adminRouter);

app.use("/api/faculty", facultyRouter);
app.use("/api/course", courseRouter);
app.use("/api/student", studentRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(`Error in connecting with databse ${err}`);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}....`);
});
