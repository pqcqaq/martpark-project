import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale/zh_CN';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ConfigProvider
                    prefixCls="ant"
                    iconPrefixCls="anticon"
                    locale={zh_CN}
                >
                    <App />
                </ConfigProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
)
