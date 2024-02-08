import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSchema from './CreateSchema';
export default function Component (){
    const [selectedTable, setSelectedTable] = useState('');
    const [schemas, setSchemas] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState('');
    const [tables, setTables] = useState([]);
    const [displaySchema, setDisplaySchema] = useState(false);
    const navigate = useNavigate();

    const handleTableChange = (event) =>{
      const selectedTable = event.target.value;
      setSelectedTable(selectedTable);
      navigate('/query',{state:{schema:selectedSchema,table:selectedTable}});
    }

    const handleSchemaChange =async (event) => {
        setSelectedSchema(event.target.value);
        try {
            const response = await fetch(`http://localhost:5000/api/get_tables/${event.target.value}`);
            if (!response.ok) {
              throw new Error('Failed to fetch tables');
            }
      
            const data = await response.json();
            setTables(data.tables);
          } catch (error) {
            console.error(error);
          }
      };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/get_schemas');
            if (!response.ok) {
              throw new Error('Failed to fetch schemas');
            }
            const data = await response.json();
            setSchemas(data.schemas);
          } catch (error) {
            console.error(error);
          }
        };        
        fetchData();
      }, []);

    
    const handleCreateSchema = () => {
      setDisplaySchema(true);
    }
    
    return (
        <>            
            <div >                
                <select value={selectedSchema} onChange={handleSchemaChange} className='dropdown'>
                    <option value="">Select a schema</option>
                    {schemas.map((schema, index) => (
                    <option key={index} value={schema}>
                        {schema}
                    </option>
                    ))}
                </select>
                    {tables.length > 0 && (
                        <select value={selectedTable} onChange={handleTableChange} className='dropdown'>
                            <option value="">Select a Table</option>
                            {tables.map((table, index) => (
                            <option key={index} value={table}>
                                {table}
                            </option>
                            ))}
                        </select>
                    )}
            </div>
            <div>
                
                <button onClick={handleCreateSchema} className='saveBtn'> 
                    Create Schema
                </button>
            </div>
            {displaySchema && <CreateSchema />}
            
        </>
    )
}