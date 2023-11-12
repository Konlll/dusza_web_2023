import React from 'react';
import {Link} from 'react-router-dom';

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

const Header = () => 
{
    const role = localStorage.getItem("role");
    console.log(role);
    return (
        <>
            <nav>
                <Switch>
                   <Case condition={role == "ADMIN"}>
                         <Link to="/register">Új felhasználó</Link>
                         <Link to="/dashboard">Felhasználók</Link>
                         <Link to="/groups">Csoportok</Link>
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
                         <Link to="/competitions">Versenyek</Link>
                         <Link to="/results">Versenyeredmények</Link>
                    </Case> 
                </Switch>
                <Link to="/about">Rólunk</Link>
            </nav>
        </>
    );

}

export default Header;
