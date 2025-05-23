// routers/bigdata.ts
import { Router } from 'express';
import prisma from '../prismaClient';
import moment from 'moment'; // For date manipulation

const router = Router();

// Helper function for consistent API response structure
const successResponse = (data: any, total?: number, size?: number, current?: number, pages?: number) => {
    if (total !== undefined && size !== undefined && current !== undefined && pages !== undefined) {
        return {
            code: 0,
            msg: 'SUCCESS',
            data: {
                records: data,
                total,
                size,
                current,
                pages,
            },
        };
    }
    return {
        code: 0,
        msg: 'SUCCESS',
        data: data,
    };
};

const errorResponse = (msg: string, code: number = 500) => {
    return {
        code,
        msg,
        data: null,
    };
};

/*-----------------------------运营态势------------------------------------*/

// 楼栋列表
router.get('/dashOp/getBuildingByYq', async (req, res) => {
    const { yqAppCode } = req.query; // Assuming yqAppCode is passed as a query parameter

    if (!yqAppCode) {
        return res.status(400).json(errorResponse('yqAppCode is required'));
    }

    try {
        const buildings = await prisma.buildings.findMany({
            where: {
                yq_app_code: String(yqAppCode),
            },
            select: {
                building_code: true,
                building_name: true,
                yq_app_code: true,
                floors_info_json: true,
            },
        });

        res.json(successResponse(buildings));
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json(errorResponse('Failed to fetch building list'));
    }
});


// 租赁态势——在租园区详情
router.get('/dashOp/getYqRentDto', async (req, res) => {
    // This data would typically come from a more complex aggregation of various tables
    // or external systems. For this exercise, we'll return the example static data.
    try {
        const data = {
            totalArea: "280629.86", //租赁面积--总面积
            rentArea: "94594.0", //已租面积
            unRentArea: "15258.0", //未租面积
            rentRate: "86.11", //出租率
            rentAvg: "1.04" //在租均价
        };
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching YqRentDto:', error);
        res.status(500).json(errorResponse('Failed to fetch YqRentDto'));
    }
});

// 租赁态势——在租公寓详情 (Returns the same sample as getYqRentDto based on provided JSON)
router.get('/dashOp/getGyRentDto', async (req, res) => {
    try {
        const data = {
            totalRooms: 1122, //租赁套数
            rentRooms: 360, //未租套数
            unRentRooms: 762, //已租套数
            roomRentRate: "32.09", //出租率
            roomRentAvg: "0.00"
        };
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching GyRentDto:', error);
        res.status(500).json(errorResponse('Failed to fetch GyRentDto'));
    }
});


// 财务态势——收入情况 (Echarts line chart)
router.get('/dashOp/financeStatistics', async (req, res) => {
    // This would typically involve aggregating financial records over time.
    // Using placeholder data as direct mapping isn't in schema.
    try {
        const data = [
            {
                time: "2025-05",
                timeType: null,
                money: "339700.99"
            },
            {
                time: "2025-04",
                timeType: null,
                money: "320000.50"
            },
            {
                time: "2025-03",
                timeType: null,
                money: "310000.20"
            },
            {
                time: "2025-02",
                timeType: null,
                money: "300000.10"
            },
            {
                time: "2025-01",
                timeType: null,
                money: "290000.00"
            }
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching finance statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch finance statistics'));
    }
});

// 财务态势——收入预测
router.get('/dashOp/getForecastStatistics', async (req, res) => {
    // Placeholder data as no direct schema for forecast.
    try {
        const data = [
            {
                time: "2025-05",
                timeType: null,
                money: "292980.00"
            },
            {
                time: "2025-06",
                timeType: null,
                money: "300000.00"
            },
            {
                time: "2025-07",
                timeType: null,
                money: "310000.00"
            }
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching forecast statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch forecast statistics'));
    }
});

// 财务态势——开票情况 (Echarts line chart)
router.get('/dashOp/getInvoiceStatistics', async (req, res) => {
    // Placeholder data as no direct schema for invoice statistics.
    try {
        const data = [
            {
                id: null, sid: null, kjType: null, syncType: null, yqAppCode: null,
                createTime: null, updateTime: null, yqName: null,
                time: "2024-05", //x轴
                timeType: null,
                totalInvoicingNumber: 0,
                receiptNumber: 0,
                totalInvoicingMoney: 0,
                receiptMoney: 0,
                sinvoicingNumber: 3,
                pinvoicingNumber: 14,
                sinvoicingMoney: 669705.27,
                pinvoicingMoney: 313515
            },
            {
                id: null, sid: null, kjType: null, syncType: null, yqAppCode: null,
                createTime: null, updateTime: null, yqName: null,
                time: "2024-06", //x轴
                timeType: null,
                totalInvoicingNumber: 1,
                receiptNumber: 1,
                totalInvoicingMoney: 1000,
                receiptMoney: 1000,
                sinvoicingNumber: 5,
                pinvoicingNumber: 18,
                sinvoicingMoney: 700000.00,
                pinvoicingMoney: 350000
            },
            {
                id: null, sid: null, kjType: null, syncType: null, yqAppCode: null,
                createTime: null, updateTime: null, yqName: null,
                time: "2024-07", //x轴
                timeType: null,
                totalInvoicingNumber: 2,
                receiptNumber: 2,
                totalInvoicingMoney: 2000,
                receiptMoney: 2000,
                sinvoicingNumber: 7,
                pinvoicingNumber: 20,
                sinvoicingMoney: 750000.00,
                pinvoicingMoney: 400000
            }
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching invoice statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch invoice statistics'));
    }
});

// 招商态势——新增客户数、新成交、退租客户数
router.get('/dashOp/getYearAgentStatistic', async (req, res) => {
    // Placeholder data as no direct schema for this.
    try {
        const data = {
            newLeaseClient: 15,
            newAgentClient: 8,
            newLeaveClient: 2
        };
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching year agent statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch year agent statistics'));
    }
});


// 招商态势——新增客户数趋势 (Echarts line chart)
router.get('/dashOp/getLeaseClientDto', async (req, res) => {
    // Placeholder data as no direct schema for this.
    try {
        const data = [
            { time: "2024-05", timeType: null, count: 5 },
            { time: "2024-06", timeType: null, count: 8 },
            { time: "2024-07", timeType: null, count: 12 },
            { time: "2024-08", timeType: null, count: 10 },
            { time: "2024-09", timeType: null, count: 15 },
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching lease client DTO:', error);
        res.status(500).json(errorResponse('Failed to fetch lease client DTO'));
    }
});

// 招商态势——新增客户数 (Same as getLeaseClientDto based on provided JSON)
router.get('/dashOp/getAgentClientDto', async (req, res) => {
    // Placeholder data as no direct schema for this.
    try {
        const data = [
            { time: "2024-05", timeType: null, count: 5 },
            { time: "2024-06", timeType: null, count: 8 },
            { time: "2024-07", timeType: null, count: 12 },
            { time: "2024-08", timeType: null, count: 10 },
            { time: "2024-09", timeType: null, count: 15 },
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching agent client DTO:', error);
        res.status(500).json(errorResponse('Failed to fetch agent client DTO'));
    }
});

// 活跃态势——在租园区详情
router.get('/dashOp/getActivityStatistic', async (req, res) => {
    // This data would typically come from various sources and be aggregated.
    // Using placeholder data as schema doesn't directly support these metrics.
    try {
        const data = {
            personCount: 8328, //园区人数
            visitCount: 0, //访客年度情况
            repairCount: 0, //报修年度情况
            msgSendCount: 5730, //当年消费情况，单位：次
            parkMonthMoney: "7000.00", //当年包月收费，显示0.70万元
            parkTempMoney: "3310.00", //当年停车收费，显示0.33万元
            carInCount: 10944 //当年车流量
        };
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching activity statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch activity statistics'));
    }
});

// 活跃态势——人流 月、年趋势 (Echarts line chart)
router.get('/dashOp/getPassengerDto', async (req, res) => {
    // This would typically involve aggregating data from Generic_Stats_And_TimeSeries
    // or external systems for person flow.
    try {
        const data = [
            { time: "2024-05", timeType: null, count: 114942 },
            { time: "2024-06", timeType: null, count: 120000 },
            { time: "2024-07", timeType: null, count: 118000 },
            { time: "2024-08", timeType: null, count: 130000 },
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching passenger DTO:', error);
        res.status(500).json(errorResponse('Failed to fetch passenger DTO'));
    }
});

/*-----------------------------业务感知------------------------------------*/

// 待办事宜——分页
router.get('/dashBiz/getUnApprovedList', async (req, res) => {
    // This would typically query a 'todo' or 'workflow' table, not directly available in schema.
    // Returning dummy paginated data.
    const page = parseInt(req.query.current as string) || 1;
    const pageSize = parseInt(req.query.size as string) || 10;
    const totalRecords = 50; // Example total
    const totalPages = Math.ceil(totalRecords / pageSize);

    const records = Array.from({ length: pageSize }).map((_, i) => ({
        id: (page - 1) * pageSize + i + 1,
        title: `待办事项 ${ (page - 1) * pageSize + i + 1}`,
        description: `这是待办事项 ${ (page - 1) * pageSize + i + 1} 的描述。`,
        status: '待处理',
        createTime: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss')
    }));

    res.json(successResponse(records, totalRecords, pageSize, page, totalPages));
});

// 设备状态——分页
router.get('/dashBiz/getAllDeviceList', async (req, res) => {
    const { yqAppCode, deviceName, deviceStatus, current = 1, size = 10 } = req.query;
    const page = parseInt(current as string);
    const pageSize = parseInt(size as string);

    try {
        const whereClause: any = {};
        if (yqAppCode) whereClause.yq_app_code = String(yqAppCode);
        if (deviceName) whereClause.device_name = { contains: String(deviceName) };
        if (deviceStatus) whereClause.device_status = String(deviceStatus);

        const devices = await prisma.devices.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: whereClause,
            select: {
                api_record_id: true, // Renamed to 'id' in frontend if needed
                device_code: true,
                device_name: true,
                device_type: true,
                device_status: true,
                location: true,
                responsible_person_name: true,
                last_updated: true,
                Park: {
                    select: {
                        yq_name: true,
                        yq_app_code: true,
                    },
                },
                Building: {
                    select: {
                        building_name: true,
                        building_code: true,
                    },
                },
            },
        });

        const total = await prisma.devices.count({ where: whereClause });
        const pages = Math.ceil(total / pageSize);

        const formattedDevices = devices.map(device => ({
            id: device.api_record_id, // Map BigInt to number if safe, otherwise handle as string
            sid: null, // Not directly from schema, set to null
            // kjType: device.Park?, // Assuming Park has kj_type, otherwise null
            kjType: "", // Assuming kj_type is available on Park
            syncType: "db", // Hardcoded as per example
            yqAppCode: device.Park?.yq_app_code,
            createTime: moment(device.last_updated).format('YYYY-MM-DD HH:mm:ss'), // Using last_updated as createTime for simplicity
            updateTime: moment(device.last_updated).format('YYYY-MM-DD HH:mm:ss'),
            yqName: device.Park?.yq_name,
            deviceName: device.device_name,
            deviceCode: device.device_code,
            deviceType: device.device_type,
            buildingName: device.Building?.building_name,
            buildingCode: device.Building?.building_code,
            location: device.location,
            deviceStatus: device.device_status,
            personCode: null, // Not directly from schema, set to null
            personName: device.responsible_person_name,
        }));

        res.json(successResponse(formattedDevices, total, pageSize, page, pages));
    } catch (error) {
        console.error('Error fetching all device list:', error);
        res.status(500).json(errorResponse('Failed to fetch device list'));
    }
});

// 设备状态——统计
router.get('/dashBiz/getDeviceStatistics', async (req, res) => {
    const { yqAppCode } = req.query;

    try {
        const whereClause: any = {};
        if (yqAppCode) whereClause.yq_app_code = String(yqAppCode);

        const totalDevices = await prisma.devices.count({ where: whereClause });
        const offlineDevices = await prisma.devices.count({ where: { ...whereClause, device_status: '0' } }); // Assuming '0' means offline
        const onlineDevices = await prisma.devices.count({ where: { ...whereClause, device_status: '1' } }); // Assuming '1' means online

        const data = {
            "1": totalDevices,
            "2": offlineDevices,
            "3": onlineDevices,
        };
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching device statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch device statistics'));
    }
});

// 报警事件——分页
router.get('/dashBiz/getAlarmList', async (req, res) => {
    const { yqAppCode, current = 1, size = 10, alarmType, alarmStatus, deviceName } = req.query;
    const page = parseInt(current as string);
    const pageSize = parseInt(size as string);

    try {
        const whereClause: any = {};
        if (yqAppCode) {
            whereClause.Device = {
                Park: {
                    yq_app_code: String(yqAppCode)
                }
            };
        }
        if (alarmType) whereClause.alarm_type = String(alarmType);
        if (alarmStatus) whereClause.alarm_status = String(alarmStatus);
        if (deviceName) whereClause.Device = { device_name: { contains: String(deviceName) } };


        const alarms = await prisma.alarms.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: whereClause,
            select: {
                api_record_id: true,
                device_code: true,
                alarm_type: true,
                alarm_level: true,
                alarm_time: true,
                alarm_status: true,
                location_at_alarm: true,
                last_updated: true,
                Device: {
                    select: {
                        device_name: true,
                        device_type: true,
                        responsible_person_name: true,
                        Building: {
                            select: {
                                building_name: true,
                                building_code: true,
                            }
                        },
                        Park: {
                            select: {
                                yq_name: true,
                                yq_app_code: true,
                            }
                        }
                    },
                },
            },
            orderBy: {
                alarm_time: 'desc'
            }
        });

        const total = await prisma.alarms.count({ where: whereClause });
        const pages = Math.ceil(total / pageSize);

        const formattedAlarms = alarms.map(alarm => ({
            id: alarm.api_record_id,
            sid: null, // Not directly from schema
            // kjType: alarm.Device?.Park?.kj_type, // Assuming kj_type is available on Park
            kjType: "", // Assuming kj_type is available on Park
            syncType: "db",
            yqAppCode: alarm.Device?.Park?.yq_app_code,
            createTime: moment(alarm.alarm_time).format('YYYY-MM-DD HH:mm:ss'), // Using alarm_time for create/update
            updateTime: moment(alarm.last_updated).format('YYYY-MM-DD HH:mm:ss'),
            yqName: alarm.Device?.Park?.yq_name,
            deviceCode: alarm.device_code,
            deviceName: alarm.Device?.device_name,
            deviceType: alarm.Device?.device_type,
            buildingName: alarm.Device?.Building?.building_name,
            buildingCode: alarm.Device?.Building?.building_code,
            location: alarm.location_at_alarm,
            personCode: null, // Not directly from schema
            personName: alarm.Device?.responsible_person_name,
            alarmType: alarm.alarm_type,
            alarmLevel: alarm.alarm_level,
            alarmTime: moment(alarm.alarm_time).format('YYYY-MM-DD HH:mm:ss'),
            alarmCode: moment(alarm.alarm_time).format('YYYY-MM-DD HH:mm:ss'), // Using alarm_time as alarmCode for simplicity
            alarmStatus: alarm.alarm_status,
        }));

        res.json(successResponse(formattedAlarms, total, pageSize, page, pages));
    } catch (error) {
        console.error('Error fetching alarm list:', error);
        res.status(500).json(errorResponse('Failed to fetch alarm list'));
    }
});


// 报警事件——统计
router.get('/dashBiz/getAlarmStatistics', async (req, res) => {
    const { yqAppCode } = req.query;
    try {
        const whereClause: any = {};
        if (yqAppCode) {
            whereClause.Device = {
                Park: {
                    yq_app_code: String(yqAppCode)
                }
            };
        }

        const totalAlarms = await prisma.alarms.count({ where: whereClause });

        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');
        const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
        const endOfLastMonth = moment().subtract(1, 'month').endOf('month');

        const currentMonthAlarms = await prisma.alarms.count({
            where: {
                ...whereClause,
                alarm_time: {
                    gte: startOfMonth.toDate(),
                    lte: endOfMonth.toDate(),
                },
            },
        });

        const lastMonthAlarms = await prisma.alarms.count({
            where: {
                ...whereClause,
                alarm_time: {
                    gte: startOfLastMonth.toDate(),
                    lte: endOfLastMonth.toDate(),
                },
            },
        });

        let monthOverMonthChange = 0;
        if (lastMonthAlarms > 0) {
            monthOverMonthChange = ((currentMonthAlarms - lastMonthAlarms) / lastMonthAlarms) * 100;
        } else if (currentMonthAlarms > 0) {
            monthOverMonthChange = 100; // If last month was 0 and current is > 0, it's 100% increase
        }


        const data = {
            "1": totalAlarms.toString(),
            "2": currentMonthAlarms.toString(),
            "3": lastMonthAlarms.toString(),
            "4": monthOverMonthChange.toFixed(2),
        };
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching alarm statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch alarm statistics'));
    }
});

// 空间直连——已绑定账号列表
router.get('/dashBiz/getBindAccounts', async (req, res) => {
    // This functionality isn't directly related to the provided database schema for "Parks",
    // "Buildings", "Devices", or "Alarms". It seems to be related to user accounts binding to parks.
    // Returning dummy data based on the structure of other list responses.
    const page = parseInt(req.query.current as string) || 1;
    const pageSize = parseInt(req.query.size as string) || 10;
    const totalRecords = 3; // Example total
    const totalPages = Math.ceil(totalRecords / pageSize);

    const records = [
        {
            "id": 1,
            "yqAppCode": "rcsj",
            "yqName": "睿创世界",
            "accountName": "admin_rcsj",
            "bindTime": "2023-01-01 10:00:00"
        },
        {
            "id": 2,
            "yqAppCode": "dl",
            "yqName": "达利集团",
            "accountName": "admin_dl",
            "bindTime": "2023-02-15 11:30:00"
        },
        {
            "id": 3,
            "yqAppCode": "testpark",
            "yqName": "测试园区",
            "accountName": "admin_test",
            "bindTime": "2023-03-20 14:00:00"
        }
    ].slice((page - 1) * pageSize, page * pageSize);

    res.json(successResponse(records, totalRecords, pageSize, page, totalPages));
});

// 空间直连——添加园区 (Placeholder as schema doesn't support "binding accounts")
router.post('/dashBiz/accountBind', async (req, res) => {
    const { yqAppCode, accountName } = req.body;
    // In a real application, you would perform validation and database operations here
    // to link an account to a yqAppCode.
    console.log(`Binding account ${accountName} to park ${yqAppCode}`);
    res.json(successResponse({ message: `Account ${accountName} bound to ${yqAppCode} successfully.` }));
});

// 空间直连——解绑园区 (Placeholder as schema doesn't support "binding accounts")
router.post('/dashBiz/accountUnBind', async (req, res) => {
    const { yqAppCode, accountName } = req.body;
    // In a real application, you would perform validation and database operations here
    // to unlink an account from a yqAppCode.
    console.log(`Unbinding account ${accountName} from park ${yqAppCode}`);
    res.json(successResponse({ message: `Account ${accountName} unbound from ${yqAppCode} successfully.` }));
});

/*-----------------------------安全态势------------------------------------*/

// 视频监控——监控列表
router.get('/dashSecure/getVideoDeviceChannelList', async (req, res) => {
    const { yqAppCode } = req.query;

    try {
        const whereClause: any = {
            device_type: "Video" // Assuming video devices have a specific type
        };
        if (yqAppCode) whereClause.yq_app_code = String(yqAppCode);

        const devices = await prisma.devices.findMany({
            where: whereClause,
            select: {
                device_code: true,
                device_name: true,
                device_status: true,
                yq_app_code: true,
                Park: {
                    select: {
                        yq_name: true,
                    }
                }
            },
        });

        const formattedDevices = devices.map(device => ({
            id: null, // Not directly available from schema
            createTime: null,
            updateTime: null,
            yqAppCode: device.yq_app_code,
            kjType: null,
            name: device.device_name, // Using device_name as channel name
            code: device.device_code, // Using device_code as channel code
            gbId: null,
            streamId: "0", // Default as per example
            streamStatus: null,
            deviceId: "0", // Default as per example
            deviceStatus: device.device_status === '1' ? '1' : '0', // Map to '1' for online, '0' for offline
            deviceCode: device.device_code,
            deviceName: device.device_name, // Keeping deviceName as is
            protocolType: null,
            organizationCode: device.yq_app_code ? `${device.yq_app_code.toUpperCase()}O0000000` : null, // Example mapping
            organizationName: device.Park?.yq_name,
        }));

        res.json(successResponse(formattedDevices));
    } catch (error) {
        console.error('Error fetching video device channel list:', error);
        res.status(500).json(errorResponse('Failed to fetch video device channel list'));
    }
});


// 预警态势——未处警统计 (表格)
router.get('/dashSecure/getUnDealAlarmList', async (req, res) => {
    const { yqAppCode } = req.query;

    try {
        const whereClause: any = {
            alarm_status: "报警中" // Assuming "报警中" (Alarming) means unhandled
        };
        if (yqAppCode) {
            whereClause.Device = {
                Park: {
                    yq_app_code: String(yqAppCode)
                }
            };
        }

        const alarms = await prisma.alarms.findMany({
            where: whereClause,
            select: {
                api_record_id: true,
                device_code: true,
                alarm_type: true,
                alarm_level: true,
                alarm_time: true,
                alarm_status: true,
                location_at_alarm: true,
                last_updated: true,
                Device: {
                    select: {
                        device_name: true,
                        device_type: true,
                        responsible_person_name: true,
                        Building: {
                            select: {
                                building_name: true,
                                building_code: true,
                            }
                        },
                        Park: {
                            select: {
                                yq_name: true,
                                yq_app_code: true,
                            }
                        }
                    },
                },
            },
            orderBy: {
                alarm_time: 'desc'
            }
        });

        const formattedAlarms = alarms.map(alarm => ({
            id: alarm.api_record_id,
            sid: null,
            // kjType: alarm.Device?.Park?.kj_type,
            kjType: "",
            syncType: "db",
            yqAppCode: alarm.Device?.Park?.yq_app_code,
            createTime: moment(alarm.alarm_time).format('YYYY-MM-DD HH:mm:ss'),
            updateTime: moment(alarm.last_updated).format('YYYY-MM-DD HH:mm:ss'),
            yqName: alarm.Device?.Park?.yq_name,
            deviceCode: alarm.device_code,
            deviceName: alarm.Device?.device_name,
            deviceType: alarm.Device?.device_type,
            buildingName: alarm.Device?.Building?.building_name,
            buildingCode: alarm.Device?.Building?.building_code,
            location: alarm.location_at_alarm,
            personCode: null,
            personName: alarm.Device?.responsible_person_name,
            alarmType: alarm.alarm_type,
            alarmLevel: alarm.alarm_level,
            alarmTime: moment(alarm.alarm_time).format('YYYY-MM-DD HH:mm:ss'),
            alarmCode: moment(alarm.alarm_time).format('YYYY-MM-DD HH:mm:ss'),
            alarmStatus: alarm.alarm_status,
        }));

        res.json(successResponse(formattedAlarms)); // Assuming this is not paginated based on example
    } catch (error) {
        console.error('Error fetching un-dealt alarm list:', error);
        res.status(500).json(errorResponse('Failed to fetch un-dealt alarm list'));
    }
});


// 预警态势——当月报警排行
router.get('/dashSecure/getCurMonthAlarmTimesDtos', async (req, res) => {
    const { yqAppCode } = req.query;
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    try {
        const whereClause: any = {
            alarm_time: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        };
        if (yqAppCode) {
            whereClause.Device = {
                Park: {
                    yq_app_code: String(yqAppCode)
                }
            };
        }

        // Group by alarm_type and count
        const alarmCounts = await prisma.alarms.groupBy({
            by: ['alarm_type'],
            _count: {
                alarm_type: true,
            },
            where: whereClause,
            orderBy: {
                _count: {
                    alarm_type: 'desc',
                },
            },
            take: 10, // Top 10 alarms
        });

        const formattedData = alarmCounts.map(item => ({
            alarmType: item.alarm_type,
            count: item._count.alarm_type,
        }));

        res.json(successResponse(formattedData));
    } catch (error) {
        console.error('Error fetching current month alarm times DTOs:', error);
        res.status(500).json(errorResponse('Failed to fetch current month alarm times DTOs'));
    }
});

// 预警态势——报警次数统计 (Line chart)
router.get('/dashSecure/getAlarmTrends', async (req, res) => {
    const { yqAppCode, timePeriod } = req.query; // timePeriod could be 'month', 'year'

    try {
        const whereClause: any = {};
        if (yqAppCode) {
            whereClause.Device = {
                Park: {
                    yq_app_code: String(yqAppCode)
                }
            };
        }

        let groupByFormat;
        let dateFilter: any = {};
        if (timePeriod === 'year') {
            groupByFormat = '%Y'; // Group by year
            dateFilter.gte = moment().subtract(1, 'year').startOf('year').toDate(); // Last 12 months data
            dateFilter.lte = moment().endOf('month').toDate();
        } else { // Default to month
            groupByFormat = '%Y-%m'; // Group by month
            dateFilter.gte = moment().subtract(11, 'months').startOf('month').toDate(); // Last 12 months data
            dateFilter.lte = moment().endOf('month').toDate();
        }

        const alarms = await prisma.$queryRaw`
            SELECT
                DATE_FORMAT(alarm_time, ${groupByFormat}) as time,
                COUNT(api_record_id) as count
            FROM
                Alarms
            WHERE
                alarm_time >= ${dateFilter.gte} AND alarm_time <= ${dateFilter.lte}
                ${yqAppCode ? `AND device_code IN (SELECT device_code FROM Devices WHERE yq_app_code = '${yqAppCode}')` : ''}
            GROUP BY
                time
            ORDER BY
                time ASC;
        `;

        res.json(successResponse(alarms));
    } catch (error) {
        console.error('Error fetching alarm trends:', error);
        res.status(500).json(errorResponse('Failed to fetch alarm trends'));
    }
});


// 人脸布控——人脸抓拍当月抓拍记录
router.get('/dashSecure/getCurMonthFaceTimesDtos', async (req, res) => {
    // This data would typically come from a dedicated "FaceRecords" or similar table
    // not explicitly in the schema. Returning placeholder data.
    try {
        const data = [
            {
                time: "2025-05-20",
                count: 1500
            },
            {
                time: "2025-05-21",
                count: 1600
            },
            {
                time: "2025-05-22",
                count: 1700
            },
            {
                time: "2025-05-23",
                count: 1800
            },
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching current month face times DTOs:', error);
        res.status(500).json(errorResponse('Failed to fetch current month face times DTOs'));
    }
});

// 人脸布控——当日抓拍人数
router.get('/dashSecure/getTodayFaceRecordCount', async (req, res) => {
    // Placeholder data.
    try {
        const data = Math.floor(Math.random() * 5000) + 1000; // Random number for today's count
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching today face record count:', error);
        res.status(500).json(errorResponse('Failed to fetch today face record count'));
    }
});

// 人脸布控——最近两条抓拍记录
router.get('/dashSecure/getLatestTwoRecords', async (req, res) => {
    // Placeholder data.
    try {
        const data = [
            {
                id: 1,
                personName: "张三",
                captureTime: "2025-05-23 09:00:00",
                imageUrl: "http://example.com/face1.jpg",
                location: "大门入口"
            },
            {
                id: 2,
                personName: "李四",
                captureTime: "2025-05-23 08:55:00",
                imageUrl: "http://example.com/face2.jpg",
                location: "C区电梯"
            },
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching latest two records:', error);
        res.status(500).json(errorResponse('Failed to fetch latest two records'));
    }
});

// 人脸布控——人脸抓拍统计 (Line chart)
router.get('/dashSecure/getFaceTrends', async (req, res) => {
    // Placeholder data.
    try {
        const data = [
            { time: "2024-05", timeType: null, count: 50318 },
            { time: "2024-06", timeType: null, count: 51000 },
            { time: "2024-07", timeType: null, count: 52000 },
            { time: "2024-08", timeType: null, count: 53000 },
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching face trends:', error);
        res.status(500).json(errorResponse('Failed to fetch face trends'));
    }
});

// 人脸布控——人脸抓拍图片
router.get('/dashSecure/getLastRecordPerDevice', async (req, res) => {
    // Placeholder data.
    try {
        const data = [
            {
                deviceCode: "cam_001",
                deviceName: "前台摄像头",
                latestCapture: {
                    id: 101,
                    captureTime: "2025-05-23 09:10:00",
                    imageUrl: "http://example.com/face_cam001.jpg",
                    personName: "王五"
                }
            },
            {
                deviceCode: "cam_002",
                deviceName: "后门摄像头",
                latestCapture: {
                    id: 102,
                    captureTime: "2025-05-23 09:05:00",
                    imageUrl: "http://example.com/face_cam002.jpg",
                    personName: "赵六"
                }
            }
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching last record per device:', error);
        res.status(500).json(errorResponse('Failed to fetch last record per device'));
    }
});

/*-----------------------------能耗态势------------------------------------*/

// 能耗态势——七天用水统计
router.get('/dashEnergy/recentSevenDaysWaterStatistic', async (req, res) => {
    const { yqAppCode } = req.query;
    try {
        const endDate = moment().endOf('day');
        const startDate = moment().subtract(6, 'days').startOf('day');

        const whereClause: any = {
            metric_source_api: { contains: 'water' }, // Assuming a convention for water metrics
            time_period_or_timestamp: {
                gte: startDate.toISOString(),
                lte: endDate.toISOString(),
            },
            metric_description: { contains: 'consumption' } // Further refinement
        };

        if (yqAppCode) whereClause.yq_app_code_context = String(yqAppCode);

        const waterStats = await prisma.generic_Stats_And_TimeSeries.findMany({
            where: whereClause,
            orderBy: {
                time_period_or_timestamp: 'asc',
            },
            select: {
                time_period_or_timestamp: true,
                value_numeric: true,
            }
        });

        // Aggregate by day
        const dailyDataMap = new Map<string, number>();
        let currentDay = moment(startDate);
        while (currentDay.isSameOrBefore(endDate, 'day')) {
            dailyDataMap.set(currentDay.format('YYYY-MM-DD'), 0);
            currentDay.add(1, 'day');
        }

        waterStats.forEach(stat => {
            const dateKey = moment(stat.time_period_or_timestamp).format('YYYY-MM-DD');
            const value = stat.value_numeric ? parseFloat(stat.value_numeric.toString()) : 0;
            dailyDataMap.set(dateKey, (dailyDataMap.get(dateKey) || 0) + value);
        });

        const formattedData = Array.from(dailyDataMap.entries()).map(([time, common]) => ({
            time: time,
            timeType: null,
            common: common,
        }));

        res.json(successResponse(formattedData));
    } catch (error) {
        console.error('Error fetching recent seven days water statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch recent seven days water statistics'));
    }
});


// 能耗态势——十二个月用水统计
router.get('/dashEnergy/recentMonthsWaterStatistic', async (req, res) => {
    const { yqAppCode } = req.query;
    try {
        const endDate = moment().endOf('month');
        const startDate = moment().subtract(11, 'months').startOf('month');

        const whereClause: any = {
            metric_source_api: { contains: 'water' },
            time_period_or_timestamp: {
                gte: startDate.toISOString(),
                lte: endDate.toISOString(),
            },
            metric_description: { contains: 'consumption' }
        };

        if (yqAppCode) whereClause.yq_app_code_context = String(yqAppCode);

        const waterStats = await prisma.generic_Stats_And_TimeSeries.findMany({
            where: whereClause,
            orderBy: {
                time_period_or_timestamp: 'asc',
            },
            select: {
                time_period_or_timestamp: true,
                value_numeric: true,
            }
        });

        // Aggregate by month
        const monthlyDataMap = new Map<string, number>();
        let currentMonth = moment(startDate);
        while (currentMonth.isSameOrBefore(endDate, 'month')) {
            monthlyDataMap.set(currentMonth.format('YYYY-MM'), 0);
            currentMonth.add(1, 'month');
        }

        waterStats.forEach(stat => {
            const monthKey = moment(stat.time_period_or_timestamp).format('YYYY-MM');
            const value = stat.value_numeric ? parseFloat(stat.value_numeric.toString()) : 0;
            monthlyDataMap.set(monthKey, (monthlyDataMap.get(monthKey) || 0) + value);
        });

        const formattedData = Array.from(monthlyDataMap.entries()).map(([time, common]) => ({
            time: time,
            timeType: null,
            common: common,
        }));

        res.json(successResponse(formattedData));
    } catch (error) {
        console.error('Error fetching recent months water statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch recent months water statistics'));
    }
});

// 能耗态势——当月用水排行
router.get('/dashEnergy/curMonthWaterDeviceRank', async (req, res) => {
    // This would likely involve more granular data than Generic_Stats_And_TimeSeries,
    // or detailed parsing of JSON fields if device-level data is stored there.
    // Returning empty array as per example.
    try {
        res.json(successResponse([]));
    } catch (error) {
        console.error('Error fetching current month water device rank:', error);
        res.status(500).json(errorResponse('Failed to fetch current month water device rank'));
    }
});


// 能耗态势——七天用电统计
router.get('/dashEnergy/recentSevenDaysElectricStatistic', async (req, res) => {
    const { yqAppCode } = req.query;
    try {
        const endDate = moment().endOf('day');
        const startDate = moment().subtract(6, 'days').startOf('day');

        const whereClause: any = {
            metric_source_api: { contains: 'electric' }, // Assuming a convention for electric metrics
            time_period_or_timestamp: {
                gte: startDate.toISOString(),
                lte: endDate.toISOString(),
            },
            metric_description: { contains: 'consumption' }
        };

        if (yqAppCode) whereClause.yq_app_code_context = String(yqAppCode);

        const electricStats = await prisma.generic_Stats_And_TimeSeries.findMany({
            where: whereClause,
            orderBy: {
                time_period_or_timestamp: 'asc',
            },
            select: {
                time_period_or_timestamp: true,
                value_numeric: true,
            }
        });

        const dailyDataMap = new Map<string, number>();
        let currentDay = moment(startDate);
        while (currentDay.isSameOrBefore(endDate, 'day')) {
            dailyDataMap.set(currentDay.format('YYYY-MM-DD'), 0);
            currentDay.add(1, 'day');
        }

        electricStats.forEach(stat => {
            const dateKey = moment(stat.time_period_or_timestamp).format('YYYY-MM-DD');
            const value = stat.value_numeric ? parseFloat(stat.value_numeric.toString()) : 0;
            dailyDataMap.set(dateKey, (dailyDataMap.get(dateKey) || 0) + value);
        });

        const formattedData = Array.from(dailyDataMap.entries()).map(([time, common]) => ({
            time: time,
            timeType: null,
            common: common,
        }));

        res.json(successResponse(formattedData));
    } catch (error) {
        console.error('Error fetching recent seven days electric statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch recent seven days electric statistics'));
    }
});

// 能耗态势——十二个月用电统计
router.get('/dashEnergy/recentMonthsElectricStatistic', async (req, res) => {
    const { yqAppCode } = req.query;
    try {
        const endDate = moment().endOf('month');
        const startDate = moment().subtract(11, 'months').startOf('month');

        const whereClause: any = {
            metric_source_api: { contains: 'electric' },
            time_period_or_timestamp: {
                gte: startDate.toISOString(),
                lte: endDate.toISOString(),
            },
            metric_description: { contains: 'consumption' }
        };

        if (yqAppCode) whereClause.yq_app_code_context = String(yqAppCode);

        const electricStats = await prisma.generic_Stats_And_TimeSeries.findMany({
            where: whereClause,
            orderBy: {
                time_period_or_timestamp: 'asc',
            },
            select: {
                time_period_or_timestamp: true,
                value_numeric: true,
            }
        });

        const monthlyDataMap = new Map<string, number>();
        let currentMonth = moment(startDate);
        while (currentMonth.isSameOrBefore(endDate, 'month')) {
            monthlyDataMap.set(currentMonth.format('YYYY-MM'), 0);
            currentMonth.add(1, 'month');
        }

        electricStats.forEach(stat => {
            const monthKey = moment(stat.time_period_or_timestamp).format('YYYY-MM');
            const value = stat.value_numeric ? parseFloat(stat.value_numeric.toString()) : 0;
            monthlyDataMap.set(monthKey, (monthlyDataMap.get(monthKey) || 0) + value);
        });

        const formattedData = Array.from(monthlyDataMap.entries()).map(([time, common]) => ({
            time: time,
            timeType: null,
            common: common,
        }));

        res.json(successResponse(formattedData));
    } catch (error) {
        console.error('Error fetching recent months electric statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch recent months electric statistics'));
    }
});

// 能耗态势——当月用电排行
router.get('/dashEnergy/curMonthElectricEnterRank', async (req, res) => {
    // Similar to water ranking, returning empty array as per example.
    try {
        res.json(successResponse([]));
    } catch (error) {
        console.error('Error fetching current month electric enterprise rank:', error);
        res.status(500).json(errorResponse('Failed to fetch current month electric enterprise rank'));
    }
});


// 能耗态势——查询年、月楼栋用水量
router.get('/dashEnergy/getWaterBuildingDto', async (req, res) => {
    const { yqAppCode, year, month, buildingCode } = req.query;

    if (!yqAppCode || !year || !month || !buildingCode) {
        return res.status(400).json(errorResponse('yqAppCode, year, month, and buildingCode are required'));
    }

    try {
        const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
        const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

        const whereClause: any = {
            metric_source_api: { contains: 'water' },
            time_period_or_timestamp: {
                gte: startOfMonth.toISOString(),
                lte: endOfMonth.toISOString(),
            },
            yq_app_code_context: String(yqAppCode),
            related_entity_code_context: String(buildingCode), // Assuming building_code is stored here
            metric_description: { contains: 'consumption' }
        };

        const waterUsage = await prisma.generic_Stats_And_TimeSeries.aggregate({
            _sum: {
                value_numeric: true,
            },
            where: whereClause,
        });

        const data = {
            buildingCode: buildingCode,
            year: parseInt(year as string),
            month: parseInt(month as string),
            waterConsumption: waterUsage._sum.value_numeric?.toString() || "0",
        };

        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching water building DTO:', error);
        res.status(500).json(errorResponse('Failed to fetch water building DTO'));
    }
});

// 能耗态势——查询年、月楼栋用电量
router.get('/dashEnergy/getElectricBuildingDto', async (req, res) => {
    const { yqAppCode, year, month, buildingCode } = req.query;

    if (!yqAppCode || !year || !month || !buildingCode) {
        return res.status(400).json(errorResponse('yqAppCode, year, month, and buildingCode are required'));
    }

    try {
        const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
        const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

        const whereClause: any = {
            metric_source_api: { contains: 'electric' },
            time_period_or_timestamp: {
                gte: startOfMonth.toISOString(),
                lte: endOfMonth.toISOString(),
            },
            yq_app_code_context: String(yqAppCode),
            related_entity_code_context: String(buildingCode), // Assuming building_code is stored here
            metric_description: { contains: 'consumption' }
        };

        const electricUsage = await prisma.generic_Stats_And_TimeSeries.aggregate({
            _sum: {
                value_numeric: true,
            },
            where: whereClause,
        });

        const data = {
            buildingCode: buildingCode,
            year: parseInt(year as string),
            month: parseInt(month as string),
            electricConsumption: electricUsage._sum.value_numeric?.toString() || "0",
        };

        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching electric building DTO:', error);
        res.status(500).json(errorResponse('Failed to fetch electric building DTO'));
    }
});


/*-----------------------------集团概况------------------------------------*/

// 集团信息——集团荣誉
router.get('/dashGroup/getHonorList', async (req, res) => {
    // This would likely come from a 'Honors' or 'News' table not directly in schema.
    // Returning placeholder data.
    try {
        const data = [
            {
                id: 1,
                createTime: "2025-04-12 11:28:35",
                updateTime: "2025-04-12 11:28:35",
                yqAppCode: "dl",
                yqName: null,
                code: "Hdlwehwad7ajwiums8",
                title: "达利集团荣获年度最佳创新奖",
                content: "<p>测试内容</p><p><img src=\"https://damai-parking.oss-cn-hangzhou.aliyuncs.com/upper/pic/20241125174757/eb0e8d08-bb6e-439c-801b-e642112c9214.png\"></p>",
                img: "https://damai-parking.oss-cn-hangzhou.aliyuncs.com/upper/pic/20240726101615/2b49909f-a95b-4890-8d0f-8ef724f2e77c.png",
                publishTime: "2025-04-10"
            },
            {
                id: 2,
                createTime: "2025-03-01 10:00:00",
                updateTime: "2025-03-01 10:00:00",
                yqAppCode: "rcsj",
                yqName: null,
                code: "Hrcsjwxyz12345678",
                title: "睿创世界获得智慧园区认证",
                content: "<p>睿创世界通过了国家级智慧园区认证，标志着其在智慧化运营方面达到行业领先水平。</p>",
                img: "https://damai-parking.oss-cn-hangzhou.aliyuncs.com/upper/pic/some-other-image.png",
                publishTime: "2025-02-28"
            }
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching honor list:', error);
        res.status(500).json(errorResponse('Failed to fetch honor list'));
    }
});

// 集团信息——集团资讯
router.get('/dashGroup/getNoticeList', async (req, res) => {
    // This would likely come from a 'Notices' or 'News' table not directly in schema.
    // Returning placeholder data.
    try {
        const data = [
            {
                id: 1,
                title: "关于园区疫情防护措施的通知",
                publishTime: "2025-05-20",
                content: "请园区内所有企业和个人严格遵守最新的疫情防护指南。",
                author: "园区管理处"
            },
            {
                id: 2,
                title: "智慧停车系统升级公告",
                publishTime: "2025-05-18",
                content: "为提升停车体验，智慧停车系统将于5月25日进行升级维护，届时可能影响部分服务。",
                author: "技术部"
            },
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching notice list:', error);
        res.status(500).json(errorResponse('Failed to fetch notice list'));
    }
});

// 集团信息、资产概况——资产信息
router.get('/dashGroup/getOne', async (req, res) => {
    const { yqAppCode } = req.query; // Assuming yqAppCode filters asset info
    // This likely comes from a 'GroupInfo' or 'AssetSummary' table, or aggregated from Parks.
    // Returning placeholder data for a specific yqAppCode or a generic one.
    try {
        const data = {
            id: 1,
            createTime: "2023-12-07 11:59:04",
            updateTime: "2023-12-07 11:59:04",
            yqAppCode: yqAppCode || "dl", // Use provided or default
            yqName: yqAppCode === "dl" ? "达利集团" : "默认园区",
            code: "Idlqefdwpwv9atab4t",
            totalArea: "280629.86", //总面积
            buildingArea: "250000", //建筑面积
            buildingCount: "30", //楼栋数量
            selfArea: "50000", //自持面积
            rentArea: "94594.0", //在租面积
            saleArea: "100000", //已售面积
            rentReadyArea: "15258.0", //待租面积
            enterCount: 200, //入驻企业数
            personCount: 8328, //园区人数
            img: "https://damai-parking.oss-cn-hangzhou.aliyuncs.com/upper/pic/some-asset-image.png"
        };
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching group one info:', error);
        res.status(500).json(errorResponse('Failed to fetch group one info'));
    }
});


// 资产概况——资产概况 (折线表)
router.get('/dashGroup/getOutputTaxInfoList', async (req, res) => {
    // This data would likely come from financial or asset records.
    // Returning placeholder data.
    try {
        const data = [
            {
                id: 3,
                createTime: "2024-07-26 14:21:04",
                updateTime: "2024-07-26 14:21:04",
                yqAppCode: "dl",
                yqName: null,
                code: "Tdlhoou9mdn9tgfz85",
                year: "2024",
                outputMoney: "899", //产值
                taxMoney: "439" //税收
            },
            {
                id: 4,
                createTime: "2023-07-26 14:21:04",
                updateTime: "2023-07-26 14:21:04",
                yqAppCode: "dl",
                yqName: null,
                code: "Tdlhoou9mdn9tgfz86",
                year: "2023",
                outputMoney: "850",
                taxMoney: "400"
            },
            {
                id: 5,
                createTime: "2022-07-26 14:21:04",
                updateTime: "2022-07-26 14:21:04",
                yqAppCode: "dl",
                yqName: null,
                code: "Tdlhoou9mdn9tgfz87",
                year: "2022",
                outputMoney: "800",
                taxMoney: "380"
            }
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching output tax info list:', error);
        res.status(500).json(errorResponse('Failed to fetch output tax info list'));
    }
});


// 代表企业——代表企业
router.get('/dashGroup/getRepresentEnterList', async (req, res) => {
    // This data would likely come from a 'Companies' or 'Enterprises' table with specific flags.
    // Returning placeholder data.
    try {
        const data = [
            {
                id: 1,
                createTime: "2024-07-26 13:40:30",
                updateTime: "2024-07-26 13:40:30",
                yqAppCode: "dl",
                yqName: null,
                code: "Edlufmo5z42vk5mpyz",
                name: "XX科技有限公司",
                industry: "互联网",
                shortName: "XX科技",
                tagNames: "高新技术企业,瞪羚企业",
                tagCodes: "HT,DZ",
                clientTag: "核心客户"
            },
            {
                id: 2,
                createTime: "2024-06-15 10:00:00",
                updateTime: "2024-06-15 10:00:00",
                yqAppCode: "rcsj",
                yqName: null,
                code: "Ercsjxyz987654321",
                name: "YY生物科技公司",
                industry: "生物医药",
                shortName: "YY生物",
                tagNames: "专精特新,上市企业",
                tagCodes: "ZJTX,SS",
                clientTag: "战略伙伴"
            }
        ];
        res.json(successResponse(data));
    } catch (error) {
        console.error('Error fetching represent enterprise list:', error);
        res.status(500).json(errorResponse('Failed to fetch represent enterprise list'));
    }
});


// 视频播放 (Special case: proxying external API)
// This endpoint is meant to proxy an external service. In a real scenario,
// you would make an HTTP request to 'yqUrl' and return its response.
// For this implementation, we'll return a dummy successful response.
router.post('/yq-video/videoDevice/getVideoHlsStream', async (req, res) => {
    const { deviceCode } = req.body;
    const yqAppCode = req.headers['yq-app-code']; // Custom header

    if (!deviceCode || !yqAppCode) {
        return res.status(400).json(errorResponse('deviceCode and yq-app-code header are required'));
    }

    try {
        // In a real application, you'd fetch the HLS stream from the external service:
        // const response = await axios.post(`${yqUrl}/yq-video/videoDevice/getVideoHlsStream`, { deviceCode }, {
        //     headers: { 'yq-app-code': yqAppCode }
        // });
        // res.json(response.data);

        // For now, return a dummy HLS stream URL
        res.json(successResponse({
            hlsStreamUrl: `http://example.com/hls/${deviceCode}.m3u8`
        }));
    } catch (error) {
        console.error('Error getting video HLS stream:', error);
        res.status(500).json(errorResponse('Failed to get video HLS stream'));
    }
});

// 通过id获取楼层点位图 (Special case: proxying external API)
// Similar to the video stream, this would proxy an external service.
router.get('/yq-dashboard/building/getFloorsByBuildingCode/:buildingCode', async (req, res) => {
    const { buildingCode } = req.params;

    if (!buildingCode) {
        return res.status(400).json(errorResponse('buildingCode is required'));
    }

    try {
        // In a real application, you'd fetch floor info from an external service:
        // const response = await axios.get(`${baseURL1}/yq-dashboard/building/getFloorsByBuildingCode/${buildingCode}`);
        // res.json(response.data);

        // For now, return dummy data
        const dummyFloors = [
            { floor: "1F", imageUrl: `http://example.com/floorplans/${buildingCode}_1f.png` },
            { floor: "2F", imageUrl: `http://example.com/floorplans/${buildingCode}_2f.png` },
        ];
        res.json(successResponse(dummyFloors));
    } catch (error) {
        console.error('Error fetching floors by building code:', error);
        res.status(500).json(errorResponse('Failed to fetch floors by building code'));
    }
});

// 通过id获取楼层点位信息 (Special case: proxying external API)
// Similar to the video stream, this would proxy an external service.
router.get('/yq-alarm/devicePtRoomIn/getList', async (req, res) => {
    const { buildingCode, floor } = req.query; // Assuming buildingCode and floor are required

    if (!buildingCode || !floor) {
        return res.status(400).json(errorResponse('buildingCode and floor are required'));
    }

    try {
        // In a real application, you'd fetch device point info from an external service:
        // const response = await axios.get(`${baseURL1}/yq-alarm/devicePtRoomIn/getList`, { params: { buildingCode, floor } });
        // res.json(response.data);

        // For now, return dummy data
        const dummyDevicePoints = [
            { deviceCode: "DEV001", deviceName: "烟感器A", x: 100, y: 50, status: "在线" },
            { deviceCode: "DEV002", deviceName: "摄像头B", x: 250, y: 120, status: "离线" },
        ];
        res.json(successResponse(dummyDevicePoints));
    } catch (error) {
        console.error('Error fetching device point room in list:', error);
        res.status(500).json(errorResponse('Failed to fetch device point room in list'));
    }
});


export default router;