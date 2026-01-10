import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const MenuEditForm = () => {

  const location = useLocation();
  const passEditFormData = location.state?.editData || '';

  const navigate = useNavigate();

  //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check
    const user_id = localStorage.getItem('user_id'); //For created_by

    useEffect(() => {
      if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        navigate('/login');
      }
    }, []);
  //*********Check Authentication End***********


  const [editFormData, setEditFormData] = useState({
    menu_name: passEditFormData?.menu_name || '',
    module_id: passEditFormData?.module_id || null,
    is_parent: passEditFormData?.is_parent === 1,
    parent_menu_id: passEditFormData?.parent_menu_id ?? null,
    permission_id: Array.isArray(passEditFormData.permission_id) ? passEditFormData.permission_id : [],
    sort_order: passEditFormData.sort_order,
    top_menu: passEditFormData?.is_top_menu === 1,
    is_active: passEditFormData?.is_active === 1,
  })

  const [showValidationError, setValidationErrors] = useState({
    menu_name: '',
    module_name: '',
    permission_id: '',
    parent_menu_id: '',

  });

  const [moduleData, setModuleData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [parentMenuData, setParentMenuData] = useState([])

  // console.log("passEditFormData:", passEditFormData);


  //----------React Select Module Start--------
     const fetchModules = async () => {
      try {
        const response = await fetch(`${baseURL}/module`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setModuleData(data.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
  
    // stat time data fetch
    useEffect(() => {
      fetchModules();
    }, []);
  
      const activeModuleOptions = moduleData.filter(module => module.is_active == 1).map(module => ({
      value: module.id,
      label: `${module.module_name}`
      }));
  
      // react-select  onChange handler
      const handleModuleChange = (selectedOption) => {
  
        if (!selectedOption) {
          setPermissionData([]);
          setParentMenuData([]);
          setEditFormData(prev => ({
            ...prev,
            module_id: null,
            permission_id: [],
            parent_menu_id: null
          }));
          return;
        }
  
        const moduleId = selectedOption.value //selected module id
        
        const ModuleInfo = moduleData.find(item => item.id === moduleId);// Find all module use moduleId in moduleData
  
        setPermissionData(ModuleInfo.permission || []) 
        setParentMenuData(ModuleInfo.menu || [])
  
        setEditFormData(prev => ({
          ...prev,
          module_id: selectedOption? selectedOption.value : null
        }))
      };
    //-------------React Select Module End---------------

    //----------React Select Permission Start-----------
    const editingMenuId = passEditFormData?.id; // for edit id

    const getUsedPermissionIds = () => {
      if (!editFormData.parent_menu_id) return [];

      return parentMenuData
        .filter(menu =>
          menu.id !== editingMenuId && // cancel slef id only Edit Mode
          Array.isArray(menu.permission_id)
        )
        .flatMap(menu => menu.permission_id);
    };

    useEffect(() => {
      if (passEditFormData && moduleData.length > 0) {

        const moduleInfo = moduleData.find(
          m => m.id === passEditFormData.module_id
        );

        if (moduleInfo) {
          setPermissionData(moduleInfo.permission || []);
          setParentMenuData(moduleInfo.menu || []);
        }
      }
    }, [passEditFormData, moduleData]);

  
    const usedPermission = getUsedPermissionIds();

    const activePermissionOptions = permissionData
      .filter(permission => permission.is_active == 1)
      .filter(permission => !usedPermission.includes(permission.id))
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


  //----------React Select Parent Menu Start---------
    const activeParentMenuOptions = parentMenuData
      .filter(parentMenu => parentMenu.is_active == 1)
      .filter(parentMenu => parentMenu.is_parent == 1)
      .map(parentMenu => ({
        value: parentMenu.id,
        label: `${parentMenu.menu_name}`
      }));

    // react-select  onChange handler
    const selectParentMenuChange = (selectedOption) => {

      setEditFormData(prev => ({
        ...prev,
        parent_menu_id: selectedOption ? selectedOption.value : null
      }))
    };
  //----------React Select Parent Menu End--------


  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.menu_name.trim()) {
      errors.menu_name = "Menu name is required.";
    } else if (!editFormData.module_id) {
      errors.module_name = "Module name is required.";
    }

    //TODO::

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        menu_name: editFormData.menu_name,
        module_id: editFormData.module_id,
        parent_menu_id: editFormData.parent_menu_id,
        is_parent: editFormData.is_parent,
        permission_id: editFormData.permission_id,
        sort_order: editFormData.sort_order,
        is_top_menu: editFormData.top_menu,
        is_active: Number(editFormData.is_active) ? 1 : 0,
        update_by: user_id 
      }

      // console.log("Submited Data",submitData);
      // return;
      const result = await fetch(`${baseURL}/menu/update/${passEditFormData.id}`, {
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

        navigate("/menu/dataTable"); // navigate to List page
      } else {
        if (typeof response.message === 'object') {
          setValidationErrors(response.message);
        } else {
          toast.error("Internal Error! Try again later.");
          console.error(response.message);
        }

      }

    } catch (error) {
      toast.error('Internal Error!! Try again after 5 min.')
      console.error(error);
    }
  };



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
              <div className='card-title'>Edit Menu</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}menu/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Menu Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter menu name"
                      name='menu_name'
                      value={editFormData.menu_name}
                      onChange={handleEditFormChange}
                      isInvalid={!!showValidationError.menu_name}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.menu_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeModuleOptions || ''}
                      value={activeModuleOptions.find(option => option.value === editFormData.module_id) || null}
                      onChange={handleModuleChange}
                      isSearchable={true}
                      tabIndex={2}
                    />

                    {showValidationError.module_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.module_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label></Form.Label>
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input border-dark"
                        type="checkbox"
                        checked= {editFormData.is_parent}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setEditFormData(prev => ({
                            ...prev,
                            is_parent: isChecked,
                            // parent_menu_id: isChecked ? null : prev.parent_menu_id,
                            permission_id: isChecked ? [] : prev.permission_id
                          }));
                        }}
                      />
                      <Form.Label>Is Parent?</Form.Label>
                    </div>
                  </Form.Group>
                </Row>

 
                <Row className="mb-2">

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Parent Menu <span className='text-danger'>*</span> </Form.Label>

                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeParentMenuOptions || ''}
                      value={activeParentMenuOptions.find(option => option.value === editFormData.parent_menu_id) || null}
                      onChange={selectParentMenuChange}
                      isSearchable={true}
                      isClearable={true}
                      tabIndex={3}
                    />

                    {showValidationError.parent_menu_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.parent_menu_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="5" controlId="validationCustom01">
                    <Form.Label>Permission <span className='text-danger'></span> </Form.Label>

                    <Select
                      styles={customStyles}
                      isMulti={true} // Enable multiple selection
                      name="permission_id"
                      className={`border-dark ${showValidationError.permission_id ? 'is-invalid' : ''}`}
                      classNamePrefix="react-select"
                      options={activePermissionOptions}
                      value={activePermissionOptions.filter(option =>
                        editFormData.permission_id.includes(option.value)
                      )}
                      onChange={selectPermissionChange}
                      tabIndex={4}
                    />

                  </Form.Group>

                  {showValidationError.permission_id && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {showValidationError.permission_id}
                    </Form.Control.Feedback>
                  )}
                </Row>


                <Row className="mb-4">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Sort Order</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      className='border-dark'
                      placeholder="Enter Sort Order"
                      name='sort_order'
                      value={editFormData.sort_order}
                      // isInvalid={!!showValidationError.module_name}
                      onChange={handleEditFormChange}

                    />

                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label></Form.Label>
                    <div className="form-check form-switch mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={editFormData.is_active}
                        onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.is_active == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label></Form.Label>
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input border-dark"
                        name='top_menu'
                        type="checkbox"
                        id="flexCheckChecked"
                        onChange={(e) => setEditFormData({ ...editFormData, top_menu: e.target.checked })}
                      />
                      <Form.Label>Top Menu?</Form.Label>
                    </div>

                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="submit">Update</Button>
                  </Col>
                </Row>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default MenuEditForm;

