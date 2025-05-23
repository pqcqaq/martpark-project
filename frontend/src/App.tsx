import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
    AppstoreOutlined,
    AlertOutlined,
    HomeOutlined,
    BuildOutlined,
    DesktopOutlined,
    DatabaseOutlined,
} from '@ant-design/icons'

import ParksPage from './pages/ParksPage'
import Alarms from './pages/Alarms'
import Buildings from './pages/Buildings'
import Devices from './pages/Devices'
import GenericRecords from './pages/GenericRecords'
import GenericStats from './pages/GenericStats'

type MenuInfo = {
    key: string
}

const { Header, Sider, Content } = Layout

export default function App() {
    const navigate = useNavigate()
    const location = useLocation()

    // 从路径中提取当前选中菜单项key
    const selectedKey = location.pathname

    const [collapsed, setCollapsed] = useState(false)

    const menuItems = [
        {
            key: '/parks',
            icon: <HomeOutlined />,
            label: 'Parks',
        },
        {
            key: '/alarms',
            icon: <AlertOutlined />,
            label: 'Alarms',
        },
        {
            key: '/buildings',
            icon: <BuildOutlined />,
            label: 'Buildings',
        },
        {
            key: '/devices',
            icon: <DesktopOutlined />,
            label: 'Devices',
        },
        {
            key: '/generic-records',
            icon: <DatabaseOutlined />,
            label: 'Generic Records',
        },
        {
            key: '/generic-stats',
            icon: <AppstoreOutlined />,
            label: 'Generic Stats',
        },
    ]

    // 点击菜单跳转
    const onMenuClick = ({ key }: MenuInfo) => {
        navigate(key)
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: '32px',
                        fontSize: 18,
                    }}
                >
                    Admin
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={onMenuClick}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        background: '#fff',
                        padding: 0,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 24,
                    }}
                >
                    管理后台系统
                </Header>
                <Content style={{ margin: '16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: '#fff',
                        }}
                    >
                        <Routes>
                            <Route path="/parks" element={<ParksPage />} />
                            <Route path="/alarms" element={<Alarms />} />
                            <Route path="/buildings" element={<Buildings />} />
                            <Route path="/devices" element={<Devices />} />
                            <Route path="/generic-records" element={<GenericRecords />} />
                            <Route path="/generic-stats" element={<GenericStats />} />
                            <Route path="*" element={<div>404 Not Found</div>} />
                        </Routes>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
