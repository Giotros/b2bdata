import React, { useState } from 'react';
import { Upload, FileJson, GitCompare, TrendingUp, Calendar, Download, AlertCircle, Zap, Shield, Clock, BarChart3, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ProductSnapshotTracker = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [xmlInput, setXmlInput] = useState('');
  const [xmlUrl, setXmlUrl] = useState('');
  const [snapshot, setSnapshot] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const parseXML = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    const products = [];
    const items = xmlDoc.getElementsByTagName('item') || xmlDoc.getElementsByTagName('product');
    
    for (let item of items) {
      const getId = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) return elem.textContent;
        }
        return null;
      };

      const getPrice = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) {
            const price = parseFloat(elem.textContent.replace(/[^0-9.]/g, ''));
            if (!isNaN(price)) return price;
          }
        }
        return 0;
      };

      const getQuantity = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) {
            const qty = parseInt(elem.textContent);
            if (!isNaN(qty)) return qty;
          }
        }
        return 0;
      };

      const getName = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) return elem.textContent;
        }
        return 'Unknown Product';
      };

      const product = {
        sku: getId(['id', 'sku', 'g:id', 'product_id']),
        name: getName(['title', 'name', 'g:title', 'product_name']),
        price: getPrice(['price', 'g:price', 'sale_price', 'product_price']),
        quantity: getQuantity(['quantity', 'stock', 'availability', 'qty', 'stock_quantity'])
      };

      if (product.sku) {
        products.push(product);
      }
    }

    return products;
  };

  const handleCreateSnapshot = async () => {
    setError('');
    setLoading(true);

    try {
      let xmlData = '';
      
      if (xmlUrl) {
        const response = await fetch(xmlUrl);
        if (!response.ok) throw new Error('Failed to fetch XML from URL');
        xmlData = await response.text();
      } else if (xmlInput) {
        xmlData = xmlInput;
      } else {
        throw new Error('Please provide XML content or URL');
      }

      const products = parseXML(xmlData);
      
      if (products.length === 0) {
        throw new Error('No products found in XML. Please check the format.');
      }

      const snapshotData = {
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB'),
        products: products,
        totalProducts: products.length
      };

      setSnapshot(snapshotData);
      
      const blob = new Blob([JSON.stringify(snapshotData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapshot-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = (file1, file2) => {
    setError('');
    setLoading(true);

    try {
      const reader1 = new FileReader();
      const reader2 = new FileReader();

      reader1.onload = (e1) => {
        const snapshot1 = JSON.parse(e1.target.result);
        
        reader2.onload = (e2) => {
          const snapshot2 = JSON.parse(e2.target.result);
          
          const comparison = compareSnapshots(snapshot1, snapshot2);
          setComparison(comparison);
          setLoading(false);
        };
        
        reader2.readAsText(file2);
      };
      
      reader1.readAsText(file1);

    } catch (err) {
      setError('Error reading files. Please ensure they are valid JSON snapshots.');
      setLoading(false);
    }
  };

  const compareSnapshots = (old, newer) => {
    const oldProducts = {};
    old.products.forEach(p => oldProducts[p.sku] = p);

    const changes = {
      priceIncreased: [],
      priceDecreased: [],
      quantityIncreased: [],
      quantityDecreased: [],
      newProducts: [],
      removedProducts: []
    };

    newer.products.forEach(newP => {
      const oldP = oldProducts[newP.sku];
      
      if (!oldP) {
        changes.newProducts.push(newP);
      } else {
        if (newP.price > oldP.price) {
          changes.priceIncreased.push({ ...newP, oldPrice: oldP.price, change: newP.price - oldP.price });
        } else if (newP.price < oldP.price) {
          changes.priceDecreased.push({ ...newP, oldPrice: oldP.price, change: oldP.price - newP.price });
        }

        if (newP.quantity > oldP.quantity) {
          changes.quantityIncreased.push({ ...newP, oldQuantity: oldP.quantity, change: newP.quantity - oldP.quantity });
        } else if (newP.quantity < oldP.quantity) {
          changes.quantityDecreased.push({ ...newP, oldQuantity: oldP.quantity, change: oldP.quantity - newP.quantity });
        }
      }
    });

    old.products.forEach(oldP => {
      const exists = newer.products.find(p => p.sku === oldP.sku);
      if (!exists) {
        changes.removedProducts.push(oldP);
      }
    });

    return {
      oldSnapshot: old,
      newSnapshot: newer,
      changes,
      summary: {
        totalChanges: Object.values(changes).reduce((sum, arr) => sum + arr.length, 0),
        priceChanges: changes.priceIncreased.length + changes.priceDecreased.length,
        quantityChanges: changes.quantityIncreased.length + changes.quantityDecreased.length
      }
    };
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <TrendingUp className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            B2B Data Tracker
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
            Monitor your suppliers' pricing and inventory changes over time
          </p>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Compare snapshots from different dates to identify trending products and make data-driven purchasing decisions
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>No Registration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Section - MOVED TO TOP */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'create' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <FileJson className="w-5 h-5" />
            Create Snapshot
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'compare' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <GitCompare className="w-5 h-5" />
            Compare Snapshots
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Create Snapshot Tab */}
        {activeTab === 'create' && (
          <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-6">Create New Snapshot</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  XML Feed URL
                </label>
                <input
                  type="text"
                  placeholder="https://supplier.com/products.xml"
                  value={xmlUrl}
                  onChange={(e) => setXmlUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-600"></div>
                <span className="text-slate-500 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-600"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Paste XML Content
                </label>
                <textarea
                  placeholder="<items>&#10;  <item>&#10;    <id>SKU123</id>&#10;    <title>Product Name</title>&#10;    <price>29.99</price>&#10;    <quantity>50</quantity>&#10;  </item>&#10;</items>"
                  value={xmlInput}
                  onChange={(e) => setXmlInput(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              <button
                onClick={handleCreateSnapshot}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate Snapshot
                  </>
                )}
              </button>
            </div>

            {snapshot && (
              <div className="mt-8 p-6 bg-green-900/30 border border-green-500/50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Snapshot Created Successfully!</h3>
                <div className="space-y-2 text-green-300">
                  <p><span className="font-medium">Date:</span> {snapshot.date}</p>
                  <p><span className="font-medium">Products Found:</span> {snapshot.totalProducts}</p>
                  <p className="text-sm mt-3">Your snapshot has been downloaded. Save it to compare later!</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compare Snapshots Tab */}
        {activeTab === 'compare' && (
          <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-6">Compare Snapshots</h2>
            
            {!comparison ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Old Snapshot (Earlier Date)
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      id="oldFile"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      New Snapshot (Later Date)
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      id="newFile"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const file1 = document.getElementById('oldFile').files[0];
                    const file2 = document.getElementById('newFile').files[0];
                    if (file1 && file2) {
                      handleCompare(file1, file2);
                    } else {
                      setError('Please select both snapshot files');
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50"
                >
                  {loading ? (
                    <>Comparing...</>
                  ) : (
                    <>
                      <GitCompare className="w-5 h-5" />
                      Compare Snapshots
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-blue-400 text-sm font-medium">Total Changes</p>
                    <p className="text-3xl font-bold text-blue-300">{comparison.summary.totalChanges}</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
                    <p className="text-green-400 text-sm font-medium">Price Changes</p>
                    <p className="text-3xl font-bold text-green-300">{comparison.summary.priceChanges}</p>
                  </div>
                  <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg">
                    <p className="text-purple-400 text-sm font-medium">Stock Changes</p>
                    <p className="text-3xl font-bold text-purple-300">{comparison.summary.quantityChanges}</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/30 p-4 rounded-lg">
                    <p className="text-orange-400 text-sm font-medium">New Products</p>
                    <p className="text-3xl font-bold text-orange-300">{comparison.changes.newProducts.length}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold mb-4">Change Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Price Up', value: comparison.changes.priceIncreased.length },
                            { name: 'Price Down', value: comparison.changes.priceDecreased.length },
                            { name: 'Stock Up', value: comparison.changes.quantityIncreased.length },
                            { name: 'Stock Down', value: comparison.changes.quantityDecreased.length },
                            { name: 'New', value: comparison.changes.newProducts.length },
                            { name: 'Removed', value: comparison.changes.removedProducts.length }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold mb-4">Top Price Changes</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={[...comparison.changes.priceIncreased, ...comparison.changes.priceDecreased]
                        .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                        .slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="sku" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Bar dataKey="change" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Changes */}
                <div className="space-y-4">
                  {comparison.changes.priceIncreased.length > 0 && (
                    <details className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <summary className="font-semibold text-red-400 cursor-pointer hover:text-red-300">
                        Price Increases ({comparison.changes.priceIncreased.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {comparison.changes.priceIncreased.slice(0, 10).map((p, i) => (
                          <div key={i} className="text-sm text-red-200 bg-slate-900/50 p-2 rounded">
                            <span className="font-medium">{p.name}</span> (SKU: {p.sku}) - 
                            €{p.oldPrice.toFixed(2)} → €{p.price.toFixed(2)} 
                            <span className="text-red-400 font-medium"> (+€{p.change.toFixed(2)})</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {comparison.changes.priceDecreased.length > 0 && (
                    <details className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <summary className="font-semibold text-green-400 cursor-pointer hover:text-green-300">
                        Price Decreases ({comparison.changes.priceDecreased.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {comparison.changes.priceDecreased.slice(0, 10).map((p, i) => (
                          <div key={i} className="text-sm text-green-200 bg-slate-900/50 p-2 rounded">
                            <span className="font-medium">{p.name}</span> (SKU: {p.sku}) - 
                            €{p.oldPrice.toFixed(2)} → €{p.price.toFixed(2)} 
                            <span className="text-green-400 font-medium"> (-€{p.change.toFixed(2)})</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {comparison.changes.quantityIncreased.length > 0 && (
                    <details className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <summary className="font-semibold text-blue-400 cursor-pointer hover:text-blue-300">
                        Stock Increases ({comparison.changes.quantityIncreased.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {comparison.changes.quantityIncreased.slice(0, 10).map((p, i) => (
                          <div key={i} className="text-sm text-blue-200 bg-slate-900/50 p-2 rounded">
                            <span className="font-medium">{p.name}</span> (SKU: {p.sku}) - 
                            {p.oldQuantity} → {p.quantity} units 
                            <span className="text-blue-400 font-medium"> (+{p.change})</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {comparison.changes.newProducts.length > 0 && (
                    <details className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                      <summary className="font-semibold text-purple-400 cursor-pointer hover:text-purple-300">
                        New Products ({comparison.changes.newProducts.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {comparison.changes.newProducts.slice(0, 10).map((p, i) => (
                          <div key={i} className="text-sm text-purple-200 bg-slate-900/50 p-2 rounded">
                            <span className="font-medium">{p.name}</span> (SKU: {p.sku}) - 
                            €{p.price.toFixed(2)}, Stock: {p.quantity}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>

                <button
                  onClick={() => setComparison(null)}
                  className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors border border-slate-600"
                >
                  Compare Different Snapshots
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real World Use Case - MOVED BELOW TOOL */}
      <div className="bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 border border-blue-500/30 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-blue-400">Real World Example</h2>
            </div>
            
            <div className="space-y-6 text-slate-300">
              <p className="text-lg leading-relaxed">
                It's summer, and you're managing an electronics store. You have 5 suppliers offering air conditioning units. 
                You want to identify the <span className="text-blue-400 font-semibold">best-selling models</span> so you can make smart inventory decisions.
              </p>
              
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Here's what you do:</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold text-white">Monday (Day 1)</p>
                      <p className="text-slate-400">Create snapshots from all 5 suppliers' XML feeds. Supplier A shows AC Model X has <span className="text-white font-medium">50 units</span> in stock.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold text-white">Monday (Day 8)</p>
                      <p className="text-slate-400">Create new snapshots. Now Supplier A shows AC Model X has only <span className="text-white font-medium">12 units</span> left!</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-green-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">💡</div>
                    <div>
                      <p className="font-semibold text-green-400">The Insight</p>
                      <p className="text-slate-400">Model X sold 38 units in a week = <span className="text-green-400 font-medium">hot seller!</span> Time to buy 30+ units before your competition does.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">🎯 Strategic Advantages:</h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong className="text-white">Low Stock + High Sales =</strong> Buy in bulk, create local monopoly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong className="text-white">Trending Online Only?</strong> Stock it in your physical store before competitors notice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong className="text-white">Price Changes:</strong> Spot when suppliers increase prices = adjust your margins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong className="text-white">Dead Stock:</strong> Products with no quantity changes? Don't waste money stocking them</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-center text-lg text-blue-400 font-semibold">
                Track trends. Make data-driven decisions. Stay ahead of competition.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Snapshot</h3>
            <p className="text-slate-400 text-sm">
              Upload your supplier's XML feed or paste the content directly
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Save JSON File</h3>
            <p className="text-slate-400 text-sm">
              Download the timestamped snapshot to your computer for safekeeping
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Wait & Repeat</h3>
            <p className="text-slate-400 text-sm">
              Come back after days or weeks and create another snapshot
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2">Compare & Analyze</h3>
            <p className="text-slate-400 text-sm">
              Upload both snapshots to see detailed changes and trends
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">Why Use B2B Data Tracker?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all">
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-slate-400">
                Process thousands of products in seconds. No waiting, no server delays. Everything runs in your browser.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all">
              <Shield className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">100% Private</h3>
              <p className="text-slate-400">
                Your data never leaves your device. No uploads, no storage, no tracking. Complete privacy guaranteed.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all">
              <BarChart3 className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Insights</h3>
              <p className="text-slate-400">
                Visual charts and detailed breakdowns help you spot supplier trends, price changes, and inventory fluctuations instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "What XML formats are supported?",
              a: "The tool supports most standard XML feed formats including Google Shopping feeds, custom product feeds, and any XML with product elements containing ID/SKU, title/name, price, and quantity fields."
            },
            {
              q: "How often should I create snapshots?",
              a: "It depends on how frequently your suppliers update their feeds. For suppliers that change prices daily or weekly, create snapshots regularly. For more stable suppliers, bi-weekly or monthly snapshots work well."
            },
            {
              q: "Is my data stored or shared?",
              a: "No. All processing happens in your browser. Your XML data and snapshots never leave your device. We don't store, track, or have access to any of your supplier data."
            },
            {
              q: "Can I compare more than two snapshots?",
              a: "Currently, the tool compares two snapshots at a time. If you have 5 suppliers, you'll create 5 snapshots per day and compare each supplier's Day A vs Day B separately."
            },
            {
              q: "What if my supplier changes their XML format?",
              a: "The tool is flexible and tries to detect common field names automatically. If a format changes significantly, you may need to verify the snapshot captures the correct data."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-semibold">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 text-slate-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">B2B Data Tracker</span>
            </div>
            <div className="text-slate-500 text-sm space-y-1">
              <p>© 2025 B2B Data Tracker. All rights reserved.</p>
              <p>Created by Georgios Trochidis</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductSnapshotTracker;