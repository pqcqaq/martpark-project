import { Router } from 'express'
import prisma from '../prismaClient'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const stats = await prisma.generic_Stats_And_TimeSeries.findMany()
        res.json(stats)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '获取统计失败' })
    }
})

router.post('/', async (req, res) => {
    try {
        const {
            metric_source_api,
            metric_description,
            yq_app_code_context,
            related_entity_code_context,
            time_period_or_timestamp,
            value_numeric,
            value_text,
            value_complex_json,
        } = req.body
        const newStat = await prisma.generic_Stats_And_TimeSeries.create({
            data: {
                metric_source_api,
                metric_description,
                yq_app_code_context,
                related_entity_code_context,
                time_period_or_timestamp,
                value_numeric,
                value_text,
                value_complex_json,
            },
        })
        res.json(newStat)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '新增统计失败' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const {
            metric_source_api,
            metric_description,
            yq_app_code_context,
            related_entity_code_context,
            time_period_or_timestamp,
            value_numeric,
            value_text,
            value_complex_json,
        } = req.body
        const updated = await prisma.generic_Stats_And_TimeSeries.update({
            where: { entry_id: id },
            data: {
                metric_source_api,
                metric_description,
                yq_app_code_context,
                related_entity_code_context,
                time_period_or_timestamp,
                value_numeric,
                value_text,
                value_complex_json,
            },
        })
        res.json(updated)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '更新统计失败' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        await prisma.generic_Stats_And_TimeSeries.delete({ where: { entry_id: id } })
        res.json({ message: '删除成功' })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '删除统计失败' })
    }
})

export default router
