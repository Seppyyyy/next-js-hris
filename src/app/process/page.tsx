"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import 'src/app/adminstyles/process_payslip.css';
import axios from "axios";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  faRightFromBracket,
  faChartLine,
  faUserPlus,
  faReceipt,
  faFile,
  faEnvelope,
  faHistory,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProcessPage() {

  //variables declaration
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [payslipData, setpayslipData] = React.useState({
    name: "",
    employee_id: "",
    role: "",
    periodcovered: "",
    days: "",
    salary: "",
    overtime: "",
    grossearnings: "",
    tax: "",
    pagibig: "",
    philhealth: "",
    sss: "",
    totalcontribution: "",
    netpay: "",
    datecreated: "",
  });
  const resetPayslipData = () => {
    setpayslipData({
      name: "",
      employee_id: "",
      role: "",
      periodcovered: "",
      days: "",
      salary: "",
      overtime: "",
      grossearnings: "",
      tax: "",
      pagibig: "",
      philhealth: "",
      sss: "",
      totalcontribution: "",
      netpay: "",
      datecreated: "",
    });
  };
  
  // Usage
  // Call resetPayslipData() when you want to reset the state
  
  function ItemOptions({ userItem }: ItemProps) {
    return (
      <option>{userItem.EmployeeInformation.name}</option>
    );
  }
  type ItemProps = {
    userItem: InformationType;
    key: React.Key; // You can use 'React.Key' for the type of 'key'
  };
  type InformationType = {
    _id: string;
    EmployeeInformation: {
      name: string;
      employee_id: string;
      phone: string;
      address?: string;
      role: string;
    };
    PayInformation: {
      days: string;
      rate: string;
    };
    datecreated?: string;
  };
  const [notif, setNotif] = React.useState(0);
  const fetchNotif = async () => {
    try {
        const response = await axios.get("api/users/notification");
        setNotif(response.data.count)
        
    } catch (error:any) {
      console.log(error.message);
      
    }
  }
  useEffect(() => {
    fetchNotif();
},[]);
const logout = async () => {
  try{
      await axios.get('/api/users/logout')
       setLoading(true) ;
       Swal.fire({
         position: 'top-end',
         icon: 'success',
         title: 'Logout Success!',
         showConfirmButton: false,
         timer: 2000,
         toast: true,
         background: '#efefef',
         showClass: {
           popup: 'animate__animated animate__fadeInDown',
         },
         hideClass: {
           popup: 'animate__animated animate__fadeOutUp',
         },
       }).then(() => {
         window.location.href = '/login';
       });
 
   }catch(error: any){
       console.log(error.message);
       Swal.fire({
   position: 'top-end', // Position to top-end
   icon: 'error',
   title: 'Unsuccessful Logout!',
   showConfirmButton: false,
   timer: 2000,
   toast: true, // Enable toast mode
   background: '#efefef',
   showClass: {
     popup: 'animate__animated animate__fadeInDown',
   },
   hideClass: {
     popup: 'animate__animated animate__fadeOutUp',
   },
 });
   }finally{
       setLoading(false);
       
   }
   
}

const handlePeriodSelection = async (selectedValue) => {
  
  const res = await axios.get(`/api/users/testing?employee_id=${payslipData.employee_id}&period=${selectedValue}`)
  const overtimehrs = res.data.data.totalHours * 71.50;

  
  setpayslipData({...payslipData, overtime: res.data.data.totalHours, periodcovered: selectedValue,  })
  
};
  const [userData, setuserData] = useState<InformationType[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const handleChange = async(e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    
    // Find the corresponding attendance item based on the selected value
    const selectedAttendanceItem = userData.find(item => item.EmployeeInformation.name === selectedValue);

    // Print the time_in value
    if (selectedAttendanceItem) {
      try {
        const currentDate = new Date();
        const month = currentDate.toLocaleString('en-US', { month: 'long' });
        const re = await axios.get(`/api/users/process?employee_id=${selectedAttendanceItem.EmployeeInformation.employee_id}`);
        console.log('this is the datas',re.data, re.data.days, month);
        let time = parseInt(selectedAttendanceItem.PayInformation.days) / 2;
        let rate = parseInt(selectedAttendanceItem.PayInformation.rate);
        let computesalary = re.data.days * rate;

        let netsalary = (computesalary - 569.60).toFixed(2);

        setpayslipData({
        name: selectedAttendanceItem.EmployeeInformation.name,
        employee_id: selectedAttendanceItem.EmployeeInformation.employee_id,
        role: selectedAttendanceItem.EmployeeInformation.role,
        periodcovered: "",
        days: re.data.days,
        salary: computesalary.toString(),
        overtime: "",
        grossearnings: computesalary.toString(),
        tax: "N/A",
        pagibig: "50 PHP",
        philhealth: "159.6 PHP",
        sss: "360 PHP",
        totalcontribution: "569.60 PHP",
        netpay: netsalary.toString(),
        datecreated: month,
      })
      } catch (error:any) {
        console.log("Fetch failed", error.message);
        
      }
    }
  };
  //function for saving and submit
  const onSaveandSubmit = async () => {
    try {
      setSelectedOption('');
      setLoading(true);
      const response = await axios.post("/api/users/process", payslipData);
      if(response.data.success === true)
      {
        Swal.fire({
          position: 'top-end', // Position to top-end
          icon: 'success',
          title: 'Payslip created Successfully!',
          showConfirmButton: false,
          timer: 2000,
          toast: true, // Enable toast mode
          background: '#efefef',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
        resetPayslipData();
      }
      else{
        Swal.fire({
          position: 'top-end', // Position to top-end
          icon: 'error',
          title: 'Payslip has already been given!',
          showConfirmButton: false,
          timer: 2000,
          toast: true, // Enable toast mode
          background: '#efefef',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
        resetPayslipData();
      }
      
      router.push("/process")
    } catch (error: any) {
      console.log("Processing Payslip", error.message);
      toast.error(error.message);
      Swal.fire({
				position: 'top-end', // Position to top-end
				icon: 'error',
				title: 'Unsuccessful Save!',
				showConfirmButton: false,
				timer: 2000,
				toast: true, // Enable toast mode
				background: '#efefef',
				showClass: {
					popup: 'animate__animated animate__fadeInDown',
				},
				hideClass: {
					popup: 'animate__animated animate__fadeOutUp',
				},
			});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (payslipData.employee_id.length > 1 && payslipData.netpay.length > 1) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [payslipData]);
  const getAttendanceData = async () => {
    try {
      const res = await axios.get('/api/users/process'); 
      setuserData(res.data.user); 
      
    } catch (error: any) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getAttendanceData(); 
  }, []);
  return (
    <div>
      <div className="Sidebar">
        <header className="head"></header>

        <ul>
          <li>
            <a href="#" className="logo">
              <Image
                src="/images/logo.png"
                width={50}
                height={50}
                alt="Picture of the author"
              />
              <span className="nav-e">Admin</span>
            </a>
          </li>

          <li>
            <a href="/admin">
              <FontAwesomeIcon icon={faChartLine} className="fas" />
              <span className="nav-item">Attendance</span>
            </a>
          </li>

          <li>
            <a href="/addemployee">
              <FontAwesomeIcon icon={faUserPlus} className="fas" />
              <span className="nav-item">Add Employee</span>
            </a>
          </li>
          <li>
            <a href="/searchemployee" >
              <FontAwesomeIcon icon={faSearch} className="fas" />
              <span className="nav-item">Employee Info</span>
            </a>
          </li>
          <li>
            <a href="/approveemployee">
            <FontAwesomeIcon icon={faFile} className="fas" />
        <span className="nav-item">Request</span>
        {notif !== 0 && <span className="notification">{notif}</span>}

            </a>
          </li>
          <li>
            <a href="/process">
              <FontAwesomeIcon icon={faReceipt} className="fas" />
              <span className="nav-item">Payslip-Process</span>
            </a>
          </li>

          <li>
            <a href="/report">
              <FontAwesomeIcon icon={faHistory} className="fas" />
              <span className="nav-item">Report</span>
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

      {/* Main content */}
      <div className="center-wrapper">
        <div className="payslip-wrapper">
          <div id="content">
            <div className="payslip-container">
              <div className="header">
                <h1>{loading ? "Processing ..." : "PAYSLIP PROCESS"}</h1>
              </div>


            
              {/* Employee information */}
              <div className="employee-info">
                <p>Employee Information</p>
                <div className="info-row">
                  <span className="label">
                    Employee Name:
                  </span>
                  <select value={selectedOption} onChange={handleChange}>
                    <option value="">-- Select Option --</option>
                    {userData.map((userItem, index) => (
                      <ItemOptions key={index} userItem={userItem} />
                    ))}
                  </select>
                </div>
                <div className="info-row">
                  <span className="label">Employee ID:</span>
                  <input
                    type="text"
                    name="employeeNo"
                    id="employeeNo"
                    readOnly
                    value={payslipData.employee_id}
                    onChange={(e) => setpayslipData({ ...payslipData, employee_id: e.target.value })}
                  />
                </div>

                <div className="info-row">
                  <span className="label">Position:</span>
                  <input
                    type="text"
                    name="employeeNo"
                    readOnly
                    id="employeeNo"
                    value={payslipData.role}
                    onChange={(e) => setpayslipData({ ...payslipData, role: e.target.value })} />
                </div>
                <div className="info-row">
                  <span className="label">Period Covered:</span>
                  <select
                  value={payslipData.periodcovered}
                  onChange={(e) => {
                    setpayslipData({ ...payslipData, periodcovered: e.target.value });
                    handlePeriodSelection(e.target.value);
                  }}
>
                    <option value="">-- Select Option --</option>
                    <option value="1st Period">1st period</option>
                    <option value="2nd Period">2nd period</option>
                  </select>
                </div>

                <div className="info-row">
                  <span className="label">Days of Work:</span>
                  <input
                    type="text"
                    name="employeeNo"
                    id="employeeNo"
                    readOnly
                    value={payslipData.days}
                    onChange={(e) => setpayslipData({ ...payslipData, days: e.target.value })}
                  />
                </div>

              </div>

              {/* Taxable income */}
              <div className="earnings">
                <h3 className="section-title">Taxable Income</h3>

                <div className="earning-row">
                  <span className="label">Basic Salary:
                    <input
                      type="text"
                      name="employeeNo"
                      id="employeeNo"
                      readOnly
                      value={payslipData.salary}
                      onChange={(e) => setpayslipData({ ...payslipData, salary: e.target.value })}
                    /></span>
                </div>
                <div className="earning-row">
                  <span className="label">Overtime:
                    <input
                      type="number"
                      name="employeeNo"
                      id="employeeNo"
                      value={payslipData.overtime}
                      style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                      onChange={(e) => setpayslipData({ ...payslipData, overtime: e.target.value })}
                    /></span>

                </div>
              </div>

              {/* Deductions */}
              <div className="deductions">
                <h3 className="section-title">Deductions</h3>

                <div className="deduction-row">
                  <span className="label">Tax:
                    <input
                      type="text"
                      name="employeeNo"
                      id="employeeNo"
                      value={payslipData.tax}
                      readOnly
                      onChange={(e) => setpayslipData({ ...payslipData, tax: e.target.value })}
                    /></span>

                </div>

                <div className="deduction-row">
                  <span className="label">Pag-Ibig:
                    <input
                      type="text"
                      name="employeeNo"
                      id="employeeNo"
                      readOnly
                      value={payslipData.pagibig}
                      onChange={(e) => setpayslipData({ ...payslipData, pagibig: e.target.value })}
                    /></span>

                </div>

                <div className="deduction-row">

                  <span className="label">PhilHealth:

                    <input
                      type="text"
                      name="employeeNo"
                      id="employeeNo"
                      value={payslipData.philhealth}
                      readOnly
                      onChange={(e) => setpayslipData({ ...payslipData, philhealth: e.target.value })}
                    /></span>

                </div>

                <div className="deduction-row">
                  <span className="label">SSS:
                    <input
                      type="text"
                      name="employeeNo"
                      id="employeeNo"
                      value={payslipData.sss}
                      readOnly
                      onChange={(e) => setpayslipData({ ...payslipData, sss: e.target.value })}
                    /></span>

                </div>
                <div className="deduction-row">
                  <span className="label">Total Deduction:
                    <input
                      type="text"
                      name="employeeNo"
                      id="employeeNo"
                      readOnly
                      value={payslipData.totalcontribution}
                      onChange={(e) => setpayslipData({ ...payslipData, totalcontribution: e.target.value })}
                    /></span>

                </div>
              </div>

              {/* Net Pay */}
              <div className="total">
                <span className="label">{"Net Pay: " + (parseFloat(payslipData.netpay)+ (parseFloat(payslipData.overtime)*71.50)) }</span>
              </div>
            </div>
          </div>
        </div>
        <div className="new-btn">
          <button className="btn-save"
            onClick={() => onSaveandSubmit()} 
          > 
          <FontAwesomeIcon icon={faEnvelope} className="fass" />Save & Submit </button>

        </div>
      </div>

    </div>
  );
};


