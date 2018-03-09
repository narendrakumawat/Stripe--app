/**
 * Created by nkkumawat  on 9-MAR-18.
 */
var express = require('express');
var router = express.Router();
var stripe = require('stripe')("sk_test_BQokikJOvBiI2HlWgH4olfQ2");


/* GET home page. */
router.get('/', function(req, res, next) {
    stripe.charges.list({  },
        function(err, charges) {
            stripe.balance.retrieve(function(err, balance) {
                console.log(balance);
                res.render('pay', { charges : charges , balance : balance });
            });
        }
    );

});

router.post('/charges', function(req, res, next) {
    "use strict";
    const email = req.body.email;
    const amount = req.body.amount;
    const desc = req.body.desc;

   stripe.customers.create({
        email: email
    }).then(function(customer){
        return stripe.customers.createSource(customer.id, {
            source: 'tok_visa'
        });
    }).then(function(source) {
        return stripe.charges.create({
            amount: amount,
            currency: 'usd',
            customer: source.customer,
            description: desc
        });
    }).then(function(charge) {
        console.log(charge);
       res.send(charge);
    }).catch(function(err) {
        console.log(err);
    });
});



router.post('/retrieveTransaction', function(req, res, next) {
    stripe.balance.retrieveTransaction(
        "txn_19XJJ02eZvKYlo2ClwuJ1rbA",
        function(err, balanceTransaction) {
            console.log(balanceTransaction);
        }
    );
});
router.post('/listTransactions', function(req, res, next) {
    stripe.balance.listTransactions({ limit: 3 }, function(err, transactions) {
        console.log(transactions);
    });
});
router.post('/retrieveCharge', function(req, res, next) {
    stripe.charges.retrieve(
        "ch_1C3Sz22eZvKYlo2CODz7WfL3",
        function(err, charge) {
            console.log(charge);
        }
    );
});
router.post('/listCharge', function(req, res, next) {
    stripe.charges.list({ limit: 3 },
        function(err, charges) {
            console.log(charges);
        }
    );
});
router.post('/createAccount', function(req, res, next) {
    stripe.customers.createSource(
        "cus_CSXdVxB48RxFXw",
        { source: "btok_1C3cbL2eZvKYlo2C9DHuDXOi" },
        function(err, card) {
            console.log(err);
            res.send(card);
        }
    );
});





module.exports = router;
