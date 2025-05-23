import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

type Park = {
    yq_app_code: string
    yq_name: string
    kj_type?: string
    extra_details_json?: any
}

export default function ParksPage() {
    const queryClient = useQueryClient()
    const [form] = Form.useForm()
    const [editingPark, setEditingPark] = useState<Park | null>(null)
    const [modalVisible, setModalVisible] = useState(false)

    const { data, isLoading } = useQuery<Park[]>(['parks'], async () => {
        const res = await axios.get('/api/parks')
        return res.data
    })

    const createPark = useMutation(
        (newPark: Partial<Park>) => axios.post('/api/parks', newPark),
        {
            onSuccess: () => {
                message.success('新增成功')
                queryClient.invalidateQueries(['parks'])
                setModalVisible(false)
                form.resetFields()
            },
            onError: () => message.error('新增失败'),
        },
    )

    const updatePark = useMutation(
        (update: { id: string; data: Partial<Park> }) =>
            axios.put(`/api/parks/${update.id}`, update.data),
        {
            onSuccess: () => {
                message.success('更新成功')
                queryClient.invalidateQueries(['parks'])
                setModalVisible(false)
                setEditingPark(null)
                form.resetFields()
            },
            onError: () => message.error('更新失败'),
        },
    )

    const deletePark = useMutation(
        (id: string) => axios.delete(`/api/parks/${id}`),
        {
            onSuccess: () => {
                message.success('删除成功')
                queryClient.invalidateQueries(['parks'])
            },
            onError: () => message.error('删除失败'),
        },
    )

    const startEdit = (park: Park) => {
        setEditingPark(park)
        setModalVisible(true)
        form.setFieldsValue({
            ...park,
            extra_details_json: JSON.stringify(park.extra_details_json || {}, null, 2),
        })
    }

    const cancelEdit = () => {
        setEditingPark(null)
        setModalVisible(false)
        form.resetFields()
    }

    const submitForm = (values: any) => {
        let extraDetails
        try {
            extraDetails = values.extra_details_json
                ? JSON.parse(values.extra_details_json)
                : undefined
        } catch {
            message.error('额外详情JSON格式不正确')
            return
        }

        const payload = {
            ...values,
            extra_details_json: extraDetails,
        }

        if (editingPark) {
            updatePark.mutate({ id: editingPark.yq_app_code, data: payload })
        } else {
            createPark.mutate(payload)
        }
    }

    const columns = [
        {
            title: '代码',
            dataIndex: 'yq_app_code',
            key: 'yq_app_code',
            width: 150,
        },
        {
            title: '名称',
            dataIndex: 'yq_name',
            key: 'yq_name',
            width: 200,
        },
        {
            title: '科技类型',
            dataIndex: 'kj_type',
            key: 'kj_type',
            width: 150,
            render: (text: string) => text || '-',
        },
        {
            title: '操作',
            key: 'actions',
            width: 150,
            render: (_: any, record: Park) => (
                <Space>
                    <Button type="link" onClick={() => startEdit(record)}>
                        编辑
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            Modal.confirm({
                                title: `确认删除园区 ${record.yq_name} (${record.yq_app_code})？`,
                                onOk: () => deletePark.mutate(record.yq_app_code),
                            })
                        }}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Title level={2}>园区管理</Title>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => {
                    setEditingPark(null)
                    form.resetFields()
                    setModalVisible(true)
                }}
            >
                新增园区
            </Button>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="yq_app_code"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title={editingPark ? '编辑园区' : '新增园区'}
                visible={modalVisible}
                onCancel={cancelEdit}
                onOk={() => form.submit()}
                okText={editingPark ? '更新' : '新增'}
                confirmLoading={createPark.isLoading || updatePark.isLoading}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={submitForm}
                    initialValues={{ extra_details_json: '{}' }}
                >
                    <Form.Item
                        label="代码（唯一）"
                        name="yq_app_code"
                        rules={[
                            { required: true, message: '请输入代码' },
                            {
                                pattern: /^[a-zA-Z0-9_-]+$/,
                                message: '代码只能包含字母、数字、下划线或中划线',
                            },
                        ]}
                    >
                        <Input disabled={!!editingPark} />
                    </Form.Item>

                    <Form.Item
                        label="名称"
                        name="yq_name"
                        rules={[{ required: true, message: '请输入名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="科技类型" name="kj_type">
                        <Input />
                    </Form.Item>

                    <Form.Item label="额外详情（JSON）" name="extra_details_json">
                        <Input.TextArea rows={4} style={{ fontFamily: 'monospace' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
