-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id),
    employee_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_status CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leave_requests_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Policy for employees to view their own requests
CREATE POLICY "Employees can view their own leave requests"
    ON leave_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM employees 
            WHERE id = employee_id 
            AND email = auth.jwt()->>'email'
        )
    );

-- Policy for employees to create their own requests
CREATE POLICY "Employees can create their own leave requests"
    ON leave_requests FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM employees 
            WHERE id = employee_id 
            AND email = auth.jwt()->>'email'
        )
    );

-- Policy for admins to view all requests
CREATE POLICY "Admins can view all leave requests"
    ON leave_requests FOR SELECT
    USING (auth.jwt()->>'email' = 'info@universitio.com');

-- Policy for admins to update request status
CREATE POLICY "Admins can update leave request status"
    ON leave_requests FOR UPDATE
    USING (auth.jwt()->>'email' = 'info@universitio.com')
    WITH CHECK (
        auth.jwt()->>'email' = 'info@universitio.com'
        AND (
            OLD.status IS DISTINCT FROM NEW.status
            AND NEW.status IN ('Approved', 'Rejected')
        )
    ); 