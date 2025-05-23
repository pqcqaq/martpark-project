import { Router } from 'express'
import prisma from '../prismaClient'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const records = await prisma.generic_Records.findMany()
        res.json(records)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '获取记录失败' })
    }
})

router.post('/', async (req, res) => {
    try {
        const { record_type, yq_app_code_context, related_entity_code, record_data_json } = req.body
        const newRecord = await prisma.generic_Records.create({
            data: { record_type, yq_app_code_context, related_entity_code, record_data_json },
        })
        res.json(newRecord)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '新增记录失败' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { record_type, yq_app_code_context, related_entity_code, record_data_json } = req.body
        const updated = await prisma.generic_Records.update({
            where: { record_id: id },
            data: { record_type, yq_app_code_context, related_entity_code, record_data_json },
        })
        res.json(updated)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '更新记录失败' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        await prisma.generic_Records.delete({ where: { record_id: id } })
        res.json({ message: '删除成功' })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '删除记录失败' })
    }
})

export default router
