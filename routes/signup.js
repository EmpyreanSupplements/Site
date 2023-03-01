var express = require('express');
var router = express.Router();
const {MongoClient} = require("mongodb");
const crypto = require("crypto");
const client = new MongoClient("mongodb+srv://rubensspy1:eusoulindo@mysite.suxiemd.mongodb.net/?retryWrites=true&w=majority");

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'FlyBetter | Junte-se a nós.'});
});

router.post("/", (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  if (
    password === confirmPassword ||
    username !== "" ||
    email !== "" ||
    password !== "" ||
    confirmPassword !== ""
  ) {
    checkUser(client, email).then(async (checked) => {
      if (checked) {
        res.render("signup", {
          reg: "Usuário já cadastrado",
        });
      } else {
        const hashedPassword = getHashedPassword(password);

        await register(client, email, username, hashedPassword);

        res.render("login", {
          log: "Cadastro completo. Agora faça login",
        });
      }
    });
  } else {
    res.render("signup", {
    });
  }
});

async function register(client, email, username, hashedPassword) {
  try {
    await client.connect();
    await client.db("auth").collection("users").insertOne({
      username: username,
      email: email,
      password: hashedPassword,
    });
    console.log(`Novo usuário cadastrado`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
async function checkUser(client, email) {
  try {
    await client.connect();
    const result = await client.db("auth").collection("users").findOne({
      email: email,
    });
    if (result !== null) {
      console.log("sim, temos esse email");
      return true;
    } else {
      console.log("não, não temos esse email");
      return false;
    }
  } finally {
    await client.close();
  }
}

module.exports = router;
