# Mobius Analytics - Jobs Data Exploration

A comprehensive toolkit for exploring and analyzing job market data from BigQuery, focusing on AI/ML positions and tech industry hiring trends.

## 🎯 Project Overview

This project provides tools and documentation for exploring the `jobs-data-linkedin` BigQuery project, which contains:
- **6.5+ million job listings** from the source table
- **18 datasets** with raw, analytics, and reporting layers
- **451,247 unique companies** across tech, healthcare, finance, and more
- **AI/ML job market insights** from April-October 2025
- **Comprehensive salary, location, and trend analysis** capabilities

### 📊 Source Data Table

**Primary Table**: `jobs-data-linkedin.jobs_data_ai.jobs_data_ai_cumulative_all`
- **6,564,848 total records** (30+ GB)
- **Updates every 2 days** automatically
- **71 columns** including 40+ enriched boolean flags
- **4 job boards**: LinkedIn (72.6%), Indeed (27.4%), WTTJ, FranceTravail
- **Date range**: April 23, 2025 - October 3, 2025

## 📁 Repository Structure

```
mobius-analytics/
├── README.md                           # This file - Project overview
├── SOURCE_TABLE_DOCUMENTATION.md       # Source table comprehensive documentation
├── DATA_DICTIONARY.md                  # Complete field-level data dictionary
├── QUERY_EXAMPLES.md                   # Common query patterns and examples
├── BQ_EXPLORATION_SUMMARY.md           # Detailed exploration findings
├── bq_explorer.py                      # Python toolkit for data exploration
├── requirements.txt                    # Python dependencies
└── .git/                               # Git repository
```

## 🚀 Quick Start

### Prerequisites

1. **GCP Authentication** ✅
   - Project: `jobs-data-linkedin`
   - Account: `ashwin@mobiusengine.ai`
   - Application Default Credentials configured

2. **GitHub Connection** ✅
   - Account: `agrawalashwin`
   - Repository initialized

### Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Verify BigQuery access
bq ls

# Run the explorer
python bq_explorer.py
```

## 📊 Available Datasets

### Most Recent & Important

| Dataset | Records | Description |
|---------|---------|-------------|
| **analytic_website_analytics** | 52,888 | Cleaned AI job listings with enriched metadata |
| **analytic_website_reporting** | - | Pre-aggregated reporting views for dashboards |
| **mobius_jobs_analytics** | 10,166 | Deep-dive AI jobs analytics (4-week window) |

See [BQ_EXPLORATION_SUMMARY.md](BQ_EXPLORATION_SUMMARY.md) for complete dataset documentation.

## 🔧 Using the Python Explorer

### Basic Usage

```python
from bq_explorer import JobsDataExplorer

# Initialize explorer
explorer = JobsDataExplorer()

# List all datasets
datasets = explorer.list_datasets()
print(datasets)

# Get top companies
top_companies = explorer.get_top_companies(limit=20)
print(top_companies)

# Search for specific jobs
ml_jobs = explorer.search_jobs("machine learning", limit=50)
print(ml_jobs)

# Get salary statistics
salary_stats = explorer.get_salary_stats_by_role()
print(salary_stats)
```

### Available Methods

#### Dataset Exploration
- `list_datasets()` - List all datasets with metadata
- `list_tables(dataset_id)` - List tables in a dataset
- `get_schema(dataset_id, table_id)` - Get table schema
- `get_sample_data(dataset_id, table_id, limit)` - Get sample rows

#### Job Market Analysis
- `get_top_companies(limit)` - Top employers by job count
- `get_salary_stats_by_role()` - Salary analysis by job family
- `get_location_distribution(limit)` - Geographic job distribution
- `get_monthly_trends()` - Time-series hiring trends
- `search_jobs(keyword, limit)` - Search jobs by keyword
- `get_work_model_distribution()` - Remote/hybrid/onsite breakdown

#### Custom Queries
- `query(sql, max_results)` - Execute any SQL query

## 📈 Key Insights

### Top AI Employers
1. **Amazon Web Services (AWS)** - 1,042 positions
2. **Amazon.com, Inc.** - 353 positions
3. **Google** - 323 positions
4. **Microsoft** - 139 positions
5. **Apple Inc.** - 93 positions

### Salary Benchmarks
- **Google**: $224,691 average
- **Microsoft**: $221,946 average
- **Amazon**: $206,124 average
- **Meta**: $183,165 average

### Work Model Distribution
- **Onsite**: 87.9% (46,442 jobs)
- **Remote**: 5.6% (2,957 jobs)
- **Hybrid**: 0.6% (316 jobs)

### Hiring Trends
- **Peak**: May 2025 (12,344 jobs)
- **Current**: October 2025 (790 jobs)
- **Total Period**: April-October 2025

## 🔍 Example Queries

### Using bq CLI

```bash
# Get top companies
bq query --use_legacy_sql=false '
SELECT data_company, COUNT(*) as jobs 
FROM `jobs-data-linkedin.analytic_website_analytics.jobs_ai_cleaned_vw` 
GROUP BY data_company 
ORDER BY jobs DESC 
LIMIT 10'

# Get monthly trends
bq query --use_legacy_sql=false '
SELECT * 
FROM `jobs-data-linkedin.analytic_website_reporting.jobs_ai_monthly_trends_RP10`'

# Search for ML Engineer jobs
bq query --use_legacy_sql=false '
SELECT data_company, data_job_title, data_location_city, data_pay_range_max
FROM `jobs-data-linkedin.analytic_website_analytics.jobs_ai_cleaned_vw`
WHERE LOWER(data_job_title) LIKE "%machine learning engineer%"
ORDER BY data_pay_range_max DESC
LIMIT 20'
```

### Using Python

```python
# Get high-paying remote jobs
sql = """
SELECT 
    data_company,
    data_job_title,
    data_pay_range_min,
    data_pay_range_max,
    data_location_state
FROM `jobs-data-linkedin.analytic_website_analytics.jobs_ai_cleaned_vw`
WHERE is_remote = TRUE
  AND data_pay_range_max > 200000
ORDER BY data_pay_range_max DESC
LIMIT 20
"""
high_paying_remote = explorer.query(sql)
```

## 📚 Documentation

### Core Documentation
- **[SOURCE_TABLE_DOCUMENTATION.md](SOURCE_TABLE_DOCUMENTATION.md)** - Complete source table documentation
  - Table overview and statistics (6.5M+ records)
  - 71-column schema breakdown
  - Data distribution and quality metrics
  - Update schedule and pipeline information

- **[DATA_DICTIONARY.md](DATA_DICTIONARY.md)** - Field-level data dictionary
  - Detailed description of all 71 columns
  - Data types, nullable status, and coverage
  - Value distributions and examples
  - Usage notes and best practices

- **[QUERY_EXAMPLES.md](QUERY_EXAMPLES.md)** - Common query patterns
  - Company analysis queries
  - Salary benchmarking queries
  - Geographic analysis queries
  - Trend analysis queries
  - Job search queries
  - Market intelligence queries

### Additional Documentation
- **[BQ_EXPLORATION_SUMMARY.md](BQ_EXPLORATION_SUMMARY.md)** - Comprehensive exploration findings
  - All 18 datasets documented
  - Schema details for key tables
  - Sample data and statistics
  - Recommended next steps

## 🎯 Use Cases

### For Data Analysts
- Salary benchmarking and compensation analysis
- Geographic hiring trend analysis
- Company hiring pattern comparison
- Job market forecasting

### For Job Seekers
- Find high-paying AI/ML positions
- Identify companies hiring remotely
- Track hiring trends by location
- Compare compensation across companies

### For Recruiters
- Competitive intelligence on hiring
- Salary range benchmarking
- Identify hiring hotspots
- Track market demand for skills

### For Business Intelligence
- Build executive dashboards
- Monitor hiring velocity
- Analyze market trends
- Generate reports for stakeholders

## 🛠️ Development

### Running Tests

```bash
# Test BigQuery connection
python -c "from bq_explorer import JobsDataExplorer; e = JobsDataExplorer(); print(e.list_datasets())"

# Run full exploration
python bq_explorer.py
```

### Adding New Features

The `JobsDataExplorer` class is designed to be extended. Add new methods for specific analyses:

```python
def get_skills_analysis(self, dataset_id: str, table_id: str) -> pd.DataFrame:
    """Analyze required skills from job descriptions"""
    sql = f"""
    SELECT 
        data_job_title,
        data_job_description,
        -- Add your analysis logic here
    FROM `{self.project_id}.{dataset_id}.{table_id}`
    """
    return self.query(sql)
```

## 📝 Notes

- All BigQuery views are read-only (no tables, only views)
- Data sourced from LinkedIn and other job boards
- Time travel enabled (168 hours) for all datasets
- Data covers April-October 2025 period
- Focus on AI/ML and tech industry positions

## 🔗 Resources

- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [BigQuery Python Client](https://cloud.google.com/python/docs/reference/bigquery/latest)
- [Pandas Documentation](https://pandas.pydata.org/docs/)

## 👥 Contributors

- **Ashwin Agrawal** (ashwin@mobiusengine.ai) - Project Owner
- **Data Engineering Team** (dataengineer@, dataengineer2@mobiusengine.ai)

## 📄 License

Internal project for Mobius Engine analytics.

---

**Last Updated**: October 4, 2025  
**Project**: jobs-data-linkedin  
**Status**: Active Development

