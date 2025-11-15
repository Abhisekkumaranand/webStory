import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || 'replace_me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const user = new User({ email, password, name, role })
    await user.save()

    const token = signToken(user)
    return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    console.error('register error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await user.comparePassword(password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken(user)
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    console.error('login error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
