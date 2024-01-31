import React from 'react';
import dayjs from 'dayjs';
import { Typography, Table, Tag, Popconfirm, Button, Checkbox } from 'antd';
import { DeleteFilled, CaretRightFilled, PauseOutlined } from '@ant-design/icons';

const { Text } = Typography;

//tham số tag tiến trình
const processText = {
    1: 'COMPLETE',
    2: 'PROGRESSING',
    3: 'DUE TODAY',
    4: 'OVERDUE',
}
const processColor = {
    1: 'success',
    2: 'processing',
    3: 'warning',
    4: 'error'
}

//tham số tag ưu tiên
const priorityText = {
    1: 'HIGH',
    2: 'MEDIUM',
    3: 'LOW',
}



function TaskListTable({ task, deleteTask, toggleCompleted, toggleStartTime, toggleFinishTime }) {

    const columns = [
        {
            //cột checkbox
            title: '',
            key: 'checkbox',
            fixed: 'left',
            width: 30,
            align: 'center',
            render: (record) => {
                function handleChange() {
                    toggleCompleted(record.id);
                }
                return (
                    <Checkbox
                        size="large"
                        checked={record.completed}
                        onChange={handleChange}
                        disabled={dayjs(record.date, 'YYYY-MM-DD').diff(dayjs().format('YYYY-MM-DD'), 'day') < 0 ? true : false}
                    />);
            }
        },
        {
            //cột tên
            title: 'Task Name',
            dataIndex: 'text',
            key: 'text',
            width: 220,
            fixed: 'left',
            sorter: (a, b) => a.text.localeCompare(b.text),
            sortDirections: ['ascend'],
            render: (text) => < Text style={{ fontSize: 20, width: 200 }} ellipsis='true'>{text}</Text>,
        },
        {
            //cột tiến trình
            title: 'Progress',
            key: 'progress',
            width: 120,
            align: 'center',
            render: (_, record) => {
                const processCode = (() => {
                    if (record.completed)
                        return 1
                    else {
                        if (dayjs(record.date, 'YYYY-MM-DD').diff(dayjs().format('YYYY-MM-DD'), 'day') > 0) return 2
                        if (dayjs(record.date, 'YYYY-MM-DD').diff(dayjs().format('YYYY-MM-DD'), 'day') == 0) return 3
                        if (dayjs(record.date, 'YYYY-MM-DD').diff(dayjs().format('YYYY-MM-DD'), 'day') < 0) return 4
                    }
                })();
                return (
                    <Tag
                        style={{ width: 100, height: 20, backgroundColor: '#2f2f2f', textAlign: 'center' }}
                        color={processColor[processCode]}
                    >
                        {processText[processCode]}
                    </Tag>);
            }
        },
        {
            //cột ưu tiên
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 120,
            align: 'center',
            sorter: (a, b) => a.priority - b.priority,
            render: (text) => (
                <Tag
                    style={{ width: 70, height: 20, backgroundColor: '#2f2f2f', textAlign: 'center', borderColor: '#f0f0f0' }}
                    color='#f0f0f0'
                >
                    {priorityText[text]}
                </Tag>
            ),
        },
        {
            //cột ngày hết hạn
            title: 'Due Date',
            dataIndex: 'date',
            key: 'dueDate',
            width: 110,
            align: 'center',
            render: (date) =>
                <Text style={{ fontSize: 16 }} ellipsis='true'>
                    {dayjs(date).format('DD/MM/YYYY')}
                </Text>
        },
        {
            //cột thời gian bắt đầu
            title: 'Start Time',
            dataIndex: 'starttime',
            key: 'startTime',
            width: 180,
            align: 'center',
            render: (date) => {
                if (dayjs(date).isValid())
                    return (
                        <Text style={{ fontSize: 16 }} ellipsis='true'>
                            {dayjs(date).format('DD-MM-YYYY | HH:mm:ss')}
                        </Text>
                    )
                else
                    return (
                        <Text style={{ fontSize: 16 }} ellipsis='true'></Text>
                    )
            }
        },
        {
            //cột thời gian kết thúc
            title: 'Finish Time',
            dataIndex: 'finishtime',
            key: 'finishTime',
            width: 180,
            align: 'center',
            render: (date) => {
                if (dayjs(date).isValid())
                    return (
                        <Text style={{ fontSize: 16 }} ellipsis='true'>
                            {dayjs(date).format('DD-MM-YYYY | HH:mm:ss')}
                        </Text>
                    )
                else
                    return (
                        <Text style={{ fontSize: 16 }} ellipsis='true'></Text>
                    )
            }
        },
        {
            //cột thời gian thực hiện
            title: 'Total Time',
            key: 'totalTime',
            width: 140,
            align: 'center',
            render: (record) => {
                const start = dayjs(record.starttime, 'YYYY-MM-DDTHH:mm:ss');
                const finish = dayjs(record.finishtime, 'YYYY-MM-DDTHH:mm:ss');
                const x = dayjs(finish).diff(start, 's') || 0
                const result = new Date(x * 1000)
                    .toISOString()
                    .slice(11, 19);
                return (
                    <Text style={{ fontSize: 16 }} ellipsis='true'>
                        {result}
                    </Text>
                )
            }
        },
        {
            //cột hành động: bắt đầu/kết thúc
            title: '',
            key: 'actWork',
            width: 60,
            align: 'center',
            fixed: 'right',
            render: (record) => {
                function handleStartChange() {
                    toggleStartTime(record.id);
                }
                function handleFinishChange() {
                    toggleFinishTime(record.id);
                }
                const BUTTON_MAP = {
                    1: <Button
                        disabled={record.completed || dayjs(record.date, 'YYYY-MM-DD').diff(dayjs().format('YYYY-MM-DD')) < 0}
                        style={{ backgroundColor: '#139218', width: 40 }}
                        type="primary"
                        shape="square"
                        size="large"
                        icon={<CaretRightFilled />}
                        onClick={handleStartChange}
                    ></Button>,

                    2: <Button danger
                        disabled={record.completed || dayjs(record.date, 'YYYY-MM-DD').diff(dayjs().format('YYYY-MM-DD')) < 0}
                        style={{ width: 40 }}
                        type="primary"
                        shape="square"
                        size="large"
                        icon={<PauseOutlined />}
                        onClick={handleFinishChange}
                    ></Button>,
                }
                return (
                    !record.started ? BUTTON_MAP[1] : BUTTON_MAP[2]
                )
            }
        },
        {
            //cột hành động: xóa
            title: '',
            key: 'actDelete',
            width: 60,
            align: 'center',
            fixed: 'right',
            render: (record) => (
                <Popconfirm
                    placement='topRight'
                    color='#4cc2a0'
                    title='Do you want to delete this task?'
                    okText='Yes'
                    cancelText='No'
                    onConfirm={() => deleteTask(record.id)}
                >
                    <Button danger
                        style={{ width: 40 }}
                        type="primary"
                        shape="square"
                        size="large"
                        icon={<DeleteFilled />}
                    ></Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            size='small'
            columns={columns}
            dataSource={task}
            scroll={{ y: 425 }}
        />
    )
}

export default TaskListTable;