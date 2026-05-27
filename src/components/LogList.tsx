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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Ir para:</span>
            <input 
              type="number" 
              min={1} 
              max={totalPages}
              placeholder="#"
              style={{ 
                width: '60px', 
                textAlign: 'center', 
                padding: '4px', 
                borderRadius: '4px', 
                border: '1px solid var(--mc-border)', 
                background: 'var(--mc-surface-light)', 
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-minecraft)'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt(e.currentTarget.value);
                  if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    setCurrentPage(val);
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>(Aperte Enter)</span>
          </div>
        </div>
      )}
    </div>
  );
}
