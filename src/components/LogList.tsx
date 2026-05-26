'use client';

import { useState } from 'react';

type Log = { id: number; player: string; action: string; target: string; type: string; time: string };

export default function LogList({ logs }: { logs: Log[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const totalPages = Math.ceil(logs.length / logsPerPage) || 1;
  
  const startIndex = (currentPage - 1) * logsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + logsPerPage);

  return (
    <div className="mc-log-list">
      {logs.length === 0 && (
        <p style={{ color: 'var(--text-secondary)' }}>Nenhum log recente encontrado.</p>
      )}
      
      {currentLogs.map((log) => (
        <div key={log.id} className={`mc-log-item ${log.type}`}>
          <div className="mc-log-time">{log.time}</div>
          <div className="mc-log-content">
            <span className="mc-log-player">{log.player}</span>{' '}
            <span className="mc-log-action">{log.action}</span>{' '}
            <span className="mc-log-target">{log.target}</span>
          </div>
        </div>
      ))}
      
      {logs.length > logsPerPage && (
        <div className="mc-pagination">
          <button 
            className="mc-button" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Anterior
          </button>
          <span style={{ color: 'var(--text-secondary)' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button 
            className="mc-button" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
