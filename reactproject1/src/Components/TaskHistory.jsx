import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Popconfirm, Divider } from "antd";
import TaskHistoryTable from './TaskHistotyTable.jsx'

const baseURL = 'https://65b9e92ab4d53c0665519c00.mockapi.io/todo-app/data';

function TaskHistory() {
    // các hook phục vụ khai báo task
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
    
    
    // xử lý khôi phục task
    function recoverTask(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const temp = { ...task, deleted: false };
                handleUpdateTask(temp);
                return temp;
            } else {
                return task;
            }
        }));
    }

    // xóa lịch sử
    function deleteHistory() {
        const handleDeleteHistory = async (taskID) => {
            try {
                await axios.delete(baseURL + `/${taskID}`);
            } catch (error) {
                console.log('Error delete history:', error);
            }
        }
        const temp = tasks?.filter((task) => task.deleted);
        setTasks(temp.map(task => {
            handleDeleteHistory(task.id);
        }))
        setTasks(tasks?.filter((task) => !task.deleted))
    }

    const handleUpdateTask = async (task) => {
        try {
            await axios.put(baseURL + `/${task.id}`, task);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="frm">
            <h1>History</h1>

            <Divider/>

            <Popconfirm
                placement='bottom'
                color='#4cc2a0'
                title='Do you want to delete all the history?'
                okText='Yes'
                cancelText='No'
                onConfirm={deleteHistory}
            >
                <Button
                    style={{ backgroundColor: '#139218', width: '100%'}}
                    type="primary"
                    shape="square"
                    size="large"
                >Delete History</Button>
            </Popconfirm>

            <Divider/>

            {/*Bảng dữ liệu*/}
            <TaskHistoryTable
                key='data'
                task={tasks?.filter((task) => task.deleted)}
                recoverTask={recoverTask}
            />

        </div>
    );
}
export default TaskHistory;
