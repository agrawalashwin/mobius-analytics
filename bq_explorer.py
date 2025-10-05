#!/usr/bin/env python3
"""
BigQuery Explorer for jobs-data-linkedin project
Provides utilities to explore and analyze job market data
"""

from google.cloud import bigquery
from typing import List, Dict, Any, Optional
import pandas as pd
from datetime import datetime

class JobsDataExplorer:
    """Explorer class for jobs-data-linkedin BigQuery datasets"""
    
    def __init__(self, project_id: str = "jobs-data-linkedin"):
        """Initialize the explorer with BigQuery client"""
        self.project_id = project_id
        self.client = bigquery.Client(project=project_id)
        
    def list_datasets(self) -> pd.DataFrame:
        """List all datasets in the project with metadata"""
        datasets = list(self.client.list_datasets())
        
        dataset_info = []
        for dataset in datasets:
            dataset_ref = self.client.get_dataset(dataset.dataset_id)
            dataset_info.append({
                'dataset_id': dataset.dataset_id,
                'location': dataset_ref.location,
                'created': datetime.fromtimestamp(int(dataset_ref.created) / 1000),
                'modified': datetime.fromtimestamp(int(dataset_ref.modified) / 1000),
            })
        
        df = pd.DataFrame(dataset_info)
        return df.sort_values('created', ascending=False)
    
    def list_tables(self, dataset_id: str) -> pd.DataFrame:
        """List all tables/views in a dataset"""
        tables = list(self.client.list_tables(dataset_id))
        
        table_info = []
        for table in tables:
            table_ref = self.client.get_table(f"{self.project_id}.{dataset_id}.{table.table_id}")
            table_info.append({
                'table_id': table.table_id,
                'type': table.table_type,
                'num_rows': table_ref.num_rows if hasattr(table_ref, 'num_rows') else None,
                'size_mb': round(table_ref.num_bytes / (1024 * 1024), 2) if hasattr(table_ref, 'num_bytes') and table_ref.num_bytes else None,
                'created': table_ref.created,
                'modified': table_ref.modified,
            })
        
        return pd.DataFrame(table_info)
    
    def get_schema(self, dataset_id: str, table_id: str) -> List[Dict[str, str]]:
        """Get schema for a specific table"""
        table_ref = self.client.get_table(f"{self.project_id}.{dataset_id}.{table_id}")
        
        schema = []
        for field in table_ref.schema:
            schema.append({
                'name': field.name,
                'type': field.field_type,
                'mode': field.mode,
                'description': field.description or ''
            })
        
        return schema
    
    def query(self, sql: str, max_results: int = 1000) -> pd.DataFrame:
        """Execute a SQL query and return results as DataFrame"""
        query_job = self.client.query(sql)
        results = query_job.result(max_results=max_results)
        return results.to_dataframe()
    
    def get_sample_data(self, dataset_id: str, table_id: str, limit: int = 10) -> pd.DataFrame:
        """Get sample data from a table"""
        sql = f"""
        SELECT *
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        LIMIT {limit}
        """
        return self.query(sql)
    
    def get_row_count(self, dataset_id: str, table_id: str) -> int:
        """Get total row count for a table"""
        sql = f"""
        SELECT COUNT(*) as count
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        """
        result = self.query(sql)
        return result['count'].iloc[0]
    
    # Specialized queries for jobs data
    
    def get_top_companies(self, dataset_id: str = "analytic_website_analytics", 
                         table_id: str = "jobs_ai_cleaned_vw", 
                         limit: int = 20) -> pd.DataFrame:
        """Get top companies by job count"""
        sql = f"""
        SELECT 
            data_company,
            COUNT(*) as job_count,
            COUNT(DISTINCT data_job_title) as unique_titles,
            AVG(data_pay_range_min) as avg_min_salary,
            AVG(data_pay_range_max) as avg_max_salary,
            SUM(CASE WHEN is_remote THEN 1 ELSE 0 END) as remote_jobs
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        WHERE data_company IS NOT NULL
        GROUP BY data_company
        ORDER BY job_count DESC
        LIMIT {limit}
        """
        return self.query(sql)
    
    def get_salary_stats_by_role(self, dataset_id: str = "analytic_website_analytics",
                                 table_id: str = "jobs_ai_cleaned_vw") -> pd.DataFrame:
        """Get salary statistics by job family"""
        sql = f"""
        SELECT 
            job_family,
            COUNT(*) as job_count,
            AVG(data_pay_range_min) as avg_min_salary,
            AVG(data_pay_range_max) as avg_max_salary,
            MIN(data_pay_range_min) as min_salary,
            MAX(data_pay_range_max) as max_salary
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        WHERE data_pay_range_min IS NOT NULL 
          AND data_pay_range_max IS NOT NULL
          AND job_family IS NOT NULL
        GROUP BY job_family
        ORDER BY avg_max_salary DESC
        """
        return self.query(sql)
    
    def get_location_distribution(self, dataset_id: str = "analytic_website_analytics",
                                  table_id: str = "jobs_ai_cleaned_vw",
                                  limit: int = 20) -> pd.DataFrame:
        """Get job distribution by location"""
        sql = f"""
        SELECT 
            data_location_city,
            data_location_state,
            data_location_country,
            COUNT(*) as job_count,
            AVG(data_pay_range_max) as avg_max_salary,
            SUM(CASE WHEN is_remote THEN 1 ELSE 0 END) as remote_jobs
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        WHERE data_location_city IS NOT NULL
        GROUP BY data_location_city, data_location_state, data_location_country
        ORDER BY job_count DESC
        LIMIT {limit}
        """
        return self.query(sql)
    
    def get_monthly_trends(self, dataset_id: str = "analytic_website_analytics",
                          table_id: str = "jobs_ai_cleaned_vw") -> pd.DataFrame:
        """Get monthly job posting trends"""
        sql = f"""
        SELECT 
            DATE_TRUNC(data_posted, MONTH) as month,
            COUNT(*) as job_count,
            COUNT(DISTINCT data_company) as unique_companies,
            AVG(data_pay_range_max) as avg_max_salary,
            SUM(CASE WHEN is_remote THEN 1 ELSE 0 END) as remote_jobs
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        WHERE data_posted IS NOT NULL
        GROUP BY month
        ORDER BY month
        """
        return self.query(sql)
    
    def search_jobs(self, keyword: str, 
                   dataset_id: str = "analytic_website_analytics",
                   table_id: str = "jobs_ai_cleaned_vw",
                   limit: int = 50) -> pd.DataFrame:
        """Search for jobs by keyword in title or description"""
        sql = f"""
        SELECT 
            unique_job_id,
            data_company,
            data_job_title,
            data_seniority_level,
            job_family,
            data_location_city,
            data_location_state,
            data_pay_range_min,
            data_pay_range_max,
            is_remote,
            data_posted
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        WHERE LOWER(data_job_title) LIKE LOWER('%{keyword}%')
           OR LOWER(data_job_description) LIKE LOWER('%{keyword}%')
        ORDER BY data_posted DESC
        LIMIT {limit}
        """
        return self.query(sql)
    
    def get_work_model_distribution(self, dataset_id: str = "analytic_website_analytics",
                                   table_id: str = "jobs_ai_cleaned_vw") -> pd.DataFrame:
        """Get distribution of work models (remote/hybrid/onsite)"""
        sql = f"""
        SELECT 
            CASE 
                WHEN is_remote THEN 'Remote'
                WHEN is_hybrid THEN 'Hybrid'
                WHEN is_onsite THEN 'Onsite'
                ELSE 'Unknown'
            END as work_model,
            COUNT(*) as job_count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM `{self.project_id}.{dataset_id}.{table_id}`
        GROUP BY work_model
        ORDER BY job_count DESC
        """
        return self.query(sql)


def main():
    """Example usage of the JobsDataExplorer"""
    explorer = JobsDataExplorer()
    
    print("=" * 80)
    print("BigQuery Jobs Data Explorer")
    print("=" * 80)
    
    # List all datasets
    print("\n📁 Available Datasets:")
    print("-" * 80)
    datasets = explorer.list_datasets()
    print(datasets.to_string(index=False))
    
    # Explore the most recent dataset
    print("\n\n📊 Exploring: analytic_website_analytics")
    print("-" * 80)
    
    # Get top companies
    print("\n🏢 Top 10 Companies by Job Count:")
    top_companies = explorer.get_top_companies(limit=10)
    print(top_companies.to_string(index=False))
    
    # Get salary stats by role
    print("\n\n💰 Salary Statistics by Job Family:")
    salary_stats = explorer.get_salary_stats_by_role()
    print(salary_stats.to_string(index=False))
    
    # Get location distribution
    print("\n\n📍 Top 10 Locations by Job Count:")
    locations = explorer.get_location_distribution(limit=10)
    print(locations.to_string(index=False))
    
    # Get work model distribution
    print("\n\n🏠 Work Model Distribution:")
    work_models = explorer.get_work_model_distribution()
    print(work_models.to_string(index=False))
    
    # Get monthly trends
    print("\n\n📈 Monthly Job Posting Trends:")
    trends = explorer.get_monthly_trends()
    print(trends.to_string(index=False))
    
    print("\n" + "=" * 80)
    print("Exploration Complete!")
    print("=" * 80)


if __name__ == "__main__":
    main()

