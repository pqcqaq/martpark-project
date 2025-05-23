import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Typography,
    Space,
    message,
} from 'antd'

const { Title } = Typography
const { TextArea } = Input

interface Device {
    device_code: string
    api_record_id: number
    yq_app_code: string
    building_code: string
    device_name: string
    device_type: string
    device_status: string
    location: string
    responsible_person_name: string
    channels_info_json: string
}

export default function Devices() {
    const [devices, setDevices] = useState<Device[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [editingDevice, setEditingDevice] = useState<Device | null>(null)
    const [form] = Form.useForm()

    const fetchDevices = async () => {
        try {
            const res = await axios.get('/api/devices')
            setDevices(res.data)
        } catch {
            message.error('获取设备列表失败')
        }
    }

    useEffect(() => {
        fetchDevices()
    }, [])

    const openModal = (device?: Device) => {
        if (device) {
            form.setFieldsValue(device)
            setEditingDevice(device)
        } else {
            form.resetFields()
            setEditingDevice(null)
        }
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setEditingDevice(null)
        form.resetFields()
    }

    const handleDelete = (device_code: string) => {
        Modal.confirm({
            title: '确认删除该设备？',
            onOk: async () => {
                try {
                    await axios.delete(`/api/devices/${device_code}`)
                    message.success('删除成功')
                    fetchDevices()
                } catch {
                    message.error('删除失败')
                }
            },
        })
    }

    const onFinish = async (values: any) => {
        // 简单校验 JSON 格式
        try {
            if (values.channels_info_json) {
                JSON.parse(values.channels_info_json)
            }
        } catch {
            message.error('通道信息 JSON 格式错误')
            return
        }

        try {
            if (editingDevice) {
                await axios.put(`/api/devices/${editingDevice.device_code}`, values)
                message.success('更新成功')
            } else {
                await axios.post('/api/devices', values)
                message.success('新增成功')
            }
            closeModal()
            fetchDevices()
        } catch {
            message.error(editingDevice ? '更新失败' : '新增失败')
        }
    }

    const columns = [
        { title: '设备代码', dataIndex: 'device_code', key: 'device_code', width: 120 },
        { title: 'API记录ID', dataIndex: 'api_record_id', key: 'api_record_id', width: 100 },
        { title: '园区代码', dataIndex: 'yq_app_code', key: 'yq_app_code', width: 120 },
        { title: '楼栋代码', dataIndex: 'building_code', key: 'building_code', width: 120 },
        { title: '设备名称', dataIndex: 'device_name', key: 'device_name', width: 150 },
        { title: '设备类型', dataIndex: 'device_type', key: 'device_type', width: 120 },
        { title: '设备状态', dataIndex: 'device_status', key: 'device_status', width: 100 },
        { title: '设备位置', dataIndex: 'location', key: 'location', width: 150 },
        { title: '负责人', dataIndex: 'responsible_person_name', key: 'responsible_person_name', width: 120 },
        {
            title: '通道信息 JSON',
            dataIndex: 'channels_info_json',
            key: 'channels_info_json',
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
            render: (_: any, record: Device) => (
                <Space>
                    <Button size="small" type="link" onClick={() => openModal(record)}>
                        编辑
                    </Button>
                    <Button
                        size="small"
                        type="link"
                        danger
                        onClick={() => handleDelete(record.device_code)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Title level={2}>设备管理</Title>
            <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>
                新增设备
            </Button>

            <Table
                columns={columns}
                dataSource={devices}
                rowKey="device_code"
                scroll={{ x: 1400 }}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title={editingDevice ? '编辑设备' : '新增设备'}
                visible={modalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText={editingDevice ? '更新' : '新增'}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="设备代码"
                        name="device_code"
                        rules={[{ required: true, message: '请输入设备代码' }]}
                    >
                        <Input disabled={!!editingDevice} />
                    </Form.Item>

                    <Form.Item
                        label="API记录ID"
                        name="api_record_id"
                        rules={[{ required: true, message: '请输入 API 记录ID' }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="园区代码"
                        name="yq_app_code"
                        rules={[{ required: true, message: '请输入园区代码' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="楼栋代码"
                        name="building_code"
                        rules={[{ required: true, message: '请输入楼栋代码' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="设备名称"
                        name="device_name"
                        rules={[{ required: true, message: '请输入设备名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="设备类型"
                        name="device_type"
                        rules={[{ required: true, message: '请输入设备类型' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="设备状态"
                        name="device_status"
                        rules={[{ required: true, message: '请输入设备状态' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="设备位置"
                        name="location"
                        rules={[{ required: true, message: '请输入设备位置' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="负责人"
                        name="responsible_person_name"
                        rules={[{ required: true, message: '请输入负责人' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="通道信息 JSON"
                        name="channels_info_json"
                        rules={[{ required: true, message: '请输入通道信息 JSON' }]}
                    >
                        <TextArea rows={6} style={{ fontFamily: 'monospace' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
