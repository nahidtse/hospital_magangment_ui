import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row, InputGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


export const BasicTable = () => {


  // Tree Font Size
  const getFontSize = (level) => {
    if (level === 1) return '18px';
    if (level === 2) return '16px';
    if (level === 3) return '14px';
    if (level === 4) return '13px';
    return '12px';
  };

  const renderTree = (nodes) => (
    <ul className="tree">
      {nodes.map((node) => (
        <li key={node.id}>
          {node.children && node.children.length > 0 ? (
            <details open>
              <summary>
                <span
                  style={{
                    fontSize: getFontSize(node.level),
                    fontWeight: node.level <= 4 ? '900' : '500'
                  }}
                >
                  {node.account_code}-{node.account_head} ({node.level})
                </span>
              </summary>
              {renderTree(node.children)}
            </details>
          ) : (
            <div className="leaf-node">
              <span
                style={{
                  fontSize: getFontSize(node.level),
                  fontWeight: node.level <= 3 ? '900' : '500'
                }}
              >
                {node.account_code}-{node.account_head} ({node.level})
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );


  // const renderTree = (nodes) => (
  //   <ul className="tree">
  //     {nodes.map((node) => {
  //       // Leaf node: Active Account
  //       if (node.ledger_head_type === "Active Account") {
  //         return (
  //           <li key={node.id} className="leaf-node">
  //             <span style={{ fontSize: getFontSize(node.level), fontWeight: 500 }}>
  //               {node.account_code}-{node.account_head} ({node.level})
  //             </span>
  //           </li>
  //         );
  //       }

  //       // Parent node: Control Account
  //       if (node.ledger_head_type === "Control Account") {
  //         return (
  //           <li key={node.id}>
  //             <details open>
  //               <summary>
  //                 <span style={{ fontSize: getFontSize(node.level), fontWeight: 700, }}>
  //                   {node.account_code}-{node.account_head} ({node.level})
  //                 </span>
  //               </summary>
  //               {node.children && node.children.length > 0 && renderTree(node.children)}
  //             </details>
  //           </li>
  //         );
  //       }

  //       // Top-level node: Title Account
  //       if (node.ledger_head_type === "Title Account") {
  //         return (
  //           <li key={node.id}>
  //             <details open>
  //               <summary>
  //                 <span style={{ fontSize: getFontSize(node.level), fontWeight: 900, }}>
  //                   {node.account_code}-{node.account_head} ({node.level})
  //                 </span>
  //               </summary>
  //               {node.children && node.children.length > 0 && renderTree(node.children)}
  //             </details>
  //           </li>
  //         );
  //       }

  //       return null; // Safety fallback
  //     })}
  //   </ul>
  // );


  //-----------Focus Input Start-----------------------------------
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
  const user_id = localStorage.getItem('user_id');  // Created_by

  if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
  }
  //*********Check Authentication End***********

  const [showValidationError, setValidationErrors] = useState({});


  const [addFormData, setFormData] = useState({
    bu_id: '',
    account_code: '',
    account_head: '',
    ledger_head_type: '',
    account_type: '',
    parent_account_head_id: '',
    parent_account_code: '',
    is_cost_center_mandatory: '2',
    is_budget_head: '2',
    sl_no: '',
    account_usage: '',
    account_source: 'None',
    status: '1',
    level: '',
  })

  // console.log("addFormData",addFormData)

  const [businessUnit, setBusinessUnit] = useState([]) // for react select business unit
  const [parents, setParent] = useState([]) // for react select Parents
  const [treeData, setTreeData] = useState([])  // for react select Tree
  const [coaFilter, setCoaFilter] = useState([])  // for react filter coa
  const [businessUnitFilter, setBusinessUnitFilter] = useState([])  // for react filter coa
  const [formMode, setFormMode] = useState("create") // FormMode Create/Edit
  const [selectedAccountHeadId, setSelectedAccountHeadId] = useState(null) //Filterd id
  const [treeLoading, setTreeLoading] = useState(false);
  
  // console.log("CheckData:", selectedAccountHeadId)


  const onChangeHandler = (e) => {
    const {name, value} = e.target;

    setFormData(prev => ({
        ...prev,
        [name]:value
    }))
  }


  //Inpute Clear Function
  const inputClear = {
    bu_id: '',
    account_code: '',
    account_head: '',
    ledger_head_type: '',
    account_type: '',
    sl_no: '',
    account_usage: '',
    account_source: 'None',
    parent_account_head_id: null,
    is_cost_center_mandatory: '2',
    parent_account_code: '',
    is_budget_head: '2',
    status: '1',
    level: '',
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.bu_id) {
      errors.bu_id = "Business unit is Required.";
    }

    if (!addFormData.account_code) {
      errors.account_code = "Account code is required.";
    }
    
    if (!addFormData.account_head) {
      errors.account_head = "Account Head is required.";
    }
    if (!addFormData.ledger_head_type) {
      errors.ledger_head_type = "Ledger Head is required.";
    }
    if (!addFormData.account_type) {
      errors.account_type = "Account type Head is required.";
    }
    if (!addFormData.account_usage) {
      errors.account_usage = "Account Usage Head is required.";
    }
    if (!addFormData.account_source) {
      errors.account_source = "Account Source Head is required.";
    }
    if (!addFormData.is_cost_center_mandatory) {
      errors.is_cost_center_mandatory = "Cost Center Mandatory Head is required.";
    }
    if (!addFormData.level) {
      errors.level = "Level is required.";
    }



    // STOP HERE
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {

      const submitData = {
        bu_id: addFormData.bu_id,
        account_code: addFormData.account_code,
        account_head: addFormData.account_head,
        ledger_head_type: addFormData.ledger_head_type,
        account_type: addFormData.account_type,
        account_usage: addFormData.account_usage,
        account_source: addFormData.account_source,
        is_cost_center_mandatory: addFormData.is_cost_center_mandatory,
        is_budget_head: addFormData.is_budget_head,
        sl_no: addFormData.sl_no ? Number(addFormData.sl_no) : '',
        status: addFormData.status,
        level: addFormData.level ? Number(addFormData.level) : null,
        parent_account_head_id: addFormData.parent_account_head_id,
      }

      if(formMode === 'create'){
        submitData.created_by = user_id;
      } else {
        submitData.updated_by = user_id;
      }

      console.log("Submited",submitData)
      // return;

      const url = formMode === "edit" ? `${baseURL}/afm_coa/update/${selectedAccountHeadId}` : `${baseURL}/afm_coa/create`;

      const result = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      console.log('Res',response)
      // return

      if (response.status == 'success') {
        toast.success(response.message, {autoClose: 1000});
        loadTree();
        buLoad();
        loadCoaFilter();

        const firstActiveBU = businessUnit.find(bu => bu.is_active == 1);

        // Form reset + default BU set
        setFormData({
          ...inputClear,
          bu_id: firstActiveBU ? firstActiveBU.id : ''
        });

        setSelectedAccountHeadId(null);
        setValidationErrors({});
        setFormMode("create");

      } else {
        if (response.status === 'fail') {
          toast.error(response.message);
          setValidationErrors(response.errors);
        } else {
          toast.error("Internal Error! Try again later.");
          console.error(response.message || {});
        }

      }

    } catch (error) {
      toast.error('Internal Error!! Try again after 5 min.')
      console.log(error);

    }

  }

  const resetHandling = () => {
    setFormData(inputClear);
    setValidationErrors({}) //Validation Errors Clear
  }


  //----------React Select Business Unit Start--------
    const buLoad = () => {
      fetch(`${baseURL}/business_unit/login_user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
        }
      })
        .then((response) => response.json())
        .then((data) => {

          if (data.data) {
            setBusinessUnit(data.data);

            // First active BU default select
            const firstActiveBU = data.data.find(bu => bu.is_active == 1);
            if (formMode === "create" && firstActiveBU) {
            setFormData(prev => ({
              ...prev,
              bu_id: firstActiveBU.id
            }));
          }
          }
        })
    }

    useEffect(() => {
      buLoad();
    }, []);


    const activeBusinessUnitOptions = businessUnit.filter(busness => busness.is_active == 1).map(busness => ({
      value: busness.id,
      label: `${busness.business_unit}`
    }));


    // react-select  onChange handler
    const selectBusinessUnitChange = (selectedOption) => {
      setFormData(prev => ({
        ...prev,
        bu_id: selectedOption? selectedOption.value : '' //bu-> bussness_unit
      }))
    };
  //----------React Select Business Unit End--------

  //----------React Select Coa Filter Start-------
    const loadCoaFilter = async () => {
      try {
        const res = await fetch(`${baseURL}/afm_coa/filter`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.data) {
          setCoaFilter(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      loadCoaFilter();
    }, []);


    const activeFilterCoaOptions = coaFilter.map(coaHead => ({
      value: coaHead.id,
      label: `${coaHead.account_head} (${coaHead.account_code})`
    }));
  //----------React Select Coa Filter End--------


  //----------React Select Business Unit Start-------
    useEffect(() => {
      fetch(`${baseURL}/business_unit/bu_filter`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
        }
      })
        .then((response) => response.json())
        .then((data) => {

          if (data.data) {
            setBusinessUnitFilter(data.data)
          }
        })
    }, [])

    const activeFilterBuOptions = businessUnitFilter.map(bu => ({
      value: bu.id,
      label: `${bu.business_unit}`
    }));


    // react-select  onChange handler
    // const selectBusinessUnitChange = (selectedOption) => {
    //   setFormData(prev => ({
    //     ...prev,
    //     bu_id: selectedOption? selectedOption.value : '' //bu-> bussness_unit
    //   }))
    // };
  //----------React Select Business Unit End--------



  //----------React Select Parent Start--------
  useEffect(() => {
    if (!addFormData.account_type) {
      setParent([]);
      return;
    }

    fetch(`${baseURL}/afm_coa/headByLedgerType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        account_type: addFormData.account_type,
        // bu_id: addFormData.bu_id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setParent(data.data || []);
        } else {
          setParent([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setParent([]);
      })
  }, [addFormData.account_type]);


  const activeParentsOptions = parents.map(parent => ({
    value: parent.id,
    label: `${parent.account_head} (${parent.account_code})`,
    parent_account_code: parent.account_code
  }));


  // react-select  onChange handler
  const selectParentChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      parent_account_head_id: selectedOption? selectedOption.value : '', 
      parent_account_code: selectedOption? selectedOption.parent_account_code : ''
    }))
  };
  //----------React Select Parent End---------



  const levelOptions = [
    { value: 1, label: 'Level 1' },
    { value: 2, label: 'Level 2' },
    { value: 3, label: 'Level 3' },
    { value: 4, label: 'Level 4' },
    { value: 5, label: 'Level 5' },
    { value: 6, label: 'Level 6' },
    { value: 7, label: 'Level 7' },
    { value: 8, label: 'Level 8' },
    { value: 9, label: 'Level 9' },
    { value: 10, label: 'Level 10' },
  ];



  //For Tree Data get Start
  const loadTree = async () => {
    try {
      setTreeLoading(true);

      const res = await fetch(`${baseURL}/afm_coa/tree`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      setTreeData(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setTreeLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, []);
  //For Tree Data get End

  //For Edit Mode
  const handleAccountHeadSelect = (option) => {

    if (!option) {
      setFormMode("create");
      setSelectedAccountHeadId(null);
      setFormData(inputClear); // initial state
      return;
    }

    setSelectedAccountHeadId(option.value)
    setFormMode("edit")

    fetch(`${baseURL}/afm_coa/edit/${option.value}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        const coa = res.data[0];

        if (businessUnit.length === 0) {
          buLoad(); // force reload
        }

        setFormData(prev => ({
          ...prev,
          bu_id: coa.bu_id ?? '',
          account_code: coa.account_code ?? '',
          account_head: coa.account_head ?? '',
          ledger_head_type: coa.ledger_head_type ?? '',
          account_type: coa.account_type ?? '',
          parent_account_head_id: coa.parent_account_head_id ?? '',
          parent_account_code: coa.parent_account_code ?? '',
          is_cost_center_mandatory: String(coa.is_cost_center_mandatory ?? '2'),
          is_budget_head: String(coa.is_budget_head ?? '2'),
          sl_no: coa.sl_no ?? '',
          account_usage: coa.account_usage ?? '',
          account_source: coa.account_source ?? '',
          status: String(coa.status ?? '1'),
          level: coa.level ?? ''
        }));
      }
    });
  }

  const editCancel = () => {
    const firstActiveBU = businessUnit.find(bu => bu.is_active == 1);

    // Form reset + default BU set
    setFormData({
      ...inputClear,
      bu_id: firstActiveBU ? firstActiveBU.id : ''
    });

    setSelectedAccountHeadId(null);
    setValidationErrors({});
    setFormMode("create");
  };
  

  //React select Style
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
            <Card.Header className="">
              <div className='card-title'>Chart of Account</div>
              <div className='ms-5 ps-5'>
                <Form.Group as={Col} md="12">
                    <Select
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: '100%', // parent width 
                            minWidth: '300px',
                          }),
                          control: (base) => ({
                            ...base,
                            borderColor: '#000',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            width: '100%', // control box fixed
                          }),
                        }}
                        className={`border-dark ${showValidationError.bu_id ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                        options={activeFilterBuOptions}
                        // value={activeBusinessUnitOptions.find(option => option.value === addFormData.bu_id) || null}
                        // onChange={selectBusinessUnitChange}
                        isSearchable={true}
                        placeholder="Search and Select Business Unit"
                    />
                </Form.Group>
              </div>
              <div className='ms-3'>
                <Form.Group as={Col} md="12">
                    <Select
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: '100%', // parent width 
                            minWidth: '300px',
                          }),
                          control: (base) => ({
                            ...base,
                            borderColor: '#000',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            width: '100%', // control box fixed
                          }),
                        }}
                        classNamePrefix="react-select"
                        options={activeFilterCoaOptions}
                        onChange={(option) => handleAccountHeadSelect(option)}
                        value={
                          activeFilterCoaOptions.find(
                            opt => opt.value === selectedAccountHeadId
                          ) || null
                        }
                        placeholder="Search and Select Account Head"
                        isSearchable={true}
                    />
                </Form.Group>
              </div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}chart_of_account/coa_report_view`}>
                  <button className="btn btn-primary">View COA Report</button>
                </Link>
              </div>
            </Card.Header>


            <Card.Body className='p-2' style={{backgroundColor: '#F8F8F9'}}>

              
              <Row>
                <Col md='7'>
                    <div style={{ backgroundColor: '#fff', borderRadius: '10px' }} className='p-3 ps-5 coa-container'>
                        {/* CSS For Tree */}
                    <style>{`
                        .tree {
                            --spacing: 1.5rem;
                            --radius: 5px;
                            font-weight: 600;
                            list-style: none;
                            padding: 0;
                            margin: 0;
                        }

                        .tree li {
                            display: block;
                            position: relative;
                            /* আপনার দেওয়া স্পেসিং লজিক */
                            padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
                        }

                        .tree ul {
                            margin-left: calc(var(--radius) - var(--spacing));
                            padding-left: 0;
                        }

                        .tree ul li {
                            border-left: 2px solid #ddd;
                        }

                        .tree ul li:last-child {
                            border-color: transparent;
                        }

                        /* সংযোগকারী এল-শেপ লাইন */
                        .tree ul li::before {
                            content: '';
                            display: block;
                            position: absolute;
                            top: calc(var(--spacing) / -2);
                            left: -2px;
                            width: calc(var(--spacing) + 2px);
                            height: calc(var(--spacing) + 1px);
                            border: solid #ddd;
                            border-width: 0 0 2px 2px;
                        }

                        .tree summary {
                            display: block;
                            cursor: pointer;
                            outline: none;
                        }

                        .tree summary::-webkit-details-marker {
                            display: none;
                        }

                        /* ডট ফিক্স: li::after এবং summary::before কে একসাথে কন্ট্রোল করা */
                        .tree li::after,
                        .tree summary::before {
                            content: '';
                            display: block;
                            position: absolute;
                            top: calc(var(--spacing) / 2 - var(--radius));
                            left: calc(var(--spacing) - var(--radius) - 1px);
                            width: calc(2 * var(--radius));
                            height: calc(2 * var(--radius));
                            border-radius: 50%;
                            background: #ddd; /* যাদের চাইল্ড নেই তাদের ডট কালার */
                        }

                        /* ডাবল ডট রিমুভ লজিক: 
                        যদি li এর ভেতরে summary থাকে (মানে চাইল্ড আছে), তবে li::after হাইড থাকবে */
                        .tree li:has(summary)::after {
                            display: none;
                        }

                        /* যাদের চাইল্ড আছে তাদের ডট কালার */
                        .tree summary::before {
                            z-index: 1;
                            background: rgb(84, 97, 84);
                        }

                        .tree a {
                            text-decoration: none;
                            color: #333;
                            display: inline-block;
                        }

                        /* প্রথম রুটের জন্য ডট পজিশন অ্যাডজাস্টমেন্ট */
                        .coa-wrapper > .tree > li {
                            padding-left: 30px;
                        }
                        .coa-wrapper > .tree > li > details > summary::before,
                        .coa-wrapper > .tree > li::after {
                            left: 5px;
                        }
                    `}</style>
                         {treeLoading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" style={{ width: 50, height: 50 }} role="status">
                          </div>
                          <div className="mt-2">Chart of Account Loading...</div>
                        </div>
                      ) : (
                        renderTree(treeData)
                      )}
                    </div>
                </Col>

                <Col md= '5'>
                  <div style={{backgroundColor: '#fff', borderRadius:'10px'}} className='p-3'>
                    <Row className="pb-3 d-flex align-items-center justify-content-between">
                      <Col>
                        <h5 className="mb-0">{formMode === "create" ? "New Account Head" : "Edit Account Head"}</h5>
                      </Col>
                      {formMode === "edit" && 
                      <Col className="text-end">
                        <button className="btn btn-outline-secondary" onClick={editCancel}>Cancel</button>
                      </Col>}
                    </Row>

                    <Form 
                        noValidate 
                        onSubmit={handleSubmit}
                        onKeyDown={(e) => {
                            const activeEl = document.activeElement; // active element define
                            if (e.key === "Enter" && e.target.tagName !== 'TEXTAREA') {
                            if (activeEl && activeEl.type === "submit") {
                                return; 
                            } else {
                                e.preventDefault();
                            }
                            }
                        }}
                    >

                       <Form.Group as={Col} md="12" className='pb-2'>
                          <Form.Label>Business Unit<span className='text-danger'> *</span> </Form.Label>

                          <Select
                            styles={customStyles}
                            className={`border-dark ${showValidationError.bu_id ? 'is-invalid' : ''}`}
                            classNamePrefix="react-select"
                            options={activeBusinessUnitOptions}
                            value={activeBusinessUnitOptions.find(option => option.value === addFormData.bu_id) || null}
                            onChange={selectBusinessUnitChange}
                            isSearchable={true}
                            // isClearable={true}
                            // tabIndex={13}
                          />
                          <Form.Control.Feedback type='invalid'>{showValidationError.bu_id}</Form.Control.Feedback>
                       </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                        <Form.Label>Account Code<span className='text-danger'> *</span> </Form.Label>
                          <Form.Control
                            required
                            type="text"
                            className={`border-dark ${showValidationError.account_code ? 'is-invalid' : ''}`}
                            placeholder="Enter Account Code"
                            name='account_code'
                            value={addFormData.account_code || ''}
                            isInvalid={!!showValidationError.account_code}
                            onChange={onChangeHandler}
                            tabIndex={5}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.account_code}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                        <Form.Label>Account Head<span className='text-danger'> *</span> </Form.Label>
                          <Form.Control
                            required
                            type="text"
                            className={`border-dark ${showValidationError.account_head ? 'is-invalid' : ''}`}
                            placeholder="Enter Account Head"
                            name='account_head'
                            value={addFormData.account_head || ''}
                            isInvalid={!!showValidationError.account_head}
                            onChange={onChangeHandler}
                            tabIndex={5}
                          />
                          <Form.Control.Feedback type='invalid'>{showValidationError.account_head}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                            <Form.Label>Ledger Head<span className='text-danger'> *</span> </Form.Label>

                            <div className="d-flex gap-3"> {/* vertical layout */}
                                <Form.Check 
                                    type="radio"
                                    label="Title Account"
                                    name="ledger_head_type"
                                    value="Title Account"
                                    checked={addFormData.ledger_head_type === "Title Account"}
                                    onChange={(e) => setFormData({...addFormData, ledger_head_type: e.target.value})}
                                />
                                <Form.Check 
                                    type="radio"
                                    label="Control Account"
                                    name="ledger_head_type"
                                    value="Control Account"
                                    checked={addFormData.ledger_head_type === "Control Account"}
                                    onChange={(e) => setFormData({...addFormData, ledger_head_type: e.target.value})}
                                />
                                <Form.Check 
                                    type="radio"
                                    label="Active Account"
                                    name="ledger_head_type"
                                    value="Active Account"
                                    checked={addFormData.ledger_head_type === "Active Account"}
                                    onChange={(e) => setFormData({...addFormData, ledger_head_type: e.target.value})}
                                />
                            </div>
                            {showValidationError.ledger_head_type && (
                              <div className="invalid-feedback d-block">
                                {showValidationError.ledger_head_type || ''}
                              </div>
                            )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                          <Form.Label>Account Type<span className='text-danger'> *</span> </Form.Label>

                          <div className="d-flex gap-3"> {/* vertical layout */}
                              <Form.Check 
                                  type="radio"
                                  label="Asset"
                                  name="account_type"
                                  value="Asset"
                                  checked={addFormData.account_type === "Asset"}
                                  onChange={(e) => setFormData({...addFormData, account_type: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Expenditure"
                                  name="account_type"
                                  value="Expenditure"
                                  checked={addFormData.account_type === "Expenditure"}
                                  onChange={(e) => setFormData({...addFormData, account_type: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Income"
                                  name="account_type"
                                  value="Income"
                                  checked={addFormData.account_type === "Income"}
                                  onChange={(e) => setFormData({...addFormData, account_type: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Liability"
                                  name="account_type"
                                  value="Liability"
                                  checked={addFormData.account_type === "Liability"}
                                  onChange={(e) => setFormData({...addFormData, account_type: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Equity"
                                  name="account_type"
                                  value="Equity"
                                  checked={addFormData.account_type === "Equity"}
                                  onChange={(e) => setFormData({...addFormData, account_type: e.target.value})}
                              />
                          </div>
                          {showValidationError.ledger_head_type && (
                            <div className="invalid-feedback d-block">
                              {showValidationError.account_type || ''}
                            </div>
                          )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                      <Form.Label>Parent Account Head<span className='text-danger ms-1'></span></Form.Label>
                      <Select
                          styles={customStyles} 
                          classNamePrefix="react-select"
                          options={activeParentsOptions}
                          // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                          onChange={selectParentChange}
                          value={
                          activeParentsOptions.find(
                            opt => opt.value === addFormData.parent_account_head_id
                          ) || null
                        }
                          placeholder="Search and Select Doctor"
                          isSearchable={true}
                          isClearable={true}
                      />

                      {showValidationError.doctor_name && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                          {showValidationError.doctor_name || ''}
                          </Form.Control.Feedback>
                      )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                      <Form.Label>Parent Account Code<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                          required
                          type="text"
                          className='border-dark'
                          placeholder="Enter Test name"
                          value={addFormData.parent_account_code || ''}
                          readOnly
                      />
                      <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group> 

                      <Form.Group as={Col} md="12" className='pb-2'>
                      <Form.Label>Sort Order No.<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                          required
                          type="number"
                          className='border-dark'
                          placeholder="Enter Sort Order No"
                          name='sl_no'
                          value={addFormData.sl_no || ''}
                          onChange={onChangeHandler}
                      />
                      <Form.Control.Feedback type='invalid'>{showValidationError.sl_no}</Form.Control.Feedback>
                      </Form.Group> 

                      <Form.Group as={Col} md="12" className='pb-2'>
                          <Form.Label>Account Usage<span className='text-danger'> *</span> </Form.Label>

                          <div className="d-flex gap-3"> {/* vertical layout */}
                              <Form.Check 
                                  type="radio"
                                  label="Bank"
                                  name="account_usage"
                                  value="Bank"
                                  checked={addFormData.account_usage === "Bank"}
                                  onChange={(e) => setFormData({...addFormData, account_usage: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Cash"
                                  name="account_usage"
                                  value="Cash"
                                  checked={addFormData.account_usage === "Cash"}
                                  onChange={(e) => setFormData({...addFormData, account_usage: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Ledger"
                                  name="account_usage"
                                  value="Ledger"
                                  checked={addFormData.account_usage === "Ledger"}
                                  onChange={(e) => setFormData({...addFormData, account_usage: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Inter Company"
                                  name="account_usage"
                                  value="Inter Company"
                                  checked={addFormData.account_usage === "Inter Company"}
                                  onChange={(e) => setFormData({...addFormData, account_usage: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="None"
                                  name="account_usage"
                                  value="None"
                                  checked={addFormData.account_usage === "None"}
                                  onChange={(e) => setFormData({...addFormData, account_usage: e.target.value})}
                              />
                          </div>
                          {showValidationError.account_usage && (
                            <div className="invalid-feedback d-block">
                              {showValidationError.account_usage || ''}
                            </div>
                          )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                          <Form.Label>Account Source<span className='text-danger'> *</span> </Form.Label>

                          <div className="d-flex gap-3"> {/* vertical layout */}
                              <Form.Check 
                                  type="radio"
                                  label="Customer"
                                  name="account_source"
                                  value="Customer"
                                  checked={addFormData.account_source === "Customer"}
                                  onChange={(e) => setFormData({...addFormData, account_source: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Supplier"
                                  name="account_source"
                                  value="Supplier"
                                  checked={addFormData.account_source === "Supplier"}
                                  onChange={(e) => setFormData({...addFormData, account_source: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Employee"
                                  name="account_source"
                                  value="Employee"
                                  checked={addFormData.account_source === "Employee"}
                                  onChange={(e) => setFormData({...addFormData, account_source: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="Loan Master"
                                  name="account_source"
                                  value="Loan Master"
                                  checked={addFormData.account_source === "Loan Master"}
                                  onChange={(e) => setFormData({...addFormData, account_source: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="None"
                                  name="account_source"
                                  value="None"
                                  checked={addFormData.account_source === "None"}
                                  onChange={(e) => setFormData({...addFormData, account_source: e.target.value})}
                              />
                          </div>
                          {showValidationError.account_source && (
                            <div className="invalid-feedback d-block">
                              {showValidationError.account_source || ''}
                            </div>
                          )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                          <Form.Label>Cost Center Mandatory<span className='text-danger'> *</span> </Form.Label>

                          <div className="d-flex gap-3"> {/* vertical layout */}
                              <Form.Check 
                                  type="radio"
                                  label="Yes"
                                  name="is_cost_center_mandatory"
                                  value="1"
                                  checked={addFormData.is_cost_center_mandatory === "1"}
                                  onChange={(e) => setFormData({...addFormData, is_cost_center_mandatory: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="No"
                                  name="is_cost_center_mandatory"
                                  value="2"
                                  checked={addFormData.is_cost_center_mandatory === "2"}
                                  onChange={(e) => setFormData({...addFormData, is_cost_center_mandatory: e.target.value})}
                              />
                          </div>
                          {showValidationError.is_cost_center_mandatory && (
                            <div className="invalid-feedback d-block">
                              {showValidationError.is_cost_center_mandatory || ''}
                            </div>
                          )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                          <Form.Label>Is Budget Account Head<span className='text-danger'> *</span> </Form.Label>

                          <div className="d-flex gap-3"> {/* vertical layout */}
                              <Form.Check 
                                  type="radio"
                                  label="Yes"
                                  name="is_budget_head"
                                  value="1"
                                  checked={addFormData.is_budget_head === "1"}
                                  onChange={(e) => setFormData({...addFormData, is_budget_head: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="No"
                                  name="is_budget_head"
                                  value="2"
                                  checked={addFormData.is_budget_head === "2"}
                                  onChange={(e) => setFormData({...addFormData, is_budget_head: e.target.value})}
                              />
                          </div>
                          {showValidationError.is_budget_head && (
                            <div className="invalid-feedback d-block">
                              {showValidationError.is_budget_head || ''}
                            </div>
                          )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                          <Form.Label>Is Active<span className='text-danger'> *</span> </Form.Label>

                          <div className="d-flex gap-3"> {/* vertical layout */}
                              <Form.Check 
                                  type="radio"
                                  label="Yes"
                                  name="status"
                                  value="1"
                                  checked={addFormData.status === "1"}
                                  onChange={(e) => setFormData({...addFormData, status: e.target.value})}
                              />
                              <Form.Check 
                                  type="radio"
                                  label="No"
                                  name="status"
                                  value="2"
                                  checked={addFormData.status === "2"}
                                  onChange={(e) => setFormData({...addFormData, status: e.target.value})}
                              />
                          </div>
                          {showValidationError.status && (
                            <div className="invalid-feedback d-block">
                              {showValidationError.status || ''}
                            </div>
                          )}
                      </Form.Group>

                      <Form.Group as={Col} md="12" className='pb-2'>
                        <Form.Label>Level<span className='text-danger ms-1'>*</span></Form.Label>
                        <Select
                            styles={customStyles} 
                            classNamePrefix="react-select"
                            className={`react-select-container ${showValidationError.level ? 'is-invalid' : ''}`}
                            options={levelOptions}
                            onChange={(option) => {
                              setFormData(prev => ({
                                ...prev,
                                level: option ? option.value : ''
                              }));
                            }}
                            value= {levelOptions.find(opt => opt.value === addFormData.level) || null}
                            placeholder="Search and Select Doctor"
                            isSearchable={true}
                            isClearable={true}
                      />

                      {showValidationError.level && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                          {showValidationError.level}
                          </Form.Control.Feedback>
                      )}
                      </Form.Group>


                      <Row className='mb-3'>                 
                      </Row>
                        
                      <div className='d-flex justify-content-end'>
                        {formMode === "create" ? 
                          <button tabIndex={-1} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button> 
                          : ""}
                        <Button tabIndex={6} type="submit">{formMode === "create" ? "Save" : "Update"}</Button>
                      </div>
                    </Form>
                  </div>
                </Col>
              </Row>
              

            </Card.Body>

          </Card>
        </Col>
      </Row>

    </Fragment>
  );
};

