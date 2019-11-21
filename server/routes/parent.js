const express = require('express')
const router = express.Router()

const Parent = require('../models/parent') // Parent Schema

router.get("/", (req, res)=>{
    Parent.find()
        .exec()
        .then(doc=>{
            res.status(200).json({
                length: doc.length,
                students: doc,
            })
        })
        .catch(err=>{
            res.status(500).json({error: err})
        })
})

router.get("/:parentId", (req, res)=>{
    query = {
        parentId: req.params.parentId
    }
    Parent.find(query)
    .then(data=>{
        res.status(200).json({ parent: data })
    })
    .catch(err=>{
        res.status(500).json({error: err})
    })
})

router.put("/addChild/:parentId", (req, res)=>{
   
    const id = req.params.parentId
    const child = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName
    }
    Parent.findOneAndUpdate({parentId: id}, 
        { $push: { childs: child } },
        { writeConcern: { w: "majority" , wtimeout: 5000 }})
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({result})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
})


router.post("/", (req, res)=>{
    addParentToDatabase(req, res);
})

function addParentToDatabase(req, res){
    const { parentId, fatherName, motherName, fatherOccupation, motherOccupation, phoneNo,nationality, presentAddress, permanentAddress } = req.body
    const parent = new Parent({
        parentId,
        fatherName,
        motherName,
        fatherOccupation,
        motherOccupation,
        phoneNo,
        nationality,
        presentAddress,
        permanentAddress,
    })

    parent.save()
        .then(data => {
            res.status(201).json({  
                isRecordCreated: true,
                data: data 
            })
        })
        .catch(err=>{
            res.status(404).json({  
                isRecordCreated: false,
                error: err 
            })
        })
}


module.exports = router
