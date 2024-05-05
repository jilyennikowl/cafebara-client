import './App.css';
import Landing from './pages/landing';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/product.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AddProduct from './pages/add-product';
import ProductList from './pages/product-list';
import TransactionHistory from './pages/transaction-history';
import ManageProducts from './pages/manage-products';

function App() {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/transactions" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
