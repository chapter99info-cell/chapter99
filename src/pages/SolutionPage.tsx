import { Navigate, useParams } from 'react-router-dom'
import { getSolution } from '../data/solutions'
import { IndustryPage } from '../site/IndustryPage'

export function SolutionPage() {
  const { slug } = useParams()
  const solution = getSolution(slug)
  if (!solution) return <Navigate to="/" replace />
  return <IndustryPage content={solution.page} />
}
