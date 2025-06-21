const isUnlimitedMode = process.env.FIRE_ENRICH_UNLIMITED === 'true' || 
                       process.env.NODE_ENV === 'development';

export const FIRE_ENRICH_CONFIG = {
  CSV_LIMITS: {
    MAX_ROWS: isUnlimitedMode ? Infinity : 15,
    MAX_COLUMNS: isUnlimitedMode ? Infinity : 5,
  },
  REQUEST_LIMITS: {
    MAX_FIELDS_PER_ENRICHMENT: isUnlimitedMode ? 50 : 10,
  },
} as const; 