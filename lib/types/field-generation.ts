import { z } from 'zod';
import type { EnrichmentField } from '.';

// Zod schema for field generation - all fields must be required for Structured Outputs
export const FieldDefinition = z.object({
  displayName: z.string().describe('Human-readable name for the field'),
  description: z.string().describe('Description of what data this field should contain'),
  type: z.enum(['string', 'number', 'boolean', 'array']).describe('The data type of the field'),
  examples: z.array(z.string()).describe('Example values for this field, empty array if none'),
});

export const FieldGenerationResponse = z.object({
  fields: z.array(FieldDefinition).describe('Array of field definitions based on user input'),
  interpretation: z.string().describe('Brief explanation of what fields were created'),
});

export type FieldDefinitionType = z.infer<typeof FieldDefinition>;
export type FieldGenerationResponseType = z.infer<typeof FieldGenerationResponse>;

export const ALL_ENRICHMENT_FIELDS: EnrichmentField[] = [
  // Company Information
  { name: 'companyName', displayName: 'Company Name', description: 'The official name of the company.', type: 'string', required: false },
  { name: 'website', displayName: 'Website', description: 'The official company website.', type: 'string', required: false },
  { name: 'industry', displayName: 'Industry', description: 'The primary industry the company operates in.', type: 'string', required: false },
  { name: 'headquarters', displayName: 'Headquarters', description: 'The physical location of the company\'s main office.', type: 'string', required: false },
  { name: 'employeeCount', displayName: 'Employee Count', description: 'The estimated number of employees.', type: 'number', required: false },
  { name: 'yearFounded', displayName: 'Year Founded', description: 'The year the company was founded.', type: 'number', required: false },
  { name: 'description', displayName: 'Description', description: 'A brief description of the company.', type: 'string', required: false },

  // Fundraising Intelligence
  { name: 'lastFundingStage', displayName: 'Last Funding Stage', description: 'The most recent funding stage (e.g., Seed, Series A).', type: 'string', required: false },
  { name: 'lastFundingAmount', displayName: 'Last Funding Amount', description: 'The amount of the last funding round.', type: 'string', required: false },
  { name: 'lastFundingDate', displayName: 'Last Funding Date', description: 'The date of the last funding round.', type: 'string', required: false },
  { name: 'totalRaised', displayName: 'Total Raised', description: 'The total amount of funding raised to date.', type: 'string', required: false },
  { name: 'valuation', displayName: 'Valuation', description: 'The company\'s estimated valuation.', type: 'string', required: false },
  { name: 'leadInvestors', displayName: 'Lead Investors', description: 'The lead investors in the last funding round.', type: 'array', required: false },
  { name: 'allInvestors', displayName: 'All Investors', description: 'A list of all known investors.', type: 'array', required: false },

  // People & Leadership
  { name: 'ceoName', displayName: 'CEO Name', description: 'The name of the current CEO.', type: 'string', required: false },
  { name: 'ceoLinkedin', displayName: 'CEO LinkedIn', description: 'The LinkedIn profile URL of the CEO.', type: 'string', required: false },
  { name: 'founders', displayName: 'Founders', description: 'The names of the company founders.', type: 'array', required: false },
  { name: 'keyExecutives', displayName: 'Key Executives', description: 'A list of key executives.', type: 'array', required: false },

  // Product & Technology
  { name: 'mainProducts', displayName: 'Main Products', description: 'The company\'s main products or services.', type: 'array', required: false },
  { name: 'targetMarket', displayName: 'Target Market', description: 'The target market (B2B, B2C, etc.).', type: 'string', required: false },
  { name: 'techStack', displayName: 'Tech Stack', description: 'The technologies used by the company.', type: 'array', required: false },
  { name: 'competitors', displayName: 'Competitors', description: 'A list of main competitors.', type: 'array', required: false },

  // Contact & Social Media
  { name: 'emails', displayName: 'Emails', description: 'Contact email addresses.', type: 'array', required: false },
  { name: 'phones', displayName: 'Phones', description: 'Contact phone numbers.', type: 'array', required: false },
  { name: 'address', displayName: 'Address', description: 'The company\'s physical address.', type: 'string', required: false },
  { name: 'linkedin', displayName: 'LinkedIn URL', description: 'The company\'s LinkedIn profile URL.', type: 'string', required: false },
  { name: 'twitter', displayName: 'Twitter URL', description: 'The company\'s Twitter profile URL.', type: 'string', required: false },
];