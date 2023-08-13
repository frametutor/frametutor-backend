const express = require('express');
const About = require('../models/about'); // Import the About model

const router = express.Router();

// Create a new About entry
const updateAbout = async (req, res) => {
  try {
    const { para1, para2 } = req.body;

    const about = await About.findOne();

    
    about.para1 = para1;
    about.para2 = para2;
        

    const savedAbout = await about.save();

    res.status(201).json({message: 'updated successfuly', savedAbout});
  } catch (error) {
    res.status(500).json({ message: 'Error creating about entry', error });
  }
};

const crateAbout = async (req, res) => {
  try {
    const { para1, para2 } = req.body;

    const about = new About({
      para1,
      para2,
      
    });
    const savedAbout = await about.save();

    res.status(201).json({message: 'created about successfuly', savedAbout});
  } catch (error) {
    res.status(500).json({ message: 'Error creating about entry', error });
  }
};


const getAbout = async (req, res) => {
    try {

      const  about = await About.findOne();

      if(!about) {
        res.status(404).json({message : "about list empty"});

      }


     
  
      
  
      res.status(200).json(about);
    } catch (error) {
      res.status(500).json({ message: 'Error fetch about', error });
    }
  };

module.exports = {
  crateAbout,
    updateAbout,
    getAbout
};
