import { Router } from 'express'
import prisma from '../prismaClient'

const router = Router()

// 获取所有楼栋
router.get('/', async (req, res) => {
    try {
        const buildings = await prisma.buildings.findMany()
        res.json(buildings)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '获取楼栋失败' })
    }
})

// 新增楼栋
router.post('/', async (req, res) => {
    try {
        const { building_code, yq_app_code, building_name, floors_info_json } = req.body
        const newBuilding = await prisma.buildings.create({
            data: {
                building_code,
                yq_app_code,
                building_name,
                floors_info_json,
            },
        })
        res.json(newBuilding)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '新增楼栋失败' })
    }
})

// 更新楼栋
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { yq_app_code, building_name, floors_info_json } = req.body
        const updated = await prisma.buildings.update({
            where: { building_code: id },
            data: { yq_app_code, building_name, floors_info_json },
        })
        res.json(updated)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '更新楼栋失败' })
    }
})

// 删除楼栋
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await prisma.buildings.delete({ where: { building_code: id } })
        res.json({ message: '删除成功' })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: '删除楼栋失败' })
    }
})

export default router
