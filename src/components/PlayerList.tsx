'use client';

import { useState } from 'react';

type Player = { name: string; avatar: string };
type PlayerStats = { playtime_minutes: number; recent_crafts: string[] };

export default function PlayerList({ players, isOnline, currentOnline }: { players: Player[], isOnline: boolean, currentOnline: number }) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);

  const openModal = async (name: string) => {
    setSelectedPlayer(name);
    setStats(null);
    setLoading(true);
    
    try {
      // In a real production app, you might want to proxy this through Next.js API
      // to avoid mixed content if the frontend is HTTPS and backend is HTTP.
      // Assuming for now the VM API is accessible.
      const res = await fetch(`http://136.116.183.226:8080/player/${name}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setSelectedPlayer(null);

  return (
    <>
      <div className="mc-player-list">
        {!isOnline && <p style={{ color: 'var(--text-secondary)' }}>O servidor está offline.</p>}
        {isOnline && currentOnline === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum jogador online no momento.</p>
        )}
        {isOnline && currentOnline > 0 && players.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>Existem {currentOnline} jogadores online! <br/><br/><span style={{fontSize: '0.8rem'}}>(O servidor Forge está escondendo a lista de nomes por padrão)</span></p>
        )}
        {players.map((player) => (
          <div key={player.name} className="mc-player-card interactive" onClick={() => openModal(player.name)}>
            <img src={player.avatar} alt={`${player.name}'s head`} className="mc-player-head" />
            <span className="mc-font" style={{ fontSize: '0.8rem' }}>{player.name}</span>
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <div className="mc-modal-overlay" onClick={closeModal}>
          <div className="mc-modal mc-panel" onClick={e => e.stopPropagation()}>
            <button className="mc-modal-close mc-button" onClick={closeModal}>X</button>
            <h2 className="mc-panel-title" style={{ marginTop: 0 }}>
              <img src={`https://minotar.net/helm/${selectedPlayer}/32.png`} alt="" style={{verticalAlign: 'middle', marginRight: '10px'}} />
              {selectedPlayer}
            </h2>
            
            <div className="mc-modal-content">
              {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Carregando estatísticas...</p>
              ) : stats ? (
                <>
                  <div className="mc-stat-row">
                    <span className="mc-stat-label">Tempo Jogado:</span>
                    <span className="mc-stat-value">
                      {Math.floor(stats.playtime_minutes / 60)}h {stats.playtime_minutes % 60}m
                    </span>
                  </div>
                  
                  <h3 style={{ borderBottom: '2px solid var(--mc-border)', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>Crafts Recentes</h3>
                  {stats.recent_crafts.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Nenhum craft registrado ainda.</p>
                  ) : (
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-primary)' }}>
                      {stats.recent_crafts.map((craft, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>{craft}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p style={{ color: 'var(--mc-red)' }}>Falha ao carregar dados.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
