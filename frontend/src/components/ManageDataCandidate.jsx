import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import DigitalClock from '../components/DigitalClock';
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import '../components-style/ManageDataStudent.css';
import '../components-style/ManageVoting.css';
import { getElection } from '../services/electionService';
import { addCandidate, getCandidates, deleteCandidate } from '../services/candidateService';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';

const ManageDataCandidate = () => {
    const [candidates, setCandidates] = useState([]);
    const [electionType, setElectionType] = useState('');
    const [open, setOpen] = useState(false);
    const [newCandidate, setNewCandidate] = useState({ name: '', studentId: '', faculty: '', major: '', vision: '' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [election, setElection] = useState([]);
    const [loading, setLoading] = useState(false); // เพิ่มสถานะการโหลดนี้

    async function fetchElection() {
        setIsLoading(true)
        try {
            const rawData = await getElection();
            console.log(rawData)
            const allElection = rawData.map((election) => {
                return election.election_name;
            })
            console.log(allElection)
            setElection(allElection);
        } catch (error) {
            console.error("Failed to fetch election:", error);
        } finally {
            setIsLoading(false)
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
                vision: row[4]
            }));

            setCandidates(formattedData);
        };

        reader.readAsBinaryString(file);
    };

    const handleDelete = async (index) => {
        if (electionType) {
            const electionName = election[electionType]
            await deleteCandidate(electionName, candidates[index].studentId)
            console.log("delete pass")
            const updatedCandidates = candidates.filter((_, i) => i !== index);
            setCandidates(updatedCandidates);
        } else {
            alert('กรุณาเลือกการเลือกตั้ง');
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewCandidate(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        setCandidates(prevCandidates => [...prevCandidates, newCandidate]);
        setNewCandidate({ name: '', studentId: '', faculty: '', major: '', vision: '' });
        handleClose();
    };

    // ฟังก์ชัน handleConfirm
    const handleConfirm = async () => {
        // ตรวจสอบว่ามีการเลือก electionType หรือไม่
        if (electionType) {
            setLoading(true); // ตั้งค่าสถานะการโหลดเป็น true
            const candidateList = createCandidate();
            const electionName = election[electionType];
            await addCandidate(electionName, candidateList);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "ดำเนินการเสร็จสิ้น",
                showConfirmButton: false,
                timer: 1500
            });
            await fetchCandidates(); // Fetch the updated list of candidates
            setLoading(false); // ตั้งค่าสถานะการโหลดเป็น false
        } else {
            // หากไม่มีการเลือก electionType แสดงการแจ้งเตือน
            alert('กรุณาเลือกการเลือกตั้ง');
        }
    };

    const fetchCandidates = async () => {
        if (electionType) {
            const electionName = election[electionType];
            const candidatesList = await getCandidates(electionName);
            const candidateListMapped = candidatesList.map((candidate) => ({
                name: candidate.name,
                studentId: candidate.student_id,
                faculty: candidate.faculty,
                major: candidate.major,
                vision: candidate.vision
            }));
            setCandidates(candidateListMapped);
        } else {
            setCandidates([]);
        }
    };

    const createCandidate = () => {
        return candidates.map((candidate) => (
            {
                student_id: candidate.studentId,
                name: candidate.name,
                faculty: candidate.faculty,
                major: candidate.major,
                vision: candidate.vision
            }
        ))
    }

    const handelDropdownChange = async () => {
        setLoading(true); // ตั้งค่าสถานะการโหลดเป็น true
        if (electionType) {
            const electionName = election[electionType]
            const candidatesList = await getCandidates(electionName);
            const candidateListMapped = candidatesList.map((candidate) => (
                {
                    name: candidate.name,
                    studentId: candidate.student_id,
                    faculty: candidate.faculty,
                    major: candidate.major,
                    vision: candidate.vision
                }
            ))
            setCandidates(candidateListMapped);
        } else {
            setCandidates([])
        }
        setLoading(false); // ตั้งค่าสถานะการโหลดเป็น false
    }

    useEffect(() => {
        handelDropdownChange()
    }, [electionType])

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <ClipLoader
                    color="#ff0000"
                    cssOverride={{}}
                    size={100}
                    speedMultiplier={2}
                />
            </div>
        );
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
                            src="https://cdn-icons-png.freepik.com/512/2393/2393401.png"
                            className="VImg"
                            alt=""
                        />
                        <div className='Votename'><h1>จัดการข้อมูลผู้ลงสมัคร</h1></div>
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
                            style={{ minWidth: 250, backgroundColor: '#A03939', alignItems: 'center', justifyContent: 'center' }}
                            startIcon={<img src="https://cdn-icons-png.flaticon.com/512/11039/11039795.png" alt="icon" style={{ maxWidth: 70 }} />}
                        >
                            <span>นำเข้าข้อมูลนักศึกษา</span>
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
                            election.map((name, index) => (
                                <option key={index} value={index}>{name}</option>
                            ))
                        }
                    </select>
                </div>
                <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {loading ? <CircularProgress style={{ display: 'flex', justifyContent: 'center', padding: '20px' }} /> : (
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
                                {candidates.map((candidate, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{candidate.name}</TableCell>
                                        <TableCell>{candidate.studentId}</TableCell>
                                        <TableCell>{candidate.faculty}</TableCell>
                                        <TableCell>{candidate.major}</TableCell>
                                        <TableCell>{candidate.vision}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDelete(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
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
                    <button type="submit" className="btn btn-success" onClick={handleConfirm} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'ยืนยัน'}</button>
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
                        value={newCandidate.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="studentId"
                        label="รหัสประจำตัวนักศึกษา"
                        type="text"
                        fullWidth
                        value={newCandidate.studentId}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="faculty"
                        label="คณะ"
                        type="text"
                        fullWidth
                        value={newCandidate.faculty}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="major"
                        label="สาขา"
                        type="text"
                        fullWidth
                        value={newCandidate.major}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="vision"
                        label="วิสัยทัศน์"
                        type="text"
                        fullWidth
                        value={newCandidate.vision}
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
