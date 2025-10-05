# 🤖 AI/ML Analytics Views - Complete Reference

**Dataset**: `jobs-data-linkedin.mobius_analytics_engine`  
**Created**: 2025-10-05  
**Total AI/ML Jobs**: 21,359 (with salary data $100K-$2M)

---

## 📊 Views Created

### **Base Views** (2)

#### 1. `software_engineering_jobs_detailed`
**Purpose**: All software engineering jobs (AI/ML, SWE, Data Science, DevOps, etc.) with role categorization  
**Rows**: ~371,000 jobs  
**Key Fields**:
- `role_category`: AI/ML Engineer, Software Engineer, Data Scientist, DevOps/SRE, etc.
- `title_level`: Junior, Mid-Level, Senior, Staff/Principal/Lead, Manager/Director
- All original job fields + flags

**Use Cases**:
- Compare AI/ML vs traditional SWE salaries
- Analyze software engineering market trends
- Track hiring patterns across all engineering roles

**Sample Query**:
```sql
SELECT role_category, COUNT(*) as jobs, ROUND(AVG(max_salary), 0) as avg_salary
FROM `jobs-data-linkedin.mobius_analytics_engine.software_engineering_jobs_detailed`
GROUP BY role_category
ORDER BY jobs DESC
```

---

#### 2. `ai_ml_jobs_with_salary`
**Purpose**: Dedicated AI/ML jobs dataset with subcategory classification  
**Rows**: 21,359 jobs  
**Key Fields**:
- `ai_ml_subcategory`: ML Engineer, LLM/GenAI Engineer, AI Engineer, Deep Learning Engineer, MLOps Engineer, AI/ML Research, Other AI/ML
- `title_level`: Junior, Mid-Level, Senior, Staff/Principal/Lead, Manager/Director
- `data_job_description`: Full job description for skills analysis
- All original job fields + flags

**Use Cases**:
- Deep dive into AI/ML job market
- Analyze specific AI/ML subcategories
- Extract skills from job descriptions
- Build "How to Break into AI/ML" data products

**Sample Query**:
```sql
SELECT ai_ml_subcategory, COUNT(*) as jobs, ROUND(AVG(max_salary), 0) as avg_salary
FROM `jobs-data-linkedin.mobius_analytics_engine.ai_ml_jobs_with_salary`
GROUP BY ai_ml_subcategory
ORDER BY jobs DESC
```

---

### **Comparison Views** (2)

#### 3. `monthly_ai_vs_swe_salary_trends`
**Purpose**: Monthly time series comparing AI/ML vs Software Engineer vs Data Scientist  
**Rows**: ~42 (7 months × 3 role categories × 2 for partial data)  
**Key Fields**:
- `month`: Month of job posting
- `role_category`: AI/ML Engineer, Software Engineer, Data Scientist
- `job_count`, `avg_salary`, `median_salary`
- `unique_companies`, `remote_jobs`, `big_tech_jobs`

**Use Cases**:
- Track AI premium over time
- Detect salary compression/expansion
- Analyze volume trends (AI/ML growth vs SWE)
- Dashboard: "Is AI Impacting SWE Salaries?"

**Sample Query**:
```sql
SELECT 
    month,
    MAX(CASE WHEN role_category = 'AI/ML Engineer' THEN avg_salary END) as ai_salary,
    MAX(CASE WHEN role_category = 'Software Engineer' THEN avg_salary END) as swe_salary,
    MAX(CASE WHEN role_category = 'AI/ML Engineer' THEN avg_salary END) - 
      MAX(CASE WHEN role_category = 'Software Engineer' THEN avg_salary END) as premium
FROM `jobs-data-linkedin.mobius_analytics_engine.monthly_ai_vs_swe_salary_trends`
GROUP BY month
ORDER BY month DESC
```

---

#### 4. `ai_vs_swe_by_seniority`
**Purpose**: Compare AI/ML vs SWE salaries by seniority level  
**Rows**: ~50 (role × title_level × seniority combinations)  
**Key Fields**:
- `role_category`: AI/ML Engineer, Software Engineer, Data Scientist
- `title_level`: Junior, Mid-Level, Senior, Staff/Principal/Lead
- `data_seniority_level`: Entry level, Associate, Mid-Senior level, Director, Executive
- `job_count`, `avg_salary`, `median_salary`, `min_salary`, `max_salary`

**Use Cases**:
- Salary benchmarking by seniority
- Career progression analysis
- Detect compression between levels
- Dashboard: "AI/ML vs SWE Career Ladder"

**Sample Query**:
```sql
SELECT role_category, title_level, avg_salary
FROM `jobs-data-linkedin.mobius_analytics_engine.ai_vs_swe_by_seniority`
WHERE title_level IN ('Mid-Level', 'Senior', 'Staff/Principal/Lead')
ORDER BY role_category, title_level
```

---

#### 5. `monthly_swe_trends_top_companies`
**Purpose**: Monthly hiring trends for top companies (SWE + AI/ML)  
**Rows**: ~2,000 (companies × months × role categories)  
**Key Fields**:
- `month`: Month of job posting
- `data_company`: Company name
- `role_category`: AI/ML Engineer, Software Engineer
- `job_count`, `avg_salary`, `median_salary`
- `remote_jobs`, `is_big_tech_flag`

**Use Cases**:
- Track company-specific hiring trends
- Identify aggressive hirers vs declining hirers
- Compare Big Tech vs startups
- Dashboard: "Top 20 Companies Hiring SWE/AI"

**Sample Query**:
```sql
SELECT data_company, SUM(job_count) as total_jobs, ROUND(AVG(avg_salary), 0) as avg_salary
FROM `jobs-data-linkedin.mobius_analytics_engine.monthly_swe_trends_top_companies`
WHERE role_category = 'Software Engineer' AND month >= '2025-04-01'
GROUP BY data_company
ORDER BY total_jobs DESC
LIMIT 20
```

---

### **AI/ML Deep Dive Views** (4)

#### 6. `ai_ml_job_titles_analysis`
**Purpose**: Breakdown of specific AI/ML job titles with salary data  
**Rows**: ~500 (unique job titles with 5+ postings)  
**Key Fields**:
- `data_job_title`: Exact job title
- `ai_ml_subcategory`: ML Engineer, LLM/GenAI, etc.
- `title_level`: Junior, Mid-Level, Senior, etc.
- `job_count`, `avg_salary`, `median_salary`
- `unique_companies`, `remote_jobs`

**Use Cases**:
- Identify most common AI/ML job titles
- Salary benchmarking by exact title
- Resume optimization (use exact titles)
- Dashboard: "Top 50 AI/ML Job Titles"

**Sample Query**:
```sql
SELECT data_job_title, job_count, avg_salary, remote_jobs
FROM `jobs-data-linkedin.mobius_analytics_engine.ai_ml_job_titles_analysis`
WHERE ai_ml_subcategory = 'ML Engineer'
ORDER BY job_count DESC
LIMIT 20
```

---

#### 7. `ai_ml_subcategory_analysis`
**Purpose**: AI/ML subcategory breakdown by seniority level  
**Rows**: ~50 (subcategories × title levels)  
**Key Fields**:
- `ai_ml_subcategory`: ML Engineer, LLM/GenAI Engineer, AI Engineer, etc.
- `title_level`: Junior, Mid-Level, Senior, Staff/Principal/Lead
- `job_count`, `avg_salary`, `median_salary`, `p25_salary`, `p75_salary`
- `unique_companies`, `remote_jobs`, `big_tech_jobs`

**Use Cases**:
- Compare subcategories (ML vs LLM vs MLOps)
- Salary progression within subcategory
- Identify highest-paying specializations
- Dashboard: "AI/ML Subcategory Comparison"

**Sample Query**:
```sql
SELECT ai_ml_subcategory, SUM(job_count) as total_jobs, ROUND(AVG(avg_salary), 0) as avg_salary
FROM `jobs-data-linkedin.mobius_analytics_engine.ai_ml_subcategory_analysis`
GROUP BY ai_ml_subcategory
ORDER BY total_jobs DESC
```

---

#### 8. `ai_ml_top_companies`
**Purpose**: Companies hiring AI/ML engineers by subcategory  
**Rows**: ~1,000 (companies × subcategories with 5+ jobs)  
**Key Fields**:
- `data_company`: Company name
- `ai_ml_subcategory`: ML Engineer, LLM/GenAI, etc.
- `job_count`, `avg_salary`
- `remote_jobs`

**Use Cases**:
- Identify top AI/ML hirers
- Company-specific AI/ML focus (ML vs LLM vs MLOps)
- Target companies for job search
- Dashboard: "Top 50 AI/ML Hiring Companies"

**Sample Query**:
```sql
SELECT data_company, SUM(job_count) as total_ai_ml_jobs, ROUND(AVG(avg_salary), 0) as avg_salary
FROM `jobs-data-linkedin.mobius_analytics_engine.ai_ml_top_companies`
GROUP BY data_company
ORDER BY total_ai_ml_jobs DESC
LIMIT 20
```

---

#### 9. `monthly_ai_ml_trends_by_subcategory`
**Purpose**: Monthly time series for each AI/ML subcategory  
**Rows**: ~200 (7 months × 7 subcategories × partial data)  
**Key Fields**:
- `month`: Month of job posting
- `ai_ml_subcategory`: ML Engineer, LLM/GenAI, etc.
- `job_count`, `avg_salary`
- `unique_companies`, `remote_jobs`

**Use Cases**:
- Track growth of LLM/GenAI vs traditional ML
- Detect salary trends by subcategory
- Identify fastest-growing specializations
- Dashboard: "AI/ML Subcategory Trends Over Time"

**Sample Query**:
```sql
SELECT month, ai_ml_subcategory, job_count, avg_salary
FROM `jobs-data-linkedin.mobius_analytics_engine.monthly_ai_ml_trends_by_subcategory`
WHERE month >= '2025-04-01'
ORDER BY month DESC, job_count DESC
```

---

#### 10. `ai_ml_skills_keywords`
**Purpose**: Skills extracted from AI/ML job descriptions  
**Rows**: ~50 (subcategories × title levels)  
**Key Fields**:
- `ai_ml_subcategory`, `title_level`
- Programming: `mentions_python`, `mentions_java`, `mentions_cpp`, `mentions_scala`, `mentions_r`
- ML Frameworks: `mentions_pytorch`, `mentions_tensorflow`, `mentions_sklearn`, `mentions_keras`
- LLM Tools: `mentions_gpt`, `mentions_langchain`, `mentions_llama`, `mentions_huggingface`
- Cloud: `mentions_aws`, `mentions_azure`, `mentions_gcp`
- MLOps: `mentions_kubernetes`, `mentions_docker`, `mentions_mlflow`, `mentions_kubeflow`
- Data: `mentions_spark`, `mentions_sql`, `mentions_airflow`
- Concepts: `mentions_deep_learning`, `mentions_nlp`, `mentions_cv`, `mentions_rl`
- `total_jobs`, `avg_salary`

**Use Cases**:
- Identify most in-demand skills by role
- Compare TensorFlow vs PyTorch adoption
- Track emerging skills (LangChain, LLMs)
- Resume optimization (keyword matching)
- Dashboard: "Top Skills for AI/ML Jobs"

**Sample Query**:
```sql
SELECT 
    ai_ml_subcategory,
    ROUND(mentions_python * 100.0 / total_jobs, 1) as python_pct,
    ROUND(mentions_pytorch * 100.0 / total_jobs, 1) as pytorch_pct,
    ROUND(mentions_tensorflow * 100.0 / total_jobs, 1) as tensorflow_pct,
    ROUND(mentions_aws * 100.0 / total_jobs, 1) as aws_pct
FROM `jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords`
WHERE title_level = 'Mid-Level'
ORDER BY total_jobs DESC
```

---

## 🎯 Use Case Matrix

| Use Case | Primary View | Secondary Views |
|----------|--------------|-----------------|
| **"Is AI compressing SWE salaries?"** | `monthly_ai_vs_swe_salary_trends` | `ai_vs_swe_by_seniority` |
| **"Which companies are hiring most?"** | `monthly_swe_trends_top_companies` | `ai_ml_top_companies` |
| **"What AI/ML job should I target?"** | `ai_ml_subcategory_analysis` | `ai_ml_job_titles_analysis` |
| **"What skills do I need?"** | `ai_ml_skills_keywords` | `ai_ml_job_titles_analysis` |
| **"Is LLM/GenAI growing?"** | `monthly_ai_ml_trends_by_subcategory` | `ai_ml_subcategory_analysis` |
| **"What's the AI premium?"** | `monthly_ai_vs_swe_salary_trends` | `ai_vs_swe_by_seniority` |
| **"Career progression in AI/ML"** | `ai_vs_swe_by_seniority` | `ai_ml_subcategory_analysis` |
| **"TensorFlow vs PyTorch?"** | `ai_ml_skills_keywords` | - |
| **"Top paying AI/ML companies?"** | `ai_ml_top_companies` | `monthly_swe_trends_top_companies` |
| **"Remote AI/ML jobs?"** | `ai_ml_job_titles_analysis` | `ai_ml_subcategory_analysis` |

---

## 📈 Key Insights from Analysis

### **1. AI Impact on SWE Salaries**
- ✅ **No compression** - SWE salaries stable ($200K-$206K)
- 📉 **AI premium shrinking** - From 15.2% → 10.3% (Apr-Sep 2025)
- 🚀 **AI volume exploding** - 460% growth in AI/ML postings
- 💡 **Insight**: AI/ML salaries normalizing, not compressing SWE

**View**: `monthly_ai_vs_swe_salary_trends`

---

### **2. AI/ML Job Market**
- 🏆 **ML Engineer** - 41% of AI/ML jobs ($224K avg)
- 🔥 **LLM/GenAI** - Fastest growing (460% Apr-Aug)
- 💰 **Research** - Highest paid ($238K avg)
- 📊 **MLOps** - Underserved (1.1% of jobs)

**View**: `ai_ml_subcategory_analysis`

---

### **3. Top Companies**
- **Highest Volume**: AWS (2,210+ jobs), Apple (696), Google (660)
- **Highest Paying**: NVIDIA ($317K), TikTok ($284K), Apple ($287K)
- **Declining**: Meta (-80% Jun-Sep), Apple (-96% May-Sep)
- **Growing**: Microsoft (+874% Apr-Sep), Oracle (+193%)

**View**: `monthly_swe_trends_top_companies`, `ai_ml_top_companies`

---

### **4. Skills Demand**
- 🔴 **Critical**: Python (74.5%), TensorFlow (87.7%), AWS (52-62%)
- 🟠 **High**: PyTorch (56.3%), Kubernetes (15% overall, 70% MLOps)
- 🟡 **Medium**: GPT/OpenAI (7-31% depending on role)
- 💡 **Insight**: TensorFlow > PyTorch for production, PyTorch > TensorFlow for research

**View**: `ai_ml_skills_keywords`

---

### **5. Career Paths**
- **Most Jobs**: ML Engineer (8,764 jobs)
- **Fastest Growing**: LLM/GenAI Engineer (460% growth)
- **Highest Paid**: Deep Learning Engineer ($243K), AI/ML Research ($238K)
- **Best Remote**: Principal ML Engineer (65% remote)

**Views**: `ai_ml_job_titles_analysis`, `ai_ml_subcategory_analysis`

---

## 🚀 Dashboard Ideas

### **Dashboard 1: "AI vs SWE Salary Tracker"**
**Views**: `monthly_ai_vs_swe_salary_trends`, `ai_vs_swe_by_seniority`  
**Visualizations**:
- Line chart: AI premium over time
- Stacked area: Job volume (AI vs SWE)
- Waterfall: Salary progression by seniority

---

### **Dashboard 2: "AI/ML Job Seeker Guide"**
**Views**: `ai_ml_subcategory_analysis`, `ai_ml_job_titles_analysis`, `ai_ml_skills_keywords`  
**Visualizations**:
- Bar chart: Jobs by subcategory
- Table: Top 50 job titles with salaries
- Heatmap: Skills demand by role

---

### **Dashboard 3: "Company Hiring Trends"**
**Views**: `monthly_swe_trends_top_companies`, `ai_ml_top_companies`  
**Visualizations**:
- Line chart: Top 10 companies hiring over time
- Bar chart: Total jobs by company
- Scatter: Salary vs volume by company

---

### **Dashboard 4: "Skills Demand Tracker"**
**Views**: `ai_ml_skills_keywords`  
**Visualizations**:
- Bar chart: Top 20 skills by mention %
- Comparison: TensorFlow vs PyTorch by role
- Trend: Emerging skills (LangChain, LLMs)

---

## 📚 Documentation Files

1. **AI_ML_JOBS_ANALYSIS.md** - Complete AI/ML job market analysis
2. **AI_ML_SKILLS_DEMAND_ANALYSIS.md** - Skills breakdown and learning roadmaps
3. **AI_ML_VIEWS_SUMMARY.md** - This file (view reference)

---

## 🎯 Next Steps

### **For Data Analysis:**
1. Query views directly in BigQuery
2. Export to CSV for Excel/Tableau
3. Connect to BI tools (Looker, Metabase)
4. Build custom dashboards

### **For Job Seekers:**
1. Identify target role using `ai_ml_subcategory_analysis`
2. Find exact job titles using `ai_ml_job_titles_analysis`
3. Learn required skills using `ai_ml_skills_keywords`
4. Target companies using `ai_ml_top_companies`

### **For Recruiters:**
1. Benchmark salaries using comparison views
2. Identify talent pools by skills
3. Track competitor hiring patterns
4. Optimize job descriptions with top keywords

---

**All views are in**: `jobs-data-linkedin.mobius_analytics_engine`  
**Base dataset**: 21,359 AI/ML jobs with salary data ($100K-$2M)  
**Time period**: April - September 2025  
**Last updated**: 2025-10-05

