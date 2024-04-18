
import { Card, Col, Container, Row } from 'react-bootstrap';
import Navigation from '../components/navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import authorize from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function TransactionHistory() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])

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

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_HOST}/transactions`, {
      headers: {
        access_token: localStorage.getItem('access_token'),
      }})
      .then((response) => {
        setTransactions(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  return (
    <div className="TransactionHistory">
      <Navigation />
      <div style={{marginTop: '40px'}}>
        <Container>
          <h3 style={{marginBottom: '20px'}}>Transaction History</h3>
          {!transactions.length ? (<div>
            <h2 className="text-secondary">There is nothing in here</h2>
          </div>) : null}
          {transactions.map(({
            _id,
            total,
            metadata,
            items,
            createdAt,
          }, i) => (
            <Card 
              bg={parseInt(i) % 2 === 0 ? 'dark' : 'light'}
              className={parseInt(i) % 2 === 0 ? 'text-white' : ''}
              style={{marginBottom: '20px'}} 
              key={_id}>
              <Card.Body>
                <Row>
                  <Col sm={5} md={4}>
                    <span className='text-secondary'>Customer:</span> {metadata.customerName} <br />
                    <span className='text-secondary'>Address:</span> {metadata.customerAddress} <br />
                    <span className='text-secondary'>Cashier:</span> {metadata.cashierName}
                  </Col>
                  <Col sm={7} md={4}>
                    <span className='text-secondary'>Items:</span> <br />
                    {items.map(({product, quantity}, k) => (
                      <div key={k}>
                        <span className='text-secondary'>{product.productCode}</span>&nbsp;
                        {product.productName} - PHP {product.price} x {quantity}<br />
                      </div>
                    ))}
                  </Col>
                  <Col sm={5} md={2}>
                    <span className='text-secondary'>Total:</span> PHP {total}
                  </Col>
                  <Col sm={7} md={2}>
                    {moment(createdAt).format('MMMM DD, YYYY h:mm A')}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Container>
      </div>
    </div>
  );
}

export default TransactionHistory;
