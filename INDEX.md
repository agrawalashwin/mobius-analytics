# Documentation Index

**Project**: Mobius Analytics - Jobs Data Exploration  
**Last Updated**: October 4, 2025

---

## 📚 Complete Documentation Guide

This index helps you navigate all documentation files in this repository.

---

## 🚀 Start Here

### New to the Project?
1. **[README.md](README.md)** - Start here for project overview
2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick facts and common patterns
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What we've built and why

### Need to Query Data?
1. **[QUERY_EXAMPLES.md](QUERY_EXAMPLES.md)** - Copy-paste SQL queries
2. **[DATA_DICTIONARY.md](DATA_DICTIONARY.md)** - Look up field definitions
3. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick syntax reference

### Building Something?
1. **[SOURCE_TABLE_DOCUMENTATION.md](SOURCE_TABLE_DOCUMENTATION.md)** - Understand the data
2. **[DATA_DICTIONARY.md](DATA_DICTIONARY.md)** - All 71 fields explained
3. **bq_explorer.py** - Python toolkit for programmatic access

---

## 📖 Documentation Files

### 1. README.md (8.7 KB)
**Purpose**: Project overview and getting started guide

**Contents**:
- Project overview
- Installation instructions
- Quick start guide
- Available datasets
- Python explorer usage
- Key insights
- Use cases

**Best For**: First-time users, project overview

---

### 2. SOURCE_TABLE_DOCUMENTATION.md (11 KB)
**Purpose**: Complete documentation of the source table

**Contents**:
- Table overview and statistics
- 71-column schema breakdown
- Data distribution by category
- Top employers
- Data quality metrics
- Update schedule
- Pipeline information

**Best For**: Understanding the source data structure

**Key Sections**:
- 📊 Table Overview
- 🗂️ Schema Structure (71 columns organized)
- 📈 Data Distribution
- 🏢 Top Employers
- 🔍 Data Quality Notes
- 🔄 Data Pipeline

---

### 3. DATA_DICTIONARY.md (15 KB)
**Purpose**: Field-level documentation for all 71 columns

**Contents**:
- Detailed description of each field
- Data types and nullable status
- Value distributions and examples
- Coverage statistics
- Usage notes
- Example queries

**Best For**: Looking up specific field definitions

**Column Categories**:
- 🔑 Identifiers & Keys (4 columns)
- ⏰ Timestamps (2 columns)
- 🏢 Company Information (3 columns)
- 💼 Job Details (8 columns)
- 📍 Location Information (3 columns)
- 💰 Compensation (6 columns)
- 📊 Application Metrics (2 columns)
- 🏠 Work Model Flags (4 columns)
- 💼 Employment Type Flags (4 columns)
- 📊 Seniority Level Flags (5 columns)
- 🔧 Job Function Flags (11 columns)
- 🏢 Company Type Flags (5 columns)
- 📍 Location Flags (5 columns)
- 💵 Compensation Flags (3 columns)
- 🌍 Other Flags (2 columns)
- 🔄 Pipeline Metadata (3 columns)

---

### 4. QUERY_EXAMPLES.md (13 KB)
**Purpose**: Ready-to-use SQL query patterns

**Contents**:
- Basic exploration queries
- Company analysis queries
- Salary analysis queries
- Geographic analysis queries
- Trend analysis queries
- Job search queries
- Market intelligence queries
- Data quality checks
- Query optimization tips

**Best For**: Copy-paste SQL for common tasks

**Query Categories**:
- 🔍 Basic Exploration
- 🏢 Company Analysis
- 💰 Salary Analysis
- 📍 Geographic Analysis
- 📈 Trend Analysis
- 🎯 Job Search
- 📊 Market Intelligence
- 🔧 Data Quality Checks

---

### 5. QUICK_REFERENCE.md (7.1 KB)
**Purpose**: Quick facts and common patterns

**Contents**:
- At-a-glance statistics
- Key columns reference
- Boolean flags summary
- Data distribution charts
- Top employers
- Common query patterns
- Quick tips

**Best For**: Quick lookups and reference

**Sections**:
- 📊 At a Glance
- 🔑 Key Columns
- 🏷️ Boolean Flags (40+)
- 📈 Data Distribution
- 💰 Salary Data
- 🏢 Top 10 Employers
- 🔍 Common Query Patterns
- 💡 Quick Tips

---

### 6. BQ_EXPLORATION_SUMMARY.md (11 KB)
**Purpose**: Comprehensive exploration of all BigQuery datasets

**Contents**:
- All 18 datasets documented
- Dataset creation dates
- Table/view listings
- Schema highlights
- Sample data
- Key insights
- Recommended next steps

**Best For**: Understanding the full BigQuery project

**Datasets Covered**:
- analytic_website_analytics
- analytic_website_raw
- analytic_website_reporting
- mobius_jobs_analytics
- jobs_data_ai
- jobs_data_ai_clients
- And 12 more...

---

### 7. PROJECT_SUMMARY.md (9.2 KB)
**Purpose**: Project completion summary and achievements

**Contents**:
- Objectives completed
- Deliverables list
- Key findings
- Data quality assessment
- Insights and trends
- Technical implementation
- Recommended next steps
- Success metrics

**Best For**: Understanding what was built and why

**Sections**:
- 🎯 Objectives Completed
- 📁 Deliverables
- 📊 Key Findings
- 🔍 Data Quality Assessment
- 📈 Insights & Trends
- 🛠️ Technical Implementation
- 🎯 Recommended Next Steps
- 🏆 Success Metrics

---

## 💻 Code Files

### bq_explorer.py (9.8 KB)
**Purpose**: Python toolkit for BigQuery exploration

**Contents**:
- JobsDataExplorer class
- 15+ analysis methods
- Example usage in main()

**Key Methods**:
- `list_datasets()` - List all datasets
- `list_tables()` - List tables in a dataset
- `get_schema()` - Get table schema
- `query()` - Execute custom SQL
- `get_top_companies()` - Top employers
- `get_salary_stats_by_role()` - Salary analysis
- `get_location_distribution()` - Geographic analysis
- `get_monthly_trends()` - Trend analysis
- `search_jobs()` - Keyword search

**Usage**:
```python
from bq_explorer import JobsDataExplorer
explorer = JobsDataExplorer()
top_companies = explorer.get_top_companies(limit=20)
```

---

### requirements.txt (62 B)
**Purpose**: Python dependencies

**Contents**:
```
google-cloud-bigquery>=3.11.0
pandas>=2.0.0
db-dtypes>=1.1.1
```

**Installation**:
```bash
pip install -r requirements.txt
```

---

## 🗂️ File Organization

### By Purpose

#### Getting Started
- README.md
- QUICK_REFERENCE.md
- PROJECT_SUMMARY.md

#### Data Reference
- SOURCE_TABLE_DOCUMENTATION.md
- DATA_DICTIONARY.md
- BQ_EXPLORATION_SUMMARY.md

#### Practical Usage
- QUERY_EXAMPLES.md
- bq_explorer.py
- requirements.txt

#### Navigation
- INDEX.md (this file)

---

## 📊 Documentation Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 10 |
| **Markdown Files** | 8 |
| **Python Files** | 1 |
| **Config Files** | 1 |
| **Total Size** | ~95 KB |
| **Total Lines** | ~3,000+ |
| **Fields Documented** | 71 |
| **Query Examples** | 20+ |

---

## 🎯 Use Case Guide

### "I want to understand the data"
→ Start with **SOURCE_TABLE_DOCUMENTATION.md**

### "I need to write a query"
→ Go to **QUERY_EXAMPLES.md**

### "What does this field mean?"
→ Look it up in **DATA_DICTIONARY.md**

### "I need quick stats"
→ Check **QUICK_REFERENCE.md**

### "I want to use Python"
→ Use **bq_explorer.py**

### "I'm new here"
→ Start with **README.md**

### "What datasets exist?"
→ See **BQ_EXPLORATION_SUMMARY.md**

### "What was accomplished?"
→ Read **PROJECT_SUMMARY.md**

---

## 🔗 External Resources

### BigQuery
- [BigQuery Console](https://console.cloud.google.com/bigquery?project=jobs-data-linkedin)
- [Source Table](https://console.cloud.google.com/bigquery?project=jobs-data-linkedin&ws=!1m5!1m4!4m3!1sjobs-data-linkedin!2sjobs_data_ai!3sjobs_data_ai_cumulative_all)

### Documentation
- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [BigQuery Python Client](https://cloud.google.com/python/docs/reference/bigquery/latest)
- [Pandas Documentation](https://pandas.pydata.org/docs/)

---

## 📝 Document Relationships

```
README.md (Start Here)
    ├── QUICK_REFERENCE.md (Quick Facts)
    ├── SOURCE_TABLE_DOCUMENTATION.md (Table Overview)
    │   └── DATA_DICTIONARY.md (Field Details)
    ├── QUERY_EXAMPLES.md (SQL Queries)
    ├── BQ_EXPLORATION_SUMMARY.md (All Datasets)
    ├── PROJECT_SUMMARY.md (What We Built)
    └── bq_explorer.py (Python Toolkit)
        └── requirements.txt (Dependencies)
```

---

## 🔄 Maintenance

### When to Update

**Update SOURCE_TABLE_DOCUMENTATION.md when**:
- Table schema changes
- New columns added
- Data volume significantly changes
- Update frequency changes

**Update DATA_DICTIONARY.md when**:
- New fields added
- Field definitions change
- Value distributions change significantly

**Update QUERY_EXAMPLES.md when**:
- New common use cases emerge
- Query patterns change
- Performance optimizations discovered

**Update BQ_EXPLORATION_SUMMARY.md when**:
- New datasets added
- Dataset purposes change
- New views created

---

## 📞 Support

**Questions about the data?**  
→ Check DATA_DICTIONARY.md or SOURCE_TABLE_DOCUMENTATION.md

**Need help with queries?**  
→ See QUERY_EXAMPLES.md

**Want to contribute?**  
→ Contact: ashwin@mobiusengine.ai

**Found an issue?**  
→ Update the relevant documentation file

---

**Last Updated**: October 4, 2025  
**Version**: 1.0  
**Maintained By**: Data Engineering Team

