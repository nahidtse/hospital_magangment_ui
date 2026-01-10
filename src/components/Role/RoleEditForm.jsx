import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Swal from 'sweetalert2';
const baseURL = import.meta.env.VITE_API_BASE_URL;



const RoleEditForm = () => {

  const location = useLocation();
  const passEditFormData = location.state?.editData || '' ;
  // console.log(passEditFormData)

   //-----------Focus Input Start--------------------------------
    const referenceSelectRef = useRef(null);  //For auto fucus
    useEffect(() => {
      // small timeout for render then focus
      const timer = setTimeout(() => {
        if (referenceSelectRef.current) {
          referenceSelectRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }, []);
  //-----------Focus Input End-----------------------------------  

  //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check
    const created_by = localStorage.getItem('user_id')                

    if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  //*********Check Authentication End***********


  const [showValidationError, setValidationErrors] = useState({
    role_id: '',
    module_id: '',
    menu_id: '',
    permission_id: ''
  });

  const [editFormData, setEditFormData] = useState({
    role_name: passEditFormData.role_name,
    role_id: passEditFormData.id,
    is_active: passEditFormData.is_active,
    module_id: '',
    menu_id: '',
    permission_id: [],
  })

  // console.log(editFormData)



  const [moduleData, setModuleData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [roleMenuData, setRoleMenuData] = useState([]);

  // console.log(roleMenuData)







  /** Delete Handler */
  const handleDeleteClick = async (Id) => {
    try {
      const result = await fetch(`${baseURL}/role_details/destroy/${Id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await result.json();
      if (response.status == 'success') {
        setRoleMenuData(prev => prev.filter(c => c.id !== Id));

      }
      return response;

    } catch (error) {
      console.log(error);
      return error;
    }

  };

  /*** Delete Permission Alert  */
  const deletePermissionAlert = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5e76a6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'

    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await handleDeleteClick(id);
        if (response.status == 'success') {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        } else {
          Swal.fire(
            'Error!',
            'There was an issue deleting the item.',
            'error'
          );
        }

      }
    })

  }



  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.role_id) {
      errors.role_id = "Role name is required.";
    }
    if (!editFormData.module_id) {
      errors.module_id = "Module name is required.";
    }
    if (!editFormData.menu_id) {
      errors.menu_id = "Module name is required.";
    }
    if (!editFormData.permission_id) {
      errors.permission_id = "Permission name is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        role_id: editFormData.role_id,
        // is_active: Number(editFormData.is_active) ? 1 : 0,
        module_id: editFormData.module_id,
        menu_id: editFormData.menu_id,
        permission_id: editFormData.permission_id,
        created_by: created_by
      }

      // const roleMenu = {
      //   role_id: editFormData.id,
      //   module_id: editFormData.module_id,
      //   menu_id: editFormData.menu_id,
      //   permission_id: editFormData.permission_id
      // }

      // const payload = {
      //   role: submitData,
      //   roleMenu: editFormData,
      // }

      // console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/role_details/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();

      if (response.status == 'success') {
        toast.success(response.message, { autoClose: 1000 });

        fetchItems();
        fetchPermission();

        setEditFormData(prev => ({
          ...prev,        
          module_id: '',
          permission_id: [],
          menu_id: ''
        }));
        setValidationErrors({})

      } else if (response.status === 'fail' && response.errors) {
        // Laravel errors → React friendly format
         const backendErrors = {};

         Object.keys(response.errors).forEach((field) => {
            backendErrors[field] = response.errors[field][0]; // first message
          });

          setValidationErrors(backendErrors);

          // optional toast
          toast.error(response.message);
          
        } else {
          toast.error("Internal Error! Try again later.");
          console.error(response.message);
        }

    } catch (error) {
      toast.error('Internal Error!! Try again after 5 min.')
      console.error(error);
    }

  };



  //----------React Select Module Start--------
      useEffect(() => {
        fetch(`${baseURL}/module/used_module`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // <-- must send token
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setModuleData(data.data);
          })
      }, [])
  
      const activeModuleOptions = moduleData
      .filter(module => module.is_active == 1)
        .map(module => ({
        value: module.id,
        label: `${module.module_name}`
        }));
  
      // react-select  onChange handler
      const selectModuleChange = (selectedOption) => {
        const selectedId = selectedOption? selectedOption.value : null;

        setEditFormData(prev => ({
          ...prev,
          module_id: selectedId,
          menu_id: null,
        }));
        fetchMenu(selectedId)
      };
  //----------React Select Module End--------


  //----------React Select Menu Start--------
      const fetchMenu = (selectedId) => {

        if (!selectedId) {
          setMenuData([]); // if not id, reset menu_id
          return;
        }

        fetch(`${baseURL}/menu/by_module/${selectedId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // <-- must send token
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setMenuData(data.data);
          })
      }
  
      const activeMenuOptions = menuData
        .filter(menu => menu.is_active == 1 && !menu.is_parent)
        .map(menu => ({
        value: menu.id,
        label: `${menu.menu_name}`
        }));
  
      // react-select  onChange handler
      const selectMenuChange = (selectedOption) => {
        setEditFormData(prev => ({
          ...prev,
          menu_id: selectedOption? selectedOption.value : null
        }))
      };
  //----------React Select Menu End----------

  //----------React Select Permission Start---------
   const fetchPermission = () => {
        fetch(`${baseURL}/permission/un_used`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // <-- must send token
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setPermissionData(data.data);
          })
      }
    useEffect(() => {
      fetchPermission()
    }, []) 

    const activePermissionOptions = permissionData
      .filter(permission => permission.is_active == 1)
      .map(permission => ({
      value: permission.id,
      label: `${permission.permission_name}`
    }));

    // react-select  onChange handler
    const selectPermissionChange = (selectedOption) => {

       const selectedIds = selectedOption ? selectedOption.map(option => option.value) : [];

      setEditFormData(prev => ({
        ...prev,
        permission_id: selectedIds
      }))
    };
  //----------React Select Permission End-----------



  //Fetch Role Details
  const fetchItems = () => {
        fetch(`${baseURL}/role_details/single_data/${passEditFormData.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
            setRoleMenuData(data.data);
            })
            .catch((error) => {
            console.log("Error Fetching the data: ", error);
            });
        };

    useEffect(() => {
        fetchItems();
    }, []);



  //React select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: '#000',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      // padding: '1px',
      minHeight: '40px',
      // '&:hover': {
      //   borderColor: '#000'
      // }
    }),
  };



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Role</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}role/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form onSubmit={handleEditFormSubmit}>
                <Row className="mb-5">
                  <Form.Group as={Col} md="4">
                    <Form.Label>Role Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      className='readableInputBgColor border-dark'
                      placeholder="Enter role name"
                      name='role_name'
                      value={editFormData.role_name || ''}
                      isInvalid={!!showValidationError.role_id}
                
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.role_id}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" className="mt-3">
                    <Form.Label></Form.Label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={editFormData.is_active == 1}
                        // onChange={(e) =>
                        //   setEditFormData({ ...editFormData, is_active: e.target.checked })
                        // }
                        readOnly
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.is_active == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>

                </Row>


                {/** Permission Area  */}

                <Row className='mb-3'>
                  <Form.Group as={Col} md="3" >
                    <Form.Label>Module Name<span className='text-danger ms-1'>*</span></Form.Label>

                    <Select
                      ref={referenceSelectRef}
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeModuleOptions || ''}
                      value={activeModuleOptions.find(option => option.value === editFormData.module_id) || null}
                      onChange={selectModuleChange}
                      isSearchable={true}
                      isClearable={true}
                      tabIndex={1}
                    />

                    {showValidationError.module_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.module_id}
                      </Form.Control.Feedback>
                    )}

                  </Form.Group>

                  <Form.Group as={Col} md="3" >
                    <Form.Label>Menu Name<span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeMenuOptions || ''}
                      value={activeMenuOptions.find(option => option.value === editFormData.menu_id) || null}
                      onChange={selectMenuChange}
                      isSearchable={true}
                      isClearable={true}
                      tabIndex={2}
                    />

                    {showValidationError.menu_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.menu_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Permission Name </Form.Label>

                    <Select
                      styles={customStyles}
                      isMulti
                      name="permissionId"
                      classNamePrefix="react-select"
                      options={activePermissionOptions}
                      value={activePermissionOptions.filter(option =>
                        editFormData.permission_id.includes(option.value)
                      )}
                      onChange={selectPermissionChange}
                      tabIndex={3}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="2"
                    controlId="validationCustom01"
                    className="d-flex align-items-center mt-4"
                  >
                    <Button
                      tabIndex={4}
                      type="submit"
                    >
                      <i className="ri-add-line fs-16"></i>
                    </Button>
                  </Form.Group>

                </Row>
              </Form>


              
              <Row className='mb-3'>

                  <div className="mt-3">
                    <div className="fw-bold mb-2">Permission List</div>

                    <div className="table-responsive">
                      <table className="table table-sm table-primary table-striped table-hover text-nowrap table-bordered border-dark">
                        <thead className="bg-primary text-center">
                          <tr>
                            <th className="text-center border border-dark">Module Name</th>
                            <th className="text-center border border-dark">Menu Name</th>
                            <th className="text-center border border-dark">Permission</th>
                            <th className="border border-dark text-center">Action</th>
                          </tr>
                        </thead>

                        <tbody>

                          {roleMenuData.map((data, index) => (
                            <tr key={data.id}>
                              <td className="border border-dark">{data.module?.module_name || ''}</td>
                              <td className="border border-dark">{data.menu?.menu_name || ''}</td>
                              <td className="border border-dark">{data?.permissions?.map(c => c.permission_name).join(', ') || "No Permission"}</td>

                              <td className="border border-dark text-center">
                                <span onClick={() => deletePermissionAlert(data.id)} className="btn-sm bg-danger ms-1" style={{ cursor: "pointer" }}><i className="bi bi-trash"></i></span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                    </div>
                  </div>

              </Row>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default RoleEditForm;












