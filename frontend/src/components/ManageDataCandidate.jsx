import React, { useState } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import DigitalClock from '../components/DigitalClock';
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import '../components-style/ManageDataStudent.css';
import '../components-style/ManageVoting.css';

const ManageDataCandidate = () => {
    const [students, setStudents] = useState([]);
    const [electionType, setElectionType] = useState('');
    const [open, setOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', studentId: '', faculty: '', major: '', vision: '' });
    const navigate = useNavigate();

    const handleDelete = (index) => {
        const updatedStudents = students.filter((_, i) => i !== index);
        setStudents(updatedStudents);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        setStudents(prevStudents => [...prevStudents, newStudent]);
        setNewStudent({ name: '', studentId: '', faculty: '', major: '', vision: '' });
        handleClose();
    };

    // ฟังก์ชัน handleConfirm
    const handleConfirm = () => {
        // ตรวจสอบว่ามีการเลือก electionType หรือไม่
        if (electionType) {
            navigate('/admin');
        } else {
            // หากไม่มีการเลือก electionType แสดงการแจ้งเตือน
            alert('กรุณาเลือกการเลือกตั้ง');
        }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูล (ตัวอย่าง)
    const saveData = async (data) => {
        try {
            // ตัวอย่างการบันทึกข้อมูลไปยังเซิร์ฟเวอร์
            const response = await fetch('/api/save-election', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };


    return (
        <>
            <NavbarAdmin />
            <DigitalClock />
            <div>
                <div className='election-form-container'>

                    <div className='VTitle'>
                        <img
                            loading="lazy"
                            src="https://cdn-icons-png.freepik.com/512/2393/2393401.png"
                            className="VImg"
                            alt=""
                        />
                        <div className='Votename'><h1>จัดการข้อมูลผู้ลงสมัคร</h1></div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="electionType">เลือกการเลือกตั้ง:</label>
                    <select
                        id="electionType"
                        value={electionType}
                        onChange={(e) => setElectionType(e.target.value)}
                        required
                    >
                        <option value="">เลือก</option>
                        <option value="1">การเลือกตั้งคณะวิศวกรรมศาสตร์และเทคโนโลยี</option>
                        <option value="2">การเลือกตั้งสาขา DIT</option>
                    </select>
                </div>
                <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ชื่อ</TableCell>
                                <TableCell>รหัสประจำตัวนักศึกษา</TableCell>
                                <TableCell>คณะ</TableCell>
                                <TableCell>สาขา</TableCell>
                                <TableCell>วิสัยทัศน์</TableCell>
                                <TableCell>แก้ไข</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student, index) => (
                                <TableRow key={index}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.studentId}</TableCell>
                                    <TableCell>{student.faculty}</TableCell>
                                    <TableCell>{student.major}</TableCell>
                                    <TableCell>{student.vision}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDelete(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className='VTitle'>
                    <Button
                        variant="contained"
                        component="span"
                        style={{ margin: 20, backgroundColor: '#A03939' }}
                        startIcon={<PersonAddIcon />}
                        onClick={handleClickOpen}
                    >
                        เพิ่มรายชื่อสมาชิก
                    </Button>
                </div>
                <div className="form-group button">
                    <button type="submit" className="btn btn-success" onClick={handleConfirm}>ยืนยัน</button>
                </div>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>กรอกรายชื่อสมาชิก</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="ชื่อ-นามสกุล"
                        type="text"
                        fullWidth
                        value={newStudent.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="studentId"
                        label="รหัสประจำตัวนักศึกษา"
                        type="text"
                        fullWidth
                        value={newStudent.studentId}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="faculty"
                        label="คณะ"
                        type="text"
                        fullWidth
                        value={newStudent.faculty}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="major"
                        label="สาขา"
                        type="text"
                        fullWidth
                        value={newStudent.major}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="vision"
                        label="วิสัยทัศน์"
                        type="text"
                        fullWidth
                        value={newStudent.vision}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        ย้อนกลับ
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageDataCandidate;
