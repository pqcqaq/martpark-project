import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Typography,
    Space,
    message,
} from 'antd'

const { Title } = Typography
const { TextArea } = Input

interface Building {
    building_code: string
    yq_app_code: string
    building_name: string
    floors_info_json: string
}

export default function Buildings() {
    const [buildings, setBuildings] = useState<Building[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
    const [form] = Form.useForm()

    const fetchBuildings = async () => {
        try {
            const res = await axios.get('/api/buildings')
            setBuildings(res.data)
        } catch {
            message.error('获取楼栋列表失败')
        }
    }

    useEffect(() => {
        fetchBuildings()
    }, [])

    const openModal = (building?: Building) => {
        if (building) {
            form.setFieldsValue(building)
            setEditingBuilding(building)
        } else {
            form.resetFields()
            setEditingBuilding(null)
        }
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setEditingBuilding(null)
        form.resetFields()
    }

    const handleDelete = (building_code: string) => {
        Modal.confirm({
            title: '确认删除该楼栋？',
            onOk: async () => {
                try {
                    await axios.delete(`/api/buildings/${building_code}`)
                    message.success('删除成功')
                    fetchBuildings()
                } catch {
                    message.error('删除失败')
                }
            },
        })
    }

    const onFinish = async (values: any) => {
        // 简单校验 JSON 格式
        try {
            if (values.floors_info_json) {
                JSON.parse(values.floors_info_json)
            }
        } catch {
            message.error('楼层信息 JSON 格式错误')
            return
        }

        try {
            if (editingBuilding) {
                await axios.put(`/api/buildings/${editingBuilding.building_code}`, values)
                message.success('更新成功')
            } else {
                await axios.post('/api/buildings', values)
                message.success('新增成功')
            }
            closeModal()
            fetchBuildings()
        } catch {
            message.error(editingBuilding ? '更新失败' : '新增失败')
        }
    }

    const columns = [
        { title: '楼栋代码', dataIndex: 'building_code', key: 'building_code', width: 120 },
        { title: '园区代码', dataIndex: 'yq_app_code', key: 'yq_app_code', width: 120 },
        { title: '楼栋名称', dataIndex: 'building_name', key: 'building_name', width: 150 },
        {
            title: '楼层信息 JSON',
            dataIndex: 'floors_info_json',
            key: 'floors_info_json',
            width: 250,
            render: (val: string) => (
                <pre
                    style={{
                        maxHeight: 100,
                        overflow: 'auto',
                        background: '#f5f5f5',
                        padding: 8,
                        borderRadius: 4,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {JSON.stringify(val)}
                </pre>
            ),
        },
        {
            title: '操作',
            key: 'actions',
            width: 120,
            fixed: 'right' as const,
            render: (_: any, record: Building) => (
                <Space>
                    <Button size="small" type="link" onClick={() => openModal(record)}>
                        编辑
                    </Button>
                    <Button
                        size="small"
                        type="link"
                        danger
                        onClick={() => handleDelete(record.building_code)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Title level={2}>楼栋管理</Title>
            <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>
                新增楼栋
            </Button>

            <Table
                columns={columns}
                dataSource={buildings}
                rowKey="building_code"
                scroll={{ x: 1000 }}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title={editingBuilding ? '编辑楼栋' : '新增楼栋'}
                visible={modalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText={editingBuilding ? '更新' : '新增'}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="楼栋代码"
                        name="building_code"
                        rules={[{ required: true, message: '请输入楼栋代码' }]}
                    >
                        <Input disabled={!!editingBuilding} />
                    </Form.Item>

                    <Form.Item
                        label="园区代码"
                        name="yq_app_code"
                        rules={[{ required: true, message: '请输入园区代码' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="楼栋名称"
                        name="building_name"
                        rules={[{ required: true, message: '请输入楼栋名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="楼层信息 JSON"
                        name="floors_info_json"
                        rules={[{ required: true, message: '请输入楼层信息 JSON' }]}
                    >
                        <TextArea rows={6} style={{ fontFamily: 'monospace' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
