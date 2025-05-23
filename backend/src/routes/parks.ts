import express from 'express'
import prisma from '../prismaClient'


const router = express.Router()

// 查询所有园区
router.get('/', async (req, res) => {
    const parks = await prisma.parks.findMany()
    res.json(parks)
})

// 查询单个园区
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const park = await prisma.parks.findUnique({ where: { yq_app_code: id } })
    if (!park) return res.status(404).json({ error: 'Park not found' })
    res.json(park)
})

// 新增园区
router.post('/', async (req, res) => {
    const { yq_app_code, yq_name, kj_type, extra_details_json } = req.body
    try {
        const park = await prisma.parks.create({
            data: { yq_app_code, yq_name, kj_type, extra_details_json },
        })
        res.status(201).json(park)
    } catch (error) {
        res.status(400).json({ error: 'Create failed' })
    }
})

// 更新园区
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { yq_name, kj_type, extra_details_json } = req.body
    try {
        const park = await prisma.parks.update({
            where: { yq_app_code: id },
            data: { yq_name, kj_type, extra_details_json },
        })
        res.json(park)
    } catch (error) {
        res.status(400).json({ error: 'Update failed' })
    }
})

// 删除园区
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await prisma.parks.delete({ where: { yq_app_code: id } })
        res.json({ message: 'Deleted successfully' })
    } catch (error) {
        res.status(400).json({ error: 'Delete failed' })
    }
})

export default router
