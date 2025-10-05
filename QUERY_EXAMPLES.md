# Query Examples: jobs_data_ai_cumulative_all

Quick reference guide for common queries against the source table.

**Table**: `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`

---

## 🔍 Basic Exploration Queries

### Get Table Statistics
```sql
SELECT 
    COUNT(*) as total_rows,
    COUNT(DISTINCT unique_job_id) as unique_jobs,
    COUNT(DISTINCT data_company) as unique_companies,
    MIN(created_at) as earliest_record,
    MAX(created_at) as latest_record,
    COUNTIF(data_pay_range_min IS NOT NULL) as jobs_with_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`;
```

### Sample Recent Jobs
```sql
SELECT 
    unique_job_id,
    data_company,
    data_job_title,
    data_location_city,
    data_location_state,
    data_pay_range_max,
    is_remote,
    data_posted
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_posted >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
ORDER BY data_posted DESC
LIMIT 100;
```

---

## 🏢 Company Analysis

### Top Companies by Job Count
```sql
SELECT 
    data_company,
    COUNT(*) as total_jobs,
    COUNT(DISTINCT data_job_title) as unique_titles,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNTIF(is_remote) as remote_jobs,
    COUNTIF(is_big_tech) as is_big_tech_flag
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_company IS NOT NULL
GROUP BY data_company
ORDER BY total_jobs DESC
LIMIT 50;
```

### Big Tech Company Comparison
```sql
SELECT 
    data_company,
    COUNT(*) as total_jobs,
    AVG(data_pay_range_min) as avg_min_salary,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNTIF(is_remote) as remote_jobs,
    COUNTIF(is_engineering) as engineering_jobs,
    COUNTIF(data_num_applicants IS NOT NULL) / COUNT(*) * 100 as pct_with_applicant_data
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_big_tech = TRUE
GROUP BY data_company
ORDER BY total_jobs DESC;
```

### Company Hiring Velocity (Last 30 Days)
```sql
SELECT 
    data_company,
    COUNT(*) as jobs_posted_last_30d,
    AVG(data_num_applicants) as avg_applicants,
    COUNTIF(is_remote) as remote_jobs,
    COUNTIF(is_hybrid) as hybrid_jobs
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_posted >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  AND data_company IS NOT NULL
GROUP BY data_company
HAVING jobs_posted_last_30d >= 10
ORDER BY jobs_posted_last_30d DESC
LIMIT 50;
```

---

## 💰 Salary Analysis

### Salary Distribution by Job Family
```sql
SELECT 
    job_family,
    COUNT(*) as job_count,
    MIN(data_pay_range_min) as min_salary,
    AVG(data_pay_range_min) as avg_min_salary,
    AVG(data_pay_range_max) as avg_max_salary,
    MAX(data_pay_range_max) as max_salary,
    APPROX_QUANTILES(data_pay_range_max, 100)[OFFSET(50)] as median_max_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_pay_range_min IS NOT NULL
  AND data_pay_range_max IS NOT NULL
  AND data_pay_range_unit = 'YEARLY'
  AND job_family IS NOT NULL
GROUP BY job_family
ORDER BY avg_max_salary DESC;
```

### Top Paying Jobs by Location
```sql
SELECT 
    data_location_city,
    data_location_state,
    data_company,
    data_job_title,
    data_pay_range_min,
    data_pay_range_max,
    data_pay_range_unit,
    is_remote
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_pay_range_max IS NOT NULL
  AND data_pay_range_unit = 'YEARLY'
  AND data_location_country = 'United States'
ORDER BY data_pay_range_max DESC
LIMIT 100;
```

### Salary Comparison: Remote vs Onsite
```sql
SELECT 
    CASE 
        WHEN is_remote THEN 'Remote'
        WHEN is_hybrid THEN 'Hybrid'
        WHEN is_onsite THEN 'Onsite'
        ELSE 'Unknown'
    END as work_model,
    job_family,
    COUNT(*) as job_count,
    AVG(data_pay_range_min) as avg_min_salary,
    AVG(data_pay_range_max) as avg_max_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_pay_range_max IS NOT NULL
  AND data_pay_range_unit = 'YEARLY'
  AND job_family IN ('Engineering & IT', 'Sales & Business Development', 'Finance & Accounting')
GROUP BY work_model, job_family
ORDER BY job_family, avg_max_salary DESC;
```

---

## 📍 Geographic Analysis

### Jobs by City (Top 50)
```sql
SELECT 
    data_location_city,
    data_location_state,
    data_location_country,
    COUNT(*) as job_count,
    COUNT(DISTINCT data_company) as unique_companies,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNTIF(is_remote) as remote_jobs
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_location_city IS NOT NULL
GROUP BY data_location_city, data_location_state, data_location_country
ORDER BY job_count DESC
LIMIT 50;
```

### Tech Hub Comparison
```sql
SELECT 
    CASE 
        WHEN is_sf_bay_area THEN 'San Francisco Bay Area'
        WHEN is_nyc_area THEN 'New York City Area'
        WHEN is_chicago_area THEN 'Chicago Area'
        ELSE 'Other'
    END as tech_hub,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNTIF(is_engineering) as engineering_jobs,
    COUNTIF(is_remote) as remote_jobs
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE (is_sf_bay_area OR is_nyc_area OR is_chicago_area)
  AND data_pay_range_max IS NOT NULL
  AND data_pay_range_unit = 'YEARLY'
GROUP BY tech_hub
ORDER BY job_count DESC;
```

### US vs Canada Comparison
```sql
SELECT 
    data_location_country,
    COUNT(*) as job_count,
    COUNT(DISTINCT data_company) as unique_companies,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNTIF(is_remote) as remote_jobs,
    COUNTIF(is_big_tech) as big_tech_jobs
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_location_country IN ('United States', 'Canada')
GROUP BY data_location_country;
```

---

## 📈 Trend Analysis

### Monthly Job Posting Trends
```sql
SELECT 
    DATE_TRUNC(data_posted, MONTH) as month,
    COUNT(*) as job_count,
    COUNT(DISTINCT data_company) as unique_companies,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNTIF(is_remote) as remote_jobs,
    COUNTIF(is_engineering) as engineering_jobs
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_posted IS NOT NULL
  AND data_posted >= '2025-04-01'
GROUP BY month
ORDER BY month;
```

### Weekly Posting Patterns
```sql
SELECT 
    EXTRACT(DAYOFWEEK FROM data_posted) as day_of_week,
    CASE EXTRACT(DAYOFWEEK FROM data_posted)
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
    END as day_name,
    COUNT(*) as job_count,
    AVG(data_num_applicants) as avg_applicants
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_posted IS NOT NULL
GROUP BY day_of_week, day_name
ORDER BY day_of_week;
```

### Industry Growth Trends
```sql
SELECT 
    industry,
    DATE_TRUNC(data_posted, MONTH) as month,
    COUNT(*) as job_count
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE industry IS NOT NULL
  AND data_posted >= '2025-04-01'
GROUP BY industry, month
ORDER BY industry, month;
```

---

## 🎯 Job Search Queries

### Find Remote Engineering Jobs with High Salary
```sql
SELECT 
    unique_job_id,
    data_company,
    data_job_title,
    data_location_city,
    data_location_state,
    data_pay_range_min,
    data_pay_range_max,
    data_num_applicants,
    data_posted,
    data_external_application_link
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_remote = TRUE
  AND is_engineering = TRUE
  AND data_pay_range_max >= 150000
  AND data_pay_range_unit = 'YEARLY'
  AND data_posted >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
ORDER BY data_pay_range_max DESC, data_posted DESC
LIMIT 100;
```

### Search by Keyword in Title
```sql
SELECT 
    unique_job_id,
    data_company,
    data_job_title,
    job_family,
    data_location_city,
    data_location_state,
    data_pay_range_max,
    is_remote,
    data_posted
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE LOWER(data_job_title) LIKE '%machine learning%'
  AND data_posted >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 60 DAY)
ORDER BY data_posted DESC
LIMIT 100;
```

### Entry-Level Jobs at Big Tech
```sql
SELECT 
    data_company,
    data_job_title,
    data_location_city,
    data_location_state,
    data_pay_range_min,
    data_pay_range_max,
    data_num_applicants,
    data_posted,
    data_external_application_link
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_big_tech = TRUE
  AND (is_entry_level = TRUE OR data_seniority_level = 'Entry level')
  AND data_posted >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
ORDER BY data_company, data_posted DESC;
```

### Visa-Friendly Jobs
```sql
SELECT 
    data_company,
    data_job_title,
    data_location_city,
    data_location_state,
    data_pay_range_max,
    is_remote,
    data_posted
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_visa_friendly = TRUE
  AND data_pay_range_max >= 100000
  AND data_pay_range_unit = 'YEARLY'
ORDER BY data_pay_range_max DESC
LIMIT 100;
```

---

## 📊 Market Intelligence

### Job Competition Analysis
```sql
SELECT 
    data_company,
    data_job_title,
    data_num_applicants,
    data_pay_range_max,
    data_location_city,
    data_posted,
    TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), data_posted, DAY) as days_since_posted
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_num_applicants IS NOT NULL
  AND data_num_applicants > 0
ORDER BY data_num_applicants DESC
LIMIT 100;
```

### Skills Demand Analysis (by keyword in description)
```sql
SELECT 
    'Python' as skill,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_max_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE LOWER(data_job_description) LIKE '%python%'
  AND data_pay_range_unit = 'YEARLY'

UNION ALL

SELECT 
    'Java' as skill,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_max_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE LOWER(data_job_description) LIKE '%java%'
  AND data_pay_range_unit = 'YEARLY'

UNION ALL

SELECT 
    'SQL' as skill,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_max_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE LOWER(data_job_description) LIKE '%sql%'
  AND data_pay_range_unit = 'YEARLY'

ORDER BY job_count DESC;
```

### Startup vs Enterprise Comparison
```sql
SELECT 
    CASE 
        WHEN is_startup THEN 'Startup'
        WHEN is_enterprise THEN 'Enterprise'
        WHEN is_big_tech THEN 'Big Tech'
        ELSE 'Other'
    END as company_type,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNTIF(is_remote) as remote_jobs,
    COUNTIF(data_pay_range_max IS NOT NULL) as jobs_with_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE (is_startup OR is_enterprise OR is_big_tech)
  AND data_pay_range_unit = 'YEARLY'
GROUP BY company_type
ORDER BY avg_max_salary DESC;
```

---

## 🔧 Data Quality Checks

### Check Data Completeness
```sql
SELECT 
    'Total Rows' as metric,
    COUNT(*) as count,
    100.0 as percentage
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`

UNION ALL

SELECT 
    'Has Job Description',
    COUNTIF(data_job_description IS NOT NULL),
    COUNTIF(data_job_description IS NOT NULL) * 100.0 / COUNT(*)
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`

UNION ALL

SELECT 
    'Has Salary Data',
    COUNTIF(data_pay_range_max IS NOT NULL),
    COUNTIF(data_pay_range_max IS NOT NULL) * 100.0 / COUNT(*)
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`

UNION ALL

SELECT 
    'Has Applicant Count',
    COUNTIF(data_num_applicants IS NOT NULL),
    COUNTIF(data_num_applicants IS NOT NULL) * 100.0 / COUNT(*)
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`

ORDER BY percentage DESC;
```

### Identify Duplicate Jobs
```sql
SELECT 
    unique_job_id,
    COUNT(*) as duplicate_count
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
GROUP BY unique_job_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
```

---

## 💡 Tips for Query Optimization

1. **Always filter by date** to reduce scan size:
   ```sql
   WHERE data_posted >= '2025-09-01'
   ```

2. **Use specific columns** instead of SELECT *:
   ```sql
   SELECT unique_job_id, data_company, data_job_title
   ```

3. **Filter early** in your WHERE clause:
   ```sql
   WHERE is_remote = TRUE AND data_pay_range_unit = 'YEARLY'
   ```

4. **Use COUNTIF** instead of COUNT(CASE WHEN):
   ```sql
   COUNTIF(is_remote) instead of COUNT(CASE WHEN is_remote THEN 1 END)
   ```

5. **Limit results** for exploratory queries:
   ```sql
   LIMIT 1000
   ```

---

**Document Version**: 1.0  
**Last Updated**: October 4, 2025

