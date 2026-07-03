import axios from 'axios'

const api = axios.create({
  baseURL: 'https://reactdeveloperexam.ymcargo.tech/api',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
})

// Attach token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const login = (email: string, password: string) =>
  api.post('/login', { email, password })

export const logout = () => api.post('/logout')

export const getMe = () => api.get('/me')

export const getBooks = (page: number = 1) =>
  api.get('/books', { params: { page } })

export const updateBook = (id: number, data: {
  title: string
  author: string
  retail_price: number
  stock: number
}) => api.put(`/books/${id}`, data)

export const getCostPrice = (id: number, reason: string) =>
  api.post(`/books/${id}/cost-price`, { reason })

export default api
