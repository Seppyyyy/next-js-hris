"use client";
import React, {useRef}from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'src/styles/files.css';
import {
    faClipboardUser,
    faReceipt,
    faQuestionCircle,
    faAddressCard,
    faRightFromBracket,
    faEnvelope,
    faCancel
} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from "next/navigation";
import axios from 'axios';
import toast from "react-hot-toast"


export default  function Files(){
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const chooseFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            // Handle the selected file here
            console.log('Selected file:', selectedFile);
        }
    };
    const logout = async () => {
        try{
           await axios.get('/api/users/logout')
            setLoading(true);
            toast.success("Logout Success");
            router.push("/login");
        }catch(error: any){
            console.log(error.message);
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }
    const [loading, setLoading] = React.useState(false);
    return (
        <div>
            <div className="Sidebar">
                <header className="head"></header>

                <ul>
                    <li>
                        <a href="#" className="logo">
                            <img src="/images/logo.png" alt="" />
                            <span className="nav-e">Employee</span>
                        </a>
                    </li>

                    <li>
                        <a href="/dashboard">
                            <FontAwesomeIcon icon={faClipboardUser} className="fas" />
                            <span className="nav-item">Attendance</span>
                        </a>
                    </li>
                    

                    <li>
                        <a href="/payslip">
                            <FontAwesomeIcon icon={faReceipt} className="fas" />
                            <span className="nav-item">Payslip</span>
                        </a>
                    </li>

                    <li>
                        <a href="/201files">
                            <FontAwesomeIcon icon={faQuestionCircle} className="fas" />
                            <span className="nav-item">201 files</span>
                        </a>
                    </li>

                    <li>
                        <a 
                            href="/aboutme">
                                <FontAwesomeIcon icon={faAddressCard} 
                            className="fas" />
                            <span className="nav-item">About Me</span>
                        </a>
                    </li>

                    <li>
                        <a 
                            href="/login" 
                            className="logout"
                            onClick={(e) => {
								e.preventDefault();
								logout();
                            }}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="fas" />
                            <span className="nav-item">Log-Out</span>
                        </a>
                    </li>
                </ul>

            </div>
            <div className="table-container">
            <div className="outer">
                <div className="tables">
                    <table>
                        <thead>
                            <tr>
                                <th>INFORMATION</th>
                                <th className="requested">REQUESTED</th>
                                <th className="current">CURRENT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="row1">
                                <td>Employee No.</td>
                                <td><input type="text" name="employeeNo" id="employeeNo" /></td>
                                <td></td>
                            </tr>
                            <tr className="row2">
                                <td>Hired Date</td>
                                <td><input type="date" id="dateInputRow2" className="date-input" /></td>
                                <td></td>
                            </tr>
                            <tr className="row3">
                                <td>Pag-Ibig No.</td>
                                <td><input type="text" /></td>
                                <td></td>
                            </tr>
                            <tr className="row4">
                                <td>Philhealth</td>
                                <td><input type="text"/></td>
                                <td></td>
                            </tr> 
                            <tr className="row5">
                                <td>Tin No</td>
                                <td><input type="text"/></td>
                                <td></td>
                            </tr>
                            <tr className="row6">
                                <td>SSS No.</td>
                                <td><input type="text"/></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Note</p>
                        <p className="hint">A brief information for requesting 201 file change</p>

                        <div className="note">
                            <textarea id="noteText" placeholder="Enter your note text here..."></textarea>
                            <button >Send Note</button>
                        </div>

                        <p>Attachment</p>
                        <div>
                        <div className="file-form">
                <input
                    type="file"
                    id="fileInput"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <button onClick={chooseFile}>Choose File</button>
             
            </div>
            <div className="new-btn">
            <button className="btn-save"> <FontAwesomeIcon icon={faEnvelope} className="fass" />Save & Submit </button>
                <button className="btn-cancel"><FontAwesomeIcon icon={faCancel} className="fass" />Close</button>
                </div>
        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};




