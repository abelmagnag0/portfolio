"use client";
import dynamic from 'next/dynamic';

const ProjectsSection = dynamic(() => import('./projects'), {
  ssr: false,
  loading: () => null,
});

export default function ProjectsSectionLazy() {
  return <ProjectsSection />;
}
