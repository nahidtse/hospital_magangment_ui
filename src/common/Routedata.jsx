import Dashboard from "../components/Dashboard";

import LeaveInfo from "../components/hr/LeaveInfo";
import LeaveInfoTables from "../components/hr/LeaveInfoTables";
import LeaveType from "../components/hr/leavetype/LeaveType";

import DataTables from "../components/hr/leavetype/DataTables";
import BusinessUnitTables from "../components/businessunit/BusinessUnitTables";
import BusinessUnitForm from "../components/businessunit/BusinessUnitForm";
import BusinessUnitEditForm from "../components/businessunit/BusinessUnitEditForm";
import SingleTableFunction from "../components/businessunit/SingleTablefunction";
import ModuleTable from "../components/module/ModuleTable";
import ModuleForm from "../components/module/ModuleForm";
import RoleTable from "../components/Role/RoleTable";
import RoleForm from "../components/Role/RoleForm";
import UserTable from "../components/User/UserTable";
import UserForm from "../components/User/UserForm";
import AssignBUnitTable from "../components/AssignBusinessUnit/AssignBUnitTable";
import AssignBUnitForm from "../components/AssignBusinessUnit/AssignBUnitForm";
import PermissionTable from "../components/Permission/PermissionTable";
import LookupTypeTable from "../components/LookupType/LookupTypeTable";
import LookupTypeForm from "../components/LookupType/LookupTypeForm";
import LookupValueTable from "../components/LookupValue/LookupValueTable";
import PermissionForm from "../components/Permission/PermissionForm";
import MenuCreate from "../components/MenuCreate/MenuCreate";
import MenuForm from "../components/MenuCreate/MenuForm";
import LookupValueForm from "../components/LookupValue/LookupValueForm";
import DoctorsInfoTable from "../components/DoctorsInfo/DoctorsInfoTable";
import DoctorsInfoForm from "../components/DoctorsInfo/DoctorsInfoForm";
import DoctorsCard from "../components/DoctorsCard/DoctorsCard";
import ChamberScheduleTable from "../components/ChamberSchedule/ChamberScheduleTable";
import ChamberScheduleForm from "../components/ChamberSchedule/ChamberScheduleForm";
import DoctorExperienceTable from "../components/DoctorExperience/DoctorExperienceTable";
import DoctorExperienceForm from "../components/DoctorExperience/DoctorExperienceForm";
import LeaveInfoTable from "../components/LeaveInfo/LeaveInfoTable";
import LeaveInfoForm from "../components/LeaveInfo/LeaveInfoForm";
import AppointmentTable from "../components/Appointment/AppointmentTable";
import AppointmentForm from "../components/Appointment/AppointmentForm";
import InvoiceDiagonesticTable from "../components/InvoiceDiagonestic/InvoiceDiagonesticTable";
import InvoiceDiagonesticForm from "../components/InvoiceDiagonestic/InvoiceDiagonesticForm";
import BankInfoTable from "../components/BankInfo/BankInfoTable";
import BankInfoForm from "../components/BankInfo/BankInfoForm";
import BankAccountInfoTable from "../components/BankAccountInfo/BankAccountInfoTable";
import BankAccountInfoForm from "../components/BankAccountInfo/BankAccountInfoForm";
import MoneyReceiptTable from "../components/MoneyReceipt/MoneyReceiptTable";
import MoneyReceiptForm from "../components/MoneyReceipt/MoneyReceiptForm";
import BankInfoSingleTable from "../components/BankInfo/BankInfoSingleTable";
import BankInfoEditForm from "../components/BankInfo/BankInfoEditForm";
import BankAccountSingleTable from "../components/BankAccountInfo/BankAccountSingleTable";
import BankAccountInfoEditForm from "../components/BankAccountInfo/BankAccountInfoEditForm";



export const Routedata = [

  { id: 1, path: `${import.meta.env.BASE_URL}dashboard`, element: <Dashboard /> },

  // User 
   { id: 2, path: `${import.meta.env.BASE_URL}user/dataTable`, element: <UserTable /> },
   { id: 3, path: `${import.meta.env.BASE_URL}user/createform`, element: <UserForm /> },

   
  // Assign Business Unit 
   { id: 4, path: `${import.meta.env.BASE_URL}assignbu/dataTable`, element: <AssignBUnitTable /> },
   { id: 5, path: `${import.meta.env.BASE_URL}assignbu/createform`, element: <AssignBUnitForm /> },

  // Permission 
   { id: 6, path: `${import.meta.env.BASE_URL}permission/dataTable`, element: <PermissionTable/> },
   { id: 7, path: `${import.meta.env.BASE_URL}permission/createform`, element: <PermissionForm /> },

  // Lookup type
   { id: 8, path: `${import.meta.env.BASE_URL}lookuptype/dataTable`, element: <LookupTypeTable/> },
   { id: 9, path: `${import.meta.env.BASE_URL}lookuptype/createform`, element: <LookupTypeForm /> },

  // Lookup type
   { id: 10, path: `${import.meta.env.BASE_URL}lookupvalue/dataTable`, element: <LookupValueTable/> },
   { id: 11, path: `${import.meta.env.BASE_URL}lookupvalue/createform`, element: <LookupValueForm /> },

  // Doctor's Information
   { id: 12, path: `${import.meta.env.BASE_URL}doctorsinfo/dataTable`, element: <DoctorsInfoTable/> },
   { id: 13, path: `${import.meta.env.BASE_URL}doctorsinfo/createform`, element: <DoctorsInfoForm /> },

  // Doctor's Cards
   { id: 14, path: `${import.meta.env.BASE_URL}doctorscard/cardPage`, element: <DoctorsCard/> },
  //  { id: 15, path: `${import.meta.env.BASE_URL}doctorsinfo/createform`, element: <DoctorsInfoForm /> },

  // Chamber Schedule
   { id: 16, path: `${import.meta.env.BASE_URL}chamberschedule/dataTable`, element: <ChamberScheduleTable/> },
   { id: 17, path: `${import.meta.env.BASE_URL}chamberschedule/createform`, element: <ChamberScheduleForm /> },

  // Doctor Experience
   { id: 18, path: `${import.meta.env.BASE_URL}doctorexperience/dataTable`, element: <DoctorExperienceTable/> },
   { id: 19, path: `${import.meta.env.BASE_URL}doctorexperience/createform`, element: <DoctorExperienceForm /> },

  // Doctor Experience
   { id: 20, path: `${import.meta.env.BASE_URL}leaveinfo/dataTable`, element: <LeaveInfoTable/> },
   { id: 21, path: `${import.meta.env.BASE_URL}leaveinfo/createform`, element: <LeaveInfoForm /> },

  // Doctor Appointment
   { id: 22, path: `${import.meta.env.BASE_URL}appointment/dataTable`, element: <AppointmentTable/> },
   { id: 23, path: `${import.meta.env.BASE_URL}appointment/createform`, element: <AppointmentForm /> },

  // Invoice Diagonestic
   { id: 24, path: `${import.meta.env.BASE_URL}invoicediagonestic/dataTable`, element: <InvoiceDiagonesticTable/> },
   { id: 25, path: `${import.meta.env.BASE_URL}invoicediagonestic/createform`, element: <InvoiceDiagonesticForm /> },

  // Bank Info
   { id: 26, path: `${import.meta.env.BASE_URL}bankinfo/dataTable`, element: <BankInfoTable/> },
   { id: 27, path: `${import.meta.env.BASE_URL}bankinfo/singledata/:id`, element: <BankInfoSingleTable/> },
   { id: 28, path: `${import.meta.env.BASE_URL}bankinfo/edit/:id`, element: <BankInfoEditForm/> },
   { id: 29, path: `${import.meta.env.BASE_URL}bankinfo/createform`, element: <BankInfoForm /> },

  // Bank Account
   { id: 30, path: `${import.meta.env.BASE_URL}bankaccount/dataTable`, element: <BankAccountInfoTable/> },
   { id: 31, path: `${import.meta.env.BASE_URL}bankaccount/createform`, element: <BankAccountInfoForm /> },
   { id: 32, path: `${import.meta.env.BASE_URL}bankaccount/singledata/:id`, element: <BankAccountSingleTable /> },
   { id: 33, path: `${import.meta.env.BASE_URL}bankaccount/edit/:id`, element: <BankAccountInfoEditForm /> },

  // Money Receipt
   { id: 34, path: `${import.meta.env.BASE_URL}moneyreceipt/dataTable`, element: <MoneyReceiptTable/> },
   { id: 35, path: `${import.meta.env.BASE_URL}moneyreceipt/createform`, element: <MoneyReceiptForm /> },


  
  
  
  
  
  
  
  
   // hr
  { id: 108, path: `${import.meta.env.BASE_URL}hr/leavetype/DataTables`, element: <DataTables /> },
  { id: 108, path: `${import.meta.env.BASE_URL}hr/leavetype/LeaveType`, element: <LeaveType /> },
  { id: 109, path: `${import.meta.env.BASE_URL}hr/LeaveInfo`, element: <LeaveInfo /> },
  { id: 110, path: `${import.meta.env.BASE_URL}hr/LeaveInfoTables`, element: <LeaveInfoTables /> },

  // Business Unit 
  { id: 111, path: `${import.meta.env.BASE_URL}businessunit/dataTable`, element: <BusinessUnitTables /> },
  { id: 112, path: `${import.meta.env.BASE_URL}businessunit/createform`, element: <BusinessUnitForm /> },
  { id: 113, path: `${import.meta.env.BASE_URL}businessunit/editform`, element: <BusinessUnitEditForm /> },
  { id: 114, path: `${import.meta.env.BASE_URL}businessunit/show`, element: <SingleTableFunction /> },

  // Module
  { id: 115, path: `${import.meta.env.BASE_URL}module/dataTable`, element: <ModuleTable /> },
  { id: 116, path: `${import.meta.env.BASE_URL}module/createform`, element: <ModuleForm /> },

  // Role
  { id: 117, path: `${import.meta.env.BASE_URL}role/dataTable`, element: <RoleTable /> },
  { id: 118, path: `${import.meta.env.BASE_URL}role/createform`, element: <RoleForm /> },
  // Menu create
  { id: 119, path: `${import.meta.env.BASE_URL}menuCreate`, element: <MenuCreate /> },
  { id: 120, path: `${import.meta.env.BASE_URL}menuCreate/menuForm`, element: <MenuForm /> },

]
