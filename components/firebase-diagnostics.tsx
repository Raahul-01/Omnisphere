"use client"

import { useState, useEffect } from 'react'
import { runAllDiagnostics, type DebugResult } from '@/lib/firebase-debug'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Database, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface DiagnosticDisplay {
  test: string
  status: 'success' | 'error' | 'warning'
  message: string
  count?: number
  data?: any
}

export function FirebaseDiagnostics() {
  const [results, setResults] = useState<DiagnosticDisplay[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)

    try {
      const diagnostics = await runAllDiagnostics()
      const displayResults: DiagnosticDisplay[] = []

      // Connection test
      displayResults.push({
        test: 'Firebase Connection',
        status: diagnostics.connection.success ? 'success' : 'error',
        message: diagnostics.connection.message,
        data: diagnostics.connection.data
      })

      // Total documents
      displayResults.push({
        test: 'Total Documents',
        status: diagnostics.totalDocs.success ? 'success' : 'error',
        message: diagnostics.totalDocs.message,
        count: diagnostics.totalDocs.data?.totalCount,
        data: diagnostics.totalDocs.data
      })

      // Time ordering
      displayResults.push({
        test: 'Time-Ordered Query',
        status: diagnostics.timeOrdering.success ? 'success' : 'error',
        message: diagnostics.timeOrdering.message,
        data: diagnostics.timeOrdering.data
      })

      // Feature queries
      diagnostics.features.forEach((feature, index) => {
        displayResults.push({
          test: `Feature Query ${index + 1}`,
          status: feature.success ? 'success' : 'error',
          message: feature.message,
          count: feature.data?.count,
          data: feature.data
        })
      })

      // Document structure
      displayResults.push({
        test: 'Document Structure',
        status: diagnostics.structure.success ? 'success' : 'error',
        message: diagnostics.structure.message,
        data: diagnostics.structure.data
      })

      // Pagination
      displayResults.push({
        test: 'Pagination Test',
        status: diagnostics.pagination.success ? 'success' : 'error',
        message: diagnostics.pagination.message,
        data: diagnostics.pagination.data
      })

      setResults(displayResults)
    } catch (error: any) {
      console.error('Diagnostic error:', error)
      setResults([{
        test: 'General Error',
        status: 'error',
        message: `Failed: ${error.message}`
      }])
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Firebase Diagnostics
        </h2>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {result.status === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                {result.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                <h3 className="font-semibold">{result.test}</h3>
              </div>
              <Badge variant={
                result.status === 'success' ? 'default' : 
                result.status === 'warning' ? 'secondary' : 'destructive'
              }>
                {result.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
            
            {result.count !== undefined && (
              <p className="text-sm font-medium mt-1">Count: {result.count}</p>
            )}
            
            {result.data && (
              <details className="mt-2">
                <summary className="text-sm cursor-pointer text-blue-600">View Sample Data</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
