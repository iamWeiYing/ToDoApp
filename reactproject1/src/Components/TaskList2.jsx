import React from 'react';
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import axios from 'axios';
import { create } from 'zustand';
import { Button, Input, Flex, Space, message, DatePicker, Select, Divider } from "antd";
import { FileAddFilled } from '@ant-design/icons';
import TaskListTable from './TaskListTable.jsx'

const baseURL = 'https://65a4dc9152f07a8b4a3dcf80.mockapi.io/todo-app/data';

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
    //const [filter, setFilter] = useState("All");
    const FILTER_MAP = {
        All: (task) => !task.deleted,
        Act: (task) => !task.completed && !task.deleted,
    };
    const useStore = create(set => ({
        current: 'All',
        value1: 'All',
        value2: 'Act',
        switchAll: () => set(state => ({ current: state.value1 })),
        switchAct: () => set(state => ({ current: state.value2 })),
    }));
    const getCurrent = useStore(state => state.current);
    const switchAll = useStore(state => state.switchAll);
    const switchAct = useStore(state => state.switchAct);

    // hook để sort dữ liệu
    /*const SORT_MAP = {
        Priority: sortByName,
        Name: sortByPriority,
    }*/

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


    /*function sortByName() {
        const dataToSort = [...tasks].sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0));
        setTasks(dataToSort);
        localStorage.setItem('sorter', 'Name');
    }

    function sortByPriority() {
        const dataToSort = [...tasks].sort((a, b) => Number(a.priority) - Number(b.priority));
        setTasks(dataToSort);
        localStorage.setItem('sorter', 'Priority');
    }*/

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
                    type={getCurrent == 'All' ? "primary" : "default"}
                    size='large'
                    onClick={switchAll}
                >All Tasks</Button>
                <Button
                    type={getCurrent == 'Act' ? "primary" : "default"}
                    size='large'
                    onClick={switchAct}
                >In Progress</Button>
                {/*<Divider type="vertical" />
                <Button
                    style={{ width: '35%', backgroundColor: '#005e03' }}
                    type="primary"
                    size='large'
                    onClick={SORT_MAP[localStorage.getItem('sorter')]}
                >Sort by {localStorage.getItem('sorter')}</Button>*/}
            </Flex>

            {/*Bảng dữ liệu*/}
            <h2>{tasks.filter(task => !task.deleted).length} {tasks.filter(task => !task.deleted).length !== 1 ? "tasks" : "task"} remaining</h2>
            
            <TaskListTable
                key='data'
                task={tasks?.filter(FILTER_MAP[getCurrent])}
                deleteTask={deleteTask}
                toggleCompleted={toggleCompleted}
                toggleStartTime={toggleStartTime}
                toggleFinishTime={toggleFinishTime}
            />

        </div>
    );
}
export default TaskList;
