import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Login( { setToken } ){
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [userid, setUserId] = useState();

    useEffect(() => {
        setToken({"token": userid});
    },[userid])

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const body = { "email":username, "password":password };
            const response = await fetch("http://localhost:5000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(body)
            });
            const user = await response.json();
            if(user){
                setUserId(user.userid);
            }
        } catch (error) {
            
        }
    }
    return (
        <div>
            <form className="login" onSubmit={handleSubmit}>
                <label>Email
                    <input name="username" type="text" value={ username } onChange={e => setUserName(e.target.value)} />
                </label>
                <label>Password
                    <input name="password" type="password" value={ password } onChange={e => setPassword(e.target.value)} />
                </label>
                <button>Submit</button>
            </form>
        </div>
    );
}

Login.propTypes = { 
    setToken: PropTypes.func.isRequired
}