import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Swal from 'sweetalert2';
const baseUrl = import.meta.env.VITE_BASE_URL;



const RoleEditForm = ({ setShowData, setContactsData, passEditFormData, setPassingEditFormData }) => {



  const [showValidationError, setValidationErrors] = useState({});

  const [editFormData, setEditFormData] = useState({
    rolename: '',
    isActive: ''
  })

  const firstInputRef = useRef(null);

  const [addPermission, setAddPermission] = useState([]);

  const [selectPermission, setSelectPermission] = useState({
    moduleId: '',
    menuId: '',
    permissionId: []
  });


  const [moduleData, setModuleData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [roleMenuData, setRoleMenuData] = useState([]);


  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        rolename: passEditFormData.role_name,

        isActive: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const goToModuleList = () => {
    setShowData(false);
    setPassingEditFormData(null);

  };


  const autoFillUpHandlerForMenu = (event) => {
    event.preventDefault();

    const moduleId = event.target.value;
    const selectedModule = moduleData.find(m => m.id == moduleId);

    if (selectedModule) {
      setMenuData(selectedModule.menu_data);
    }


    setSelectPermission({ ...selectPermission, moduleId: moduleId });
  };

  const autoFillUpHandlerForPermissions = (event) => {
    event.preventDefault();

    const menuId = event.target.value;
    const selectedMenu = menuData.find(m => m.id == menuId);

    if (selectedMenu) {
      setPermissionData(selectedMenu.permissions);
    }


    setSelectPermission({ ...selectPermission, menuId: menuId });
  };

  const fetchRoleMenuData = (id) => {

    fetch(`${baseUrl}/rolemenu/show/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data)
        setRoleMenuData(data.data || []);
      })
      .catch((error) => {
        console.log("Error Fetching the data: ", error)
      })
  }

  const onChangePermission = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...selectPermission };
    newFormData[fieldName] = fieldValue;

    setSelectPermission(newFormData);

  }

  const addSelectPermission = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!selectPermission.moduleId) {
      errors.module_id = "Module is required.";
    }
    if (!selectPermission.menuId) {
      errors.menu_id = "Menu is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const moduleId = Number(selectPermission.moduleId);
    const menuId = Number(selectPermission.menuId);
    const permissionIds = selectPermission.permissionId;

    const module = moduleData.find(item => item.id === moduleId);
    const menu = module.menu_data.find(item => item.id === menuId);
    const permissionList = module.permission_data.filter(item =>
      permissionIds.includes(item.id))
    console.log(permissionList);

    // setAddPermission(prev => [...prev, {
    //   id: Date.now(),
    //   moduleId: moduleId,
    //   moduleName: module.module_name,
    //   menuId: menuId,
    //   menuName: menu.menu_name || "menu name",
    //   permissionId: permissionIds,
    //   permissionNames: permissionList
    // }]);

    try {

      const isExisting = roleMenuData.find(item => item.menu_id === menuId);

      let submitData = {};

      if (isExisting) {
        submitData = {
          id: isExisting.id,
          role_id: passEditFormData.id,
          module_id: moduleId,
          menu_id: menuId,
          permission_id: [
            ...isExisting.permission_id,  // old permissions
            ...permissionIds              // new permissions
          ]
        };
      } else {
        submitData = {
          role_id: passEditFormData.id,
          module_id: moduleId,
          menu_id: menuId,
          permission_id: permissionIds   // new only
        };
      }

      // console.log(submitData);
      // return;

      const result = await fetch(`${baseUrl}/rolemenu/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      if (response.status == 'success') {

        toast.success(response.message, { autoClose: 1000 });

        fetchRoleMenuData(passEditFormData.id);

      } else {
        if (typeof response.message === 'object') {
          setValidationErrors(response.message);
        } else {
          toast.error("Internal Error! Try again later.");
          console.error(response.message);
        }

      }

    } catch (error) {

    }


    setSelectPermission({
      moduleId: '',
      menuId: '',
      permissionId: []
    })

  }

  const deleteRow = (id) => {
    setAddPermission(prev => prev.filter(r => r.id !== id));
  };

  /** Delete Handler */
  const handleDeleteClick = async (Id) => {
    try {
      const result = await fetch(`${baseUrl}/rolemenu/destroy/${Id}`, {
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

    if (!editFormData.rolename.trim()) {
      errors.role_name = "Role name is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        role_name: editFormData.rolename,
        is_active: Number(editFormData.isActive) ? 1 : 0
      }
      const roleMenu = {
        role_id: passEditFormData.id,
        module_id: addPermission.moduleId,
        menu_id: addPermission.menuId,
        permission_id: addPermission.permissionId

      }

      const payload = {
        role: submitData,
        roleMenu: addPermission,
      }

      // console.log(payload)
      // return;

      const result = await fetch(`${baseUrl}/role/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });


      const response = await result.json();
      if (response.status == 'success') {
        toast.success(response.message, { autoClose: 1000 });

        setContactsData((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === response.data.id ? response.data : contact
          )
        );

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
        const [moduleRes, permissionRes, menuRes, roleMenuRes] = await Promise.all([
          fetch(`${baseUrl}/module`),
          fetch(`${baseUrl}/permission`),
          fetch(`${baseUrl}/menu`),
          fetch(`${baseUrl}/rolemenu/show/${passEditFormData.id}`),

        ]);

        const [moduleData, permissionData, menuData, roleMenuData] = await Promise.all([
          moduleRes.json(),
          permissionRes.json(),
          menuRes.json(),
          roleMenuRes.json(),
        ]);

        setModuleData(moduleData.data || []);
        setPermissionsData(permissionData.data || []);
        // setMenuData(menuData.data || []);
        setRoleMenuData(roleMenuData.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Optionally set error state here
      }
    };

    fetchData();
  }, []);

  //   const permissionIds = [36,
  // 37,
  // 38,
  // 39
  // ];
  //   const selectedPermission = permissionIds.flatMap(item => item.permission_id);
  //   const usedPermissionIds = roleMenuData.flatMap(item => item.permission_id);

  //   const filterPermissionData  = permissionsData.filter(item=> item.id === selectedPermission)

  //   /** Multi selection  */
  //   const multiSelectPermissionsData = filterPermissionData
  //     .filter(item => !usedPermissionIds.includes(item.id))
  //     .map(item => ({
  //       value: item.id,
  //       label: item.permission_name
  //     }));



  // 1. Selected allowed permissions
  const selectedPermissionIds = permissionData;

  // 2. Already used permissions (flatten array)

  const usedPermissionIds = roleMenuData
    .filter(r => r.menu_id === selectedPermissionIds.menu_id)
    .map(r => r.permission_id);

  // 3. Filter original permissionData
  const filteredPermissions = permissionsData
    // must be in allowed list
    .filter(item => selectedPermissionIds.includes(item.id))
    // must NOT be already used
    .filter(item => !usedPermissionIds.includes(item.id))
    // final dropdown format
    .map(item => ({
      value: item.id,
      label: item.permission_name
    }));

  // final output
  const multiSelectPermissionsData = filteredPermissions;



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Role</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}role/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form>
                <Row className="mb-5">
                  <Form.Group as={Col} md="4">
                    <Form.Label>Role Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      className='readableInputBgColor border-dark'
                      placeholder="Enter role name"
                      name='rolename'
                      value={editFormData.rolename}
                      onChange={handleEditFormChange}
                      isInvalid={!!showValidationError.role_name}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.role_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" className="mt-3">
                    <Form.Label></Form.Label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={editFormData.isActive == 1}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, isActive: e.target.checked })
                        }
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.isActive == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>

                </Row>


                {/** Permission Area  */}

                <Row className='mb-3'>
                  <Form.Group as={Col} md="3" >
                    <Form.Label>Module Name<span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      // ref={firstInputRef}
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.module_id ? 'is-invalid' : ''}`}
                      name="moduleId"
                      onChange={autoFillUpHandlerForMenu}
                      value={selectPermission.moduleId}
                      aria-label="Select role"
                    >
                      <option value="">Select Module</option>
                      {moduleData.map((data) => (
                        <option key={data.id} value={data.id}>{data.module_name}</option>
                      ))}

                    </Form.Select>

                    {showValidationError.module_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.module_id}
                      </Form.Control.Feedback>
                    )}

                  </Form.Group>

                  <Form.Group as={Col} md="3" >
                    <Form.Label>Menu Name<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.menu_id ? 'is-invalid' : ''}`}
                      name="menuId"
                      value={selectPermission.menuId}
                      onChange={autoFillUpHandlerForPermissions}
                      aria-label="Select role"
                    >


                      <option value="">Select Menu</option>
                      {menuData
                        .filter(menu => {

                          const perms = menu.permissions || [];
                          const isMenuUsed = roleMenuData.some(r => r.menu_id === menu.id);

                          // Collect all used permission IDs for this menu
                          const usedPermissionIds = roleMenuData
                            .filter(r => r.menu_id === menu.id)
                            .flatMap(r => r.permission_id || []);


                          // CASE 1: menu don't use → SHOW
                          if (!isMenuUsed) {
                            return true;
                          }

                          // CASE 2: menu used

                          // CASE 2.1: is parent → HIDE
                          if (menu.is_parent == 1) {
                            return false;
                          }

                          // CASE 2.2: permission menu → SHOW if still have unused permissions
                          const stillHasUnused = perms.some(p => !usedPermissionIds.includes(p));
                          return stillHasUnused;

                        })
                        .map(menu => (
                          <option key={menu.id} value={menu.id}>
                            {menu.menu_name}
                          </option>
                        ))
                      }






                    </Form.Select>

                    {showValidationError.menu_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.menu_id}
                      </Form.Control.Feedback>
                    )}

                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Permission Name </Form.Label>

                    <Select
                      isMulti
                      name="permissionId"
                      classNamePrefix="react-select"
                      options={multiSelectPermissionsData}
                      // defaultValue={permissionsData}
                      value={multiSelectPermissionsData.filter(option =>
                        (selectPermission.permissionId || []).includes(option.value)
                      )}   // ← SELECT ALL BY DEFAULT
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map(option => option.value);
                        setSelectPermission(prev => ({
                          ...prev,
                          permissionId: selectedIds
                        }));
                      }}
                    />


                    {showValidationError.feed_type_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.feed_type_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="2"
                    controlId="validationCustom01"
                    className="d-flex align-items-center mt-4"
                  >
                    <Button
                      type="button"
                      onClick={addSelectPermission}
                    >
                      <i className="ri-add-line fs-16"></i>
                    </Button>
                  </Form.Group>

                </Row>

                <Row className='mb-3'>

                  <div className="mt-3">
                    <div className="fw-bold mb-2">Permission List</div>

                    <div className="table-responsive">
                      <table className="table text-nowrap table-bordered border-dark">
                        <thead className="text-white table-dark">
                          <tr>
                            <th className="text-center border border-dark">Module Name</th>
                            <th className="text-center border border-dark">Menu Name</th>
                            <th className="text-center border border-dark">Permission</th>
                            <th className="border border-dark text-center">Action</th>
                          </tr>
                        </thead>

                        <tbody>

                          {/* SAMPLE ROW DATA */}
                          {/* {addPermission.map((data, index) => (
                            <tr key={data.id}>
                              <td className="border border-dark">{data.moduleName}</td>
                              <td className="border border-dark">{data.menuName}</td>
                              <td className="border border-dark">{data.permissionNames.map(c => c.permission_name).join(', ') || "permission name"}</td>

                              <td className="border border-dark text-center">
                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRow(data.id)}>X</button>
                              </td>
                            </tr>
                          ))} */}

                          {roleMenuData.map((data, index) => (
                            <tr key={data.id}>
                              <td className="border border-dark">{data.module?.module_name}</td>
                              <td className="border border-dark">{data.menu?.menu_name}</td>
                              <td className="border border-dark">{data.permissionData.map(c => c.permission_name).join(', ') || "No Permission"}</td>

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
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default RoleEditForm;












