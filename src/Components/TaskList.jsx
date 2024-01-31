import React from 'react';
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import axios from 'axios';
import { Button, Input, Flex, Space, message, DatePicker, Select } from "antd";
import { FileAddFilled } from '@ant-design/icons';
import TaskListTable from './TaskListTable.jsx'

const baseURL = 'https://65b9e92ab4d53c0665519c00.mockapi.io/todo-app/data';

function TaskList() {
    // các hook phục vụ lưu trữ task mới
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(baseURL); // Replace with your actual API endpoint
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    const [text, setText] = useState('');
    const [date, setDate] = useState(dayjs());
    const [priority, setPriority] = useState(2);

    // lọc dữ liệu task
    const [filter, setFilter] = useState("All");
    const FILTER_MAP = {
        All: (task) => !task.deleted,
        Act: (task) => !task.completed && !task.deleted,
    };

    const [messageApi, contextHolder] = message.useMessage();

    // xử lý thêm task
    function addTask(text, date) {
        text = text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
        if (text == '' || date == null) {
            messageApi.open({
                type: 'error',
                content: 'Please fill all information!',
            });
        }
        else if (text.length >= 45) {
            messageApi.open({
                type: 'error',
                content: 'Task name too long (max 45 letter)',
            });
        }
        else {
            const newTask = {
                text,
                date,
                priority,
                starttime: '',
                finishtime: '',
                started: false,
                completed: false,
                deleted: false
            };
            /*setTasks([...tasks, newTask]);*/
            const handleNewData = async () => {
                try {
                    const response = await axios.post(baseURL, newTask); // Replace with your actual API endpoint
                    setTasks([...tasks, response.data]);
                    setText('');
                } catch (error) {
                    console.error('Error updating data:', error);
                }
            };
            handleNewData();
        }
    }

    function onSelectDate(date) {
        setDate(date);
    }

    function onSelectPriority(value) {
        setPriority(value);
    }

    // xử lý xóa task
    function deleteTask(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const temp = { ...task, deleted: true };
                handleUpdateTask(temp);
                return temp;
            } else {
                return task;
            }
        }));
    }

    //đặt trạng thái task hoàn thành
    function toggleCompleted(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const temp = { ...task, completed: !task.completed };
                handleUpdateTask(temp);
                return temp;
            } else {
                return task;
            }
        }));
    }

    //xử lý bắt đầu, kết thúc thực hiện
    function toggleStartTime(id) {
        setTasks(tasks.map(task => {
            if (task.id === id && task.finishtime != '') {
                const temp = { ...task, starttime: dayjs(), finishtime: '', started: true };
                handleUpdateTask(temp);
                return temp;
            } else if (task.id === id && task.finishtime == '') {
                const temp = { ...task, starttime: dayjs(), started: true };
                handleUpdateTask(temp);
                return temp;
            } else {
                return task;
            }
        }));
    }
    function toggleFinishTime(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const temp = { ...task, finishtime: dayjs(), started: false };
                handleUpdateTask(temp);
                return temp;
            } else {
                return task;
            }
        }));
    }


    const handleUpdateTask = async (task) => {
        try {
            await axios.put(baseURL + `/${task.id}`, task);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    //đồng hồ
    const [clock, setClock] = useState();
    useEffect(() => {
        const interval = setInterval(() => {
            setClock(dayjs().format('MMMM D, YYYY | hh:mm:ss A'));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="frm">
            <h2 style={{ textAlign: 'right' }}>{clock}</h2>
            <h1>My To-Do List</h1>
            <Space.Compact style={{ width: '100%' }}>       {/*viết nhập dữ liệu*/}
                <Input
                    size="large"
                    placeholder="Enter your task!"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <DatePicker
                    placeholder="Due Date"
                    style={{ width: 180 }}
                    defaultValue={dayjs()}
                    format={'DD/MM/YYYY'}
                    onChange={onSelectDate}
                />
                <Select
                    placeholder="Priority"
                    defaultValue='Medium'
                    style={{ width: 180, height: 40 }}
                    options={[
                        { value: 1, label: 'High' },
                        { value: 2, label: 'Medium' },
                        { value: 3, label: 'Low' },
                    ]}
                    onChange={onSelectPriority}
                />
                {contextHolder}
                <Button
                    type="primary"
                    size="large"
                    icon={<FileAddFilled />}
                    onClick={() => addTask(text, date)}
                >Add</Button>
            </Space.Compact>
            <Flex className='btn-grp' justify='space-evenly' align='center'>            {/*nút lọc*/}
                <Button
                    type={filter == 'All' ? "primary" : "default"}
                    size='large'
                    onClick={() => setFilter('All')}
                >All Tasks</Button>
                <Button
                    type={filter == 'Act' ? "primary" : "default"}
                    size='large'
                    onClick={() => setFilter('Act')}
                >In Progress</Button>
            </Flex>

            {/*Bảng dữ liệu*/}
            <h2>{tasks.filter(task => !task.deleted).length} {tasks.filter(task => !task.deleted).length !== 1 ? "tasks" : "task"} remaining</h2>

            <TaskListTable
                key='data'
                task={tasks?.filter(FILTER_MAP[filter])}
                deleteTask={deleteTask}
                toggleCompleted={toggleCompleted}
                toggleStartTime={toggleStartTime}
                toggleFinishTime={toggleFinishTime}
            />

        </div>
    );
}
export default TaskList;
