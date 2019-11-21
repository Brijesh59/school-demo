const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ParentSchema = new Schema({
    parentId: {
        type: String,
        required: true
    },
    fatherName: String,
    motherName: String,
    fatherOccupation: String,
    motherOccupation: String,
    phoneNo: String,
    nationality: String,
    presentAddress: String,
    permanentAddress: String,
    childs: [ {
        username: String,
        password: String,
        firstName: String
    }]
})

ParentSchema.index({ parentId: 1}, { unique: true })

const ParentModel = mongoose.model('parentdetails', ParentSchema)
module.exports = ParentModel
