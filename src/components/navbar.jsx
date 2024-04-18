
import { Container } from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate()
  const handleSignOut = () => {
    localStorage.removeItem('access_token')
    navigate('/')
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Cafébara</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products">Home</Nav.Link>
            <Nav.Link as={Link} to="/add">Add Products</Nav.Link>
            <Nav.Link as={Link} to="/manage-products">Manage Products</Nav.Link>
            <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
          </Nav>
          <div className='text-light'>
            <span onClick={handleSignOut} style={{cursor: 'pointer'}}>Sign Out&nbsp;
              <BoxArrowRight
                style={{marginTop: '-3px', marginLeft: '3px'}}
                size={25} /></span>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
