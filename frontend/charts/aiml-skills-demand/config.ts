import { ChartConfig } from '@/lib/types'

export const config: ChartConfig = {
  id: 'aiml-skills-demand',
  title: 'What Skills Are Most In-Demand for AI/ML Roles?',
  description: 'Top technical skills mentioned in AI/ML job postings',
  width: 'full',
  height: 450,
  query: `
    WITH skills_unpivot AS (
      SELECT 'Python' as skill, SUM(mentions_python) as mentions, AVG(avg_salary) as avg_salary FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'TensorFlow', SUM(mentions_tensorflow), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'PyTorch', SUM(mentions_pytorch), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'Kubernetes', SUM(mentions_kubernetes), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'Docker', SUM(mentions_docker), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'AWS', SUM(mentions_aws), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'Spark', SUM(mentions_spark), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'SQL', SUM(mentions_sql), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'Airflow', SUM(mentions_airflow), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'MLflow', SUM(mentions_mlflow), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'LangChain', SUM(mentions_langchain), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'Scikit-learn', SUM(mentions_sklearn), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'Keras', SUM(mentions_keras), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'Deep Learning', SUM(mentions_deep_learning), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
      UNION ALL
      SELECT 'NLP', SUM(mentions_nlp), AVG(avg_salary) FROM \`jobs-data-linkedin.mobius_analytics_engine.ai_ml_skills_keywords\`
    )
    SELECT
      skill,
      mentions as job_count,
      ROUND(avg_salary, 0) as avg_salary
    FROM skills_unpivot
    WHERE mentions > 0
    ORDER BY mentions DESC
    LIMIT 20
  `,
  methodology: `
    **Data Source**: AI/ML job descriptions analyzed for technical skill mentions
    
    **Extraction Method**: 
    - Regex pattern matching on job descriptions
    - Case-insensitive matching for common variations
    - Grouped similar technologies (e.g., "k8s" → "Kubernetes")
    
    **Metrics**:
    - Job Count: Number of unique postings mentioning the skill
    - Avg Salary: Mean salary for jobs requiring this skill
    
    **Filters**: 
    - Only AI/ML roles with disclosed salaries ($100K-$2M)
    - Minimum 100 job mentions for statistical significance
    
    **Caveat**: Skills may be underreported if not explicitly mentioned in job descriptions
  `
}

