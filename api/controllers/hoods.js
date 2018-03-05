const mongoose = require("mongoose");

const Hoods = require("../models/hoods");

exports.hoods_get_all = (req, res, next) => {
    Hoods.find()
    .select("regions")
    .exec()
    .then(docs => {
        const response = {
            hoods: docs.regions
        };
        //   if (docs.length >= 0) {
        res.status(200).json(response);
        //   } else {
        //       res.status(404).json({
        //           message: 'No entries found'
        //       });
        //   }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.hoods_create_hoods = (req, res, next) => {
    const hoods = new Hoods({
        regions: req.body.regions
    });
    hoods
    .save()
    .then(result => {
        res.status(201).json({
            message: "Created regions successfully",
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}