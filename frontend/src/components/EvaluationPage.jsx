import React from 'react';
import '../components-style/EvaP.css';
import qrCodeImage from '../image/qr-code.png';

const EvaluationPage = () => {
  return (
    <div>
      <h1>แสกนหรือกดที่ Qr code เพื่อเข้าแบบฟอร์มการประเมิน</h1>
      <a href="https://forms.gle/orbv14upKUQ6DThN9" target="_blank" rel="noopener noreferrer">
        <img src={qrCodeImage} alt="QR Code for evaluation form" />
      </a>
    </div>
  );
};

export default EvaluationPage;
