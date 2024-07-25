import React, { useState, useEffect, useContext } from 'react';
import NavbarAdmin from '../components/NavbarAdmin';
import DigitalClock from '../components/DigitalClock';
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../components-style/ManageDataStudent.css';
import { getElection } from '../services/electionService';
import { addVoter, getVoter, deleteVoter } from '../services/voterService';
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';
import CircularProgress from '@mui/material/CircularProgress';

const ManageDataStudent = () => {
  const [students, setStudents] = useState([]);
  const [electionType, setElectionType] = useState('');
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentId: '',
    faculty: '',
    major: '',
  });
  const [election, setElection] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchElection() {
    setIsLoading(true);
    try {
      const rawData = await getElection();
      const allElection = rawData.map((election) => {
        return election.election_name;
      });
      setElection(allElection);
    } catch (error) {
      console.error('Failed to fetch election:', error);
    } finally {
      setIsLoading(false);
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

      const rows = data.slice(1).filter((row) => row.some((cell) => cell));

      const formattedData = rows.map((row) => ({
        name: row[0],
        studentId: row[1],
        faculty: row[2],
        major: row[3],
      }));

      setStudents(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleDelete = async (index) => {
    if (electionType) {
      //add try catch
      const electionName = election[electionType];
      await deleteVoter(electionName, students[index].studentId);

      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
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
    setNewStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setNewStudent({ name: '', studentId: '', faculty: '', major: '' });
    handleClose();
  };

  const handleConfirm = async () => {
    if (electionType) {
      setLoading(true);
      const studentList = createStudent();
      const electionName = election[electionType];
      await addVoter(electionName, studentList);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'ดำเนินการเสร็จสิ้น',
        showConfirmButton: false,
        timer: 1500,
      });
      await fetchStudents();
      setLoading(false);
    } else {
      alert('กรุณาเลือกการเลือกตั้ง');
    }
  };

  const fetchStudents = async () => {
    if (electionType) {
      const electionName = election[electionType];
      const studentsList = await getVoter(electionName);
      const studentListMapped = studentsList.map((student) => ({
        name: student.name,
        studentId: student.student_id,
        faculty: student.faculty,
        major: student.major,
      }));
      setStudents(studentListMapped);
    } else {
      setStudents([]);
    }
  };
  const handelDropdownChange = async () => {
    setLoading(true);
    if (electionType) {
      const electionName = election[electionType];
      const studentsList = await getVoter(electionName);
      const studentListMapped = studentsList.map((student) => ({
        name: student.name,
        studentId: student.student_id,
        faculty: student.faculty,
        major: student.major,
      }));
      setStudents(studentListMapped);
    } else {
      setStudents([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    handelDropdownChange();
  }, [electionType]);

  const createStudent = () => {
    return students.map((student) => ({
      student_id: student.studentId,
      name: student.name,
      faculty: student.faculty,
      major: student.major,
      mail: student.studentId + '@stu.pim.ac.th',
    }));
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
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
        <div className="election-form-container">
          <div className="VTitle">
            <img
              loading="lazy"
              src="https://krishplayschool.com/images/icons/graduation.svg"
              className="VImg"
              alt=""
            />
            <div>
              <h1>จัดการข้อมูลนักศึกษา</h1>
            </div>
          </div>
        </div>
        <div className="VTitle">
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
              style={{
                minWidth: 250,
                backgroundColor: '#A03939',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              startIcon={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/11039/11039795.png"
                  alt="icon"
                  style={{ maxWidth: 70 }}
                />
              }
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
            {election.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <TableContainer
          component={Paper}
          style={{ maxHeight: 400, overflowY: 'auto' }}
        >
          {loading ? (
            <CircularProgress
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
              }}
            />
          ) : (
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
          )}
        </TableContainer>
        <div className="VTitle">
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
          <button
            type="submit"
            className="btn btn-success"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'ยืนยัน'}
          </button>
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
