import { NextRequest, NextResponse } from 'next/server'
import { BigQuery } from '@google-cloud/bigquery'

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID || 'jobs-data-linkedin',
})

export async function POST(request: NextRequest) {
  try {
    const { query, params } = await request.json()
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Executing BigQuery:', query)
    
    // Execute query
    const [job] = await bigquery.createQueryJob({
      query,
      params,
      location: 'us-west1',
    })
    
    console.log(`⏳ Job ${job.id} started...`)
    
    // Wait for query to complete
    const [rows] = await job.getQueryResults()
    
    console.log(`✅ Query returned ${rows.length} rows`)
    
    return NextResponse.json({
      data: rows,
      totalRows: rows.length,
      cached: false,
    })
  } catch (error: any) {
    console.error('❌ BigQuery error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to execute query',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'BigQuery API endpoint',
    projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
  })
}

