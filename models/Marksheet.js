const mongoose = require('mongoose')
const { Schema } = mongoose

const marksheetSchema = new Schema({
    markSheet: {
        type: String,
        required: true
    },
    examId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    studentId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    updatedOn: {
        type: Date,
        default: new Date(),
      },
   
},{ strict: false })

module.exports = mongoose.model('marksheet', marksheetSchema,'marksheet')
