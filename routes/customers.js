const mongoose = require('mongoose')

const express = require('express');
const router = express.Router();

const customerSchema = new mongoose.Schema({
    isGold:{
        type: Boolean,
        required: true,
        default:false
    },

    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    phone:{
        type: String,
        required: true,
        minlength:5,
        maxlength:50
    }
})


const Customer = mongoose.model('Customer',customerSchema);


// GET
router.get('/',async(req,res) =>{
    const customers = await Customer.find().sort('name');
    res.send(customers);
});


// POST 
router.post('/',async(req,res)=>{
    const { error } = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name:req.body.name,
        phone:req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);
});


// PUT // UPDATE
router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id,
      { 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      }, { new: true });
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    
    res.send(customer);
  });


  // DELETE
  router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });
  

  // Individual GET
  router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });
  

function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    };
  
    return Joi.validate(customer, schema);
  }
  


module.exports = router;