import { Router } from 'express'
import prisma from '../prismaClient'

const router = Router()

// 获取所有设备
router.get('/', async (req, res) => {
    try {
        const devices = await prisma.devices.findMany()
        res.json(devices)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '获取设备失败' })
    }
})

// 新增设备
router.post('/', async (req, res) => {
    try {
        const {
            device_code,
            api_record_id,
            yq_app_code,
            building_code,
            device_name,
            device_type,
            device_status,
            location,
            responsible_person_name,
            channels_info_json,
        } = req.body
        const newDevice = await prisma.devices.create({
            data: {
                device_code,
                api_record_id,
                yq_app_code,
                building_code,
                device_name,
                device_type,
                device_status,
                location,
                responsible_person_name,
                channels_info_json,
            },
        })
        res.json(newDevice)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '新增设备失败' })
    }
})

// 更新设备
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const {
            api_record_id,
            yq_app_code,
            building_code,
            device_name,
            device_type,
            device_status,
            location,
            responsible_person_name,
            channels_info_json,
        } = req.body
        const updated = await prisma.devices.update({
            where: { device_code: id },
            data: {
                api_record_id,
                yq_app_code,
                building_code,
                device_name,
                device_type,
                device_status,
                location,
                responsible_person_name,
                channels_info_json,
            },
        })
        res.json(updated)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '更新设备失败' })
    }
})

// 删除设备
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await prisma.devices.delete({ where: { device_code: id } })
        res.json({ message: '删除成功' })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '删除设备失败' })
    }
})

export default router
