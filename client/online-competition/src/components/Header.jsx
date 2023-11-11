import React from 'react';

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
                           <p>admin condition</p>
                    </Case> 
                    
                   <Case condition={role == "TEACHER"}>
                           <p>teacher condition</p>
                    </Case> 
                   <Case condition={role == "STUDENT"}> 
                        <p>student condition</p>
                    </Case> 
                   <Case condition={role == "JUDGE"}> 
                        <p>jury condition</p>
                    </Case> 
                </Switch>
            </nav>
        </>
    );

}

export default Header;
