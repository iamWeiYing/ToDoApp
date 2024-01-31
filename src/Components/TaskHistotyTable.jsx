import React from 'react';
import dayjs from 'dayjs';
import { Typography, Table, Tag, Popconfirm, Button, Checkbox } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

const { Text } = Typography;

//tham số tag tiến trình
const tagText = {
    1: 'COMPLETE',
    2: 'INCOMPLETE'
}
const tagColor = {
    1: 'success',
    2: 'error'
}

//tham số tag ưu tiên
const priorityText = {
    1: 'HIGH',
    2: 'MEDIUM',
    3: 'LOW',
}


function TaskListTable({ task, recoverTask }) {

    const columns = [
        {
            //cột tên
            title: 'Task Name',
            dataIndex: 'text',
            key: 'text',
            width: '50%',
            fixed: 'left',
            render: (text) => < Text style={{ fontSize: 20, width: 350 }} ellipsis='true'>{text}</Text>,
        },
        {
            //cột tiến trình
            title: 'Progress',
            key: 'progress',
            width: '20%',
            render: (_, record) => {
                const processCode = (() => {
                    if (record.completed)
                        return 1
                    else return 2
                })();
                return (
                    <Tag
                        style={{ width: '100%', height: 20, backgroundColor: '#2f2f2f', textAlign: 'center' }}
                        color={tagColor[processCode]}
                    >
                        {tagText[processCode]}
                    </Tag>);
            }
        },
        {
            //cột ưu tiên
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: '15%',
            render: (text) => (
                <Tag
                    style={{ width: '100%', height: 20, backgroundColor: '#2f2f2f', textAlign: 'center', borderColor: '#f0f0f0' }}
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
            key: 'date',
            width: '20%',
            render: (date) =>
                <Text style={{ fontSize: 16 }} ellipsis='true'>
                    {dayjs(date).format('DD/MM/YYYY')}
                </Text>
        },
        {
            //cột hành động: khôi phục
            title: '',
            key: 'actRestore',
            width: '5%',
            fixed: 'right',
            render: (record) => (
                <Popconfirm
                    placement='topRight'
                    color='#4cc2a0'
                    title='Do you want to recover this task?'
                    okText='Yes'
                    cancelText='No'
                    onConfirm={() => recoverTask(record.id)}
                >
                    <Button
                        style={{ backgroundColor: '#139218' }}
                        type="primary"
                        shape="square"
                        size="large"
                        icon={<RedoOutlined />}
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
            scroll={{ x: 'max-content', y: 450 }}
        />
    )
}

export default TaskListTable;