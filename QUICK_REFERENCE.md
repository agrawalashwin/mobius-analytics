# Quick Reference Guide

**Table**: `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`

---

## 📊 At a Glance

| Metric | Value |
|--------|-------|
| **Total Records** | 6,564,848 |
| **Table Size** | 30.08 GB |
| **Date Range** | Apr 23, 2025 - Oct 3, 2025 |
| **Update Frequency** | Every 2 days |
| **Unique Companies** | 451,247 |
| **Unique Jobs** | 3,229,962 |
| **Total Columns** | 71 |

---

## 🔑 Key Columns

### Must-Know Fields

| Column | Type | Description | Coverage |
|--------|------|-------------|----------|
| `unique_job_id` | STRING | Unique job identifier | 100% |
| `data_company` | STRING | Company name | ~100% |
| `data_job_title` | STRING | Job title | ~100% |
| `data_job_description` | STRING | Full job description | 100% |
| `data_posted` | TIMESTAMP | When job was posted | ~100% |
| `created_at` | TIMESTAMP | When record was created | 100% |
| `data_pay_range_min` | FLOAT | Minimum salary | 15.2% |
| `data_pay_range_max` | FLOAT | Maximum salary | 15.2% |
| `data_pay_range_unit` | STRING | Salary unit (YEARLY, HOURLY) | 25% |
| `data_location_city` | STRING | City | ~90% |
| `data_location_state` | STRING | State/Province | ~90% |
| `data_location_country` | STRING | Country | ~100% |
| `data_num_applicants` | INTEGER | Number of applicants | 72.6% |
| `job_family` | STRING | Job category | ~90% |
| `industry` | STRING | Industry code | ~90% |

---

## 🏷️ Boolean Flags (40+ Available)

### Work Model
- `is_remote` - 14.6% (957,776 jobs)
- `is_hybrid` - 10.2% (667,201 jobs)
- `is_onsite` - 77.7% (5,103,705 jobs)

### Employment Type
- `is_full_time` - 49.0% (3,215,434 jobs)
- `is_part_time` - 6.8% (446,544 jobs)
- `is_contract` - 4.8% (313,873 jobs)

### Company Type
- `is_big_tech` - 2.8% (184,916 jobs)
- `is_enterprise` - 24.6% (1,612,027 jobs)
- `is_startup` - 2.1% (140,554 jobs)
- `is_consulting_firm` - 6.1% (399,547 jobs)

### Job Functions
- `is_engineering` - Engineering roles
- `is_data_related` - Data science/analytics
- `is_technical` - Technical roles
- `is_sales` - Sales roles
- `is_marketing` - Marketing roles
- `is_product` - Product management
- `is_operations` - Operations roles

### Seniority
- `is_entry_level` - Entry level
- `is_senior_level` - Senior level
- `is_director_level` - Director level
- `is_executive` - Executive level
- `is_managerial` - Management roles

### Location
- `is_us_based` - US-based (81.8%)
- `is_international` - International (18.2%)
- `is_nyc_area` - NYC metro area
- `is_sf_bay_area` - SF Bay Area
- `is_chicago_area` - Chicago metro

---

## 📈 Data Distribution

### Job Boards
```
LinkedIn:       72.6% (4,767,937)
Indeed:         27.4% (1,796,240)
WTTJ:           <0.1% (558)
FranceTravail:  <0.1% (113)
```

### Countries
```
United States:  81.8% (5,372,635)
Canada:         18.2% (1,192,213)
```

### Top Industries
```
TECH:    2,253,973 (34.3%)
HLTH:    1,780,906 (27.1%)
REAL:      978,313 (14.9%)
CONS:      495,001 (7.5%)
FIN:       430,234 (6.6%)
```

### Top Job Families
```
Other / Specialized:           60.1%
Engineering & IT:              16.3%
Sales & Business Development:   7.3%
Finance & Accounting:           4.7%
Operations & Supply Chain:      3.9%
```

### Seniority Levels
```
Entry level:       40.0% (1,885,453)
Mid-Senior level:  36.0% (1,697,732)
Not Applicable:    11.0% (516,585)
Associate:          5.5% (260,923)
Director:           4.5% (210,306)
```

---

## 💰 Salary Data

| Metric | Value |
|--------|-------|
| Jobs with Salary | 15.2% (995,022) |
| Min Salary | $0 |
| Max Salary | $3,000,000 |
| Avg Min Salary | $53,697 |
| Avg Max Salary | $76,759 |

### Pay Units
```
YEARLY:   8.5% (557,183)
HOURLY:   6.2% (408,761)
MONTHLY:  0.3% (19,891)
WEEKLY:   0.1% (5,818)
NULL:    75.0% (4,925,636)
```

---

## 🏢 Top 10 Employers

| Rank | Company | Jobs |
|------|---------|------|
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

*Note: Lensa and TieTalent are job aggregators*

---

## 🔍 Common Query Patterns

### Basic Filtering
```sql
-- Remote engineering jobs
WHERE is_remote = TRUE AND is_engineering = TRUE

-- High-paying jobs
WHERE data_pay_range_max > 150000 AND data_pay_range_unit = 'YEARLY'

-- Big tech companies
WHERE is_big_tech = TRUE

-- Recent postings (last 30 days)
WHERE data_posted >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)

-- US-based jobs
WHERE data_location_country = 'United States'
```

### Aggregations
```sql
-- Count by company
GROUP BY data_company

-- Average salary by job family
GROUP BY job_family

-- Monthly trends
GROUP BY DATE_TRUNC(data_posted, MONTH)

-- Geographic distribution
GROUP BY data_location_city, data_location_state
```

---

## 💡 Quick Tips

### Performance
1. **Always filter by date** to reduce scan size
2. **Use specific columns** instead of SELECT *
3. **Limit results** for exploratory queries
4. **Filter on boolean flags** for fast queries

### Data Quality
- ✅ Job descriptions: 100% coverage
- ✅ Company info: ~100% coverage
- ⚠️ Salary data: Only 15.2% have salary info
- ⚠️ Applicant counts: Only on LinkedIn jobs (72.6%)

### Best Practices
- Use `unique_job_id` for deduplication
- Filter by `data_posted` for time-based analysis
- Use `created_at` for data freshness checks
- Check `data_pay_range_unit` when analyzing salaries
- Combine boolean flags for precise filtering

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| [SOURCE_TABLE_DOCUMENTATION.md](SOURCE_TABLE_DOCUMENTATION.md) | Complete table overview |
| [DATA_DICTIONARY.md](DATA_DICTIONARY.md) | All 71 columns explained |
| [QUERY_EXAMPLES.md](QUERY_EXAMPLES.md) | Ready-to-use SQL queries |
| [BQ_EXPLORATION_SUMMARY.md](BQ_EXPLORATION_SUMMARY.md) | All datasets explored |

---

## 🚀 Getting Started

### 1. Basic Exploration
```sql
SELECT 
    data_company,
    data_job_title,
    data_location_city,
    data_pay_range_max,
    is_remote
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_posted >= '2025-09-01'
LIMIT 100;
```

### 2. Company Analysis
```sql
SELECT 
    data_company,
    COUNT(*) as job_count,
    AVG(data_pay_range_max) as avg_salary
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE is_big_tech = TRUE
GROUP BY data_company
ORDER BY job_count DESC;
```

### 3. Salary Benchmarking
```sql
SELECT 
    job_family,
    AVG(data_pay_range_max) as avg_max_salary,
    COUNT(*) as job_count
FROM `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
WHERE data_pay_range_unit = 'YEARLY'
  AND data_pay_range_max IS NOT NULL
GROUP BY job_family
ORDER BY avg_max_salary DESC;
```

---

## 🔗 Quick Links

- **BigQuery Console**: [View Table](https://console.cloud.google.com/bigquery?project=jobs-data-linkedin&ws=!1m5!1m4!4m3!1sjobs-data-linkedin!2sjobs_data_ai!3sjobs_data_ai_cumulative_all)
- **Project**: jobs-data-linkedin
- **Dataset**: jobs_data_ai
- **Table**: jobs_data_ai_cumulative_all
- **Location**: us-west1

---

**Last Updated**: October 4, 2025  
**Version**: 1.0

