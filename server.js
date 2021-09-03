const express = require('express');
const cors = require('cors');
const validator = require('express-validator');
const validationResult = require('express-validator').validationResult

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config();
const mailerService = require('./services/email_service');

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    // console.log(`This is Joefa's SMTP server`); remove
    res.json(`You are connected to Joefa SMTP server`);
});

app.post('/CoffeeHouse',
    validator.check('email').isEmail().normalizeEmail().trim().isLength({ min: 20, max: 50 }),
    validator.check('subject').trim().escape().isLength({ min: 10, max: 30 }),
    validator.check('message').trim().escape().isLength({ min: 20, max: 250 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const body = req.body;
            const mailResult = await mailerService.sendMail(
                process.env.COFFEE_HOUSE_EMAIL,
                body.email,
                body.subject,
                body.message);

            mailResult.deliveredTo = "CoffeeHouse";
            res.json(mailResult);

        } catch (error) {
            res.statusCode = 207;
            res.json({
                error: 'Error occured while sending mail'
            });
        }

    });

const port = process.env.PORT || 3500

const server = app.listen(port, () => {
    console.log(`Listening to port ${port} `);
});

function stopServer() {
    server.close();
}

module.exports = {
    app,
    stopServer,
}