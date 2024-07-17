import React, { useState } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import DigitalClock from '../components/DigitalClock';
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import '../components-style/ManageDataStudent.css';

const ManageDataCandidate = () => {
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', studentId: '', faculty: '', major: '', vision: ''});

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
        setNewStudent({ name: '', studentId: '', faculty: '', major: '' , vision: ''});
        handleClose();
    };

    return (
        <>
            <NavbarAdmin />
            <DigitalClock />
            <div>
                <div className='VTitle'>
                    <img
                        loading="lazy"
                        src="https://cdn-icons-png.freepik.com/512/2393/2393401.png"
                        className="VImg"
                        alt=""
                    />
                    <div className='Votename'><h1>จัดการข้อมูลผู้ลงสมัคร</h1></div>
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
