import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import DigitalClock from '../components/DigitalClock';
import { IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Added import
import { useNavigate } from 'react-router-dom';
import '../components-style/ManageDataStudent.css';
import '../components-style/ManageVoting.css';
import { getElection } from '../services/electionService';
import { addCandidate, getCandidates, deleteCandidate } from '../services/candidateService';
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';

const ManageDataCandidate = () => {
    const [candidates, setCandidates] = useState([]);
    const [electionType, setElectionType] = useState('');
    const [open, setOpen] = useState(false);
    const [newCandidate, setNewCandidate] = useState({ name: '', studentId: '', faculty: '', major: '', vision: '', image: '' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [election, setElection] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [file ,setFile] = useState([])

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
            //alert here
            console.error("Failed to fetch election:", error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchElection();
    }, []);

   
    const handleDelete = async (index) => {
        if (electionType) {
            //add try catch here
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
        setImagePreview('')
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile((prevFile) => [...prevFile, file])
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCandidate(prevState => ({
                    ...prevState,
                    image: reader.result
                }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setNewCandidate(prevState => ({
                ...prevState,
                image: ''
            }));
            setImagePreview('');
        }
    };

    const handleSubmit = () => {
        setCandidates(prevCandidates => [...prevCandidates, newCandidate]);
        setNewCandidate({ name: '', studentId: '', faculty: '', major: '', vision: '', image: '' });
        handleClose();
    };

    const handleConfirm = async () => {
        //add try catch here
        if (electionType) {
            setLoading(true);
            const formData = new FormData();
            console.log(file)
            const candidateList = createCandidate();
            let candidateString = JSON.stringify(candidateList)
            console.log(candidateString)
            const electionName = election[electionType];
            formData.append('election_name', electionName);
            formData.append('candidate_list', candidateString);
            for (let i = 0; i < file.length; i++) {
                formData.append('image', file[i]);
            }
            console.log(formData)
            await addCandidate(formData);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "ดำเนินการเสร็จสิ้น",
                showConfirmButton: false,
                timer: 1500
            });
            await fetchCandidates();
            setFile([]);
            setLoading(false);
        } else {
            alert('กรุณาเลือกการเลือกตั้ง');
        }
    };

    const fetchCandidates = async () => {
        //add try catch here
        if (electionType) {
            const electionName = election[electionType];
            const candidatesList = await getCandidates(electionName);
            // console.log(candidatesList[0].img.path)
            const candidateListMapped = candidatesList
                .filter(candidate => candidate.student_id !== 0)
                .map(candidate => ({
                    name: candidate.name,
                    studentId: candidate.student_id,
                    faculty: candidate.faculty,
                    major: candidate.major,
                    vision: candidate.vision,
                    image: `/uploads/${candidate.img.path}`
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
                vision: candidate.vision,
            }
        ));
    };

    const handelDropdownChange = async () => {
        //add try catch here
        setLoading(true);
        if (electionType) {

            await fetchCandidates()

        } else {
            setCandidates([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        handelDropdownChange();
    }, [electionType]);

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
                
                <div className="form-group">
                    <label htmlFor="electionType">เลือกการเลือกตั้ง:</label>
                    <select
                        id="electionType"
                        value={electionType}
                        onChange={(e) => setElectionType(e.target.value)}
                        required
                    >
                        <option value="">เลือก</option>
                        {election.map((name, index) => (
                            <option key={index} value={index}>{name}</option>
                        ))}
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
                                    <TableCell>รูป</TableCell>
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
                                            {candidate.image && <img src={candidate.image} alt="candidate" style={{ width: '50px' }} />}
                                        </TableCell>
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
                    <div style={{ marginTop: '16px' }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-image"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="upload-image">
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<PhotoCamera />}
                            >
                                แนบรูปภาพ
                            </Button>
                        </label>
                        {imagePreview && (
                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                />
                            </div>
                        )}
                    </div>
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
