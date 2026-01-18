import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileJson, GitCompare, TrendingUp, Calendar, Download, AlertCircle, Zap, Shield, Clock, BarChart3, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SEO from './components/SEO';
import analytics from './utils/analytics';

const ProductSnapshotTracker = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [xmlInput, setXmlInput] = useState('');
  const [xmlUrl, setXmlUrl] = useState('');
  const [xmlFile, setXmlFile] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [cookieConsent, setCookieConsent] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'change', direction: 'desc' });
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check cookie consent on mount
  React.useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setCookieConsent(consent === 'accepted');
    }
  }, []);

  // Track page view on mount
  React.useEffect(() => {
    if (cookieConsent === true) {
      analytics.trackPageView();
    }
  }, [cookieConsent]);

  const handleCookieConsent = (accepted) => {
    setCookieConsent(accepted);
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    analytics.trackCookieConsent(accepted);
  };

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getAllChanges = () => {
    if (!comparison) return [];
    
    const all = [
      ...comparison.changes.quantityDecreased.map(p => ({ ...p, type: 'stock_down', category: 'Hot Seller' })),
      ...comparison.changes.quantityIncreased.map(p => ({ ...p, type: 'stock_up', category: 'Stock Increase' })),
      ...comparison.changes.priceIncreased.map(p => ({ ...p, type: 'price_up', category: 'Price Increase' })),
      ...comparison.changes.priceDecreased.map(p => ({ ...p, type: 'price_down', category: 'Price Decrease' })),
      ...comparison.changes.newProducts.map(p => ({ ...p, type: 'new', category: 'New Product', change: 0, oldQuantity: 0, oldPrice: 0 }))
    ];
    
    // Filter by category
    let filtered = filterCategory === 'all' ? all : all.filter(p => p.type === filterCategory);
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toString().includes(searchTerm)
      );
    }
    
    // Sort
    return sortData(filtered, sortConfig.key, sortConfig.direction);
  };

  const exportToCSV = () => {
    if (!comparison) return;

    const changes = getAllChanges();
    const headers = ['SKU', 'Product Name', 'Category', 'Old Price', 'New Price', 'Price Change', 'Old Stock', 'New Stock', 'Stock Change'];
    const rows = changes.map(p => [
      p.sku,
      p.name,
      p.category,
      p.oldPrice || p.price,
      p.price,
      p.type.includes('price') ? (p.change * (p.type === 'price_up' ? 1 : -1)).toFixed(2) : '0',
      p.oldQuantity || p.quantity,
      p.quantity,
      p.type.includes('stock') ? (p.change * (p.type === 'stock_up' ? 1 : -1)) : '0'
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    if (cookieConsent) {
      analytics.trackCsvExport(changes.length);
    }
  };

  const sanitizeXML = (xmlString) => {
    // Fix common XML issues
    return xmlString
      // Fix unescaped & that aren't part of entities
      .replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
      // Remove any BOM (Byte Order Mark)
      .replace(/^\uFEFF/, '')
      // Fix any double-escaped entities
      .replace(/&amp;amp;/g, '&amp;');
  };

  const parseXML = (xmlString) => {
    // Sanitize XML first
    const cleanXML = sanitizeXML(xmlString);
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cleanXML, 'text/xml');
    
    // Check for XML parsing errors
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      const errorText = parseError[0].textContent || 'Unknown parsing error';
      console.error('XML Parse Error:', errorText);
      console.error('XML Preview (sanitized):', cleanXML.substring(0, 1000));
      
      // Try to extract line number from error
      const lineMatch = errorText.match(/line (\d+)/);
      const line = lineMatch ? lineMatch[1] : 'unknown';
      
      throw new Error(`XML parsing failed at line ${line}. The XML may contain invalid characters or formatting. Try downloading the XML file and uploading it instead.`);
    }
    
    // Detect root element
    const root = xmlDoc.documentElement;
    if (!root) {
      throw new Error('Invalid XML: No root element found');
    }
    
    console.log('Root element:', root.tagName);
    
    // Check if we got HTML instead of XML (CORS proxy issue)
    if (root.tagName.toLowerCase() === 'html') {
      throw new Error('ERROR: Got HTML instead of XML! This means:\n1. The CORS proxy is not working\n2. OR the website is blocking us\n\nSOLUTION: Download the XML file manually and upload it using the "Choose File" button.');
    }
    
    const products = [];
    const detectedFields = { id: null, name: null, price: null, quantity: null, rootElement: root.tagName, itemElement: null };
    
    // SMART SEARCH - Look for product elements ANYWHERE in the tree (not just immediate children)
    let items = null;
    const possibleItemNames = ['product', 'item', 'entry', 'offer', 'listing', 'record'];
    
    for (let itemName of possibleItemNames) {
      items = xmlDoc.getElementsByTagName(itemName);
      if (items.length > 0) {
        detectedFields.itemElement = itemName;
        console.log(`✅ Found ${items.length} <${itemName}> elements`);
        break;
      }
    }
    
    if (!items || items.length === 0) {
      // Last resort - look for ANY element that repeats and has child elements
      console.log('❌ Standard item names not found. Analyzing structure...');
      const allElements = xmlDoc.getElementsByTagName('*');
      const elementCounts = {};
      
      for (let elem of allElements) {
        if (elem.children.length >= 2) { // Has at least 2 children (probably has id, name, etc.)
          const tagName = elem.tagName.toLowerCase();
          elementCounts[tagName] = (elementCounts[tagName] || 0) + 1;
        }
      }
      
      // Find the most repeated element with children
      let maxCount = 0;
      let bestGuess = null;
      for (let [tag, count] of Object.entries(elementCounts)) {
        if (count > maxCount && count >= 5) { // At least 5 items
          maxCount = count;
          bestGuess = tag;
        }
      }
      
      if (bestGuess) {
        items = xmlDoc.getElementsByTagName(bestGuess);
        detectedFields.itemElement = bestGuess;
        console.log(`🔍 Smart guess: Found ${items.length} <${bestGuess}> elements`);
      }
    }
    
    if (!items || items.length === 0) {
      console.error('XML Structure:', cleanXML.substring(0, 2000));
      throw new Error(`No product items found. Root: <${root.tagName}>. Tried: ${possibleItemNames.join(', ')}. Cannot detect product structure automatically. Please check your XML format.`);
    }
    
    for (let item of items) {
      const getId = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) {
            if (!detectedFields.id) detectedFields.id = tag;
            return elem.textContent;
          }
        }
        return null;
      };

      const getPrice = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) {
            const price = parseFloat(elem.textContent.replace(/[^0-9.]/g, ''));
            if (!isNaN(price)) {
              if (!detectedFields.price) detectedFields.price = tag;
              return price;
            }
          }
        }
        return 0;
      };

      const getQuantity = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) {
            const text = elem.textContent.trim().toLowerCase();
            
            // Handle Y/N format (Skroutz and others)
            if (text === 'y' || text === 'yes' || text === 'true' || text === '1') {
              if (!detectedFields.quantity) detectedFields.quantity = `${tag} (Y/N format)`;
              return 999; // In stock
            }
            if (text === 'n' || text === 'no' || text === 'false' || text === '0' || text === '') {
              if (!detectedFields.quantity) detectedFields.quantity = `${tag} (Y/N format)`;
              return 0; // Out of stock
            }
            
            // Handle text-based availability - more variations
            const inStockPatterns = ['in stock', 'available', 'in-stock', 'σε απόθεμα', 'διαθέσιμο', 'instock'];
            const outOfStockPatterns = ['out of stock', 'unavailable', 'out-of-stock', 'εξαντλημένο', 'μη διαθέσιμο', 'outofstock'];
            
            if (inStockPatterns.some(pattern => text.includes(pattern))) {
              if (!detectedFields.quantity) detectedFields.quantity = `${tag} (text: "${text}")`;
              return 999;
            }
            if (outOfStockPatterns.some(pattern => text.includes(pattern))) {
              if (!detectedFields.quantity) detectedFields.quantity = `${tag} (text: "${text}")`;
              return 0;
            }
            
            // Try to parse as number
            const qty = parseInt(text.replace(/[^0-9]/g, ''));
            if (!isNaN(qty) && text.match(/\d/)) {
              if (!detectedFields.quantity) detectedFields.quantity = `${tag} (numeric)`;
              return qty;
            }
          }
        }
        
        // Default: if no quantity field found, assume in stock
        if (!detectedFields.quantity) detectedFields.quantity = 'not found (assuming in stock)';
        return 999;
      };

      const getName = (tags) => {
        for (let tag of tags) {
          const elem = item.getElementsByTagName(tag)[0];
          if (elem) {
            if (!detectedFields.name) detectedFields.name = tag;
            return elem.textContent;
          }
        }
        return 'Unknown Product';
      };

      const product = {
        sku: getId(['id', 'sku', 'mpn', 'g:id', 'product_id', 'item_id', 'uniqueid', 'productid', 'code', 'barcode', 'ean', 'isbn']),
        name: getName(['title', 'name', 'g:title', 'product_name', 'description', 'productname', 'item_name', 'g:description', 'product_title']),
        price: getPrice(['price', 'g:price', 'sale_price', 'product_price', 'cost', 'baseprice', 'finalprice', 'price_with_vat', 'price_without_vat']),
        quantity: getQuantity(['quantity', 'stock', 'availability', 'qty', 'stock_quantity', 'in_stock', 'instock', 'available', 'g:availability', 'stock_status'])
      };

      if (product.sku) {
        products.push(product);
      }
    }

    return { products, detectedFields };
  };

  const handleCreateSnapshot = async () => {
    setError('');
    setLoading(true);
    setSnapshot(null);

    try {
      let xmlData = '';
      let supplierName = '';
      
      // PRIORITY SYSTEM: File > URL > Manual Paste
      // 1. Check for uploaded file FIRST (highest priority)
      if (xmlFile) {
        console.log('✅ Using FILE (Priority 1):', xmlFile.name);
        xmlData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(xmlFile);
        });
        console.log('File read, length:', xmlData.length);
        
        // Extract supplier name from filename (remove .xml extension)
        supplierName = xmlFile.name.replace(/\.xml$/i, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
        
      // 2. If no file, check for URL (second priority)
      } else if (xmlUrl && xmlUrl.trim()) {
        console.log('✅ Using URL (Priority 2):', xmlUrl);
        const proxyUrl = `/api/fetch-xml?url=${encodeURIComponent(xmlUrl)}`;
        console.log('Proxy URL:', proxyUrl);
        
        const response = await fetch(proxyUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch XML' }));
          console.error('Fetch error:', errorData);
          throw new Error(errorData.error || `Server error: ${response.status}. The CORS proxy might not be working. Try uploading the XML file instead.`);
        }
        
        xmlData = await response.text();
        console.log('XML fetched, length:', xmlData.length);
        console.log('XML preview:', xmlData.substring(0, 500));
        
        // Extract supplier name from URL (domain name)
        try {
          const urlObj = new URL(xmlUrl);
          supplierName = urlObj.hostname.replace('www.', '').split('.')[0];
        } catch (e) {
          supplierName = 'supplier';
        }
        
        // Check if response is actually XML
        if (!xmlData.trim().startsWith('<')) {
          console.error('Response is not XML:', xmlData.substring(0, 200));
          throw new Error('Server returned invalid response (not XML). The URL might be blocked. Try downloading the XML file and uploading it instead.');
        }
        
      // 3. If no file or URL, check for manual paste (lowest priority)
      } else if (xmlInput && xmlInput.trim()) {
        console.log('✅ Using MANUAL PASTE (Priority 3)');
        xmlData = xmlInput;
        supplierName = 'manual';
        
      // 4. If nothing is provided, show error
      } else {
        throw new Error('Please provide an XML source:\n1. Upload an XML file (recommended)\n2. Or paste an XML URL\n3. Or paste XML content');
      }

      // Parse XML
      console.log('Parsing XML...');
      const { products } = parseXML(xmlData);
      console.log('Products parsed:', products.length);
      
      if (products.length === 0) {
        throw new Error('No products found in XML. Please check the XML format.');
      }

      // Create snapshot with source info
      const sourceType = xmlFile ? 'file' : (xmlUrl ? 'url' : 'manual');
      const snapshotData = {
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB'),
        source: supplierName,
        sourceType: sourceType,
        products: products,
        totalProducts: products.length
      };

      setSnapshot(snapshotData);

      // Download JSON file with supplier name
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `snapshot-${supplierName}-${dateStr}.json`;

      const blob = new Blob([JSON.stringify(snapshotData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (cookieConsent) {
        analytics.trackSnapshotCreated(sourceType, products.length);
        analytics.trackSnapshotDownload();
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to create snapshot. Please check your XML and try again.');
      if (cookieConsent) {
        analytics.trackError('snapshot_creation', err.message);
      }
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

          if (cookieConsent) {
            analytics.trackComparisonMade(
              comparison.summary.totalChanges,
              comparison.changes.newProducts.length,
              comparison.changes.removedProducts.length
            );
          }

          setLoading(false);
        };

        reader2.readAsText(file2);
      };

      reader1.readAsText(file1);

    } catch (err) {
      setError('Error reading files. Please ensure they are valid JSON snapshots.');
      if (cookieConsent) {
        analytics.trackError('comparison', err.message);
      }
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
    <>
      <SEO />
      <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent px-2">
            B2B Data Tracker
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-3 sm:mb-4 max-w-2xl mx-auto px-4">
            Monitor your suppliers' pricing and inventory changes over time
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8 px-4">
            Compare snapshots from different dates to identify trending products and make data-driven purchasing decisions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-400 px-4">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <FileJson className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Snapshot
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
              activeTab === 'compare'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <div className="bg-slate-800 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 border border-slate-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Create New Snapshot</h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">
              Priority: File Upload → XML URL → Manual Paste. If you upload a file, it takes priority over URL.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Upload XML File {xmlFile && <span className="text-blue-400 text-xs">(Priority: This will be used)</span>}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    accept=".xml"
                    id="fileInput"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setXmlFile(file);
                      setSnapshot(null);
                    }}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer file:text-xs sm:file:text-sm hover:file:bg-blue-700"
                  />
                  {xmlFile && (
                    <button
                      onClick={() => {
                        setXmlFile(null);
                        document.getElementById('fileInput').value = '';
                      }}
                      className="px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 sm:w-auto w-full"
                      title="Clear file"
                    >
                      <span className="text-xl">×</span>
                      <span className="sm:hidden">Clear</span>
                    </button>
                  )}
                </div>
                {xmlFile && (
                  <p className="mt-2 text-xs sm:text-sm text-green-400 flex items-center gap-2 break-all">
                    <span>✓</span> <span className="truncate">{xmlFile.name}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-600"></div>
                <span className="text-slate-500 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-600"></div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  XML Feed URL {!xmlFile && xmlUrl && <span className="text-blue-400 text-xs">(This will be used)</span>}
                  {xmlFile && <span className="text-slate-500 text-xs">(File takes priority)</span>}
                </label>
                <input
                  type="text"
                  placeholder="https://supplier.com/products.xml"
                  value={xmlUrl}
                  onChange={(e) => {
                    setXmlUrl(e.target.value);
                    setSnapshot(null);
                  }}
                  disabled={xmlFile}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500 text-sm ${
                    xmlFile ? 'border-slate-700 opacity-50 cursor-not-allowed' : 'border-slate-600'
                  }`}
                />
                {xmlFile && (
                  <p className="mt-2 text-xs text-slate-400">
                    ⓘ URL input is disabled because a file is selected. Clear the file to use URL.
                  </p>
                )}
              </div>

              <button
                onClick={handleCreateSnapshot}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
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
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Change Distribution</h3>
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
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Top Price Changes</h3>
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

                {/* Top Highlights - Cards (Top 6 Hot Sellers) */}
                {comparison.changes.quantityDecreased.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-orange-400 mb-2 flex items-center gap-2">
                      🔥 Top Hot Sellers
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">These products are selling the fastest. Stock is decreasing rapidly.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {comparison.changes.quantityDecreased
                        .sort((a, b) => b.change - a.change)
                        .slice(0, 6)
                        .map((p, i) => (
                        <div key={i} className="bg-slate-900/70 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs text-slate-400">SKU: {p.sku}</span>
                            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded font-semibold">
                              -{p.change}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-white mb-3 line-clamp-2">{p.name}</h4>
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-xs text-slate-500">Before</p>
                              <p className="text-lg font-bold text-slate-300">{p.oldQuantity}</p>
                            </div>
                            <div className="text-orange-400">→</div>
                            <div className="text-center">
                              <p className="text-xs text-slate-500">After</p>
                              <p className="text-lg font-bold text-orange-400">{p.quantity}</p>
                            </div>
                          </div>
                          {p.quantity < 10 && p.change > 5 && (
                            <div className="mt-2 bg-red-500/20 border border-red-500/30 rounded px-2 py-1">
                              <p className="text-xs text-red-400 font-semibold">⚠️ Low Stock!</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Data Table */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">All Changes</h3>
                    <button
                      onClick={exportToCSV}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Search by name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm"
                    />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="stock_down">Hot Sellers (Stock ↓)</option>
                      <option value="stock_up">Stock Increases</option>
                      <option value="price_up">Price Increases</option>
                      <option value="price_down">Price Decreases</option>
                      <option value="new">New Products</option>
                    </select>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-900/50 border-b border-slate-700">
                        <tr>
                          <th className="text-left p-3 text-slate-400 font-medium cursor-pointer hover:text-slate-200" onClick={() => handleSort('sku')}>
                            SKU {sortConfig.key === 'sku' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                          </th>
                          <th className="text-left p-3 text-slate-400 font-medium cursor-pointer hover:text-slate-200" onClick={() => handleSort('name')}>
                            Product {sortConfig.key === 'name' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                          </th>
                          <th className="text-left p-3 text-slate-400 font-medium">Category</th>
                          <th className="text-right p-3 text-slate-400 font-medium cursor-pointer hover:text-slate-200" onClick={() => handleSort('change')}>
                            Change {sortConfig.key === 'change' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                          </th>
                          <th className="text-right p-3 text-slate-400 font-medium">Old Value</th>
                          <th className="text-right p-3 text-slate-400 font-medium">New Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getAllChanges().map((item, i) => (
                          <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors">
                            <td className="p-3 text-slate-300 font-mono">{item.sku}</td>
                            <td className="p-3 text-slate-200">{item.name}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                item.type === 'stock_down' ? 'bg-orange-500/20 text-orange-400' :
                                item.type === 'stock_up' ? 'bg-green-500/20 text-green-400' :
                                item.type === 'price_up' ? 'bg-red-500/20 text-red-400' :
                                item.type === 'price_down' ? 'bg-green-500/20 text-green-400' :
                                'bg-purple-500/20 text-purple-400'
                              }`}>
                                {item.category}
                              </span>
                            </td>
                            <td className={`p-3 text-right font-bold ${
                              item.type === 'stock_down' || item.type === 'price_up' ? 'text-orange-400' :
                              item.type === 'stock_up' || item.type === 'price_down' ? 'text-green-400' :
                              'text-purple-400'
                            }`}>
                              {item.type === 'new' ? 'NEW' :
                               item.type.includes('price') ? `€${item.change.toFixed(2)}` :
                               item.change}
                            </td>
                            <td className="p-3 text-right text-slate-400">
                              {item.type.includes('price') ? `€${(item.oldPrice || item.price).toFixed(2)}` :
                               item.type.includes('stock') ? (item.oldQuantity || item.quantity) :
                               '-'}
                            </td>
                            <td className="p-3 text-right text-slate-200 font-medium">
                              {item.type.includes('price') ? `€${item.price.toFixed(2)}` :
                               item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm text-slate-400 mt-4">
                    Showing {getAllChanges().length} of {comparison.summary.totalChanges} changes
                  </p>
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
              <div className="flex gap-4 justify-center mt-2">
                <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Use</Link>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link to="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {cookieConsent === null && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-6 shadow-2xl z-50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-slate-200 text-sm">
                We use essential cookies to analyze website traffic and optimize your experience. Your data is processed locally and never shared with third parties. By accepting, you help us improve the tool.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleCookieConsent(false)}
                className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                Decline
              </button>
              <button
                onClick={() => handleCookieConsent(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Accept Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ProductSnapshotTracker;