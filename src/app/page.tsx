import LogList from '../components/LogList';
import PlayerList from '../components/PlayerList';

type Player = { name: string; avatar: string };
type Log = { id: number; player: string; action: string; target: string; type: string; time: string };

export default async function Home() {
  let registeredPlayers: Player[] = [];
  let isOnline = false;
  let maxPlayers = 0;
  let currentOnline = 0;
  
  // 1. Puxar status do servidor e jogadores online (APENAS CONTADOR)
  try {
    const res = await fetch('https://api.mcsrvstat.us/3/sd-br5.blazebr.com:26088', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      isOnline = data.online;
      if (data.players) {
        maxPlayers = data.players.max;
        currentOnline = data.players.online;
      }
    }
  } catch (e) {
    console.error("Failed to fetch server status:", e);
  }

  // 2. Puxar todos os jogadores registrados da nossa API
  try {
    const playersRes = await fetch('http://34.9.156.212:8080/players', { cache: 'no-store' });
    if (playersRes.ok) {
      const data = await playersRes.json();
      if (Array.isArray(data)) registeredPlayers = data;
    }
  } catch (e) {
    console.error("Failed to fetch players:", e);
  }

  // 2. Puxar os logs da API na VM
  let recentLogs: Log[] = [];
  try {
    const logsRes = await fetch('http://34.9.156.212:8080/logs', { cache: 'no-store' });
    if (logsRes.ok) {
      const data = await logsRes.json();
      if (Array.isArray(data)) recentLogs = data;
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
            {isOnline ? `Online (${currentOnline}/${maxPlayers})` : 'Offline'}
          </span>
        </div>
      </div>

      <div className="mc-grid">
        {/* Left Column: Registered Players */}
        <section className="mc-panel">
          <h2 className="mc-panel-title">Membros da Sociedade</h2>
          <PlayerList players={registeredPlayers} isOnline={isOnline} currentOnline={currentOnline} />
        </section>

        {/* Right Column: Recent Logs */}
        <section className="mc-panel">
          <h2 className="mc-panel-title">Recent Activity Logs</h2>
          <LogList logs={recentLogs} />
        </section>
      </div>
    </main>
  )
}
