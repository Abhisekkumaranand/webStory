import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['admin','editor','user'], default: 'user' } // set default user
}, { timestamps: true })

// Hash password before save
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidate) {
  try {
    return await bcrypt.compare(candidate, this.password)
  } catch (err) {
    return false
  }
}

export default mongoose.model('User', UserSchema)
