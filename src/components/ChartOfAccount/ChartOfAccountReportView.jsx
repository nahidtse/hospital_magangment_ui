import { Fragment, useEffect, useState, } from 'react';
import { Card, Col, Row,  } from 'react-bootstrap';
import { Link,  } from 'react-router-dom';
import { useRef } from 'react';

const baseURL = import.meta.env.VITE_API_BASE_URL;


const ChartOfAccountReportView = () => {

  const printRef = useRef();



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





  //*********Check Authentication Start***********
  const token = localStorage.getItem('auth_token'); //Check Authentication
  const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

  if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
  }
  //*********Check Authentication End***********






  const [treeData, setTreeData] = useState([])  // for react select Tree


  // const handlePrint = () => {
  //   const element = printRef.current;

  //   const opt = {
  //     margin:       0.5,
  //     filename:     'COA_Report.pdf',
  //     image:        { type: 'jpeg', quality: 0.98 },
  //     html2canvas:  { scale: 2, scrollY: -window.scrollY },
  //     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  //   };

  //   html2pdf().set(opt).from(element).save();
  // };

  const handlePrint = () => {
    window.print();
  };




  const loadTree = () => {
    fetch(`${baseURL}/afm_coa/tree`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTreeData(data.data || []);
      });
  };

  useEffect(() => {
    loadTree();
  }, []);





  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Chart Of Account</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}chart_of_account/dataTable`}>
                  <button className="btn btn-primary">Coa List</button>
                </Link>
                <Link>
                  <button className="btn btn-info ms-2">Chart Of Account</button>
                </Link>
                  
                <button onClick={handlePrint} className="btn btn-success ms-2">Print Report</button>
              </div>
            </Card.Header>


            <Card.Body>

              
              <Row >
                <Col md='12' className='d-flex align-items-center justify-content-center'>
                    <div ref={printRef} id="printable-area" style={{ backgroundColor: '#fff', borderRadius: '10px' }} className='p-3 ps-5 coa-container border border-dark'>
                        {/* CSS For Tree */}
                    <style>{`
                        @page {
                          size: auto;
                          margin: 10mm; /* কাগজের মার্জিন সেট করা */
                        }
                        @media print {
                          body * {
                            visibility: hidden;
                          }
                          #printable-area, #printable-area * {
                            visibility: visible;
                          }
                          #printable-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            margin: 0;
                            padding: 20px;
                            border: none !important; /* বর্ডার প্রিন্টে না চাইলে */
                            box-shadow: none !important;
                          }
                          /* প্রিন্টের সময় বাটন বা নেভিগেশন হাইড করতে */
                          .prism-toggle, .btn, .card-header {
                            display: none !important;
                          }
                        }
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
                        {renderTree(treeData)}
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

export default ChartOfAccountReportView;
