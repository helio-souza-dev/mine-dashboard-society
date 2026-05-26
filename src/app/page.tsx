type Player = { name: string; avatar: string };
type Log = { id: number; player: string; action: string; target: string; type: string; time: string };

export default async function Home() {
  let onlinePlayers: Player[] = [];
  let isOnline = false;
  let maxPlayers = 0;
  
  // 1. Puxar status do servidor e jogadores online
  try {
    const res = await fetch('https://api.mcsrvstat.us/3/136.116.183.226', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      isOnline = data.online;
      if (data.players) {
        maxPlayers = data.players.max;
        if (data.players.list) {
          onlinePlayers = data.players.list.map((p: any) => ({
            name: p.name,
            avatar: `https://minotar.net/helm/${p.name}/40.png`
          }));
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch server status:", e);
  }

  // 2. Puxar os logs da API na VM
  let recentLogs: Log[] = [];
  try {
    const logsRes = await fetch('http://136.116.183.226:8080/logs', { cache: 'no-store' });
    if (logsRes.ok) {
      recentLogs = await logsRes.json();
    }
  } catch (e) {
    console.error("Failed to fetch logs:", e);
  }

  return (
    <main>
      {/* Server Status Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <div className="mc-status" style={{ borderColor: isOnline ? 'var(--mc-green)' : 'var(--mc-red)' }}>
          <div className="mc-status-indicator" style={{ backgroundColor: isOnline ? 'var(--mc-green)' : 'var(--mc-red)' }}></div>
          <span className="mc-status-text">
            {isOnline ? `Online (${onlinePlayers.length}/${maxPlayers})` : 'Offline'}
          </span>
        </div>
      </div>

      <div className="mc-grid">
        {/* Left Column: Online Players */}
        <section className="mc-panel">
          <h2 className="mc-panel-title">Players Online</h2>
          
          <div className="mc-player-list">
            {!isOnline && <p style={{ color: 'var(--text-secondary)' }}>O servidor está offline.</p>}
            {isOnline && onlinePlayers.length === 0 && (
              <p style={{ color: 'var(--text-secondary)' }}>Nenhum jogador online no momento.</p>
            )}
            {onlinePlayers.map((player) => (
              <div key={player.name} className="mc-player-card">
                <img src={player.avatar} alt={`${player.name}'s head`} className="mc-player-head" />
                <span className="mc-font" style={{ fontSize: '0.8rem' }}>{player.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Recent Logs */}
        <section className="mc-panel">
          <h2 className="mc-panel-title">Recent Activity Logs</h2>
          
          <div className="mc-log-list">
            {recentLogs.length === 0 && (
              <p style={{ color: 'var(--text-secondary)' }}>Nenhum log recente encontrado.</p>
            )}
            {recentLogs.map((log) => (
              <div key={log.id} className={`mc-log-item ${log.type}`}>
                <div className="mc-log-time">{log.time}</div>
                <div className="mc-log-content">
                  <span className="mc-log-player">{log.player}</span>{' '}
                  <span className="mc-log-action">{log.action}</span>{' '}
                  <span className="mc-log-target">{log.target}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
