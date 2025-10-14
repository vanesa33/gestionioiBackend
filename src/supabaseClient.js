const { createClient } = require("@supabase/supabase-js");

// 👇 Estas variables las ponés en tu archivo .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Creamos el cliente
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

module.exports = { supabase };