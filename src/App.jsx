import React, { useState, useEffect, useRef, createContext, useContext } from 'react'

const ProductContext = createContext()

function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadInitialProducts = () => [
    { id: 1, name: 'Wireless Mouse', description: 'Comfortable wireless mouse with long battery life', price: 29.99, category: 'Electronics' },
    { id: 2, name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with blue switches', price: 79.99, category: 'Electronics' },
    { id: 3, name: 'USB-C Cable', description: 'Fast charging USB-C cable 6ft', price: 12.99, category: 'Accessories' },
    { id: 4, name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand for better posture', price: 45.99, category: 'Accessories' },
    { id: 5, name: 'Wireless Earbuds', description: 'True wireless earbuds with noise cancellation', price: 89.99, category: 'Electronics' },
    { id: 6, name: 'Phone Case', description: 'Protective silicone case for smartphones', price: 15.99, category: 'Accessories' }
  ]

  useEffect(() => {
    const storedProducts = localStorage.getItem('products')
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      const initialProducts = loadInitialProducts()
      localStorage.setItem('products', JSON.stringify(initialProducts))
      setProducts(initialProducts)
    }
    setLoading(false)
  }, [])

  const addProduct = (newProduct) => {
    const productWithId = { ...newProduct, id: Date.now() }
    const updatedProducts = [...products, productWithId]
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  const updateProduct = (id, updatedData) => {
    const updatedProducts = products.map(p => p.id === id ? { ...p, ...updatedData } : p)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  const resetProducts = () => {
    const initialProducts = loadInitialProducts()
    setProducts(initialProducts)
    localStorage.setItem('products', JSON.stringify(initialProducts))
  }

  return { products, loading, addProduct, updateProduct, resetProducts }
}

function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav>
      <ul>
        <li><button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</button></li>
        <li><button onClick={() => setCurrentPage('add-product')} className={currentPage === 'add-product' ? 'active' : ''}>Add Product</button></li>
        <li><button onClick={() => setCurrentPage('products')} className={currentPage === 'products' ? 'active' : ''}>Products</button></li>
      </ul>
    </nav>
  )
}

function Home() {
  return (
    <div className="home">
      <h1>Welcome to E-Commerce Admin Portal</h1>
      <p>Use the tabs to add, edit, remove, and view products.</p>
    </div>
  )
}

function AddProduct() {
  const { addProduct } = useContext(ProductContext)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    addProduct({ name, description, price: parseFloat(price), category })
    setShowSuccess(true)
    setName(''); setDescription(''); setPrice(''); setCategory('')
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="form-container">
      <h2>Add New Product</h2>
      {showSuccess && <div className="success-message">Product added successfully!</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Product Name:</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
        <div className="form-group"><label>Description:</label><textarea value={description} onChange={e => setDescription(e.target.value)} required /></div>
        <div className="form-group"><label>Price:</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required /></div>
        <div className="form-group"><label>Category:</label><input value={category} onChange={e => setCategory(e.target.value)} required /></div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  )
}

function Products() {
  const { products, updateProduct, resetProducts } = useContext(ProductContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Products</h2>
      <button className="reset-button" onClick={resetProducts}>Reset to Default Products</button>
      <div className="search-bar">
        <input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      {filtered.length === 0 ? <p>No products found.</p> : (
        <div className="products-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card">
              {editingId === p.id ? (
                <div>
                  <div className="form-group"><label>Name:</label><input value={editName} onChange={e => setEditName(e.target.value)} /></div>
                  <div className="form-group"><label>Description:</label><input value={editDescription} onChange={e => setEditDescription(e.target.value)} /></div>
                  <div className="form-group"><label>Price:</label><input type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} /></div>
                  <div className="button-group">
                    <button className="save-button" onClick={() => { updateProduct(p.id, { name: editName, description: editDescription, price: parseFloat(editPrice) }); setEditingId(null) }}>Save</button>
                    <button className="cancel-button" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <p><strong>Category:</strong> {p.category}</p>
                  <div className="product-price">${p.price.toFixed(2)}</div>
                  <button className="edit-button" onClick={() => { setEditingId(p.id); setEditName(p.name); setEditDescription(p.description); setEditPrice(p.price) }}>Edit Product</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const productsHook = useProducts()
  const [currentPage, setCurrentPage] = useState('home')

  if (productsHook.loading) return <div>Loading...</div>

 return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        nav { background-color: #1c2321; padding: 15px; margin-bottom: 20px; }
        nav ul { list-style: none; display: flex; gap: 20px; }
        nav button { color: white; background: none; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
        nav button:hover { background-color: #555; }
        nav button.active { background-color: #a9b4c2; }
        .home { text-align: center; padding: 50px 20px; }
        .home h1 { color: #333; margin-bottom: 20px; font-size: 36px; }
        .home p { color: #666; font-size: 18px; line-height: 1.6; max-width: 800px; margin: 0 auto 20px auto; }
        .form-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
        .form-container h2 { margin-bottom: 20px; color: #333; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
        .form-group textarea { min-height: 100px; resize: vertical; }
        button { background-color: #7d98a1; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #a9b4c2; }
        .success-message { background-color: #d4edda; color: #155724; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        .search-bar { margin-bottom: 20px; }
        .search-bar input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; }
        .product-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .product-card h3 { color: #333; margin-bottom: 10px; }
        .product-card p { color: #666; margin-bottom: 10px; }
        .product-price { font-size: 24px; color: #4CAF50; font-weight: bold; margin: 10px 0; }
        .button-group { display: flex; gap: 10px; margin-top: 10px; }
        .edit-button { background-color: #7d98a1; }
        .edit-button:hover { background-color: #a9b4c2; }
        .cancel-button { background-color: #f44336; }
        .cancel-button:hover { background-color: #da190b; }
        .save-button { background-color: #4CAF50; }
        .reset-button { background-color: #ff9800; margin-bottom: 20px; }
        .reset-button:hover { background-color: #e68900; }
        @media (max-width: 768px) {
          nav ul { flex-direction: column; gap: 10px; }
          .products-grid { grid-template-columns: 1fr; }
          .home h1 { font-size: 28px; }
          .form-container { padding: 20px; }
        }
        @media (max-width: 480px) {
          .container { padding: 10px; }
          button { width: 100%; }
          .button-group { flex-direction: column; }
        }
      `}</style>

      <ProductContext.Provider value={productsHook}>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="container">
          {currentPage === 'home' && <Home />}
          {currentPage === 'add-product' && <AddProduct />}
          {currentPage === 'products' && <Products />}
        </div>
      </ProductContext.Provider>
    </>
  )
}