import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roleContext } from '../custom_hooks/roleContext';

const Case = ({ condition, children }) => (condition ? children : null);

const Switch = ({ children }) => {
    // Convert children to an array to easily iterate over them
    const childrenArray = React.Children.toArray(children);

    // Find the first Case component with a true condition
    const activeCase = childrenArray.find(
        (child) => child.type === Case && child.props.condition
    );

    // Render the children of the active Case, if any
    return activeCase ? activeCase.props.children : null;
}

const Header = () => {
    const navigate = useNavigate()
    const { role, setRole } = useContext(roleContext)
    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, [role])

    const logout = () => {
        localStorage.removeItem("role")
        setRole("")
        localStorage.removeItem("access_token")
        navigate('/')
    }

    return (
        <>
            <nav>
                <h1>Online vetélkedő</h1>
                <div>
                    <Switch>
                        <Case condition={role == "ADMIN"}>
                            <Link to="/register">Új felhasználó</Link>
                            <Link to="/dashboard">Felhasználók</Link>
                            <Link to="/groups">Csoportok</Link>
                            <Link to="/activity">Aktivitás</Link>
                            <Link to="/create-intro">Bemutatkozás szerkesztése</Link>
                            <Link to="/settings">Beállítások</Link>
                        </Case>

                        <Case condition={role == "TEACHER"}>
                            <Link to="/tasks">Feladatok</Link>
                        </Case>
                        <Case condition={role == "STUDENT"}>
                            <Link to="/intro">Bemutatkozó oldal</Link>
                        </Case>
                        <Case condition={role == "JUDGE"}>
                            <Link to="/dashboard">Versenyek</Link>
                        </Case>
                    </Switch>
                    <Link to="/about">Rólunk</Link>
                    {role && <button onClick={logout}>Kijelentkezés</button>}
                </div>
            </nav>
        </>
    );

}

export default Header;
