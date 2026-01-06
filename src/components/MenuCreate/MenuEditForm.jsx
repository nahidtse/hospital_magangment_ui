import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseUrl = import.meta.env.VITE_BASE_URL;


const MenuEditForm = ({ setShowData, setContactsData, passEditFormData, setPassingEditFormData }) => {


  const [editFormData, setEditFormData] = useState({
    menuName: '',
    moduleId: '',
    modulename: '',
    isParent: '',
    parentMenuName: '',
    parentMenuId: '',
    permissionId: [],
    permissionName: [],
    sortOrder: '',
    topMenu: '',
    isActive: 1,
  })

  const [showValidationError, setValidationErrors] = useState({
    menu_name: '',
    module_name: '',
    permission_id: '',
    parent_menuId: '',

  });
  const [moduleData, setModuleData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [isParen, setIsParen] = useState(0)
  const [parenMenusData, setParenMenusData] = useState([])
  console.log(passEditFormData);

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        menuName: passEditFormData.menu_name,
        moduleId: passEditFormData.module_id,
        modulename: passEditFormData.module.module_name,
        parentMenuName: passEditFormData.menu_name,
        parentMenuId: passEditFormData.parent_menu_id,
        isParent: passEditFormData.is_parent,
        permissionName: passEditFormData.permissionname,
        permissionId: passEditFormData.permissions,
        sortOrder: passEditFormData.sort_order,
        topMenu: passEditFormData.is_top_menu,

        isActive: passEditFormData.is_active
      });
    }
    setPermissionData(passEditFormData.permissionName)
  }, [passEditFormData]);

  const isParenHandler = () => {
    let updated = !isParen
    updated = updated ? 1 : 0;
    const newEditForm = { ...editFormData }

    if (updated) {
      newEditForm['parentMenuId'] = [];
      newEditForm['permissionId'] = []
    } else {
      newEditForm['parentMenuId'] = passEditFormData.parent_menu_id;
      newEditForm['permissionId'] = passEditFormData.permissions
    }
    setIsParen(updated)
    newEditForm['isParent'] = updated;
    setEditFormData(newEditForm)

  }
  const redirectData = (id) => {

    fetch(`${baseUrl}/menu/show/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setContactsData(prev =>
          prev.map(c =>
            c.id === data.data.id ? data.data : c
          )
        );
      })
      .catch((error) => {
        console.log("Error Fetching the data: ", error)
      })
  }


  const getPermissionDataByModuleId = (event) => {

    const moduleId = event.target.value;


    const perData = moduleData.find(item => item.id === parseInt(moduleId))
    // console.log(perData);
    setPermissionData(perData.permission_data);
    setParenMenusData(perData.menu_data);


    const newData = { ...editFormData, moduleId: moduleId }
    setEditFormData(newData);

  }

  const goToModuleList = () => {
    setShowData(false);
    setPassingEditFormData(null);

  };


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

    if (!editFormData.menuName.trim()) {
      errors.menu_name = "Menu name is required.";
    } else if (!editFormData.moduleId) {
      errors.module_name = "Module name is required.";
    }

    //TODO::

    // else if (editFormData.menuName.trim() && editFormData.moduleId.trim()) {
    //   const isDuplicate = existingData.some(data =>
    //     (data.menu_name == editFormData.menuName && data.module_id == editFormData.moduleId)
    //   );

    //   if (isDuplicate) {
    //     errors.menu_name = "Duplicate Menu name for this module.";
    //   }
    // }

    if (!isParen) {

      if (!editFormData.parentMenuId) {
        errors.parent_menuId = "Parent Menu name is required.";
      }
      if (!editFormData.permissionId) {

        errors.permission_id = "Permission name is required.";
      }
    }
    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        menu_name: editFormData.menuName,
        module_id: editFormData.moduleId,
        parent_menu_id: editFormData.parentMenuId,
        is_parent: editFormData.isParent,
        permissions: editFormData.permissionId,
        sort_order: editFormData.sortOrder,
        is_top_menu: editFormData.topMenu,
        is_active: Number(editFormData.isActive) ? 1 : 0,
      }

      // console.log(submitData);
      // return;
      const result = await fetch(`${baseUrl}/menu/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      if (response.status == 'success') {
        toast.success(response.message, { autoClose: 1000 });

        redirectData(passEditFormData.id);

        setShowData(false);
        setPassingEditFormData(null);

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moduleRes, menuRes] = await Promise.all([
          fetch(`${baseUrl}/module`),
          fetch(`${baseUrl}/menu`),


        ]);

        const [moduleData, menuData] = await Promise.all([
          moduleRes.json(),
          menuRes.json(),

        ]);
        // console.log(menuData.data);

        setModuleData(moduleData.data)
        setParenMenusData(menuData.data)

      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [])

  const permission = permissionData.map((item) => ({
    value: item.id,
    label: item.permission_name,
  }));

  //  const permission = permissionData
  //   .filter(item => !passEditFormData.permissions.includes(item.id))
  //   .map(item => ({
  //     value: item.id,
  //     label: item.permission_name,
  //   }));



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Menu</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}menu/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
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
                      id="menuName"
                      placeholder="Enter menu name"
                      name='menuName'
                      value={editFormData.menuName}
                      onChange={handleEditFormChange}
                      isInvalid={!!showValidationError.menu_name}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.menu_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.module_name ? 'is-invalid' : ''}`}
                      name="moduleId"
                      onChange={getPermissionDataByModuleId}
                      value={editFormData.moduleId}
                      aria-label="Select role"
                    >
                      {/* <option value={editFormData.moduleId}>{editFormData.modulename}</option> */}
                      {moduleData.map((data) => (
                        <option key={data.id} value={data.id}>{data.module_name}</option>
                      ))}

                    </Form.Select>

                    {showValidationError.module_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.module_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label></Form.Label>
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input border-dark"
                        type="checkbox"
                        value="isParen"
                        id="flexCheckChecked"
                        checked={editFormData.isParent == 1}
                        onChange={isParenHandler}
                      />
                      <Form.Label>Is Parent?</Form.Label>
                    </div>
                  </Form.Group>
                </Row>

                {/* {editFormData.isParent != 1 && !isParen && (  )} */}
                <Row className="mb-3">

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Parent Menu <span className='text-danger'> *</span> </Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.parent_menuId ? 'is-invalid' : ''}`}
                      name="parenMenu"
                      value={editFormData.parentMenuId}
                      aria-label="Select role"
                    >
                      {/* First, filter data based on parent_menu_id */}
                      {
                        // (() => {
                        //   const filteredData = parenMenusData.filter(item => item.id == editFormData.parentMenuId);

                        //   console.log(filteredData)
                        //   // Check if filteredData contains any matching item
                        //   if (filteredData.length > 0) {
                        //     return (
                        //       <option value={editFormData.parentMenuId}>
                        //         {filteredData[0].menu_name}
                        //       </option>
                        //     );
                        //   } else {
                        //     return (
                        //       <option value="">Select Parent</option>
                        //     );
                        //   }
                        // })()
                      }

                      {/* Render remaining options based on parenMenusData */}
                      <option value="">Select Parent</option>
                      
                      {parenMenusData &&
                        parenMenusData.map((data) => {
                          if (data.is_parent == 1 && data.module_id === editFormData.moduleId) {
                            return (

                              <option key={data.id} value={data.id}>
                                {data.menu_name}
                              </option>
                            );
                          }
                          return null;
                        })
                      }
                    </Form.Select>


                  </Form.Group>
                  <Form.Group as={Col} md="5" controlId="validationCustom01">
                    <Form.Label>Permission <span className='text-danger'> *</span> </Form.Label>

                    <Select
                      isMulti={true} // Enable multiple selection
                      name="permissionId"
                      className={`border-dark ${showValidationError?.feed_company_id ? 'is-invalid' : ''}`}
                      classNamePrefix="react-select"
                      options={permission}
                      value={permission.filter(option =>
                        (editFormData.permissionId || []).includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map(option => option.value);
                        setEditFormData((prev) => ({
                          ...prev,
                          permissionId: selectedIds,
                        }));
                      }}
                    />
                    {showValidationError.feed_company_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.feed_company_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Row>



                <Row className="mb-4">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Sort Order</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      className='border-dark'
                      placeholder="Enter Sort Order"
                      defaultValue=""
                      name='sortOrder'
                      value={editFormData.sortOrder}
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
                        checked={editFormData.isActive == 1}
                        onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.isActive == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label></Form.Label>
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input border-dark"
                        name='topMenu'
                        type="checkbox"
                        value=""
                        id="flexCheckChecked"
                        checked={editFormData.topMenu == 1}
                        onChange={(e) => setEditFormData({ ...editFormData, topMenu: e.target.checked })}
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

