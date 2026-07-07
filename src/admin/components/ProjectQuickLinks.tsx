import { Globe, Images, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TaskProjectSummary } from '../../types/agency'

interface ProjectQuickLinksProps {
  project: TaskProjectSummary
  compact?: boolean
}

export default function ProjectQuickLinks({ project, compact = false }: ProjectQuickLinksProps) {
  const clientName = project.client?.businessName?.trim()
  const label = clientName || 'Project'

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'mt-2'}`}>
      <Link
        to={`/admin/briefing?project=${project.id}`}
        className="text-sm font-semibold text-[#2D5016] hover:underline"
        title={`Open ${label} in Live Briefing`}
      >
        เปิดโปรเจกต์ →
      </Link>
      <Link
        to={`/admin?project=${project.id}`}
        className="text-sm font-medium text-[#6B7280] hover:text-[#2D5016] hover:underline"
        title={`View ${label} on Projects dashboard`}
      >
        Dashboard
      </Link>
      <div className="flex items-center gap-1">
        <Link
          to={`/p/${project.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-[#1A1A1A]/20 p-1 text-[#2D5016] hover:bg-white"
          title="Client Portal"
          aria-label={`Client portal for ${label}`}
        >
          <LayoutGrid className="h-4 w-4" />
        </Link>
        {project.liveWebUrl && (
          <a
            href={project.liveWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-[#1A1A1A]/20 p-1 text-[#2D5016] hover:bg-white"
            title="Live Site"
            aria-label={`Live site for ${label}`}
          >
            <Globe className="h-4 w-4" />
          </a>
        )}
        {project.galleryUrl && (
          <a
            href={project.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-[#1A1A1A]/20 p-1 text-[#2D5016] hover:bg-white"
            title="Photo Gallery"
            aria-label={`Gallery for ${label}`}
          >
            <Images className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}
