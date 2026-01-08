import Dashboard from "../components/Dashboard";

import LeaveInfo from "../components/hr/LeaveInfo";
import LeaveInfoTables from "../components/hr/LeaveInfoTables";
import LeaveType from "../components/hr/leavetype/LeaveType";

import DataTables from "../components/hr/leavetype/DataTables";
// import BusinessUnitTables from "../components/businessunit/BusinessUnitTables";
// import BusinessUnitForm from "../components/businessunit/BusinessUnitForm";
// import BusinessUnitEditForm from "../components/businessunit/BusinessUnitEditForm";
// import SingleTableFunction from "../components/businessunit/SingleTablefunction";
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
import MenuSingleTableFunction from "../components/MenuCreate/MenuSingleTableFunction";
import MenuTable from "../components/MenuCreate/MenuTable";
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
import MoneyReceiptSingleTable from "../components/MoneyReceipt/MoneyReceiptSingleTable";
import MoneyReceiptEditForm from "../components/MoneyReceipt/MoneyReceiptEditForm";
import PendingInvoiceListTable from "../components/PendingInvoiceList/PendingInvoiceListTable";
import PendingInvoiceSingleTable from "../components/PendingInvoiceList/PendingInvoiceSingleTable";
import TestInfoTable from "../components/TestInfo/TestInfoTable";
import TestInfoForm from "../components/TestInfo/TestInfoForm";
import TestInfoSingleTable from "../components/TestInfo/TestInfoSingleTable";
import TestInfoEditForm from "../components/TestInfo/TestInfoEditForm";
import Profile from "../components/Pages/Profile";
import ModuleEditForm from "../components/module/ModuleEditForm";
import ModuleSingleTableFunction from "../components/module/ModuleSingleTableFunction";
import UserEditForm from "../components/User/UserEditForm";
import UserSingleTableFunction from "../components/User/UserSingleTableFunction";
import PermissionSingleTableFunction from "../components/Permission/PermissionSingleTableFunction";
import PermissionEditForm from "../components/Permission/PermissionEditForm";
import MenuEditForm from "../components/MenuCreate/MenuEditForm";

export const Routedata = [

  { id: 1, path: `${import.meta.env.BASE_URL}dashboard`, element: (<Dashboard /> )},
  { id: 5, path: `${import.meta.env.BASE_URL}profile`, element: <Profile/> },

  // User 
   { id: 2, path: `${import.meta.env.BASE_URL}user/dataTable`, element: <UserTable /> },
   { id: 2, path: `${import.meta.env.BASE_URL}user/singledata`, element: <UserSingleTableFunction /> },
   { id: 3, path: `${import.meta.env.BASE_URL}user/createform`, element: <UserForm /> },
   { id: 3, path: `${import.meta.env.BASE_URL}user/edit`, element: <UserEditForm /> },

   
  // Assign Business Unit 
   { id: 4, path: `${import.meta.env.BASE_URL}assignbu/dataTable`, element: <AssignBUnitTable /> },
   { id: 5, path: `${import.meta.env.BASE_URL}assignbu/createform`, element: <AssignBUnitForm /> },

  // Permission 
   { id: 6, path: `${import.meta.env.BASE_URL}permission/dataTable`, element: <PermissionTable/> },
   { id: 7, path: `${import.meta.env.BASE_URL}permission/createform`, element: <PermissionForm /> },
   { id: 7, path: `${import.meta.env.BASE_URL}permission/singledata`, element: <PermissionSingleTableFunction /> },
   { id: 7, path: `${import.meta.env.BASE_URL}permission/edit`, element: <PermissionEditForm /> },

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
   { id: 36, path: `${import.meta.env.BASE_URL}moneyreceipt/singledata/:id`, element: <MoneyReceiptSingleTable /> },
   { id: 37, path: `${import.meta.env.BASE_URL}moneyreceipt/edit/:id`, element: <MoneyReceiptEditForm /> },

  // Pending Invoice 
   { id: 38, path: `${import.meta.env.BASE_URL}pendinginvoice/dataTable`, element: <PendingInvoiceListTable/> },
  //  { id: 35, path: `${import.meta.env.BASE_URL}moneyreceipt/createform`, element: <MoneyReceiptForm /> },
   { id: 40, path: `${import.meta.env.BASE_URL}pendinginvoice/singledata`, element: <PendingInvoiceSingleTable /> },
  //  { id: 36, path: `${import.meta.env.BASE_URL}moneyreceipt/edit/:id`, element: <MoneyReceiptEditForm /> },


  // Test Info
   { id: 42, path: `${import.meta.env.BASE_URL}testinfo/dataTable`, element: <TestInfoTable/> },
   { id: 43, path: `${import.meta.env.BASE_URL}testinfo/createform`, element: <TestInfoForm /> },
   { id: 44, path: `${import.meta.env.BASE_URL}testinfo/singledata`, element: <TestInfoSingleTable /> },
   { id: 45, path: `${import.meta.env.BASE_URL}testinfo/edit`, element: <TestInfoEditForm /> },


  
  
  
  
  
  
  
  
  // hr
  { id: 108, path: `${import.meta.env.BASE_URL}hr/leavetype/DataTables`, element: <DataTables /> },
  { id: 108, path: `${import.meta.env.BASE_URL}hr/leavetype/LeaveType`, element: <LeaveType /> },
  { id: 109, path: `${import.meta.env.BASE_URL}hr/LeaveInfo`, element: <LeaveInfo /> },
  { id: 110, path: `${import.meta.env.BASE_URL}hr/LeaveInfoTables`, element: <LeaveInfoTables /> },

  // Business Unit 
  // { id: 111, path: `${import.meta.env.BASE_URL}businessunit/dataTable`, element: <BusinessUnitTables /> },
  // { id: 112, path: `${import.meta.env.BASE_URL}businessunit/createform`, element: <BusinessUnitForm /> },
  // { id: 113, path: `${import.meta.env.BASE_URL}businessunit/editform`, element: <BusinessUnitEditForm /> },
  // { id: 114, path: `${import.meta.env.BASE_URL}businessunit/show`, element: <SingleTableFunction /> },

  // Module
  { id: 115, path: `${import.meta.env.BASE_URL}module/dataTable`, element: <ModuleTable /> },
  { id: 116, path: `${import.meta.env.BASE_URL}module/createform`, element: <ModuleForm /> },
  { id: 116, path: `${import.meta.env.BASE_URL}module/singledata`, element: <ModuleSingleTableFunction /> },
  { id: 116, path: `${import.meta.env.BASE_URL}module/edit`, element: <ModuleEditForm /> },

  // Role
  { id: 117, path: `${import.meta.env.BASE_URL}role/dataTable`, element: <RoleTable /> },
  { id: 118, path: `${import.meta.env.BASE_URL}role/createform`, element: <RoleForm /> },
  
  // Menu create
  { id: 119, path: `${import.meta.env.BASE_URL}menu/dataTable`, element: <MenuTable /> },
  { id: 120, path: `${import.meta.env.BASE_URL}menu/createform`, element: <MenuForm /> },
  { id: 120, path: `${import.meta.env.BASE_URL}menu/singledata`, element: <MenuSingleTableFunction /> },
  { id: 120, path: `${import.meta.env.BASE_URL}menu/edit`, element: <MenuEditForm /> },

]
