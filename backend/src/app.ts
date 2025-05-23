import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

import parksRouter from './routes/parks'
import buildingsRouter from './routes/buildings'
import devicesRouter from './routes/devices'
import alarmsRouter from './routes/alarms'
import genericRecordsRouter from './routes/genericRecords'
import genericStatsRouter from './routes/genericStats'
import bigdata from './routes/bigdata'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api/parks', parksRouter)
app.use('/api/buildings', buildingsRouter)
app.use('/api/devices', devicesRouter)
app.use('/api/alarms', alarmsRouter)
app.use('/api/generic-records', genericRecordsRouter)
app.use('/api/generic-stats', genericStatsRouter)
app.use('/api/bigdata', bigdata)

app.get('/', (req, res) => {
    res.send('SmartPark API is running')
})

export default app
