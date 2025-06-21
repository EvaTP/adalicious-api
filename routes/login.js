const express = require("express");
const router = express.Router();
const pool = require("../db");

// bcrypt
const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';
// https://github.com/kelektiv/node.bcrypt.js?tab=readme-ov-file#usage

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const { Decimal } = Prisma;

router.get("/test", (req, res) => {
  console.log("✅ Route /login/test atteinte");
  res.send("Test route login OK");
});

// CODE ROMAIN
// se connecter
router.post('/', async (req, res) => {
    const saltRounds = 10;

    const { firstname: newFirstname, password: newPassword } = req.body
    bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
        console.log('debug hash : ', hash )
        // Store hash in your password DB.
        const firstname = await prisma.users.create({
            data: {
                firstname: newFirstname,
                hash_password: hash
            },
        })
    });
    res.sendStatus(200);
})

router.post('/login', async (req, res) => {
    const { id, password } = req.body
    
    const usersUnique = await prisma.users.findUnique({
        where: { id: id}
    })
    bcrypt.compare(password, usersUnique.hash_password, async function(err, result) {
        console.log('result: ', result)
    });
    res.sendStatus(200);
})




module.exports = router;
