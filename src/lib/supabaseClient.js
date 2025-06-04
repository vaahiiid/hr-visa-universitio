import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plcovvtakxektjwpmwda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsY292dnRha3hla3Rqd3Btd2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTU2NjYsImV4cCI6MjA2MzQ5MTY2Nn0.jnNPWoP8_25zRL95y390_pgQ54HVqrn6Mv93NJIRPSM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);