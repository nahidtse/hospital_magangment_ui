import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const MenuForm = () => {

  //-----------Focus Input Start------------------------------
    const referenceSelectRef = useRef(null);  //For auto fucus
    // Component mount then focus 
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

    if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  //*********Check Authentication End***********

  const [showValidationError, setValidationErrors] = useState({
    menu_name: '',
    module_name: '',
    permission_id: '',
    parent_menu_id: '',

  });

  const [addFormData, setFormData] = useState({
    menu_name: '',
    module_id: '',
    is_parent: false,
    parent_menu_id: null,
    permission_id: [],
    sort_order: '',
    top_menu: '',
    is_active: true,


  })

  console.log(addFormData)

  const [permissionData, setPermissionData] = useState([]);
  const [parentMenuData, setParentMenuData] = useState([])
  const [moduleData, setModuleData] = useState([]);//React Select Module


  const onChangeHandler = (e) => {
    const {name, value} = e.target;

    setFormData(prev => ({
        ...prev,
        [name]:value
    }))
  }




  const handleSubmit = async (event) => {
    event.preventDefault();



    const errors = {};

    if (!addFormData.menu_name.trim()) {
      errors.menu_name = "Menu name is required.";
    }
    if (!addFormData.module_id) {
      errors.module_name = "Module name is required.";
    }


    
    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        menu_name: addFormData.menu_name,
        module_id: addFormData.module_id,
        is_parent: addFormData.is_parent ? 1 : 0,
        parent_menu_id: addFormData.is_parent ? '#' : addFormData.parent_menu_id,
        permission_id: addFormData.permission_id,
        sort_order: addFormData.sort_order,
        is_top_menu: addFormData.top_menu ? 1 : 0,
        is_active: addFormData.is_active ? 1 : 0,
      }

      console.log(submitData);
      // return;

      const result = await fetch(`${baseURL}/menu/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();


      if (response.status == 'success') {
       toast.success(response.message, {autoClose: 1000});

        fetchModules();
        //Auto Focus
        // setTimeout(() => {
        //   if (referenceSelectRef.current) referenceSelectRef.current.focus();
        // }, 100);

        // Clear form
        setFormData({
          menu_name: '',
          module_id: '',
          is_parent: false,
          parent_menu_id: '',
          permission_id: [],
          sort_order: '',
          top_menu: '',
          is_active: 1,

        });
        setValidationErrors({})

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
      console.log(error);

    }


  }

  const resetHandling = () => {
    setFormData({
      menu_name: '',
      module_id: '',
      is_parent: false,
      parent_menu_id: '',
      permission_id: [],
      sort_order: '',
      top_menu: '',
      is_active: true,

    })
  }



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
    const selectChange = (selectedOption) => {

      if (!selectedOption) {
        setPermissionData([]);
        setParentMenuData([]);
        setFormData(prev => ({
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

      setFormData(prev => ({
        ...prev,
        module_id: selectedOption? selectedOption.value : null
      }))
    };
  //----------React Select Module End------------


  //----------React Select Permission Start---------
    const getUsedPermissionIds = () => {
      if (!addFormData.parent_menu_id) return [];

      return parentMenuData
        .filter(
          menu =>
            menu.parent_menu_id === addFormData.parent_menu_id &&
            Array.isArray(menu.permission_id)
        )
        .flatMap(menu => menu.permission_id);
    };

  
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

      setFormData(prev => ({
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

      setFormData(prev => ({
        ...prev,
        parent_menu_id: selectedOption ? selectedOption.value : null
      }))
    };
  //----------React Select Parent Menu End--------



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
              <div className='card-title'>New Menu</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}menu/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-2">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Menu Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      ref={referenceSelectRef}
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter menu name"
                      name='menu_name'
                      value={addFormData.menu_name}
                      isInvalid={!!showValidationError.menu_name}
                      onChange={onChangeHandler}
                      tabIndex={1}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.menu_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Module Name <span className='text-danger'> *</span> </Form.Label>

                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeModuleOptions || ''}
                      value={activeModuleOptions.find(option => option.value === addFormData.module_id) || null}
                      onChange={selectChange}
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
                        checked= {addFormData.is_parent}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            is_parent: isChecked,
                            parent_menu_id: isChecked ? '#' : null, // # for parent menu
                            permission_id: isChecked ? [] : prev.permission_id
                          }));
                        }}
                      />
                      <Form.Label>Is Parent?</Form.Label>
                    </div>

                  </Form.Group>
                </Row>

                {!addFormData.is_parent && ( 
                  <Row className="mb-2">

                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Parent Menu <span className='text-danger'> *</span> </Form.Label>

                      <Select
                        styles={customStyles}
                        className={"border-dark"}
                        classNamePrefix="react-select"
                        options={activeParentMenuOptions || ''}
                        value={activeParentMenuOptions.find(option => option.value === addFormData.parent_menu_id) || null}
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
                      <Form.Label>Permission <span className='text-danger'> *</span> </Form.Label>

                      <Select
                        styles={customStyles}
                        isMulti={true} // Enable multiple selection
                        name="permission_id"
                        className={`border-dark ${showValidationError.permission_id ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                        options={activePermissionOptions}
                        value={activePermissionOptions.filter(option =>
                          addFormData.permission_id.includes(option.value)
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
                 )}
                  
              


                <Row className="mb-4">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Sort Order</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      className='border-dark'
                      placeholder="Enter Sort Order"
                      name='sort_order'
                      value={addFormData.sort_order}
                      isInvalid={!!showValidationError.sort_order}
                      onChange={onChangeHandler}
                      tabIndex={5}
                    />

                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label></Form.Label>
                    <div className="form-check form-switch mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={addFormData.is_active}
                        onChange={(e) => setFormData({ ...addFormData, is_active: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {addFormData.is_active ? 'Active' : 'Inactive'}
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
                        value=""
                        id="flexCheckChecked"
                        onChange={(e) => setFormData({ ...addFormData, top_menu: e.target.checked })}
                      />
                      <Form.Label>Top Menu?</Form.Label>
                    </div>

                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <button type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                    <Button tabIndex={5} type="submit">Save</Button>
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

export default MenuForm;


