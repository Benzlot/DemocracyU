
function checkIfEmpty(value, errorMessage) {
    if (typeof value === 'string') {
        if (!value.trim()) {
            throw new Error(errorMessage || 'String is empty or only whitespace');
        }
    } else if (Array.isArray(value)) {
        if (value.length === 0) {
            throw new Error(errorMessage || 'Array is empty');
        }
    } else if (typeof value === 'object') {
        if (value === null || Object.keys(value).length === 0) {
            throw new Error(errorMessage || 'Object is empty or null');
        }
    } else {
        throw new Error('Unsupported type');
    }
}

function checkIfStringIsZero(value, errorMessage) {
    if (typeof value !== 'string') {
        throw new Error('Input must be a string');
    }
    if (value !== '0') {
        throw new Error(errorMessage || 'The string is not equal to "0"');
    }
    return true;
}

function checkNotEmpty(value) {
    if (typeof value === 'string') {
        if (value.trim() !== '') {
            return false; // String is not empty
        }
    } else if (Array.isArray(value)) {
        if (value.length > 0) {
            return false; // Array is not empty
        }
    } else if (typeof value === 'object') {
        if (value !== null && Object.keys(value).length > 0) {
            return false; // Object is not empty
        }
    }
    return true; // Value is empty
}

function checkNotEmptyThrowError(value, errorMessage) {
    if (typeof value === 'string') {
        if (value.trim() !== '') {
            throw new Error(errorMessage +' The string is not empty');
        }
    } else if (Array.isArray(value)) {
        if (value.length > 0) {
            throw new Error(errorMessage + ' The array is not empty');
        }
    } else if (typeof value === 'object') {
        if (value !== null && Object.keys(value).length > 0) {
            throw new Error(errorMessage + ' The object is not empty');
        }
    } else {
        throw new Error('Unsupported type');
    }
}

function checkIsEnd (election){
    const endDate = new Date(election.election_end);
    const now = new Date();
    
    const timeDiff = endDate.getTime() - now.getTime(); //เอาเวลาจบลบเวลาปัจจุบัน

    if(timeDiff > 0){
        return false //ยังไม่จบ
    }else{
        return true //จบแล้ว
    }
}

function checkIsStart (election){
    const startDate = new Date(election.election_start);
    const now = new Date();
    
    const timeDiff = now.getTime() - startDate.getTime(); //เอาเวลาปัจจุบันลบเวลาเริ่ม

    if(timeDiff > 0){
        return true //เริ่มแล้ว
    }else{
        return false //ยังไม่เริ่ม
    }
}


module.exports = {checkIfEmpty, checkIfStringIsZero, checkNotEmpty, checkNotEmptyThrowError , checkIsEnd, checkIsStart};