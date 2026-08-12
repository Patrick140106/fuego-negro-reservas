import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgtgzzpyiczpojkwyeaz.supabase.co';
const supabaseKey = 'sb_publishable_UWPNLG5XktGOINU9GxUXLQ_sFiNqPvo';

export const supabase = createClient(supabaseUrl, supabaseKey);