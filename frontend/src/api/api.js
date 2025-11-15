import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')
})

export const fetchStories = async () => {
  try {
    const res = await API.get('/stories')
    return res.data
  } catch (err) {
    console.error('fetchStories', err)
    throw err
  }
}

export const fetchStory = async (id) => {
  try {
    const res = await API.get(`/stories/${id}`)
    return res.data
  } catch (err) {
    console.error('fetchStory', err)
    throw err
  }
}

export const createStory = async (formData, options = {}) => {
  try {
    const res = await API.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...options
    })
    return res.data
  } catch (err) {
    console.error('createStory', err)
    throw err
  }
}

export const updateStory = async (id, formData) => {
  try {
    const res = await API.put(`/stories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    console.error('updateStory', err)
    throw err
  }
}

export const deleteStory = async (id) => {
  try {
    const res = await API.delete(`/stories/${id}`)
    return res.data
  } catch (err) {
    console.error('deleteStory', err)
    throw err
  }
}

API.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {}
  return config
}, (err) => Promise.reject(err))


export default API