# 📊 E-commerce Analytics Dashboard

A powerful, interactive web application for analyzing e-commerce sales data with beautiful visualizations, user authentication, and cloud storage powered by Supabase.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 📈 Analytics & Visualizations
- **7 Interactive Charts**: Line, bar, doughnut, pie, and stacked bar charts
- **Real-time KPIs**: Revenue, profit, average order value, and more
- **Smart Insights**: Automatically identifies top products, categories, and regions
- **Advanced Filtering**: Filter by category, region, and date range
- **Trend Analysis**: Track sales and profit trends over time
- **Profit Margin Analysis**: Identify most profitable products

### 🔐 User Management
- **Secure Authentication**: Email/password authentication via Supabase
- **User Isolation**: Each user's data is completely separate
- **Session Management**: Persistent login sessions

### 💾 Data Management
- **CSV Upload**: Drag-and-drop or click to upload CSV files
- **Cloud Storage**: All data saved to Supabase (optional)
- **Saved Views**: Save and load custom filter configurations
- **Sample Data**: Built-in demo data for testing

### 🎨 User Experience
- **Beautiful UI**: Modern gradient design with smooth animations
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Fast Performance**: Client-side processing for instant updates
- **No Backend Required**: Can run as static site with optional Supabase integration

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup Required)

1. Open `index.html` in your browser
2. Click "Load Sample Data"
3. Start exploring!

### Option 2: GitHub Pages Deployment

1. **Fork or clone this repository**

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages
   - Select branch: `main` (or `master`)
   - Select folder: `/ (root)`
   - Click Save

3. **Access your dashboard:**
   - Your site will be available at: `https://yourusername.github.io/ecommerce-dashboard/`

### Option 3: Full Setup with Supabase

#### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Choose organization and fill in project details
5. Wait for project to be ready (~2 minutes)

#### Step 2: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-setup.sql`
4. Paste and click "Run"
5. Verify tables were created in **Table Editor**

#### Step 3: Get API Credentials

1. Go to **Project Settings** > **API**
2. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy your **anon/public key**

#### Step 4: Configure the App

1. Open `config.js`
2. Replace the empty strings with your credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

3. Save the file

#### Step 5: Deploy

**Via GitHub Pages:**
- Push your changes to GitHub
- GitHub Pages will automatically update

**Via Local Server:**
```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server)
npx http-server

# Then open: http://localhost:8000
```

## 📁 CSV File Format

Your CSV file should have these columns:

```csv
Order Date,Product Name,Category,Region,Quantity,Sales,Profit
2024-01-15,Laptop,Electronics,North,2,2500,500
2024-01-16,Mouse,Accessories,South,5,100,25
```

**Required Columns:**
- `Order Date` - Format: YYYY-MM-DD
- `Product Name` - Product identifier
- `Category` - Product category
- `Region` - Geographic region
- `Quantity` - Number of units sold (integer)
- `Sales` - Total sales amount (decimal)
- `Profit` - Profit amount (decimal)

## 🎯 Usage Guide

### First Time Setup

1. **Create an account** or use demo mode
2. **Upload your CSV data** or load sample data
3. **Explore the dashboard** - all charts update automatically

### Filtering Data

1. Select filters from the dropdowns
2. Choose date range
3. Click "Apply Filters"
4. Save your filter configuration for later use

### Saving Views

1. Apply your desired filters
2. Enter a name in the "View name" field
3. Click "Save Current Filters"
4. Load saved views anytime with one click

### Uploading New Data

- Click the upload area or drag a CSV file
- Data is automatically parsed and analyzed
- If logged in, data is saved to your Supabase account

## 🏗️ Architecture

```
ecommerce-dashboard/
├── index.html          # Main HTML structure
├── app.js              # Application logic & charts
├── config.js           # Supabase configuration
├── supabase-setup.sql  # Database schema
├── README.md           # This file
└── ecommerce_sales_data.csv  # Sample data (optional)
```

### Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js 4.4.0
- **CSV Parsing**: PapaParse 5.4.1
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: GitHub Pages (static)

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Secure authentication via Supabase Auth
- No sensitive credentials in frontend code
- HTTPS enforced via GitHub Pages

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📊 Sample Data

Included sample dataset contains:
- 3,500+ orders
- 3 years of data (2022-2024)
- Multiple product categories
- 4 geographic regions
- Real-world sales patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💡 Tips & Tricks

1. **Performance**: For large datasets (>10,000 rows), consider filtering by date first
2. **Mobile**: Rotate device to landscape for best chart viewing
3. **Export**: Take screenshots of charts for presentations
4. **Privacy**: Demo mode keeps all data in your browser (no cloud storage)

## 🐛 Troubleshooting

**Charts not displaying?**
- Check browser console for errors
- Ensure CSV format matches requirements
- Try loading sample data first

**Can't log in?**
- Verify Supabase credentials in `config.js`
- Check Supabase project is active
- Ensure database tables are created

**Data not saving?**
- Confirm you're logged in
- Check Supabase dashboard for errors
- Verify RLS policies are enabled

## 📧 Support

For issues or questions:
1. Check this README thoroughly
2. Review Supabase documentation
3. Open an issue on GitHub

## 🎉 Acknowledgments

Built with ❤️ using:
- [Chart.js](https://www.chartjs.org/)
- [PapaParse](https://www.papaparse.com/)
- [Supabase](https://supabase.com/)

---

**Enjoy analyzing your data! 📈**
