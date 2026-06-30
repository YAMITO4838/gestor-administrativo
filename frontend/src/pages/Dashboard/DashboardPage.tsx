import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ClipboardList,
  FolderKanban,
  Trophy,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { projectService } from '../../services/projectService';
import { clientService } from '../../services/clientService';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { getStatusLabel, getStatusVariant } from '../../components/common/badgeUtils';
import type { Client, Project } from '../../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, c] = await Promise.all([projectService.getAll(), clientService.getAll()]);
        setProjects(p);
        setClients(c);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalTasks = projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
  const completedProjects = projects.filter(
    (p) => p.status === 'COMPLETADO' || p.status === 'COMPLETED'
  ).length;

  const stats: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: 'Total Proyectos', value: projects.length, Icon: FolderKanban },
    { label: 'Clientes Activos', value: clients.length, Icon: UsersRound },
    { label: 'Tareas Pendientes', value: totalTasks, Icon: ClipboardList },
    { label: 'Completados', value: completedProjects, Icon: Trophy },
  ];

  return (
    <Layout>
      <div className="premium-animate mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8a764e]">
          Panel administrativo
        </p>
        <h1 className="premium-heading">
          Bienvenido, {user?.username || 'Usuario'}.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-graphite">
          Resumen claro de proyectos, clientes y tareas para tomar decisiones rapido.
        </p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="premium-card-interactive premium-animate p-5"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-[#8a764e]">
                    <stat.Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <p className="text-4xl font-extrabold tracking-tight text-ink">{stat.value}</p>
                </div>
                <p className="mt-3 text-sm font-semibold text-graphite">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.45fr_.85fr]">
            <div className="premium-card premium-animate premium-delay-1 p-6">
              <div className="mb-5 flex items-center justify-between border-b border-stone-200 pb-4">
                <h2 className="font-display text-2xl font-semibold text-ink">Proyectos Recientes</h2>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#17486a] hover:text-[#6f5526]"
                >
                  Ver todos
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="space-y-3">
                {projects.length === 0 ? (
                  <p className="py-6 text-center text-sm text-graphite">Sin proyectos aun</p>
                ) : (
                  projects.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="group flex items-center justify-between gap-4 rounded-lg border border-transparent p-3 hover:border-stone-200 hover:bg-stone-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-ink group-hover:text-[#17486a]">
                          {project.name}
                        </p>
                        <p className="mt-1 text-xs font-medium text-graphite">
                          {project.clientName || 'Sin cliente'} - {project.tasks?.length || 0} tareas
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="premium-card premium-animate premium-delay-2 p-6">
              <div className="mb-5 flex items-center justify-between border-b border-stone-200 pb-4">
                <h2 className="font-display text-2xl font-semibold text-ink">Clientes Recientes</h2>
                <Link
                  to="/clients"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#17486a] hover:text-[#6f5526]"
                >
                  Ver todos
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="space-y-3">
                {clients.length === 0 ? (
                  <p className="py-6 text-center text-sm text-graphite">Sin clientes aun</p>
                ) : (
                  clients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center gap-3 rounded-lg p-3 hover:bg-stone-50">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-[#8a764e]">
                        <UserRound size={18} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-ink">{client.razonSocial}</p>
                        <p className="truncate text-xs font-medium text-graphite">
                          {client.correoContacto || client.telefono || 'Sin contacto'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default DashboardPage;
