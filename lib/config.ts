const isUnlimitedMode = process.env.FIRE_ENRICH_UNLIMITED === 'true' || 
                       process.env.NODE_ENV === 'development';

export const FIRE_ENRICH_CONFIG = {
  CSV_LIMITS: {
    MAX_ROWS: Infinity,
    MAX_COLUMNS: Infinity,
  },
  REQUEST_LIMITS: {
    MAX_FIELDS_PER_ENRICHMENT: 50,
  },
} as const; 