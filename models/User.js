const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function(next) {   // User 정보를 저장하기 전에 실행
  var user = this;

  if(user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
      next()
  }
})


userSchema.methods.comparePassword = function(plainPassword, cb) {

  // plainPassword: 1234567     암호화된 비밀번호: $2b$10$Wh4gN/9GN/Gk9uRZ0kdMNelvVegK9P9RAiPftJLmbBJc90eFYpUoC
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err),
      cb(null, isMatch)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }