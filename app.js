// Supabase client
let supabase;
let currentUser = null;
let rawData = [];
let filteredData = [];
let charts = {};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
    setupDragDrop();
});

function initializeSupabase() {
    if (typeof SUPABASE_URL === 'undefined' || !SUPABASE_URL) {
        console.warn('Supabase not configured. Using demo mode.');
        showDemoMode();
        return;
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    checkAuth();
}

function showDemoMode() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userEmail').textContent = 'Demo Mode';
    loadSampleData();
}

async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        currentUser = user;
        showApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

function showApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userEmail').textContent = currentUser.email;
    loadUserViews();
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('authMessage').innerHTML = '';
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('authMessage').innerHTML = '';
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showAuthMessage('Please enter email and password', 'error');
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        showAuthMessage(error.message, 'error');
    } else {
        currentUser = data.user;
        showApp();
    }
}

async function signup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupPasswordConfirm').value;
    
    if (!email || !password || !confirmPassword) {
        showAuthMessage('Please fill all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        showAuthMessage(error.message, 'error');
    } else {
        showAuthMessage('Account created! Please check your email to verify.', 'success');
        setTimeout(showLogin, 3000);
    }
}

async function logout() {
    if (supabase) {
        await supabase.auth.signOut();
    }
    currentUser = null;
    rawData = [];
    filteredData = [];
    showAuth();
}

function showAuthMessage(message, type) {
    const messageDiv = document.getElementById('authMessage');
    messageDiv.className = type;
    messageDiv.textContent = message;
}

function setupDragDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        }, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        handleFileUpload({ target: { files: files } });
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('loading').style.display = 'block';

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            processData(results.data);
            saveDataToSupabase(results.data);
        },
        error: function(error) {
            alert('Error parsing CSV: ' + error.message);
            document.getElementById('loading').style.display = 'none';
        }
    });
}

function loadSampleData() {
    document.getElementById('loading').style.display = 'block';
    
    // Use the sample data from the workspace
    Papa.parse('ecommerce_sales_data.csv', {
        download: true,
        header: true,
        complete: function(results) {
            processData(results.data);
        },
        error: function(error) {
            // If sample file not found, create demo data
            const demoData = generateDemoData();
            processData(demoData);
        }
    });
}

function generateDemoData() {
    const products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headphones'];
    const categories = ['Electronics', 'Accessories', 'Office'];
    const regions = ['North', 'South', 'East', 'West'];
    const data = [];

    for (let i = 0; i < 100; i++) {
        const quantity = Math.floor(Math.random() * 10) + 1;
        const price = Math.floor(Math.random() * 1000) + 100;
        const sales = quantity * price;
        const profit = sales * (0.1 + Math.random() * 0.3);
        
        data.push({
            'Order Date': new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            'Product Name': products[Math.floor(Math.random() * products.length)],
            'Category': categories[Math.floor(Math.random() * categories.length)],
            'Region': regions[Math.floor(Math.random() * regions.length)],
            'Quantity': quantity,
            'Sales': sales,
            'Profit': profit
        });
    }

    return data;
}

async function saveDataToSupabase(data) {
    if (!supabase || !currentUser) return;

    try {
        const { error } = await supabase
            .from('sales_data')
            .insert(data.map(row => ({
                user_id: currentUser.id,
                order_date: row['Order Date'],
                product_name: row['Product Name'],
                category: row.Category,
                region: row.Region,
                quantity: parseInt(row.Quantity),
                sales: parseFloat(row.Sales),
                profit: parseFloat(row.Profit)
            })));

        if (error) throw error;
        console.log('Data saved to Supabase');
    } catch (error) {
        console.error('Error saving to Supabase:', error);
    }
}

async function loadUserData() {
    if (!supabase || !currentUser) {
        alert('Please log in to load saved data');
        return;
    }

    document.getElementById('loading').style.display = 'block';

    try {
        const { data, error } = await supabase
            .from('sales_data')
            .select('*')
            .eq('user_id', currentUser.id);

        if (error) throw error;

        if (data.length === 0) {
            alert('No saved data found. Please upload a CSV file.');
            document.getElementById('loading').style.display = 'none';
            return;
        }

        const formattedData = data.map(row => ({
            'Order Date': row.order_date,
            'Product Name': row.product_name,
            'Category': row.category,
            'Region': row.region,
            'Quantity': row.quantity,
            'Sales': row.sales,
            'Profit': row.profit,
            Date: new Date(row.order_date)
        }));

        processData(formattedData);
    } catch (error) {
        alert('Error loading data: ' + error.message);
        document.getElementById('loading').style.display = 'none';
    }
}

function processData(data) {
    rawData = data.filter(row => row['Order Date'] && row.Sales);
    rawData.forEach(row => {
        row.Sales = parseFloat(row.Sales);
        row.Profit = parseFloat(row.Profit);
        row.Quantity = parseInt(row.Quantity);
        if (!row.Date) {
            row.Date = new Date(row['Order Date']);
        }
    });
    
    filteredData = [...rawData];
    initializeDashboard();
}

function initializeDashboard() {
    populateFilters();
    updateDashboard();
    document.getElementById('loading').style.display = 'none';
    document.getElementById('dataDisplay').style.display = 'block';
    document.getElementById('savedViewsSection').style.display = 'block';
}

function populateFilters() {
    const categories = [...new Set(rawData.map(r => r.Category))];
    const regions = [...new Set(rawData.map(r => r.Region))];
    
    const categorySelect = document.getElementById('categoryFilter');
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    const regionSelect = document.getElementById('regionFilter');
    regionSelect.innerHTML = '<option value="all">All Regions</option>';
    regions.forEach(reg => {
        const option = document.createElement('option');
        option.value = reg;
        option.textContent = reg;
        regionSelect.appendChild(option);
    });

    const dates = rawData.map(r => r.Date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    document.getElementById('dateFrom').value = formatDateInput(minDate);
    document.getElementById('dateTo').value = formatDateInput(maxDate);
}

function formatDateInput(date) {
    return date.toISOString().slice(0, 7);
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dateFrom = new Date(document.getElementById('dateFrom').value);
    const dateTo = new Date(document.getElementById('dateTo').value);
    dateTo.setMonth(dateTo.getMonth() + 1);

    filteredData = rawData.filter(row => {
        const matchCategory = category === 'all' || row.Category === category;
        const matchRegion = region === 'all' || row.Region === region;
        const matchDate = row.Date >= dateFrom && row.Date < dateTo;
        return matchCategory && matchRegion && matchDate;
    });

    updateDashboard();
}

function resetFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('regionFilter').value = 'all';
    const dates = rawData.map(r => r.Date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    document.getElementById('dateFrom').value = formatDateInput(minDate);
    document.getElementById('dateTo').value = formatDateInput(maxDate);
    filteredData = [...rawData];
    updateDashboard();
}

function updateDashboard() {
    updateKPIs();
    updateInsights();
    updateCharts();
}

function updateKPIs() {
    const totalSales = filteredData.reduce((sum, row) => sum + row.Sales, 0);
    const totalProfit = filteredData.reduce((sum, row) => sum + row.Profit, 0);
    const totalOrders = filteredData.length;
    const avgOrderValue = totalSales / totalOrders;
    const profitMargin = (totalProfit / totalSales * 100);
    const totalQuantity = filteredData.reduce((sum, row) => sum + row.Quantity, 0);

    const kpiHTML = `
        <div class="kpi-card">
            <div class="kpi-label">Total Revenue</div>
            <div class="kpi-value">$${totalSales.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
            <div class="kpi-subvalue">${totalOrders.toLocaleString()} orders</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Total Profit</div>
            <div class="kpi-value">$${totalProfit.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
            <div class="kpi-subvalue">${profitMargin.toFixed(1)}% margin</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Avg Order Value</div>
            <div class="kpi-value">$${avgOrderValue.toFixed(0)}</div>
            <div class="kpi-subvalue">${totalQuantity.toLocaleString()} items sold</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Unique Products</div>
            <div class="kpi-value">${new Set(filteredData.map(r => r['Product Name'])).size}</div>
            <div class="kpi-subvalue">${new Set(filteredData.map(r => r.Category)).size} categories</div>
        </div>
    `;
    document.getElementById('kpiGrid').innerHTML = kpiHTML;
}

function updateInsights() {
    const topProduct = getTopByMetric('Product Name', 'Sales');
    const topCategory = getTopByMetric('Category', 'Profit');
    const topRegion = getTopByMetric('Region', 'Sales');
    
    const profitMargins = {};
    filteredData.forEach(row => {
        const product = row['Product Name'];
        if (!profitMargins[product]) profitMargins[product] = { profit: 0, sales: 0 };
        profitMargins[product].profit += row.Profit;
        profitMargins[product].sales += row.Sales;
    });
    
    let bestMargin = { product: '', margin: 0 };
    Object.keys(profitMargins).forEach(product => {
        const margin = (profitMargins[product].profit / profitMargins[product].sales * 100);
        if (margin > bestMargin.margin) {
            bestMargin = { product, margin };
        }
    });

    const insightsHTML = `
        <h2>🔍 Key Insights</h2>
        <div class="insight-item">
            <strong>Best Seller:</strong> ${topProduct.name} generated $${topProduct.value.toLocaleString()} in revenue
        </div>
        <div class="insight-item">
            <strong>Most Profitable Category:</strong> ${topCategory.name} with $${topCategory.value.toLocaleString()} profit
        </div>
        <div class="insight-item">
            <strong>Top Region:</strong> ${topRegion.name} leads with $${topRegion.value.toLocaleString()} in sales
        </div>
        <div class="insight-item">
            <strong>Best Margin Product:</strong> ${bestMargin.product} at ${bestMargin.margin.toFixed(1)}% profit margin
        </div>
    `;
    document.getElementById('insights').innerHTML = insightsHTML;
}

function getTopByMetric(field, metric) {
    const aggregated = {};
    filteredData.forEach(row => {
        const key = row[field];
        if (!aggregated[key]) aggregated[key] = 0;
        aggregated[key] += row[metric];
    });
    
    const sorted = Object.entries(aggregated).sort((a, b) => b[1] - a[1]);
    return { name: sorted[0][0], value: sorted[0][1] };
}

function updateCharts() {
    createTrendChart();
    createProductsChart();
    createCategoryChart();
    createRegionChart();
    createMarginChart();
    createQuantityChart();
    createHeatmapChart();
}

function createTrendChart() {
    const monthlyData = {};
    filteredData.forEach(row => {
        const month = row.Date.toISOString().slice(0, 7);
        if (!monthlyData[month]) monthlyData[month] = { sales: 0, profit: 0 };
        monthlyData[month].sales += row.Sales;
        monthlyData[month].profit += row.Profit;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const sales = sortedMonths.map(m => monthlyData[m].sales);
    const profit = sortedMonths.map(m => monthlyData[m].profit);

    destroyChart('trendChart');
    charts.trendChart = new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            labels: sortedMonths,
            datasets: [{
                label: 'Sales',
                data: sales,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Profit',
                data: profit,
                borderColor: '#f093fb',
                backgroundColor: 'rgba(240, 147, 251, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createProductsChart() {
    const productSales = {};
    filteredData.forEach(row => {
        const product = row['Product Name'];
        if (!productSales[product]) productSales[product] = 0;
        productSales[product] += row.Sales;
    });

    const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 10);

    destroyChart('productsChart');
    charts.productsChart = new Chart(document.getElementById('productsChart'), {
        type: 'bar',
        data: {
            labels: sorted.map(s => s[0]),
            datasets: [{
                label: 'Sales ($)',
                data: sorted.map(s => s[1]),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: '#667eea',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function createCategoryChart() {
    const categoryData = {};
    filteredData.forEach(row => {
        const cat = row.Category;
        if (!categoryData[cat]) categoryData[cat] = { sales: 0, profit: 0 };
        categoryData[cat].sales += row.Sales;
        categoryData[cat].profit += row.Profit;
    });

    const labels = Object.keys(categoryData);
    const sales = labels.map(l => categoryData[l].sales);
    const profit = labels.map(l => categoryData[l].profit);

    destroyChart('categoryChart');
    charts.categoryChart = new Chart(document.getElementById('categoryChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales',
                data: sales,
                backgroundColor: 'rgba(102, 126, 234, 0.8)'
            }, {
                label: 'Profit',
                data: profit,
                backgroundColor: 'rgba(118, 75, 162, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createRegionChart() {
    const regionSales = {};
    filteredData.forEach(row => {
        const region = row.Region;
        if (!regionSales[region]) regionSales[region] = 0;
        regionSales[region] += row.Sales;
    });

    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
    
    destroyChart('regionChart');
    charts.regionChart = new Chart(document.getElementById('regionChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(regionSales),
            datasets: [{
                data: Object.values(regionSales),
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function createMarginChart() {
    const productMargins = {};
    filteredData.forEach(row => {
        const product = row['Product Name'];
        if (!productMargins[product]) productMargins[product] = { profit: 0, sales: 0 };
        productMargins[product].profit += row.Profit;
        productMargins[product].sales += row.Sales;
    });

    const margins = Object.entries(productMargins).map(([product, data]) => ({
        product,
        margin: (data.profit / data.sales * 100)
    })).sort((a, b) => b.margin - a.margin).slice(0, 10);

    destroyChart('marginChart');
    charts.marginChart = new Chart(document.getElementById('marginChart'), {
        type: 'bar',
        data: {
            labels: margins.map(m => m.product),
            datasets: [{
                label: 'Profit Margin (%)',
                data: margins.map(m => m.margin),
                backgroundColor: 'rgba(240, 147, 251, 0.8)',
                borderColor: '#f093fb',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function createQuantityChart() {
    const quantityBuckets = { '1-2': 0, '3-4': 0, '5-6': 0, '7-8': 0, '9+': 0 };
    filteredData.forEach(row => {
        const q = row.Quantity;
        if (q <= 2) quantityBuckets['1-2'] += row.Sales;
        else if (q <= 4) quantityBuckets['3-4'] += row.Sales;
        else if (q <= 6) quantityBuckets['5-6'] += row.Sales;
        else if (q <= 8) quantityBuckets['7-8'] += row.Sales;
        else quantityBuckets['9+'] += row.Sales;
    });

    destroyChart('quantityChart');
    charts.quantityChart = new Chart(document.getElementById('quantityChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(quantityBuckets),
            datasets: [{
                data: Object.values(quantityBuckets),
                backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function createHeatmapChart() {
    const monthlyByCategory = {};
    filteredData.forEach(row => {
        const month = row.Date.toISOString().slice(0, 7);
        const category = row.Category;
        if (!monthlyByCategory[category]) monthlyByCategory[category] = {};
        if (!monthlyByCategory[category][month]) monthlyByCategory[category][month] = 0;
        monthlyByCategory[category][month] += row.Sales;
    });

    const categories = Object.keys(monthlyByCategory);
    const months = [...new Set(filteredData.map(r => r.Date.toISOString().slice(0, 7)))].sort();
    
    const datasets = categories.map((cat, idx) => {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
        return {
            label: cat,
            data: months.map(m => monthlyByCategory[cat][m] || 0),
            backgroundColor: colors[idx % colors.length],
            borderWidth: 2,
            borderColor: 'white'
        };
    });

    destroyChart('heatmapChart');
    charts.heatmapChart = new Chart(document.getElementById('heatmapChart'), {
        type: 'bar',
        data: {
            labels: months,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function destroyChart(chartId) {
    if (charts[chartId]) {
        charts[chartId].destroy();
    }
}

// Saved Views Functions
async function saveCurrentView() {
    const viewName = document.getElementById('viewName').value;
    if (!viewName) {
        alert('Please enter a view name');
        return;
    }

    const view = {
        name: viewName,
        category: document.getElementById('categoryFilter').value,
        region: document.getElementById('regionFilter').value,
        dateFrom: document.getElementById('dateFrom').value,
        dateTo: document.getElementById('dateTo').value
    };

    if (supabase && currentUser) {
        try {
            const { error } = await supabase
                .from('saved_views')
                .insert({
                    user_id: currentUser.id,
                    view_name: view.name,
                    filters: view
                });

            if (error) throw error;
            alert('View saved successfully!');
            document.getElementById('viewName').value = '';
            loadUserViews();
        } catch (error) {
            alert('Error saving view: ' + error.message);
        }
    } else {
        // Save to localStorage if not using Supabase
        const views = JSON.parse(localStorage.getItem('savedViews') || '[]');
        views.push(view);
        localStorage.setItem('savedViews', JSON.stringify(views));
        alert('View saved locally!');
        document.getElementById('viewName').value = '';
        loadUserViews();
    }
}

async function loadUserViews() {
    let views = [];

    if (supabase && currentUser) {
        try {
            const { data, error } = await supabase
                .from('saved_views')
                .select('*')
                .eq('user_id', currentUser.id);

            if (error) throw error;
            views = data.map(v => ({
                id: v.id,
                ...v.filters
            }));
        } catch (error) {
            console.error('Error loading views:', error);
        }
    } else {
        views = JSON.parse(localStorage.getItem('savedViews') || '[]');
    }

    displayViews(views);
}

function displayViews(views) {
    const viewsList = document.getElementById('viewsList');
    
    if (views.length === 0) {
        viewsList.innerHTML = '<p style="color: #666;">No saved views yet</p>';
        return;
    }

    viewsList.innerHTML = views.map((view, idx) => `
        <div class="view-item">
            <div>
                <div class="view-name">${view.name}</div>
                <div style="font-size: 0.85em; color: #666;">
                    ${view.category !== 'all' ? view.category : 'All Categories'} | 
                    ${view.region !== 'all' ? view.region : 'All Regions'} | 
                    ${view.dateFrom} to ${view.dateTo}
                </div>
            </div>
            <div class="view-actions">
                <button onclick='loadView(${JSON.stringify(view)})'>Load</button>
                <button onclick='deleteView(${view.id || idx})' class="danger">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadView(view) {
    document.getElementById('categoryFilter').value = view.category;
    document.getElementById('regionFilter').value = view.region;
    document.getElementById('dateFrom').value = view.dateFrom;
    document.getElementById('dateTo').value = view.dateTo;
    applyFilters();
}

async function deleteView(id) {
    if (!confirm('Delete this view?')) return;

    if (supabase && currentUser) {
        try {
            const { error } = await supabase
                .from('saved_views')
                .delete()
                .eq('id', id);

            if (error) throw error;
            loadUserViews();
        } catch (error) {
            alert('Error deleting view: ' + error.message);
        }
    } else {
        const views = JSON.parse(localStorage.getItem('savedViews') || '[]');
        views.splice(id, 1);
        localStorage.setItem('savedViews', JSON.stringify(views));
        loadUserViews();
    }
}
