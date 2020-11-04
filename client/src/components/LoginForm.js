import React, {useState, useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../store/authentication';

function UserForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();
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
                <div className="control">
                    <input className="input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                </div>
                <label>Password: </label>
                <div className="control">
                    <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
                </div>
            </div>
            <button>Login</button>
        </form>
    );
}
export default UserForm;
