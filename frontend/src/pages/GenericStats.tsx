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

interface GenericStat {
    stat_id: number
    metric_source_api: string
    metric_description: string
    yq_app_code_context: string
    related_entity_code_context: string
    time_period_or_timestamp: string
    value_numeric: number | null
    value_text: string | null
    value_complex_json: string | null
}

export default function GenericStats() {
    const [stats, setStats] = useState<GenericStat[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [editingStat, setEditingStat] = useState<GenericStat | null>(null)
    const [form] = Form.useForm()

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/generic-stats')
            setStats(res.data)
        } catch (error) {
            message.error('获取数据失败')
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const openModal = (stat?: GenericStat) => {
        if (stat) {
            form.setFieldsValue({
                ...stat,
                value_complex_json: stat.value_complex_json || '',
            })
            setEditingStat(stat)
        } else {
            form.resetFields()
            setEditingStat(null)
        }
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setEditingStat(null)
        form.resetFields()
    }

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '确认删除该统计项？',
            onOk: async () => {
                try {
                    await axios.delete(`/api/generic-stats/${id}`)
                    message.success('删除成功')
                    fetchStats()
                } catch {
                    message.error('删除失败')
                }
            },
        })
    }

    const onFinish = async (values: any) => {
        // 校验 JSON 格式
        try {
            if (values.value_complex_json) {
                JSON.parse(values.value_complex_json)
            }
        } catch {
            message.error('复杂JSON值格式错误')
            return
        }

        try {
            if (editingStat) {
                await axios.put(`/api/generic-stats/${editingStat.stat_id}`, values)
                message.success('更新成功')
            } else {
                await axios.post('/api/generic-stats', values)
                message.success('新增成功')
            }
            closeModal()
            fetchStats()
        } catch {
            message.error(editingStat ? '更新失败' : '新增失败')
        }
    }

    const columns = [
        {
            title: '统计ID',
            dataIndex: 'stat_id',
            key: 'stat_id',
            width: 80,
        },
        {
            title: '指标来源API',
            dataIndex: 'metric_source_api',
            key: 'metric_source_api',
            width: 180,
        },
        {
            title: '指标描述',
            dataIndex: 'metric_description',
            key: 'metric_description',
            width: 200,
        },
        {
            title: '园区代码上下文',
            dataIndex: 'yq_app_code_context',
            key: 'yq_app_code_context',
            width: 150,
        },
        {
            title: '相关实体代码上下文',
            dataIndex: 'related_entity_code_context',
            key: 'related_entity_code_context',
            width: 150,
        },
        {
            title: '时间段或时间戳',
            dataIndex: 'time_period_or_timestamp',
            key: 'time_period_or_timestamp',
            width: 150,
        },
        {
            title: '数值',
            dataIndex: 'value_numeric',
            key: 'value_numeric',
            width: 100,
            render: (val: number | null) => (val === null ? '-' : val),
        },
        {
            title: '文本值',
            dataIndex: 'value_text',
            key: 'value_text',
            width: 150,
            render: (val: string | null) => val || '-',
        },
        {
            title: '复杂JSON值',
            dataIndex: 'value_complex_json',
            key: 'value_complex_json',
            width: 200,
            render: (val: string | null) => (
                <pre
                    style={{
                        maxHeight: 100,
                        overflow: 'auto',
                        background: '#f5f5f5',
                        padding: 8,
                        borderRadius: 4,
                    }}
                >
                    {val ? JSON.stringify(val) : '-'}
                </pre>
            ),
        },
        {
            title: '操作',
            key: 'actions',
            width: 120,
            fixed: 'right' as const,
            render: (_: any, record: GenericStat) => (
                <Space>
                    <Button size="small" type="link" onClick={() => openModal(record)}>
                        编辑
                    </Button>
                    <Button
                        size="small"
                        type="link"
                        danger
                        onClick={() => handleDelete(record.stat_id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Title level={2}>通用统计管理</Title>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => openModal()}
            >
                新增统计项
            </Button>

            <Table
                columns={columns}
                dataSource={stats}
                rowKey="stat_id"
                scroll={{ x: 1300 }}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title={editingStat ? '编辑统计项' : '新增统计项'}
                visible={modalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText={editingStat ? '更新' : '新增'}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        value_numeric: null,
                        value_text: '',
                        value_complex_json: '',
                    }}
                >
                    <Form.Item
                        label="指标来源API"
                        name="metric_source_api"
                        rules={[{ required: true, message: '请输入指标来源API' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="指标描述"
                        name="metric_description"
                        rules={[{ required: true, message: '请输入指标描述' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="园区代码上下文"
                        name="yq_app_code_context"
                        rules={[{ required: true, message: '请输入园区代码上下文' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="相关实体代码上下文"
                        name="related_entity_code_context"
                        rules={[{ required: true, message: '请输入相关实体代码上下文' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="时间段或时间戳"
                        name="time_period_or_timestamp"
                        rules={[{ required: true, message: '请输入时间段或时间戳' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="数值" name="value_numeric">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="文本值" name="value_text">
                        <Input />
                    </Form.Item>

                    <Form.Item label="复杂JSON值" name="value_complex_json">
                        <TextArea rows={4} style={{ fontFamily: 'monospace' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
