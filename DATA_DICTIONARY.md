# Data Dictionary: jobs_data_ai_cumulative_all

**Table**: `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`  
**Total Columns**: 71  
**Last Updated**: October 4, 2025

---

## Column Reference

### 🔑 Identifiers & Keys

#### `unique_job_id`
- **Type**: STRING
- **Description**: Unique identifier for each job posting across all sources
- **Format**: Alphanumeric (e.g., "JOB_016648", "JOB_D5KFEI")
- **Nullable**: No
- **Primary Key**: Yes
- **Example**: `JOB_016648`, `JOB_ILGXGW`
- **Usage**: Use for deduplication and joining with other tables

#### `data_job_id`
- **Type**: STRING
- **Description**: Original job ID from the source platform (LinkedIn, Indeed, etc.)
- **Nullable**: Yes
- **Unique Values**: 5,414,557
- **Example**: `3663974c993cc39c`, `4300761932`
- **Note**: Not unique across platforms; same job may have different IDs on different boards

#### `id`
- **Type**: INTEGER
- **Description**: Internal sequential identifier
- **Nullable**: Yes
- **Usage**: Internal system reference

#### `url`
- **Type**: STRING
- **Description**: Direct URL to the job posting
- **Nullable**: Yes
- **Example**: `https://www.linkedin.com/jobs/view/...`

---

### ⏰ Timestamps

#### `created_at`
- **Type**: TIMESTAMP
- **Description**: When the record was created/ingested into our system
- **Nullable**: No
- **Range**: 2025-04-23 00:00:01 to 2025-10-03 23:59:52
- **Timezone**: UTC
- **Usage**: Track data freshness, filter by ingestion date

#### `data_posted`
- **Type**: TIMESTAMP
- **Description**: When the job was originally posted on the source platform
- **Nullable**: Yes
- **Timezone**: UTC
- **Usage**: Analyze posting trends, filter by actual job posting date
- **Note**: May differ from created_at if job was posted before ingestion

---

### 🏢 Company Information

#### `data_company`
- **Type**: STRING
- **Description**: Company name as listed on the job board
- **Nullable**: Yes
- **Unique Values**: 451,247 companies
- **Examples**: `Google`, `Amazon`, `Microsoft`, `Meta`, `Lensa`
- **Note**: May include job aggregators (Lensa, TieTalent) as well as direct employers

#### `data_company_url`
- **Type**: STRING
- **Description**: URL to the company's profile page on the job board
- **Nullable**: Yes
- **Coverage**: 100%
- **Example**: `https://www.linkedin.com/company/google`

#### `industry`
- **Type**: STRING
- **Description**: Industry classification code
- **Nullable**: Yes
- **Values**: 
  - `TECH` - Technology (2,253,973 jobs)
  - `HLTH` - Healthcare (1,780,906 jobs)
  - `REAL` - Real Estate (978,313 jobs)
  - `CONS` - Consumer Goods (495,001 jobs)
  - `FIN` - Finance (430,234 jobs)
  - `IND` - Industrial (273,174 jobs)
  - `RETAIL` - Retail (78,289 jobs)
  - `ENER` - Energy (63,868 jobs)
  - `COMM` - Communications (48,724 jobs)
  - `UTIL` - Utilities (28,166 jobs)
  - `OTHER` - Other (18,647 jobs)
  - `ENTERTAINMENT` - Entertainment (14,453 jobs)
  - `CONSERV` - Conservation (12,122 jobs)
  - `CONSTR` - Construction (10,227 jobs)
  - `HEALTH` - Health (8,503 jobs)

---

### 💼 Job Details

#### `data_job_title`
- **Type**: STRING
- **Description**: Job title as posted
- **Nullable**: Yes
- **Examples**: 
  - `Senior Data Scientist, AI Product Performance`
  - `Software Engineer III, Core`
  - `Tax Manager, Tax Controversy`

#### `data_job_description`
- **Type**: STRING
- **Description**: Full text of the job description
- **Nullable**: Yes
- **Coverage**: 100%
- **Length**: Variable (typically 500-5000 characters)
- **Usage**: Text analysis, skills extraction, keyword search

#### `data_job_board`
- **Type**: STRING
- **Description**: Source job board/platform
- **Nullable**: Yes
- **Values**:
  - `linkedin` - 4,767,937 jobs (72.6%)
  - `indeed` - 1,796,240 jobs (27.4%)
  - `wttj` - 558 jobs (<0.1%)
  - `francetravail` - 113 jobs (<0.1%)

#### `data_seniority_level`
- **Type**: STRING
- **Description**: Seniority level as classified by the job board
- **Nullable**: Yes
- **Coverage**: 71.8%
- **Values**:
  - `Entry level` - 1,885,453 jobs
  - `Mid-Senior level` - 1,697,732 jobs
  - `Not Applicable` - 516,585 jobs
  - `Associate` - 260,923 jobs
  - `Director` - 210,306 jobs
  - `Internship` - 101,503 jobs
  - `Executive` - 95,435 jobs
  - Experience-based (rare): `LESS_THAN_6_MONTHS`, `1_TO_2_YEARS`, etc.

#### `job_family`
- **Type**: STRING
- **Description**: Categorized job function/family
- **Nullable**: Yes
- **Top Values**:
  - `Other / Specialized` - 3,943,817 jobs (60.1%)
  - `Engineering & IT` - 1,067,576 jobs (16.3%)
  - `Sales & Business Development` - 479,601 jobs (7.3%)
  - `Finance & Accounting` - 308,307 jobs (4.7%)
  - `Operations & Supply Chain` - 255,867 jobs (3.9%)
  - `HR & Recruiting` - 232,642 jobs (3.5%)
  - `Marketing & Communications` - 163,532 jobs (2.5%)
  - `Product & Design` - 83,424 jobs (1.3%)
  - `Customer Support` (various) - ~25,000 jobs (0.4%)
  - `Research, Applied, & Data Sciences` - Present but not in top 20

#### `data_job_time_type`
- **Type**: STRING
- **Description**: Employment time type (full-time, part-time, etc.)
- **Nullable**: Yes
- **Values**: Various employment type descriptions

#### `data_cta`
- **Type**: STRING
- **Description**: Call-to-action text (e.g., "Apply Now", "Easy Apply")
- **Nullable**: Yes

#### `data_external_application_link`
- **Type**: STRING
- **Description**: External URL for job application
- **Nullable**: Yes
- **Coverage**: 78.0% (5,116,805 jobs)

#### `data_url`
- **Type**: STRING
- **Description**: Alternative URL field for job posting
- **Nullable**: Yes

---

### 📍 Location Information

#### `data_location_city`
- **Type**: STRING
- **Description**: City where the job is located
- **Nullable**: Yes
- **Examples**: `San Francisco`, `New York City`, `Seattle`, `Toronto`, `Vancouver`

#### `data_location_state`
- **Type**: STRING
- **Description**: State or province where the job is located
- **Nullable**: Yes
- **Examples**: `California`, `New York`, `Washington`, `Ontario`, `British Columbia`

#### `data_location_country`
- **Type**: STRING
- **Description**: Country where the job is located
- **Nullable**: Yes
- **Values**:
  - `United States` - 5,372,635 jobs (81.8%)
  - `Canada` - 1,192,213 jobs (18.2%)

---

### 💰 Compensation

#### `data_pay_range_min`
- **Type**: FLOAT
- **Description**: Minimum salary/pay in the range
- **Nullable**: Yes
- **Coverage**: 15.2% (995,022 jobs)
- **Range**: $0 - $3,000,000
- **Average**: $53,697
- **Unit**: See `data_pay_range_unit`

#### `data_pay_range_max`
- **Type**: FLOAT
- **Description**: Maximum salary/pay in the range
- **Nullable**: Yes
- **Coverage**: 15.2% (995,022 jobs)
- **Range**: $0 - $3,000,000
- **Average**: $76,759
- **Unit**: See `data_pay_range_unit`

#### `data_pay_range_unit`
- **Type**: STRING
- **Description**: Unit of compensation (yearly, hourly, etc.)
- **Nullable**: Yes
- **Values**:
  - `YEARLY` - 557,183 jobs (8.5%)
  - `HOURLY` - 408,761 jobs (6.2%)
  - `MONTHLY` - 19,891 jobs (0.3%)
  - `WEEKLY` - 5,818 jobs (0.1%)
  - `DAILY` - 3,254 jobs (<0.1%)
  - `NONE` - 115 jobs (<0.1%)
  - Empty/NULL - 4,925,636 jobs (75.0%)

#### `data_regex_pay_range`
- **Type**: STRING
- **Description**: Raw pay range text extracted via regex from job description
- **Nullable**: Yes
- **Example**: `$100K - $150K per year`

#### `data_regex_range_min`
- **Type**: INTEGER
- **Description**: Minimum pay extracted via regex
- **Nullable**: Yes

#### `data_regex_range_max`
- **Type**: INTEGER
- **Description**: Maximum pay extracted via regex
- **Nullable**: Yes

#### `max_salary`
- **Type**: FLOAT
- **Description**: Normalized maximum salary value
- **Nullable**: Yes
- **Usage**: Standardized field for salary comparisons

---

### 📊 Application Metrics

#### `data_num_applicants`
- **Type**: INTEGER
- **Description**: Number of applicants who have applied to the job
- **Nullable**: Yes
- **Coverage**: 72.6% (4,767,937 jobs)
- **Note**: Primarily available for LinkedIn jobs
- **Usage**: Gauge job popularity and competition

---

### 🏠 Work Model Flags

#### `is_remote`
- **Type**: BOOLEAN
- **Description**: Job allows fully remote work
- **Count**: 957,776 jobs (14.6%)
- **Usage**: Filter for remote opportunities

#### `is_hybrid`
- **Type**: BOOLEAN
- **Description**: Job offers hybrid work arrangement
- **Count**: 667,201 jobs (10.2%)

#### `is_onsite`
- **Type**: BOOLEAN
- **Description**: Job requires onsite presence
- **Count**: 5,103,705 jobs (77.7%)

#### `is_remote_friendly`
- **Type**: BOOLEAN
- **Description**: Company is open to remote work arrangements
- **Nullable**: Yes

---

### 💼 Employment Type Flags

#### `is_full_time`
- **Type**: BOOLEAN
- **Description**: Full-time position
- **Count**: 3,215,434 jobs (49.0%)

#### `is_part_time`
- **Type**: BOOLEAN
- **Description**: Part-time position
- **Count**: 446,544 jobs (6.8%)

#### `is_contract`
- **Type**: BOOLEAN
- **Description**: Contract/temporary position
- **Count**: 313,873 jobs (4.8%)

#### `is_internship`
- **Type**: BOOLEAN
- **Description**: Internship position
- **Nullable**: Yes

---

### 📊 Seniority Level Flags

#### `is_entry_level`
- **Type**: BOOLEAN
- **Description**: Entry-level position
- **Nullable**: Yes

#### `is_senior_level`
- **Type**: BOOLEAN
- **Description**: Senior-level position
- **Nullable**: Yes

#### `is_director_level`
- **Type**: BOOLEAN
- **Description**: Director-level position
- **Nullable**: Yes

#### `is_executive`
- **Type**: BOOLEAN
- **Description**: Executive-level position (C-suite, VP)
- **Nullable**: Yes

#### `is_managerial`
- **Type**: BOOLEAN
- **Description**: Position involves people management
- **Nullable**: Yes

---

### 🔧 Job Function Flags

#### `is_engineering`
- **Type**: BOOLEAN
- **Description**: Engineering role
- **Nullable**: Yes

#### `is_data_related`
- **Type**: BOOLEAN
- **Description**: Data science, analytics, or data engineering role
- **Nullable**: Yes

#### `is_technical`
- **Type**: BOOLEAN
- **Description**: Technical role (engineering, IT, data, etc.)
- **Nullable**: Yes

#### `is_non_technical`
- **Type**: BOOLEAN
- **Description**: Non-technical role
- **Nullable**: Yes

#### `is_sales`
- **Type**: BOOLEAN
- **Description**: Sales or business development role
- **Nullable**: Yes

#### `is_marketing`
- **Type**: BOOLEAN
- **Description**: Marketing or communications role
- **Nullable**: Yes

#### `is_product`
- **Type**: BOOLEAN
- **Description**: Product management role
- **Nullable**: Yes

#### `is_operations`
- **Type**: BOOLEAN
- **Description**: Operations or supply chain role
- **Nullable**: Yes

#### `is_hr_related`
- **Type**: BOOLEAN
- **Description**: HR, recruiting, or people operations role
- **Nullable**: Yes

#### `is_support`
- **Type**: BOOLEAN
- **Description**: Customer support or service role
- **Nullable**: Yes

#### `is_program_management`
- **Type**: BOOLEAN
- **Description**: Program or project management role
- **Nullable**: Yes

---

### 🏢 Company Type Flags

#### `is_big_tech`
- **Type**: BOOLEAN
- **Description**: Major technology company (FAANG+)
- **Count**: 184,916 jobs (2.8%)
- **Examples**: Google, Amazon, Microsoft, Meta, Apple

#### `is_startup`
- **Type**: BOOLEAN
- **Description**: Startup company
- **Count**: 140,554 jobs (2.1%)

#### `is_enterprise`
- **Type**: BOOLEAN
- **Description**: Large enterprise company
- **Count**: 1,612,027 jobs (24.6%)

#### `is_consulting_firm`
- **Type**: BOOLEAN
- **Description**: Consulting or professional services firm
- **Count**: 399,547 jobs (6.1%)
- **Examples**: PwC, Deloitte, Accenture

#### `is_agency`
- **Type**: BOOLEAN
- **Description**: Staffing agency or recruiting firm
- **Count**: 266,032 jobs (4.1%)

---

### 📍 Location Flags

#### `is_us_based`
- **Type**: BOOLEAN
- **Description**: Position is based in the United States
- **Nullable**: Yes

#### `is_international`
- **Type**: BOOLEAN
- **Description**: Position is outside the United States
- **Nullable**: Yes

#### `is_nyc_area`
- **Type**: BOOLEAN
- **Description**: Position is in the New York City metropolitan area
- **Nullable**: Yes

#### `is_sf_bay_area`
- **Type**: BOOLEAN
- **Description**: Position is in the San Francisco Bay Area
- **Nullable**: Yes

#### `is_chicago_area`
- **Type**: BOOLEAN
- **Description**: Position is in the Chicago metropolitan area
- **Nullable**: Yes

---

### 💵 Compensation Flags

#### `is_comp_disclosed`
- **Type**: BOOLEAN
- **Description**: Compensation information is disclosed in the posting
- **Nullable**: Yes

#### `is_mid_salary`
- **Type**: BOOLEAN
- **Description**: Salary falls in mid-range bracket
- **Nullable**: Yes

#### `is_high_salary`
- **Type**: BOOLEAN
- **Description**: Salary falls in high-range bracket
- **Nullable**: Yes

---

### 🌍 Other Flags

#### `is_visa_friendly`
- **Type**: BOOLEAN
- **Description**: Company offers visa sponsorship
- **Nullable**: Yes

#### `is_relocation_offered`
- **Type**: BOOLEAN
- **Description**: Relocation assistance is offered
- **Nullable**: Yes

---

### 🔄 Pipeline Metadata

#### `pipeline`
- **Type**: INTEGER
- **Description**: Pipeline identifier for data processing
- **Nullable**: Yes
- **Usage**: Internal tracking of data processing pipeline

#### `run`
- **Type**: INTEGER
- **Description**: Run identifier for batch processing
- **Nullable**: Yes
- **Usage**: Track which batch/run the record belongs to

#### `seed`
- **Type**: STRING
- **Description**: Seed value used in data processing
- **Nullable**: Yes
- **Usage**: Internal processing reference

---

## 📝 Usage Examples

### Example 1: Find High-Paying Remote Data Science Jobs
```sql
SELECT 
    unique_job_id,
    data_company,
    data_job_title,
    data_location_city,
    data_location_state,
    data_pay_range_max
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_remote = TRUE
  AND is_data_related = TRUE
  AND data_pay_range_max > 150000
  AND data_pay_range_unit = 'YEARLY'
ORDER BY data_pay_range_max DESC
LIMIT 50;
```

### Example 2: Analyze Big Tech Hiring Trends
```sql
SELECT 
    data_company,
    DATE_TRUNC(data_posted, MONTH) as month,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_max_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_big_tech = TRUE
  AND data_posted >= '2025-04-01'
GROUP BY data_company, month
ORDER BY month, job_count DESC;
```

### Example 3: Geographic Distribution of Engineering Jobs
```sql
SELECT 
    data_location_city,
    data_location_state,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_max_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_engineering = TRUE
  AND data_location_country = 'United States'
  AND data_pay_range_max IS NOT NULL
GROUP BY data_location_city, data_location_state
HAVING job_count > 100
ORDER BY job_count DESC
LIMIT 25;
```

---

**Document Version**: 1.0  
**Last Updated**: October 4, 2025  
**Maintained By**: Data Engineering Team

