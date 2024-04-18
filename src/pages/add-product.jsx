import { Button, Container, ToastContainer } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Navigation from "../components/navbar";
import { useEffect, useRef, useState } from "react";
import axios from "axios"
import Toast from 'react-bootstrap/Toast';
import authorize from "../utils/auth";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate()
  const [productCode, setProductCode] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [show, setShow] = useState(false);
  const [showAPIError, setShowAPIError] = useState(false);
  const [img, setImg] = useState(null)
  const [APIError, setAPIError] = useState('')
  const ref = useRef();
  const handleFileChange = (event) => {
    setImg(event.target.files[0]);
  }

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

  const handleUpload = () => {
    const fields = [productCode, name, description, img]
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
    axios.post(`${process.env.REACT_APP_API_HOST}/products`, data, {
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
      setShow(true)
    })
    .catch((error) => {
      setAPIError(error.response.data.message)
      setShowAPIError(true)
    })
  }
  return (
    <div className="AddProduct">
      <Navigation />
      <Container className="product-container">
        <div className="product-form">
          <h3>Add New Product</h3>
          <Form>
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
              <Form.Label>Image</Form.Label>
              <Form.Control ref={ref} type="file" accept="image/*" onChange={handleFileChange}/>
            </Form.Group>
          </Form>
          <div className="d-flex justify-content-end">
            <Button onClick={handleUpload} variant="success">Save</Button>
          </div>
        </div>
      </Container>
      <ToastContainer position='bottom-end' style={{position: 'fixed', padding: '20px'}}>
        <Toast bg="success" onClose={() => setShow(false)} show={show} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">Info</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Product was added</Toast.Body>
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

export default AddProduct;
