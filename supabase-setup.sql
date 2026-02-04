-- E-commerce Dashboard - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable Row Level Security
-- Create sales_data table
CREATE TABLE IF NOT EXISTS sales_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_date DATE NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    region TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    sales DECIMAL(10, 2) NOT NULL,
    profit DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_views table
CREATE TABLE IF NOT EXISTS saved_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    view_name TEXT NOT NULL,
    filters JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_data
CREATE POLICY "Users can view their own sales data"
    ON sales_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales data"
    ON sales_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales data"
    ON sales_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales data"
    ON sales_data FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for saved_views
CREATE POLICY "Users can view their own saved views"
    ON saved_views FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved views"
    ON saved_views FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved views"
    ON saved_views FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved views"
    ON saved_views FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_data_user_id ON sales_data(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_data_order_date ON sales_data(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_data_category ON sales_data(category);
CREATE INDEX IF NOT EXISTS idx_sales_data_region ON sales_data(region);
CREATE INDEX IF NOT EXISTS idx_saved_views_user_id ON saved_views(user_id);

-- Optional: Create a view for aggregated statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    user_id,
    COUNT(*) as total_orders,
    SUM(sales) as total_sales,
    SUM(profit) as total_profit,
    AVG(sales) as avg_order_value,
    SUM(quantity) as total_items_sold,
    COUNT(DISTINCT product_name) as unique_products,
    COUNT(DISTINCT category) as unique_categories,
    MIN(order_date) as first_order_date,
    MAX(order_date) as last_order_date
FROM sales_data
GROUP BY user_id;

-- Grant access to authenticated users
GRANT SELECT ON user_statistics TO authenticated;
