import React from 'react';
import dayjs from 'dayjs';
import { Button, Flex, Popconfirm, Typography, Tag, Popover } from "antd";
import { RedoOutlined } from '@ant-design/icons';

const { Text } = Typography;
function TaskHistoryItem({ task, recoverTask }) {

    const tagCode = (() => {
        if (task.completed)
            return 1
        else {
            return 2
        }
    })();

    const tagText = {
        1: 'COMPLETE',
        2: 'INCOMPLETE'
    }
    const tagColor = {
        1: 'success',
        2: 'error'
    }
    const priorityText = {
        1: 'HIGH',
        2: 'MEDIUM',
        3: 'LOW',
    }

    return (
        <Flex className="todo-item" justify="space-between" align="center">
            <Popover content={task.text} trigger='click' placement='topLeft'>
                <Text style={{ color: 'white', fontSize: 20, width: '50%', paddingLeft: 20 }} ellipsis='true'>
                    {task.text}
                </Text>
            </Popover>
            <Flex
                style={{ width: '25%' }}
                className="item-text"
                vertical="vertical"
            >
                <Tag
                    style={{ width: '100%', backgroundColor: '#2f2f2f', textAlign: 'center' }}
                    color={tagColor[tagCode]}>
                    {tagText[tagCode]}
                </Tag>
                <Tag
                    style={{ width: '100%', backgroundColor: '#2f2f2f', textAlign: 'center', borderColor: '#f0f0f0' }}
                    color='#f0f0f0'
                >
                    {priorityText[task.priority]}
                </Tag>
                <Text style={{ color: 'white', fontSize: 14, width: '100%' }} ellipsis='true'>
                    Hạn: {dayjs(task.date).format('DD/MM/YYYY')}
                </Text>
            </Flex>
            <Popconfirm
                placement='topRight'
                color='#999'
                title='Do you want to recover this task?'
                okText='Yes'
                cancelText='No'
                onConfirm={() => recoverTask(task.id)}
            >
                <Button
                    style={{backgroundColor: '#139218'} }
                    type="primary"
                    shape="square"
                    size="large"
                    icon= {<RedoOutlined />}
                ></Button>
            </Popconfirm>
        </Flex>
    );
}
export default TaskHistoryItem;
