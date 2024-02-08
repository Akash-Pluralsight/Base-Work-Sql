import React,{useState} from "react";

export default function CreateSchema (){

    const [schemaName,setSchemaName] = useState("");
    const [validationMessage, setValidationMessage] = useState("");

    const handleSchemaNameChange=(event)=>{
        setSchemaName(event.target.value);
    }

    const handleCreateSchemaBtn = async () => {
        const hasBlankSpaces = /\s+/.test(schemaName);
        const hasSpecialCharacters = /[^\w]/.test(schemaName);
        if(schemaName!==schemaName.toLowerCase()){
            setValidationMessage("<p style='color: red;'>Schema name should be in lowercase</p>");
        }
        else if(hasBlankSpaces){
            setValidationMessage("<p style='color: red;'>Schema name should not contain blank spaces</p>")
        }
        else if (hasSpecialCharacters) {
            setValidationMessage("<p style='color: red;'>Schema name should not contain special characters other than underscore</p>");
        }
        else if(schemaName === ""){
            setValidationMessage("<p style='color: red;'>Please enter Schema name </p>");
        }
        else{
            setValidationMessage("")
            try {
                const response = await fetch("http://localhost:5000/api/createSchema", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ schemaName }),
                });
        
                if (response.ok) {
                  setValidationMessage("<p style='color: green;'>Schema created successfully</p>");

                } else {
                  setValidationMessage("<p style='color: red;'>Error creating schema ok </p>");
                }
            } catch (error) {
                    console.error("Error:", error);
                    setValidationMessage("<p style='color: red;'>Error creating schema</p>");
                }
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleCreateSchemaBtn();
        }
    };

    return(
        <>
            <h1>Enter valid Schema Name</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter Schema Name"
                    value={schemaName}
                    onChange={handleSchemaNameChange}
                    className="schemaInput"
                    onKeyDown={handleKeyPress}
                />
            </div>
            <div dangerouslySetInnerHTML={{ __html: validationMessage }} />
            <button onClick={handleCreateSchemaBtn} className="createschemabtn">
                Create Schema
            </button>
        </>
    )
}