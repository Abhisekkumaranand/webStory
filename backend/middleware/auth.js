import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || 'replace_me'

export const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'Invalid token' })
    req.user = user
    return next()
  } catch (err) {
    console.error('authenticate error', err)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// role guard e.g. requireRole('admin')
export const requireRole = (role) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' })
    return next()
  } catch (err) {
    console.error('requireRole error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
