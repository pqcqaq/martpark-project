import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Table,
    Button,
    Form,
    Input,
    DatePicker,
    Modal,
    Space,
    Typography,
    message,
} from 'antd'
import dayjs from 'dayjs'

const { Text } = Typography

interface Alarm {
    api_record_id: number
    device_code: string
    alarm_type: string
    alarm_level: string
    alarm_time: string
    alarm_status: string
    location_at_alarm: string
}

export default function Alarms() {
    const [alarms, setAlarms] = useState<Alarm[]>([])
    const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const fetchAlarms = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/alarms')
            setAlarms(res.data)
        } catch (error) {
            message.error('获取报警列表失败')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlarms()
    }, [])

    // 打开新增弹窗
    const openAddModal = () => {
        setEditingAlarm(null)
        form.resetFields()
        setModalVisible(true)
    }

    // 打开编辑弹窗
    const openEditModal = (alarm: Alarm) => {
        setEditingAlarm(alarm)
        form.setFieldsValue({
            ...alarm,
            alarm_time: dayjs(alarm.alarm_time),
        })
        setModalVisible(true)
    }

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '确认删除该报警吗？',
            onOk: async () => {
                try {
                    await axios.delete(`/api/alarms/${id}`)
                    message.success('删除成功')
                    fetchAlarms()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleFinish = async (values: any) => {
        try {
            const payload = {
                ...values,
                alarm_time: values.alarm_time.toISOString(),
            }

            if (editingAlarm) {
                await axios.put(`/api/alarms/${editingAlarm.api_record_id}`, payload)
                message.success('更新成功')
            } else {
                await axios.post('/api/alarms', payload)
                message.success('新增成功')
            }

            setModalVisible(false)
            fetchAlarms()
            form.resetFields()
            setEditingAlarm(null)
        } catch (error) {
            message.error('操作失败')
        }
    }

    const columns = [
        {
            title: 'API记录ID',
            dataIndex: 'api_record_id',
            key: 'api_record_id',
            width: 100,
        },
        {
            title: '设备代码',
            dataIndex: 'device_code',
            key: 'device_code',
            width: 120,
        },
        {
            title: '报警类型',
            dataIndex: 'alarm_type',
            key: 'alarm_type',
            width: 120,
        },
        {
            title: '报警等级',
            dataIndex: 'alarm_level',
            key: 'alarm_level',
            width: 100,
        },
        {
            title: '报警时间',
            dataIndex: 'alarm_time',
            key: 'alarm_time',
            width: 180,
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '报警状态',
            dataIndex: 'alarm_status',
            key: 'alarm_status',
            width: 120,
        },
        {
            title: '报警时位置',
            dataIndex: 'location_at_alarm',
            key: 'location_at_alarm',
        },
        {
            title: '操作',
            key: 'action',
            width: 160,
            render: (_: any, record: Alarm) => (
                <Space>
                    <Button type="link" onClick={() => openEditModal(record)}>
                        编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.api_record_id)}>
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
                <Text strong style={{ fontSize: 24 }}>
                    报警管理
                </Text>
                <Button type="primary" onClick={openAddModal}>
                    新增报警
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={alarms}
                rowKey="api_record_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title={editingAlarm ? '编辑报警' : '新增报警'}
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false)
                    setEditingAlarm(null)
                    form.resetFields()
                }}
                onOk={() => form.submit()}
                okText={editingAlarm ? '更新' : '新增'}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{ alarm_time: dayjs() }}
                >
                    <Form.Item
                        label="API记录ID"
                        name="api_record_id"
                        rules={[
                            { required: true, message: '请输入API记录ID' },
                            {
                                pattern: /^\d+$/,
                                message: 'API记录ID必须为数字',
                            },
                        ]}
                    >
                        <Input disabled={!!editingAlarm} />
                    </Form.Item>

                    <Form.Item label="设备代码" name="device_code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="报警类型" name="alarm_type" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="报警等级" name="alarm_level" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="报警时间" name="alarm_time" rules={[{ required: true }]}>
                        <DatePicker
                            showTime
                            style={{ width: '100%' }}
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                    </Form.Item>

                    <Form.Item label="报警状态" name="alarm_status" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="报警时位置" name="location_at_alarm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
