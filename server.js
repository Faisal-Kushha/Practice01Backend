require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.URL);
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const server = express();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT;

server.get("/flowerAPI", getFlower);
function getFlower(req, res) {
  let URL = `https://flowers-api-13.herokuapp.com/getFlowers`;
  axios
    .get(URL)
    .then((result) => {
      res.send(result.data);
    })

    .catch((err) => {
      console.log(err);
    });
}

server.post("/addflower", addFlowerHandler);
const AddFlowerSchema = new mongoose.Schema({
  instructions: String,
  name: String,
  photo: String,
  email: String,
});
FlowerModel = mongoose.model("FlowerModel", AddFlowerSchema);

async function addFlowerHandler(req, res) {
  const instructions = req.body.instructions;
  const photo = req.body.photo;
  const name = req.body.name;
  const email = req.body.email;

  await FlowerModel.create({
    instructions: instructions,
    name: name,
    photo: photo,
    email: email,
  });
  FlowerModel.find({ email: email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}
server.get("/getFlower", getFlowerData);

async function getFlowerData(req, res) {
  const email = req.query.email;
  FlowerModel.find({ email: email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}
server.delete("/deleteFlower/:id", deleteFlowerHandler);
async function deleteFlowerHandler(req, res) {
  const flowerId = req.params.id;
  const email = req.query.email;
  FlowerModel.deleteOne({ _id: flowerId }, (err, result) => {
    FlowerModel.find({ email: email }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
}

server.put("/updateFlower/:id", updateFlowerHandler);
function updateFlowerHandler(req, res) {
  const flowerId = req.params.id;
  const { instructions, name, photo, email } = req.body;
  FlowerModel.findByIdAndUpdate(
    flowerId,
    { instructions, name, photo },
    (err, result) => {
      FlowerModel.find({ email: email }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    }
  );
}
server.listen(PORT, () => console.log(`listening on ${PORT}`));
