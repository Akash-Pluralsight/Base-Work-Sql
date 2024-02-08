import React,{useState,useEffect} from "react";
import { useLocation } from 'react-router-dom';
import '../App.css'
export default function Query(){
    const [sqlQuery, setSqlQuery] = useState("");
    const [ruleName, setRuleName] = useState("");
    const [editedSqlQuery, setEditedSqlQuery] = useState("");
    const [editedRuleName, setEditedRuleName] = useState("");
    const [tableData, setTableData] = useState([]);
    const [validationMessage, setValidationMessage] = useState("");
    const [validationMessageEdit, setValidationMessageEdit] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState("");
    const location = useLocation();
    const { schema, table } = location.state || {};
    const handleSqlInputChange = (event) => {
        setSqlQuery(event.target.value);
      };
    const handleRuleNameInputChange = (event) =>{
        setRuleName(event.target.value);
    }
    const handleEditedSqlInputChange = (event) => {
        setEditedSqlQuery(event.target.value);
      };
    const handleEditedRuleNameInputChange = (event) =>{
        setEditedRuleName(event.target.value);
    }

    const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/get_data/${schema}/${table}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const result = await response.json();
          setTableData(result.data);
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        fetchData(); // eslint-disable-next-line
      }, [schema,table]);

    const handleSave = async () => {
        const ruleNameExists = tableData.some((row) => row.rule_name === ruleName);
        if (sqlQuery === "" || ruleName === "" || sqlQuery.length < 2) {
            setValidationMessage("<p style='color: red;'>Please enter SQL Query and Rule</p>");
        } 
        else if(ruleNameExists){
            setValidationMessage("<p style='color: red;'>This Rule Name already exists</p>");
        }
        else {
            setValidationMessage("")
            try {
                const syntaxCheckResponse = await fetch('http://localhost:5000/api/sql_query_syntax_check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sqlQuery: sqlQuery,
                    }),
                });
    
                const syntaxCheckResult = await syntaxCheckResponse.json();
                if (syntaxCheckResult.success) {
                    setValidationMessage("<p style='color: green;'>Saved Successfully</p>");
                    await fetch('http://localhost:5000/api/sql_query', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            sqlQuery: sqlQuery,
                            ruleName: ruleName,
                            table,
                            schema
                        }),
                    });
                } else {
                    setValidationMessage(`<p style='color: red;'>${syntaxCheckResult.error}</p>`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleDeleteClick = (id) => {
        if(window.confirm("Are you sure you want to delete?")){
            const deleteEndpoint = `http://localhost:5000/api/delete_row/${schema}/${table}/${id}`;    
            fetch(deleteEndpoint, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to delete row. Status: ${response.status}`);
                }         
                const updatedData = tableData.filter(row => row.id !== id);
                setTableData(updatedData);
              })
              .catch(error => {
                console.error('Error deleting row:', error.message);
              });
        }
    };
  const handleEditClick = (id,rule_name,sql_query) => {
    setEditedRuleName(rule_name);
    setEditedSqlQuery(sql_query)
    setEditId(id)
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleSave();
    }
};

  const handleEditSave =async (id) => {
    const ruleNameExists = tableData.some((row) => row.rule_name === editedRuleName);
        if (editedSqlQuery === "" || editedRuleName === "") {
            setValidationMessageEdit("<p style='color: red;'>Please enter SQL Query and Rule</p>");
        } 
        else if(ruleNameExists){
            setValidationMessageEdit("<p style='color: red;'>This Rule Name already exists</p>");
        }
        else{
            setValidationMessageEdit("")
            try {
                const syntaxCheckResponse = await fetch('http://localhost:5000/api/sql_query_syntax_check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sqlQuery: editedSqlQuery,
                    }),
                });
    
                const syntaxCheckResult = await syntaxCheckResponse.json();
                if (syntaxCheckResult.success) {
                    setValidationMessageEdit("<p style='color: green;'>Updated Successfully</p>");
                    await fetch('http://localhost:5000/api/update_row', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id:editId,
                            editedRuleName,
                            editedSqlQuery,
                            table,
                            schema
                        }),
                    });
                } else {
                    setValidationMessageEdit(`<p style='color: red;'>${syntaxCheckResult.error}</p>`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
  };

    return(
        <>
            <h1>Enter SQL query for {table} table</h1>
            <div>
            <textarea
                placeholder="Enter SQL Query"
                value={sqlQuery}
                onChange={handleSqlInputChange}
                onKeyDown={handleKeyPress}
                className='sqlqueryinput'
            />
            </div>
            <h1>Enter the Rule Name for your Query</h1>
            <div>
                <input
                    placeholder='Enter Rule Name'
                    value={ruleName}
                    onChange={handleRuleNameInputChange}
                    onKeyDown={handleKeyPress}
                    className='ruleinput'
                />
            </div>
            <div dangerouslySetInnerHTML={{ __html: validationMessage }} />
            <div>
                <button onClick={handleSave} className='saveBtn'> 
                    Save
                </button>
            </div>
            <div>
                {tableData.length > 0 && (
                    tableData.map((row, index) => (
                    <div key={index} className="data-rows">
                        <hr />
                        <div  className="data-row">
                            <p>ID: {row.id}</p>
                            <p>Rule Name: {row.rule_name}</p>
                            <p>SQL Query: {row.sql_query}</p>
                            <button onClick={() => handleEditClick(row.id,row.rule_name,row.sql_query)} className="editBtn">EDIT</button>
                            <button onClick={() => handleDeleteClick(row.id)} className="editBtn">DELETE</button>
                        </div>
                        {showEditModal && editId===row.id &&(
                            <div className="edit-modal">
                                <div className="editInputField"> 
                                    <label>Query : </label>
                                    <textarea
                                        placeholder='Enter Query'
                                        value={editedSqlQuery}
                                        onChange={handleEditedSqlInputChange}
                                        className='editruleinput'
                                    />
                                </div>
                                <div className="editInputField">
                                    <label>Rule Name : </label>
                                    <input
                                        placeholder='Enter Rule Name'
                                        value={editedRuleName}
                                        onChange={handleEditedRuleNameInputChange}
                                        className='editruleinput'
                                    />
                                </div>
                                <div>
                                    <button onClick={()=>handleEditSave(row.id)} className="editBtn">Save</button>
                                    <button onClick={handleCloseModal} className="editBtn">Cancel</button>
                                </div>     
                                <div dangerouslySetInnerHTML={{ __html: validationMessageEdit }} />                     
                            </div>
                        )}
                        <hr />
                    </div>
                    ))
                )}
                
            </div>

        </>
    )
} 