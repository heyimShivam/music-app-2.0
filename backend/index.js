import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const jwtSecurityKey = "jwtsecurityKey";
const userSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
    favSongs: [String],
    playListData: [{
        name: String,
        tracksIds: [String]
    }]
});

const userModal = mongoose.model("userDetails", userSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const PORT = process.env.PORT || 8000;

const mongoDB = "mongodb+srv://shivamthalwal:beanstalk@cluster0.dttppac.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoDB).then(() => {
    app.listen(PORT, () => {
        console.log("Server starting on the Port: " + PORT);
    })
}).catch(() => {

});

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, jwtSecurityKey, {
        expiresIn: maxAge,
    });
}

function verifyToken(req) {
    const bearerHeader = req.headers["authentication"];

    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(" ");
        const token = bearer(1);

        req.token = token;
        return true;
    } else {
        return false;
    }
}

app.post('/register', async (req, res) => {
    const data = {
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: req.body.userPassword,
        favSongs: [],
        playListData: [],
    };

    data.userPassword = await bcrypt.hash(data.userPassword, 5);
    data.userEmail = data.userEmail.toLowerCase();

    userModal.findOne({ userEmail: data.userEmail }).then(async (user) => {
        if (user) {
            res.status(200).send({
                errorStatus: true,
                errorMessage: "User already exist, Please use another email or login!!"
            });
        } else {
            userModal.create(data).then((result) => {
                const token = createToken(result._id);
                res.cookie("jwt", token);

                // Token is sent to the frontend but there is some issue to implement it.
                res.send({ 
                    errorStatus: false,
                    message: req.body.userName + " has been added."
                });
            }).catch((error) => {
                res.json(error);
            })
        }
    }).catch((error) => {
        console.log(error);
        res.json(error);
    })
});

// const Character = mongoose.model('Character', new mongoose.Schema({
//     name: String,
//     age: Number
//   }));
  
// //   await Character.create({ name: 'Jean-Luc Picard' });
  
// //   const filter = { name: 'Jean-Luc Picard' };
// //   const update = { age: 59 };
  
// //   // `doc` is the document _before_ `update` was applied
// //   let doc = await Character.findOneAndUpdate(filter, update);
// //   doc.name; // 'Jean-Luc Picard'
// //   doc.age; // undefined
  
// //   doc = await Character.findOne(filter);
// //   doc.age; // 59

app.post('/update', async (req, res) => {
    console.log(req.body);

    const data = await userModal.findOneAndUpdate({ userEmail: req.body.userEmail.toLowerCase() }, req.body.updateData, {
        new: true
    });
    

    res.send({
        message: "Data updated"
    })
});
app.post('/login', async (req, res) => {
    userModal.findOne({ userEmail: req.body.userEmail.toLowerCase() }).then(async (user) => {
        if (user) {
            if (!(await bcrypt.compare(req.body.userPassword, user.userPassword))) {
                res.status(200).send({
                    errorStatus: true,
                    errorMessage: "Wrong password, Please check password!!"
                });
            } 
            else {
                res.json({
                    errorStatus: false,
                    Message: user.userName + " has Login successfully.",
                    data: {
                        userName: user.userName,
                        userEmail: user.userEmail,
                        favSongs: user.favSongs,
                        playListData: user.playListData,
                    }
                });
            }
        } else {
            res.status(200).send({
                errorStatus: true,
                errorMessage: "User not found, Please check email."
            });
        }
    }).catch((error) => {
        console.log(error);
        res.json(error);
    })
});
