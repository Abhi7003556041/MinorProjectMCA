const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const keys = require('../config/key')
const sendEmail = require('../utils/nodemailer')
const Student = require('../models/student')
const Subject = require('../models/subject')
const Attendence = require('../models/attendence')
const Message = require('../models/message')
const Mark = require("../models/marks")
const gravatar = require('gravatar')

function createToken(data) {
    return jwt.sign(data, "mySecretKey")
  }
//File Handler
const bufferConversion = require('../utils/bufferConversion')
const cloudinary = require('../utils/cloudinary')

const validateStudentLoginInput = require('../validation/studentLogin')
const validateStudentUpdatePassword = require('../validation/studentUpdatePassword')
const validateForgotPassword = require('../validation/forgotPassword')
const validateOTP = require('../validation/otpValidation')
const { markAttendence } = require("./facultyController")
const mongoose = require("mongoose")

module.exports = {
    studentLogin: async (req, res, next) => {
       
        const { registrationNumber, password } = req.body;

        const student = await Student.findOne({ registrationNumber })
        if (!student) {
            return res.status(404).json({message:'Registration number not found'});
        }
        const isCorrect = await bcrypt.compare(password, student.password)
        if (!isCorrect) {
            return res.status(404).json({message: 'Invalid Credentials'});
        }
        const payload = { id: student.id, student };
        jwt.sign(
            payload,
            keys.secretOrKey,
            (err, token) => {
                res.status(200).json({
                    success: true,
                    token:  token
                });
            }
        );


    },
    studentSignup : async (req, res) => {
        // res.status(200).json(req.body);
        try{
        const {department,email, password} = req.body
        console.log('tokennen',req.body)
        let salt = bcrypt.genSaltSync(10);
        let hashPass = bcrypt.hashSync(req.body.password, salt);
        let departmentHelper;
        if (department === "C.S.E") {
            departmentHelper = "07"
        }
        else if (department === "E.C.E") {
            departmentHelper = "02"
        }
        else if (department === "I.T") {
            departmentHelper = "03"
        }
        else if (department === "Mechanical") {
            departmentHelper = "04"
        }
        else if (department === "Civil") {
            departmentHelper = "05"

        }
        else if (department === "E.E.E") {
            departmentHelper = "06"
        }
        else {
            departmentHelper = "00"
        }
        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })

        const student = await Student.find({ department })
        let helper;
        if (student.length < 10) {
            helper = "00" + student.length.toString()
        }
        else if (student.length < 100 && student.length > 9) {
            helper = "0" + student.length.toString()
        }
        else {
            helper = student.length.toString()
        }
       
        var date = new Date();
        const joiningYear = date.getFullYear()
        var components = [
            "STU",
            date.getFullYear(),
            departmentHelper,
            helper
        ];

        var registrationNumber = components.join("");
        const token = createToken({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
            department:req.body.department,
            studentMobileNumber:req.body.studentMobileNumber,
            year:req.body.year,
            registrationNumber:registrationNumber,
            section:req.body.section,
            batch:req.body.batch,
            subjects:req.body.subjects,
            dob:req.body.dob,
            fatherMobileNumber:req.body.fatherMobileNumber,
            fatherName:req.body.fatherName,
            gender:req.body.gender,
            aadharCard: req.body.aadharCard,
            avatar:avatar
          })
        const newUser = new Student({
          name: req.body.name,
          email: req.body.email,
          password: hashPass,
          department:req.body.department,
          studentMobileNumber:req.body.studentMobileNumber,
          year:req.body.year,
          registrationNumber:registrationNumber,
          section:req.body.section,
          batch:req.body.batch,
          subjects:req.body.subjects,
          dob:req.body.dob,
          fatherMobileNumber:req.body.fatherMobileNumber,
          fatherName:req.body.fatherName,
          gender:req.body.gender,
          aadharCard: req.body.aadharCard,
          token: token,
          avatar:avatar
        });
      
        await newUser.save();
        await sendEmail(email, password, "SignUp", registrationNumber);
        return res
          .status(200)
          .json({
            success: true,
            message: "Faculty registerd successfully,check your registered email for Registration number and Password",
            token: token,
            Data: newUser,
          })
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
          }
      },
    checkAttendence: async (req, res, next) => {
        try {
            
            const studentId =  req.body.id
            console.log('_idddddddd_iddd',mongoose.Types.ObjectId(studentId))
            const attendence = await Attendence.find({ student:  mongoose.Types.ObjectId(studentId)  }).populate('subject')
            if (!attendence) {
                res.status(400).json({ message: "Attendence not found" })
            }
            console.log('attendence',attendence)
            res.status(200).json({
                result: attendence.map(att => {
                    let res = {};
                    res.attendence = ((att.lectureAttended / att.totalLecturesByFaculty) * 100).toFixed(2)
                    res.subjectCode = att.subject.subjectCode
                    res.subjectName = att.subject.subjectName
                    res.maxHours = att.subject.totalLectures
                    res.absentHours = att.totalLecturesByFaculty - att.lectureAttended
                    res.lectureAttended = att.lectureAttended
                    res.totalLecturesByFaculty = att.totalLecturesByFaculty
                    return res
                })
            })
        }
        catch (err) {
            console.log("Error in fetching attendence",err.message)
        }
        
    },
    getAllStudents: async (req, res, next) => {
        try {
            const { department, year, section } = req.body;
            const students = await Student.find({ department, year, section })
            if (students.length === 0) {
                return res.status(400).json({ message: "No student found" })
            }
            return res.status(200).json({ result: students })

        }
        catch (err) {
            return res.status(400).json({ message: err.message })
        }
    },
    getStudentByName: async (req, res, next) => {
        try {
            const { name } = req.body
            const students = await Student.find({ name })
            if (students.length === 0) {
                return res.status(400).json({ message: "No student found" })
            }
            return res.status(200).json({ result: students })

        }
        catch (err) {
            return res.status(400).json({ message: err.message })
        }
    },
    updatePassword: async (req, res, next) => {
        try {
            const { errors, isValid } = validateStudentUpdatePassword(req.body);
            if (!isValid) {
                return res.status(400).json(errors);
            }
            const { registrationNumber, oldPassword, newPassword, confirmNewPassword } = req.body
            if (newPassword !== confirmNewPassword) {
                errors.confirmNewpassword = 'Password Mismatch'
                return res.status(400).json(errors);
            }
            const student = await Student.findOne({ registrationNumber })
            const isCorrect = await bcrypt.compare(oldPassword, student.password)
            if (!isCorrect) {
                errors.oldPassword = 'Invalid old Password';
                return res.status(404).json(errors);
            }
            let hashedPassword;
            hashedPassword = await bcrypt.hash(newPassword, 10)
            student.password = hashedPassword;
            await student.save()
            res.status(200).json({ message: "Password Updated" })
        }
        catch (err) {
            console.log("Error in updating password", err.message)
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const { errors, isValid } = validateForgotPassword(req.body);
            if (!isValid) {
                return res.status(400).json(errors);
            }
            const { email } = req.body
            const student = await Student.findOne({ email })
            if (!student) {
                errors.email = "Email Not found, Provide registered email"
                return res.status(400).json(errors)
            }
            function generateOTP() {
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 6; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                return OTP;
            }
            const OTP = await generateOTP()
            student.otp = OTP
            await student.save()
            await sendEmail(student.email, OTP, "OTP")
            res.status(200).json({ message: "check your registered email for OTP" })
            const helper = async () => {
                student.otp = ""
                await student.save()
            }
            setTimeout(function () {
                helper()
            }, 300000);
        }
        catch (err) {
            console.log("Error in sending email", err.message)
        }
    },
    getStudentByRegName: async (req, res, next) => {
        try {
            const { registrationNumber } = req.body
            const students = await Student.findOne({ registrationNumber })
            if (!students) {
                return res.status(400).json({ message: "No student found" })
            }
            return res.status(200).json({ result: students })

        }
        catch (err) {
            return res.status(400).json({ message: err.message })
        }
    },
    postOTP: async (req, res, next) => {
        try {
            const { errors, isValid } = validateOTP(req.body);
            if (!isValid) {
                return res.status(400).json(errors);
            }
            const { email, otp, newPassword, confirmNewPassword } = req.body
            if (newPassword !== confirmNewPassword) {
                errors.confirmNewPassword = 'Password Mismatch'
                return res.status(400).json(errors);
            }
            const student = await Student.findOne({ email });
            if (student.otp !== otp) {
                errors.otp = "Invalid OTP, check your email again"
                return res.status(400).json(errors)
            }
            let hashedPassword;
            hashedPassword = await bcrypt.hash(newPassword, 10)
            student.password = hashedPassword;
            await student.save()
            return res.status(200).json({ message: "Password Changed" })
        }
        catch (err) {
            console.log("Error in submitting otp", err.message)
            return res.status(200)
        }
    },
    postPrivateChat: async (req, res, next) => {
        try {
            const { senderName, senderId, roomId,
                receiverRegistrationNumber,senderRegistrationNumber,message,image } = req.body

            const receiverStudent = await Student.findOne({ registrationNumber: receiverRegistrationNumber })
            const newMessage = await new Message({
                senderName,
                senderId,
                roomId,
                message,
                senderRegistrationNumber,
                receiverRegistrationNumber,
                receiverName: receiverStudent.name,
                receiverId: receiverStudent._id,
                createdAt: new Date(),
                image:image
            })
            await newMessage.save()
        }
        catch (err) {
            console.log("Error in post private chat", err.message)
        }
    },
    getPrivateChat: async (req, res, next) => {
        try {
            const { roomId } = req.params
            const swap = (input, value_1, value_2) => {
                let temp = input[value_1];
                input[value_1] = input[value_2];
                input[value_2] = temp;
            }
            const allMessage = await Message.find({ roomId })
            let tempArr = roomId.split(".")
            swap(tempArr, 0, 1)
            let secondRomId = tempArr[0] + '.' + tempArr[1]
            const allMessage2 = await Message.find({ roomId: secondRomId })
            var conversation = allMessage.concat(allMessage2);
            conversation.sort();
            res.status(200).json({ result: conversation })
        }
        catch (err) {
            console.log("errr in getting private chat server side", err.message)

        }
    },
    differentChats: async (req, res, next) => {
        try {
            const { receiverName } = req.params
            const newChatsTemp = await Message.find({ senderName: receiverName })
            // if (newChatsTemp.length === 0) {
            //    return res.status(404).json({ result: "No any new Chat" })
            // }
            var filteredObjTemp = newChatsTemp.map(obj => {
                let filteredObjTemp = {
                    senderName: obj.senderName,
                    receiverName: obj.receiverName,
                    senderRegistrationNumber: obj.senderRegistrationNumber,
                    receiverRegistrationNumber: obj.receiverRegistrationNumber,
                    receiverId: obj.receiverId
                }
                return filteredObjTemp
            })
            let filteredListTemp = [...new Set(filteredObjTemp.map(JSON.stringify))].map(JSON.parse)

            // const { receiverName } = req.params
            const newChats = await Message.find({ receiverName })
            // if (newChats.length === 0) {
            //    return res.status(404).json({ result: "No any new Chat" })
            // }
            var filteredObj = newChats.map(obj => {
                let filteredObj = {
                    senderName: obj.senderName,
                    receiverName: obj.receiverName,
                    senderRegistrationNumber: obj.senderRegistrationNumber,
                    receiverRegistrationNumber: obj.receiverRegistrationNumber,
                    receiverId: obj.receiverId
                }
                return filteredObj
            })
            let filteredListPro = [...new Set(filteredObj.map(JSON.stringify))].map(JSON.parse)
            for (var i = 0; i < filteredListPro.length; i++) {
                for (var j = 0; j < filteredListTemp.length; j++) {
                    if (filteredListPro[i].senderName === filteredListTemp[j].receiverName) {
                        filteredListPro.splice(i, 1)

                    }
                }
            }
            res.status(200).json({ result: filteredListPro })
        }
        catch (err) {
            console.log("Error in getting different chats", err.message)
        }
    },
    previousChats: async (req, res, next) => {
        try {
            const { senderName } = req.params
            const newChats = await Message.find({ senderName })
            if (newChats.length === 0) {
                res.status(404).json({ result: "No any new Chat" })
            }
            var filteredObj = newChats.map(obj => {
                let filteredObj = {
                    senderName: obj.senderName,
                    receiverName: obj.receiverName,
                    senderRegistrationNumber: obj.senderRegistrationNumber,
                    receiverRegistrationNumber: obj.receiverRegistrationNumber,
                    receiverId: obj.receiverId
                }
                return filteredObj
            })
            var filteredList = [...new Set(filteredObj.map(JSON.stringify))].map(JSON.parse)
            console.log("filterdList",filteredList)
            res.status(200).json({ result: filteredList })
        }
        catch (err) {
            console.log("Error in getting previous chats", err.message)
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            const {email, gender, studentMobileNumber, fatherName,
                fatherMobileNumber, aadharCard} = req.body
            const userPostImg = await bufferConversion(req.file.originalname, req.file.buffer)
            const imgResponse = await cloudinary.uploader.upload(userPostImg)
            const student = await Student.findOne({ email })
            if (gender) {
                student.gender = gender
                await student.save()
            }
            if (studentMobileNumber) {
                student.studentMobileNumber = studentMobileNumber
                await student.save()
            }
            if (fatherName) {
                student.fatherName = fatherName
                await student.save()
            }
            if (fatherMobileNumber) {
                student.fatherMobileNumber = fatherMobileNumber
                await student.save()
            }
            if (aadharCard) {
                student.aadharCard = aadharCard
                await student.save()
            }
                student.avatar = imgResponse.secure_url
                await student.save()
                res.status(200).json(student)
        }
        catch (err) {
            console.log("Error in updating Profile", err.message)
        }
    },
    getAllSubjects: async (req, res, next) => {
        try {
            console.log("req.user",req.body)

            const { department, year } = req.body;
            const subjects = await Subject.find({ department, year })
            if (subjects.length === 0) {
                return res.status(404).json({ message: "No subjects founds" })
            }
            res.status(200).json({result: subjects })
        }
        catch (err) {
            return res.status(400).json({"Error in getting all subjects":err.message})
        }
    },
    getMarks: async (req, res, next) => {
        try {
            console.log("req.user",req.user)
            const {department, year, id} = req.user
            const getMarks = await Mark.find({ department, student: id }).populate('subject')
            console.log("getMarks",getMarks)
          
            const CycleTest1 = getMarks.filter((obj) => {
                return obj.exam === "CycleTest1"
            })
            const CycleTest2 = getMarks.filter((obj) => {
                return obj.exam === "CycleTest2"
            })
            const Semester = getMarks.filter((obj) => {
                return obj.exam === "Semester"
            })
            res.status(200).json({
                result: {
                    CycleTest1,
                    CycleTest2,
                    Semester
                    
            }})
        }
        catch (err) {
            return res.status(400).json({ "Error in getting marks": err.message })
        }
    }
}
