# BigQuery Dataset Exploration Summary
**Project**: `jobs-data-linkedin`  
**Date**: October 4, 2025  
**Explorer**: Augment Agent

---

## 📊 Overview

The BigQuery project contains **18 datasets** focused on job market analytics, particularly around AI/ML jobs, website analytics, and employment trends from major tech companies.

---

## 🗂️ Datasets by Creation Date

### Most Recent Datasets

| Dataset Name | Created | Location | Owner | Description |
|-------------|---------|----------|-------|-------------|
| **analytic_website_analytics** | Sept 28, 2025 | us-west1 | dataengineer2@mobiusengine.ai | Analytics layer with cleaned AI job data |
| **mobius_jobs_analytics** | June 1, 2025 | us-west1 | ashwin@mobiusengine.ai | Comprehensive AI jobs analytics with enriched data |
| **jobs_data_ai_clients** | May 19, 2025 | US | dataengineer@mobiusengine.ai | Client-specific AI job data |
| **delivery_metrics** | Dec 15, 2024 | US | ashwin@mobiusengine.ai | Delivery and performance metrics |

### Other Datasets
- `analytic_website_raw` - Raw job data views
- `analytic_website_reporting` - Reporting layer with aggregated metrics
- `analytics_website` - Website analytics
- `google_and_meta_jobs_data` - Specific data for Google and Meta jobs
- `jobs_data` - General jobs data
- `jobs_data_ai` - AI-specific jobs data
- `jobs_data_ai_dated` - Time-series AI jobs data
- `jobs_data_dated` - Time-series general jobs data
- `jobs_data_trackers` - Job tracking data
- `jobs_analysis_ananya` - Personal analysis workspace
- `dev_data` - Development/testing data
- `tracker_data` - Tracker information
- `mantics_jobs` - Mantics-related job data
- `aaghash_test` - Test dataset

---

## 🔍 Deep Dive: Most Recent Datasets

### 1. **analytic_website_analytics** (Sept 28, 2025)

**Total Records**: 52,888 jobs

#### Tables/Views:
- `jobs_ai_cleaned_vw` - Cleaned AI job listings
- `jobs_ai_enriched_vw` - Enriched with additional metadata
- `jobs_cleaned_vw` - General cleaned jobs
- `jobs_location_cleaned_vw` - Location-focused view
- `jobs_salary_cleaned_vw` - Salary-focused view

#### Schema Highlights (`jobs_ai_cleaned_vw`):
```
- unique_job_id (STRING)
- data_company (STRING)
- data_company_url (STRING)
- data_job_board (STRING)
- data_job_title (STRING)
- data_job_description (STRING)
- data_seniority_level (STRING)
- job_family (STRING)
- data_location_city/state/country (STRING)
- data_pay_range_min/max (FLOAT)
- data_pay_range_unit (STRING)
- data_num_applicants (INTEGER)
- data_posted (TIMESTAMP)
- created_at (TIMESTAMP)
- is_remote/hybrid/onsite (BOOLEAN)
- is_full_time/part_time/contract (BOOLEAN)
```

#### Sample Data:
| Company | Job Title | Seniority | Job Family | Location | Salary Range | Remote |
|---------|-----------|-----------|------------|----------|--------------|--------|
| Amazon | Tax Manager, Tax Controversy | NULL | Finance & Accounting | Vancouver, BC | $89K-$149K | No |
| Microsoft | Senior Data Scientist, AI Product Performance | NULL | Research, Applied, & Data Sciences | Vancouver, BC | $114K-$204K | Yes |
| Google | Software Engineer III, Core | NULL | Engineering & IT | San Francisco, CA | $141K-$202K | No |

#### Key Statistics:
- **Total Jobs**: 52,888
- **Date Range**: April 2025 - October 2025
- **Companies**: Google, Amazon, Microsoft, Meta, and many more
- **Job Families**: Engineering & IT, Finance & Accounting, Research & Data Sciences, etc.

---

### 2. **analytic_website_reporting** (Sept 28, 2025)

Reporting layer with pre-aggregated views for dashboards and analytics.

#### Key Views:

##### Monthly Trends (`jobs_ai_monthly_trends_RP10`):
| Month | Monthly Jobs | Cumulative Jobs |
|-------|--------------|-----------------|
| Apr 2025 | 3,830 | 3,830 |
| May 2025 | 12,344 | 16,174 |
| Jun 2025 | 11,532 | 27,706 |
| Jul 2025 | 10,550 | 38,256 |
| Aug 2025 | 8,839 | 47,095 |
| Sep 2025 | 4,803 | 51,898 |
| Oct 2025 | 790 | 52,688 |

##### Work Model Distribution (`jobs_ai_work_model_RP40`):
| Work Model | Job Count | Percentage |
|------------|-----------|------------|
| Onsite | 46,442 | 87.9% |
| Remote | 2,957 | 5.6% |
| Other | 2,587 | 4.9% |
| Hybrid | 316 | 0.6% |

##### Top Companies by Compensation (`jobs_compensation_RP40_vw`):
| Company | Total Jobs | Avg Salary | Remote Jobs |
|---------|------------|------------|-------------|
| Google | 20,581 | $224,691 | 1,240 |
| Amazon | 16,461 | $206,124 | 273 |
| Microsoft | 9,149 | $221,946 | 1,331 |
| Meta | 6,697 | $183,165 | 117 |

#### All Reporting Views:
- `jobs_ai_job_family_RP30` - Job family distribution
- `jobs_ai_monthly_trends_RP10` - Monthly hiring trends
- `jobs_ai_seniority_mix_RP20` - Seniority level distribution
- `jobs_ai_work_model_RP40` - Work model breakdown
- `jobs_compensation_RP40_vw` - Compensation analysis
- `jobs_cumulative_trends_RP10_vw` - Cumulative trends
- `jobs_daily_patterns_RP90_vw` - Daily posting patterns
- `jobs_geographic_distribution_RP80_vw` - Geographic analysis
- `jobs_growth_trends_RP30_vw` - Growth metrics
- `jobs_hiring_distribution_RP20_vw` - Hiring distribution
- `jobs_job_functions_RP60_vw` - Job function breakdown
- `jobs_salary_distribution_RP100_vw` - Salary ranges
- `jobs_seniority_mix_RP50_vw` - Seniority analysis
- `jobs_work_model_RP70_vw` - Work model details

---

### 3. **mobius_jobs_analytics** (June 1, 2025)

**Total Records**: 10,166 AI jobs (4-week window)

#### Tables/Views:
- `ai_jobs_4w_cleaned_salary` - Cleaned salary data
- `ai_jobs_4w_enriched` - Enriched with 70+ features
- `ai_jobs_4w_enriched_grouped` - Grouped analysis
- `ai_jobs_4w_strict` - Strict AI job filtering
- `ai_jobs_4w_strict_with_salary` - Strict filtering with salary
- `ai_jobs_4w_titles_strict` - Title-based filtering
- `ai_jobs_by_role_group` - Role group analysis
- `ai_jobs_sunburst` - Hierarchical visualization data
- `ai_jobs_sunburst_by_company` - Company-based sunburst
- `high_salary_job_counts_by_company` - High salary analysis
- `high_salary_us_jobs_deduped` - Deduplicated high salary jobs
- `top_50_ai_employers` - Top AI employers
- `us_city_job_counts` - City-level job counts

#### Schema Highlights (`ai_jobs_4w_enriched`):
**70+ enriched features including:**
- Core job data: `data_job_id`, `data_company`, `data_job_title`, `data_job_description`
- Location: `data_location_city`, `data_location_state`, `data_location_country`
- Compensation: `data_pay_range_min`, `data_pay_range_max`, `max_salary`
- Work model: `is_remote`, `is_hybrid`, `is_onsite`, `is_remote_friendly`
- Employment type: `is_full_time`, `is_part_time`, `is_contract`, `is_internship`
- Seniority: `is_entry_level`, `is_senior_level`, `is_director_level`, `is_executive`, `is_managerial`
- Job categories: `is_engineering`, `is_data_related`, `is_technical`, `is_non_technical`
- Functional areas: `is_sales`, `is_marketing`, `is_product`, `is_operations`, `is_hr_related`, `is_support`, `is_program_management`
- Company types: `is_big_tech`, `is_startup`, `is_enterprise`, `is_consulting_firm`, `is_agency`
- Location flags: `is_us_based`, `is_international`, `is_nyc_area`, `is_sf_bay_area`, `is_chicago_area`
- Other: `is_visa_friendly`, `is_relocation_offered`, `is_comp_disclosed`, `job_family`, `industry`, `canonical_title`

#### Sample Data:
| Company | Job Title | Seniority | Location | Salary Range | Remote |
|---------|-----------|-----------|----------|--------------|--------|
| AWS | Delivery Consultant- GenAI/ML | NULL | New York City, NY | $118K-$204K | No |
| AWS | Sr. Machine Learning Engineer, GenAI Innovation Center | NULL | Arlington, TX | $151K-$262K | No |
| Google | Software Engineer III, AI/ML Recommendations | Not Applicable | Mountain View, CA | N/A | No |
| Amazon | Sr. Applied Scientist, FAR (Frontier AI & Robotics) | NULL | San Francisco, CA | $150K-$260K | No |
| Gartner | Lead AI Engineer | NULL | Stamford, CT | $116K-$163K | Yes |

#### Top 15 AI Employers:
| Company | Total AI Jobs |
|---------|---------------|
| Amazon Web Services (AWS) | 1,042 |
| Amazon.com, Inc. | 353 |
| Google | 323 |
| Microsoft | 139 |
| Apple Inc. | 93 |
| Meta | 86 |
| Datadog | 86 |
| Speechify | 83 |
| Oracle | 72 |
| PwC | 66 |
| SCIEX | 49 |
| NVIDIA | 46 |
| Deloitte | 36 |
| Launch Potato | 35 |
| Optum | 34 |

---

## 📈 Key Insights

### Job Market Trends
1. **Peak Hiring Period**: May-July 2025 saw the highest job posting volumes
2. **Current Trend**: Declining from ~12K/month (May) to ~790 in early October
3. **Work Model**: Strong preference for onsite (88%), with remote at only 6%
4. **Top Employers**: AWS dominates AI hiring with 1,042 positions

### Compensation Insights
- **Google**: Highest average salary at $224,691
- **Microsoft**: $221,946 average
- **Amazon**: $206,124 average
- **Meta**: $183,165 average

### Geographic Distribution
- Major tech hubs: San Francisco, New York City, Seattle, Mountain View
- International presence: Toronto, Vancouver, Winnipeg (Canada)
- Remote opportunities: ~3,000 jobs across all datasets

### Job Categories
- **Engineering & IT**: Dominant category
- **Research, Applied, & Data Sciences**: Strong AI/ML focus
- **Finance & Accounting**: Supporting roles
- **Other/Specialized**: Niche positions

---

## 🔧 Data Architecture

### Layer Structure:
1. **Raw Layer** (`analytic_website_raw`): Source data ingestion
2. **Analytics Layer** (`analytic_website_analytics`): Cleaned and enriched data
3. **Reporting Layer** (`analytic_website_reporting`): Pre-aggregated views for dashboards
4. **Specialized Analytics** (`mobius_jobs_analytics`): Deep-dive AI job analysis

### Data Quality Features:
- Deduplication (unique_job_id)
- Salary normalization and cleaning
- Location standardization
- Boolean flags for easy filtering
- Enrichment with 70+ derived features
- Time-series tracking with created_at and data_posted timestamps

---

## 🎯 Recommended Next Steps

1. **Trend Analysis**: Investigate the decline in job postings from May to October
2. **Salary Analysis**: Deep dive into compensation by role, seniority, and location
3. **Company Analysis**: Compare hiring patterns across big tech companies
4. **Skills Analysis**: Extract and analyze required skills from job descriptions
5. **Geographic Expansion**: Analyze international vs US-based opportunities
6. **Remote Work Trends**: Track evolution of remote/hybrid opportunities
7. **Dashboard Creation**: Build executive dashboards using the reporting views
8. **Predictive Modeling**: Forecast future hiring trends based on historical data

---

## 📝 Notes

- All views are read-only (VIEW type, no tables)
- Data appears to be sourced from LinkedIn and other job boards
- Time travel enabled (168 hours) for all datasets
- Multiple data engineers contributing (ashwin@, dataengineer@, dataengineer2@)
- Naming convention: RP## likely indicates "Report" with priority/sequence numbers

