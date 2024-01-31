import React, { useState } from 'react';
import { UnorderedListOutlined, DeleteOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import TaskList from './TaskList';
import TaskHistory from './TaskHistory';

const items = [
    {
        label: 'Task List',
        key: 'list',
        icon: <UnorderedListOutlined />,
        style: {width: '40%', textAlign: 'center'},
    },
    {
        label: 'Delete History',
        key: 'history',
        icon: <DeleteOutlined />,
        style: {width: '40%', textAlign: 'center'},
    }
];
function HeaderMenu()  {
    const [current, setCurrent] = useState('list');
    const onClick = (e) => {
        setCurrent(e.key);
    };
    function Condition() {
        if (current == 'list') {
            return <TaskList />;
        } else {
            return <TaskHistory />;
        }
    }

    return (
        <>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                theme='dark'
                items={items}
                style={{
                    padding: 0, width: 940, margin: 'auto', paddingRight: 60, justifyContent: 'space-between'
                }}
            />
            <Condition />
        </>
    )
}
export default HeaderMenu;