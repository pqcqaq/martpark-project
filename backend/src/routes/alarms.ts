import { Router } from 'express'
import prisma from '../prismaClient'

const router = Router()

// 获取所有报警
router.get('/', async (req, res) => {
    try {
        const alarms = await prisma.alarms.findMany()
        res.json(alarms)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '获取报警失败' })
    }
})

// 新增报警
router.post('/', async (req, res) => {
    try {
        const {
            api_record_id,
            device_code,
            alarm_type,
            alarm_level,
            alarm_time,
            alarm_status,
            location_at_alarm,
        } = req.body
        const newAlarm = await prisma.alarms.create({
            data: {
                api_record_id,
                device_code,
                alarm_type,
                alarm_level,
                alarm_time: new Date(alarm_time),
                alarm_status,
                location_at_alarm,
            },
        })
        res.json(newAlarm)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '新增报警失败' })
    }
})

// 更新报警
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const {
            device_code,
            alarm_type,
            alarm_level,
            alarm_time,
            alarm_status,
            location_at_alarm,
        } = req.body
        const updated = await prisma.alarms.update({
            where: { api_record_id: id },
            data: {
                device_code,
                alarm_type,
                alarm_level,
                alarm_time: new Date(alarm_time),
                alarm_status,
                location_at_alarm,
            },
        })
        res.json(updated)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '更新报警失败' })
    }
})

// 删除报警
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        await prisma.alarms.delete({ where: { api_record_id: id } })
        res.json({ message: '删除成功' })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '删除报警失败' })
    }
})

export default router
