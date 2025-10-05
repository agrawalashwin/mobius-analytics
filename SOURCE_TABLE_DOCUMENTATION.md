# Source Table Documentation: jobs_data_ai_cumulative_all

**Table**: `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`  
**Type**: TABLE (Native BigQuery Table)  
**Location**: us-west1  
**Last Updated**: October 3, 2025 23:59:52  
**Update Frequency**: Every 2 days

---

## 📊 Table Overview

This is the **primary source table** containing all job listings data. It serves as the foundation for all downstream analytics, reporting views, and data products.

### Key Statistics

| Metric | Value |
|--------|-------|
| **Total Rows** | 6,564,848 |
| **Total Size** | 30.08 GB (logical) / 38.14 GB (physical) |
| **Date Range** | April 23, 2025 - October 3, 2025 |
| **Unique Companies** | 451,247 |
| **Unique Job IDs** | 5,414,557 (data_job_id) |
| **Unique Jobs** | 3,229,962 (unique_job_id) |
| **Job Boards** | 4 (LinkedIn, Indeed, WTTJ, FranceTravail) |
| **Total Columns** | 71 |

### Data Freshness
- **Earliest Record**: April 23, 2025 00:00:01
- **Latest Record**: October 3, 2025 23:59:52
- **Update Schedule**: Automated refresh every 2 days
- **Time Travel**: 168 hours (7 days) enabled

---

## 🗂️ Schema Structure

The table contains **71 columns** organized into the following categories:

### 1. Core Identifiers (4 columns)
- `unique_job_id` - Unique identifier for each job posting
- `data_job_id` - Original job ID from the source platform
- `id` - Internal sequential ID
- `url` - Job posting URL

### 2. Timestamps (2 columns)
- `created_at` - When the record was created in our system
- `data_posted` - When the job was originally posted on the platform

### 3. Company Information (3 columns)
- `data_company` - Company name
- `data_company_url` - Company profile URL
- `industry` - Industry classification (TECH, HLTH, FIN, etc.)

### 4. Job Details (8 columns)
- `data_job_title` - Job title
- `data_job_description` - Full job description text
- `data_job_board` - Source platform (linkedin, indeed, wttj, francetravail)
- `data_seniority_level` - Seniority level
- `job_family` - Job category/family
- `data_job_time_type` - Employment time type
- `data_cta` - Call-to-action text
- `data_external_application_link` - External application URL

### 5. Location Information (3 columns)
- `data_location_city` - City
- `data_location_state` - State/Province
- `data_location_country` - Country

### 6. Compensation (6 columns)
- `data_pay_range_min` - Minimum salary/pay
- `data_pay_range_max` - Maximum salary/pay
- `data_pay_range_unit` - Pay unit (YEARLY, HOURLY, MONTHLY, etc.)
- `data_regex_pay_range` - Regex-extracted pay range
- `data_regex_range_min` - Regex-extracted minimum
- `data_regex_range_max` - Regex-extracted maximum
- `max_salary` - Normalized maximum salary

### 7. Application Metrics (2 columns)
- `data_num_applicants` - Number of applicants
- `data_url` - Application URL

### 8. Work Model Flags (4 columns)
- `is_remote` - Remote work flag
- `is_hybrid` - Hybrid work flag
- `is_onsite` - Onsite work flag
- `is_remote_friendly` - Remote-friendly flag

### 9. Employment Type Flags (4 columns)
- `is_full_time` - Full-time position
- `is_part_time` - Part-time position
- `is_contract` - Contract position
- `is_internship` - Internship position

### 10. Seniority Level Flags (5 columns)
- `is_entry_level` - Entry level position
- `is_senior_level` - Senior level position
- `is_director_level` - Director level position
- `is_executive` - Executive level position
- `is_managerial` - Managerial position

### 11. Job Function Flags (9 columns)
- `is_engineering` - Engineering role
- `is_data_related` - Data-related role
- `is_technical` - Technical role
- `is_non_technical` - Non-technical role
- `is_sales` - Sales role
- `is_marketing` - Marketing role
- `is_product` - Product role
- `is_operations` - Operations role
- `is_hr_related` - HR-related role
- `is_support` - Support role
- `is_program_management` - Program management role

### 12. Company Type Flags (5 columns)
- `is_big_tech` - Big tech company
- `is_startup` - Startup company
- `is_enterprise` - Enterprise company
- `is_consulting_firm` - Consulting firm
- `is_agency` - Agency/staffing firm

### 13. Location Flags (5 columns)
- `is_us_based` - US-based position
- `is_international` - International position
- `is_nyc_area` - NYC area position
- `is_sf_bay_area` - SF Bay Area position
- `is_chicago_area` - Chicago area position

### 14. Compensation Flags (3 columns)
- `is_comp_disclosed` - Compensation disclosed
- `is_mid_salary` - Mid-range salary
- `is_high_salary` - High salary

### 15. Other Flags (2 columns)
- `is_visa_friendly` - Visa sponsorship available
- `is_relocation_offered` - Relocation assistance offered

### 16. Pipeline Metadata (3 columns)
- `pipeline` - Pipeline identifier
- `run` - Run identifier
- `seed` - Seed value for processing

---

## 📈 Data Distribution

### Job Boards
| Platform | Count | Percentage |
|----------|-------|------------|
| LinkedIn | 4,767,937 | 72.6% |
| Indeed | 1,796,240 | 27.4% |
| WTTJ | 558 | <0.1% |
| FranceTravail | 113 | <0.1% |

### Geographic Distribution
| Country | Count | Percentage |
|---------|-------|------------|
| United States | 5,372,635 | 81.8% |
| Canada | 1,192,213 | 18.2% |

### Industry Distribution (Top 10)
| Industry | Count | Description |
|----------|-------|-------------|
| TECH | 2,253,973 | Technology |
| HLTH | 1,780,906 | Healthcare |
| REAL | 978,313 | Real Estate |
| CONS | 495,001 | Consumer Goods |
| FIN | 430,234 | Finance |
| IND | 273,174 | Industrial |
| RETAIL | 78,289 | Retail |
| ENER | 63,868 | Energy |
| COMM | 48,724 | Communications |
| UTIL | 28,166 | Utilities |

### Job Family Distribution (Top 10)
| Job Family | Count | Percentage |
|------------|-------|------------|
| Other / Specialized | 3,943,817 | 60.1% |
| Engineering & IT | 1,067,576 | 16.3% |
| Sales & Business Development | 479,601 | 7.3% |
| Finance & Accounting | 308,307 | 4.7% |
| Operations & Supply Chain | 255,867 | 3.9% |
| HR & Recruiting | 232,642 | 3.5% |
| Marketing & Communications | 163,532 | 2.5% |
| Product & Design | 83,424 | 1.3% |
| Customer Support (various) | ~25,000 | 0.4% |

### Seniority Level Distribution
| Seniority Level | Count | Percentage |
|-----------------|-------|------------|
| Entry level | 1,885,453 | 40.0% |
| Mid-Senior level | 1,697,732 | 36.0% |
| Not Applicable | 516,585 | 11.0% |
| Associate | 260,923 | 5.5% |
| Director | 210,306 | 4.5% |
| Internship | 101,503 | 2.2% |
| Executive | 95,435 | 2.0% |

### Work Model Distribution
| Work Model | Count | Percentage |
|------------|-------|------------|
| Onsite | 5,103,705 | 77.7% |
| Remote | 957,776 | 14.6% |
| Hybrid | 667,201 | 10.2% |

### Employment Type Distribution
| Type | Count | Percentage |
|------|-------|------------|
| Full-time | 3,215,434 | 49.0% |
| Part-time | 446,544 | 6.8% |
| Contract | 313,873 | 4.8% |

### Company Type Distribution
| Type | Count | Percentage |
|------|-------|------------|
| Enterprise | 1,612,027 | 24.6% |
| Consulting Firm | 399,547 | 6.1% |
| Agency | 266,032 | 4.1% |
| Big Tech | 184,916 | 2.8% |
| Startup | 140,554 | 2.1% |

### Compensation Data
| Metric | Value |
|--------|-------|
| Jobs with Salary Data | 995,022 (15.2%) |
| Minimum Salary | $0 |
| Maximum Salary | $3,000,000 |
| Average Min Salary | $53,697 |
| Average Max Salary | $76,759 |

### Pay Range Units
| Unit | Count | Percentage |
|------|-------|------------|
| (Empty/NULL) | 4,925,636 | 75.0% |
| YEARLY | 557,183 | 8.5% |
| HOURLY | 408,761 | 6.2% |
| MONTHLY | 19,891 | 0.3% |
| WEEKLY | 5,818 | 0.1% |
| DAILY | 3,254 | <0.1% |
| NONE | 115 | <0.1% |

---

## 🏢 Top Employers (Top 20)

| Rank | Company | Job Count |
|------|---------|-----------|
| 1 | Lensa | 268,969 |
| 2 | TieTalent | 120,472 |
| 3 | Jobot | 33,187 |
| 4 | RemoteWorker US | 24,630 |
| 5 | Google | 20,581 |
| 6 | CommonSpirit Health | 17,222 |
| 7 | Amazon | 16,461 |
| 8 | PwC | 15,864 |
| 9 | Jobs via Dice | 15,828 |
| 10 | Trinity Health | 15,790 |
| 11 | Amazon.com Services LLC | 14,736 |
| 12 | Walmart | 14,410 |
| 13 | PracticeLink | 13,050 |
| 14 | U.S. Department of Veterans Affairs | 12,775 |
| 15 | Kaiser Permanente | 12,645 |
| 16 | Capital One | 12,344 |
| 17 | Deloitte | 12,252 |
| 18 | Outlier | 12,175 |
| 19 | Intuit | 12,045 |
| 20 | Ascension | 11,992 |

**Note**: Lensa and TieTalent are job aggregators, not direct employers.

---

## 🔍 Data Quality Notes

### Completeness
| Field | Coverage |
|-------|----------|
| Job Description | 100% (6,564,848) |
| Company URL | 100% (6,564,848) |
| External Application Link | 78.0% (5,116,805) |
| Applicant Count | 72.6% (4,767,937) |
| Salary Information | 15.2% (995,022) |
| Seniority Level | 71.8% (4,767,937) |

### Data Quality Observations
1. **High Coverage**: Job descriptions and company URLs are present for all records
2. **Salary Data**: Only 15.2% of jobs have salary information disclosed
3. **Applicant Counts**: Available primarily for LinkedIn jobs (72.6%)
4. **Seniority Levels**: Well-populated for most records
5. **Boolean Flags**: Comprehensive enrichment with 40+ derived flags

---

## 🔄 Data Pipeline

### Source Systems
1. **LinkedIn** - Primary source (72.6% of data)
2. **Indeed** - Secondary source (27.4% of data)
3. **WTTJ** (Welcome to the Jungle) - Minimal coverage
4. **FranceTravail** - Minimal coverage

### Processing Steps
1. **Extraction**: Jobs scraped from source platforms
2. **Transformation**: Data cleaning, normalization, enrichment
3. **Enrichment**: 40+ boolean flags derived from job content
4. **Loading**: Cumulative table updated every 2 days
5. **Deduplication**: Handled via unique_job_id

### Update Schedule
- **Frequency**: Every 2 days
- **Last Update**: October 3, 2025 23:59:52
- **Next Expected**: October 5, 2025

---

## 📝 Usage Notes

### Primary Use Cases
1. **Job Market Analysis**: Trend analysis, market intelligence
2. **Salary Benchmarking**: Compensation analysis by role, location, company
3. **Talent Intelligence**: Understanding hiring patterns and demand
4. **Competitive Analysis**: Company hiring velocity and patterns
5. **Geographic Analysis**: Location-based job market insights

### Recommended Queries
See [DATA_DICTIONARY.md](DATA_DICTIONARY.md) for detailed field descriptions and example queries.

### Performance Considerations
- **Table Size**: 30+ GB - use appropriate filters
- **Partitioning**: Not currently partitioned - consider filtering by created_at or data_posted
- **Clustering**: Not currently clustered - full table scans can be expensive
- **Best Practice**: Always filter by date range, company, or location to reduce scan size

---

## 🔗 Related Assets

### Downstream Views
- `analytic_website_analytics.*` - Cleaned and analytics-ready views
- `analytic_website_reporting.*` - Pre-aggregated reporting views
- `mobius_jobs_analytics.*` - Specialized AI/ML job analytics

### Documentation
- [DATA_DICTIONARY.md](DATA_DICTIONARY.md) - Complete field-level documentation
- [BQ_EXPLORATION_SUMMARY.md](BQ_EXPLORATION_SUMMARY.md) - Overall BigQuery exploration
- [README.md](README.md) - Project overview and usage guide

---

**Document Version**: 1.0  
**Last Updated**: October 4, 2025  
**Maintained By**: Data Engineering Team (ashwin@mobiusengine.ai)

