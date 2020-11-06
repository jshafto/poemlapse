import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../store/authentication';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const errmsg = useSelector(state => state.errors.auth);

    const submitForm = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }
    return (
        <form onSubmit={submitForm}>
            {(errmsg) ? <li>{errmsg}</li> : null}
            <div className="field">
                <label>Email: </label>
                <div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                </div>
                <label>Password: </label>
                <div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
                </div>
            </div>
            <button>Login</button>
        </form>
    );
}
export default LoginForm;
