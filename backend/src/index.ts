import express from 'express'
import cors from 'cors'
import './config/loadEnvironment'
import connectDB from './config/dbConfig'
import authRoutes from './routes/auth.routes'
import friendsRoutes from './routes/friends.routes'

const PORT = process.env.PORT || 3000
const app = express()

connectDB()

app.use(express.json({ extended: true } as object))
app.use(cors())

app.use('/api/', authRoutes)
app.use('/api/friends/', friendsRoutes)

app.get('/', (_, res) => {
  res.send('Server is running...')
})

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
