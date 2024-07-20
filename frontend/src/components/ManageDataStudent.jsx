import React, { useState, useEffect, useContext } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import DigitalClock from '../components/DigitalClock';
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../components-style/ManageDataStudent.css';
import { getElection } from '../services/electionService';
import { addVoter } from '../services/voterService';

const ManageDataStudent = () => {
    const [students, setStudents] = useState([]);
    const [electionType, setElectionType] = useState('');
    const [open, setOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', studentId: '', faculty: '', major: '' });
    const navigate = useNavigate();
    const [election, setElection] = useState([]);
    
    async function fetchElection() {
        try {
          const rawData = await getElection();
          console.log(rawData)
          const allElection = rawData.map((election)=>{
            return election.election_name;
          })
          console.log(allElection)
          setElection(allElection); 
        //   if (Array.isArray(rawData)) {
        //     const data = mapElection(rawData);
        //       setElection(data);
        //   } else {
        //     console.error("Expected an array but got:", rawData);
        //   }
        } catch (error) {
          console.error("Failed to fetch election:", error);
        }
      }

    useEffect(() => {
        fetchElection();
    }, []);

    const handleImportExcel = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();


        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // ตรวจสอบโครงสร้างของข้อมูลที่อ่านได้
            console.log(data);

            // ลบแถวหัวเรื่องออกและกรอง row ที่ไม่มีข้อมูล
            const rows = data.slice(1).filter(row => row.some(cell => cell));

            // ตั้งค่าข้อมูลใน state
            const formattedData = rows.map(row => ({
                name: row[0],
                studentId: row[1],
                faculty: row[2],
                major: row[3],
            }));

            setStudents(formattedData);
        };

        reader.readAsBinaryString(file);
    };

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
        setNewStudent({ name: '', studentId: '', faculty: '', major: '' });
        handleClose();
    };

    const handleConfirm = async () => {
        // ตรวจสอบว่ามีการเลือก electionType หรือไม่
        if (electionType) {
            const studentList = createStudent();
            const electionName = election[electionType];
            await addVoter(electionName,studentList);
            //Sweetalert add
            // navigate('/admin');
            console.log(electionType);
        } else {
            // หากไม่มีการเลือก electionType แสดงการแจ้งเตือน
            alert('กรุณาเลือกการเลือกตั้ง');
        }
    };

    const createStudent =()=>{
        return students.map((student)=>(
            {
            student_id: student.studentId,
            name: student.name,
            faculty:student.faculty,
            major:student.major,
            mail: student.studentId+"@stu.pim.ac.th"
            }
        ))
    }

    return (
        <>
            <NavbarAdmin />
            <DigitalClock />
            <div>
                <div className='election-form-container'>
                    <div className='VTitle'>
                        <img
                            loading="lazy"
                            src="https://krishplayschool.com/images/icons/graduation.svg"
                            className="VImg"
                            alt=""
                        />
                        <div><h1>จัดการข้อมูลนักศึกษา</h1></div>
                    </div>
                </div>
                <div className='VTitle'>
                    <input
                        accept=".xlsx, .xls"
                        style={{ display: 'none' }}
                        id="upload-file"
                        type="file"
                        onChange={handleImportExcel}
                    />
                    <label htmlFor="upload-file">
                        <Button
                            variant="contained"
                            component="span"
                            style={{ margin: 20, backgroundColor: '#A03939' }}
                            startIcon={<img src="https://cdn-icons-png.flaticon.com/512/11039/11039795.png" alt="icon" style={{ width: 20, marginRight: 10 }} />}
                        >
                            นำเข้าข้อมูลนักศึกษา
                        </Button>
                    </label>
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
                        {
                            election.map((name, index)=>(
                                <option value={index}>{name}</option> 
                            ))
                        }
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

export default ManageDataStudent;
