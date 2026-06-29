import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { projectService } from '../../services/projectService';
import { clientService } from '../../services/clientService';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Badge, { getStatusVariant } from '../../components/common/Badge';
import type { Project, Client } from '../../types';

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
  const completedProjects = projects.filter((p) => p.status === 'COMPLETADO' || p.status === 'COMPLETED').length;

  const stats = [
    { label: 'Total Proyectos', value: projects.length, icon: '📁', color: 'from-indigo-600 to-indigo-700' },
    { label: 'Clientes', value: clients.length, icon: '👥', color: 'from-purple-600 to-purple-700' },
    { label: 'Tareas', value: totalTasks, icon: '✅', color: 'from-emerald-600 to-emerald-700' },
    { label: 'Proyectos Completados', value: completedProjects, icon: '🏆', color: 'from-amber-600 to-amber-700' },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Bienvenido, <span className="text-indigo-400">{user?.username}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Aquí tienes un resumen del sistema administrativo
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Proyectos Recientes</h2>
                <Link
                  to="/projects"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-3">
                {projects.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Sin proyectos aún</p>
                ) : (
                  projects.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                    >
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">
                          {project.name}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {project.clientName || 'Sin cliente'} • {project.tasks?.length || 0} tareas
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status || 'Sin estado'}
                      </Badge>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent clients */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Clientes Registrados</h2>
                <Link
                  to="/clients"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-3">
                {clients.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Sin clientes aún</p>
                ) : (
                  clients.slice(0, 5).map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs uppercase">
                          {client.razonSocial?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{client.razonSocial}</p>
                        <p className="text-slate-500 text-xs">{client.correoContacto || client.telefono || 'Sin contacto'}</p>
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
