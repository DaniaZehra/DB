import { useState } from 'react';
import Cookies from 'js-cookie'

function UpdateCustomerForm() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [cust_email, setCustEmail] = useState('');
    const [password, setPassword] = useState('');

    const cust_id = Cookies.get("userId");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updates = { first_name, last_name, cust_email, password };
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value)
        );

       try{
        const response = fetch(`${process.env.REACT_APP_BASE_URL}/customer/update/custId`,{
            method:"PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({cust_id: cust_id, updates:filteredUpdates}),
            credentials: 'include', 
        })
        const result = response.json();
        console.log("Response status:", result.status);
        console.log("Response Body",response);
        if(result.ok){
            alert("This Works");
        }
       }catch(error){

       }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="First Name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={cust_email}
                onChange={(e) => setCustEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Update</button>
        </form>
    );
}

export default UpdateCustomerForm;
