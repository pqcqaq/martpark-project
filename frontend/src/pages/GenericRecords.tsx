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

interface GenericRecord {
    record_id: number
    record_type: string
    yq_app_code_context: string
    related_entity_code: string
    record_data_json: string
}

export default function GenericRecords() {
    const [records, setRecords] = useState<GenericRecord[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [editingRecord, setEditingRecord] = useState<GenericRecord | null>(null)
    const [form] = Form.useForm()

    const fetchRecords = async () => {
        try {
            const res = await axios.get('/api/generic-records')
            setRecords(res.data)
        } catch {
            message.error('获取记录失败')
        }
    }

    useEffect(() => {
        fetchRecords()
    }, [])

    const openModal = (record?: GenericRecord) => {
        if (record) {
            form.setFieldsValue(record)
            setEditingRecord(record)
        } else {
            form.resetFields()
            setEditingRecord(null)
        }
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setEditingRecord(null)
        form.resetFields()
    }

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '确认删除该记录？',
            onOk: async () => {
                try {
                    await axios.delete(`/api/generic-records/${id}`)
                    message.success('删除成功')
                    fetchRecords()
                } catch {
                    message.error('删除失败')
                }
            },
        })
    }

    const onFinish = async (values: any) => {
        // 校验 JSON 格式
        try {
            if (values.record_data_json) {
                JSON.parse(values.record_data_json)
            }
        } catch {
            message.error('记录数据 JSON 格式错误')
            return
        }

        try {
            if (editingRecord) {
                await axios.put(`/api/generic-records/${editingRecord.record_id}`, values)
                message.success('更新成功')
            } else {
                await axios.post('/api/generic-records', values)
                message.success('新增成功')
            }
            closeModal()
            fetchRecords()
        } catch {
            message.error(editingRecord ? '更新失败' : '新增失败')
        }
    }

    const columns = [
        {
            title: '记录ID',
            dataIndex: 'record_id',
            key: 'record_id',
            width: 80,
        },
        {
            title: '记录类型',
            dataIndex: 'record_type',
            key: 'record_type',
            width: 150,
        },
        {
            title: '园区代码上下文',
            dataIndex: 'yq_app_code_context',
            key: 'yq_app_code_context',
            width: 150,
        },
        {
            title: '相关实体代码',
            dataIndex: 'related_entity_code',
            key: 'related_entity_code',
            width: 150,
        },
        {
            title: '记录数据 JSON',
            dataIndex: 'record_data_json',
            key: 'record_data_json',
            width: 250,
            render: (val: string) => (
                <pre
                    style={{
                        maxHeight: 100,
                        overflow: 'auto',
                        background: '#f5f5f5',
                        padding: 8,
                        borderRadius: 4,
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
            render: (_: any, record: GenericRecord) => (
                <Space>
                    <Button size="small" type="link" onClick={() => openModal(record)}>
                        编辑
                    </Button>
                    <Button
                        size="small"
                        type="link"
                        danger
                        onClick={() => handleDelete(record.record_id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Title level={2}>通用记录管理</Title>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => openModal()}
            >
                新增记录
            </Button>

            <Table
                columns={columns}
                dataSource={records}
                rowKey="record_id"
                scroll={{ x: 1000 }}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title={editingRecord ? '编辑记录' : '新增记录'}
                visible={modalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText={editingRecord ? '更新' : '新增'}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="记录类型"
                        name="record_type"
                        rules={[{ required: true, message: '请输入记录类型' }]}
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
                        label="相关实体代码"
                        name="related_entity_code"
                        rules={[{ required: true, message: '请输入相关实体代码' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="记录数据 JSON"
                        name="record_data_json"
                        rules={[{ required: true, message: '请输入记录数据 JSON' }]}
                    >
                        <TextArea rows={6} style={{ fontFamily: 'monospace' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
