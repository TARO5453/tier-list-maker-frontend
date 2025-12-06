import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
function Navigation() {
    // For redirecting to other pages
    const navigate = useNavigate();
    // For checking user auth status
    const {currentUser, logout} = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Tier List Maker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {/* If the user is authenticated, displays their username and shortcut to Templates page. Otherwise displays login and sign-up buttons*/}
            { currentUser ? (
                <>
                <Nav.Link as={Link} to="/templates">My Templates</Nav.Link>
                <NavDropdown title={`${currentUser.username}`} id="user-dropdown">
                  
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
                
            ) : (
                <>
                    <Button 
                variant="outline-light" 
                className="mx-2"
                onClick={() => navigate('/login')}
                >
                Login
                </Button>
                <Button 
                variant="primary"
                onClick={() => navigate('/register')}
                >
                Sign Up
                </Button>
                </>
            )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
}

export default Navigation;