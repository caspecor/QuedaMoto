-- ============================================================
-- Gasolineras Canarias - Tabla de precios de gasolineras
-- Ejecutar en el editor SQL de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS gasolineras_canarias (
  id          TEXT PRIMARY KEY,            -- IDEESS del MITECO
  rotulo      TEXT NOT NULL,
  direccion   TEXT,
  municipio   TEXT,
  provincia   TEXT,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  precio_95   DOUBLE PRECISION,            -- Gasolina 95 E5
  precio_diesel DOUBLE PRECISION,          -- Gasóleo A
  precio_98   DOUBLE PRECISION,            -- Gasolina 98 E5
  horario     TEXT,
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Índice para búsquedas rápidas por precio
CREATE INDEX IF NOT EXISTS idx_gasolineras_precio_95     ON gasolineras_canarias (precio_95 ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_gasolineras_precio_diesel ON gasolineras_canarias (precio_diesel ASC NULLS LAST);

-- Tabla de control de la última sincronización
CREATE TABLE IF NOT EXISTS gasolineras_sync_log (
  id          SERIAL PRIMARY KEY,
  synced_at   TIMESTAMP DEFAULT NOW(),
  total_rows  INTEGER,
  source_date TEXT
);
