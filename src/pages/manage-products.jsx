
import { Button, Card, Col, Container, Form, Image, InputGroup, Modal, Row, Toast, ToastContainer } from 'react-bootstrap';
import Navigation from '../components/navbar';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { PencilSquare, Search, Trash } from 'react-bootstrap-icons';
import authorize from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function ManageProducts() {
  const navigate = useNavigate()
  const [baseProducts, setBaseProducts] = useState([])
  const [products, setProducts] = useState([])
  const [productToDelete, setProductToDelete] = useState(null)
  const [productToUpdate, setProductToUpdate] = useState(null)
  const [showDSuccess, setShowDSuccess] = useState(false);
  const [showD, setShowD] = useState(false)
  const [showU, setShowU] = useState(false)
  const [search, setSearch] = useState('')

  // for product update
  const [productCode, setProductCode] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [img, setImg] = useState(null)
  const ref = useRef();
  const [showAPIError, setShowAPIError] = useState(false);
  const [APIError, setAPIError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const auth = async () => {
      try {
        await authorize(localStorage.getItem('access_token'))
      } catch(e) {
        navigate('/')
      }
    }
    auth()
  })

  const handleFileChange = (event) => {
    setImg(event.target.files[0]);
  }
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_HOST}/products`, {
      headers: {
        access_token: localStorage.getItem('access_token'),
      }})
      .then((response) => {
        setProducts(response.data)
        setBaseProducts(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [showDSuccess, showSuccess])

  useEffect(() => {
    setProducts(() => {
      const filtered = baseProducts.filter(({productName, productCode, description}) => {
        const k = new RegExp(search, 'i')
        if (
          k.test(productName) ||
          k.test(productCode) ||
          k.test(description)
        ) {
          return true
        }
        return false
      })
      return filtered
    })
  }, [ search, baseProducts ])

  // for delete confirmation modal
  const handleCloseD = () => {
    setProductToDelete(null)
    setShowD(false)
  }
  const handleShowD = (product) => {
    setProductToDelete(product)
    setShowD(true)
  }

  const handleDelete = () => {
    axios.delete(`${process.env.REACT_APP_API_HOST}/products/${productToDelete._id}`, {
      headers: {
        access_token: localStorage.getItem('access_token'),
      }})
    .then((response) => {
      handleCloseD()
      setShowDSuccess(true)
      return
    })
    .catch((error) => {
      handleCloseD()
      return
    })
  }

  // for update  modal
  const handleCloseU = () => {
    setProductToUpdate(null)
    setShowU(false)
  }
  const handleShowU = (product) => {
    setProductToUpdate(product)
    setProductCode(product.productCode)
    setName(product.productName)
    setPrice(product.price)
    setDescription(product.description)
    setShowU(true)
  }

  const handleUpdate= () => {
    const fields = [productCode, name, description]
    for (const i in fields) {
      if (!fields[i]) {
        setAPIError('incomplete form fields')
        setShowAPIError(true)
        return
      }
    }
    const data = new FormData()
    data.append('productCode', productCode)
    data.append('name', name)
    data.append('price', price)
    data.append('description', description)
    data.append('productImg', img)
    axios.patch(`${process.env.REACT_APP_API_HOST}/products/${productToUpdate._id}`, data, {
      headers: {
        access_token: localStorage.getItem('access_token'),
      },
      'Content-Type': 'multipart/form-data'
    })
    .then((response) => {
      setProductCode('')
      setName('')
      setPrice(0)
      setDescription('')
      setImg(null)
      ref.current.value = ""
      setShowU(false)
      setShowSuccess(true)
    })
    .catch((error) => {
      setAPIError(error.response.data.message)
      setShowAPIError(true)
    })
  }

  return (
    <div className="TransactionHistory">
      <Navigation />
      <div style={{marginTop: '40px'}}>
        <Container>
          <div>
            <Row>
              <Col xs={12} md={8}>
                <h3 style={{marginBottom: '20px'}}>Manage Products</h3>
              </Col>
              <Col xs={12} md={4}>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                  <InputGroup.Text id="basic-addon2">
                    <Search
                      style={{cursor: 'pointer'}}
                      className="text-secondary" size={20} />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
          </div>
          {!baseProducts.length ? (<div>
            <h2 className="text-secondary">There is nothing in here</h2>
          </div>) : null}
          {!products.length && baseProducts.length ? (<div>
            <h2 className="text-secondary">Nothing matches your search</h2>
          </div>) : null}
          {products.map(({
              _id,
              productCode,
              productName,
              description,
              price,
              imageUrl,
              createdAt,
              updatedAt
            }, i) => (
            <Card 
              bg={parseInt(i) % 2 === 0 ? 'dark' : 'light'}
              className={parseInt(i) % 2 === 0 ? 'text-white' : ''}
              style={{marginBottom: '20px'}} 
              key={_id}>
              <Card.Body>
                <Row>
                  <Col sm={6} md={6} lg={2}>
                    <Image 
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        height: '150px',
                        width: '100%'
                      }} src={`${process.env.REACT_APP_API_HOST}/${imageUrl}`} 
                      rounded />
                  </Col>
                  <Col sm={6} md={6} lg={2}>
                    <span className='text-secondary'>Product Code:</span> {productCode} <br />
                    <span className='text-secondary'>Name:</span> {productName} <br />
                    <span className='text-secondary'>Price:</span> PHP {price} <br />
                  </Col>
                  <Col sm={12} md={12} lg={4}>
                    <span className={parseInt(i) % 2 === 0 ? 'text-white' : ''}>
                        {description}
                    </span> <br />
                  </Col>
                  <Col sm={12} md={12} lg={3}>
                    <span className='text-secondary'>Date Added:</span> {moment(createdAt).format('MMMM DD, YYYY h:mm A')} <br />
                    {updatedAt ? 
                    (<><span className='text-secondary'>Last Updated:</span> {moment(updatedAt).format('MMMM DD, YYYY h:mm A')} <br /></>) 
                    : <br />}
                  </Col>
                  <Col sm={12} md={12} lg={1}>
                    <div className="d-flex justify-content-end">
                      <PencilSquare
                        style={{cursor: 'pointer', marginRight: '10px'}}
                        onClick={() => handleShowU({productCode, productName, _id, description, price})}
                        className="text-primary" size={45} />
                      <Trash
                        style={{cursor: 'pointer'}}
                        onClick={() => handleShowD({productCode, productName, _id})}
                        className="text-danger" size={45} />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Container>
      </div>
      <Modal centered show={showD} onHide={handleCloseD} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Attention!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete ? (<span className="text-primary">{productToDelete.productCode} - {productToDelete.productName} <br /></span>) : null}
          Are you sure you want to delete this item?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseD}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="success" onClose={() => setShowDSuccess(false)} show={showDSuccess} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">Info</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Item was deleted</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* update modal */}
      <Modal centered show={showU} onHide={handleCloseU} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>          <Form>
            <Form.Group className="mb-3" controlId="product-code">
              <Form.Label>Product Code</Form.Label>
              <Form.Control
                maxLength={40} 
                value={productCode} onChange={e => setProductCode(e.target.value)}
                placeholder="Example: LTE143" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                maxLength={100} 
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Make it catchy!" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price in PHP</Form.Label>
              <Form.Control 
                type="number"
                min="0"
                maxLength={100} 
                value={price} onChange={e => setPrice(e.target.value)}
                placeholder="00" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                maxLength={500} 
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="input description in here ..." as="textarea" rows={3} />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>New Image</Form.Label>
              <Form.Control ref={ref} type="file" accept="image/*" onChange={handleFileChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseU}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="success" onClose={() => setShowSuccess(false)} show={showSuccess} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Info</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Product was Updated</Toast.Body>
        </Toast>
      </ToastContainer>
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="danger" onClose={() => setShowAPIError(false)} show={showAPIError} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Alert!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{APIError}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default ManageProducts;
