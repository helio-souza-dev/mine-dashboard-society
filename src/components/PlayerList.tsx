'use client';

import { useState } from 'react';

type Player = { name: string; avatar: string };
type Advancement = { id: string; name: string; unlocked: boolean };
type PlayerStats = { 
  playtime_minutes: number; 
  mobs_killed: number;
  distance_km: number;
  jumps: number;
  damage_taken: number;
  recent_crafts: string[];
  advancements: Advancement[];
};

export default function PlayerList({ players, isOnline, currentOnline }: { players: Player[], isOnline: boolean, currentOnline: number }) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'conquistas' | 'crafts'>('status');

  const openModal = async (name: string) => {
    setSelectedPlayer(name);
    setStats(null);
    setLoading(true);
    setActiveTab('status');
    
    try {
      const res = await fetch(`/api/player/${name}`);
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
                  <div className="mc-tabs">
                    <button className={`mc-tab ${activeTab === 'status' ? 'active' : ''}`} onClick={() => setActiveTab('status')}>Status</button>
                    <button className={`mc-tab ${activeTab === 'conquistas' ? 'active' : ''}`} onClick={() => setActiveTab('conquistas')}>Conquistas</button>
                    <button className={`mc-tab ${activeTab === 'crafts' ? 'active' : ''}`} onClick={() => setActiveTab('crafts')}>Atividades</button>
                  </div>

                  {activeTab === 'status' && (
                    <div style={{ marginTop: '1rem' }}>
                      <div className="mc-stat-row">
                        <span className="mc-stat-label">Tempo Jogado:</span>
                        <span className="mc-stat-value">
                          {Math.floor(stats.playtime_minutes / 60)}h {stats.playtime_minutes % 60}m
                        </span>
                      </div>
                      <div className="mc-stat-row">
                        <span className="mc-stat-label">Monstros Derrotados:</span>
                        <span className="mc-stat-value">{stats.mobs_killed}</span>
                      </div>
                      <div className="mc-stat-row">
                        <span className="mc-stat-label">Distância Percorrida:</span>
                        <span className="mc-stat-value">{stats.distance_km} Km</span>
                      </div>
                      <div className="mc-stat-row">
                        <span className="mc-stat-label">Pulos:</span>
                        <span className="mc-stat-value">{stats.jumps}</span>
                      </div>
                      <div className="mc-stat-row">
                        <span className="mc-stat-label">Dano Sofrido:</span>
                        <span className="mc-stat-value">{stats.damage_taken}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'conquistas' && (
                    <div className="mc-advancement-list" style={{ marginTop: '1rem' }}>
                      {stats.advancements.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Nenhuma conquista mapeada ainda.</p>
                      ) : (
                        // Sort unlocked first
                        [...stats.advancements].sort((a, b) => (a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1)).map((adv) => (
                          <div key={adv.id} className={`mc-advancement ${adv.unlocked ? 'unlocked' : 'locked'}`}>
                            <div className="mc-advancement-icon"></div>
                            <span className="mc-advancement-name">{adv.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'crafts' && (
                    <div style={{ marginTop: '1rem' }}>
                      {stats.recent_crafts.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Nenhum craft registrado ainda.</p>
                      ) : (
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-primary)' }}>
                          {stats.recent_crafts.map((craft, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>{craft}</li>
                          ))}
                        </ul>
                      )}
                    </div>
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
