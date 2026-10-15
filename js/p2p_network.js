/**
 * Hệ Thống Kết Nối Chơi Cùng Bạn Bè - WebRTC PeerJS P2P
 * Không cần cài đặt server backend phức tạp! Hoạt động 100% trên static web pgame.dragon9468.com.
 */

class DragonNetworkManager {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.myPeerId = null;
    this.roomCode = null;
    this.isHost = false;
    this.isConnected = false;
    this.friendProfile = null;
    this.friendIslandData = null;

    // Callbacks
    this.onConnected = null;
    this.onDisconnected = null;
    this.onFriendIslandReceived = null;
    this.onBattleInit = null;
    this.onBattleAction = null;
    this.onChatMessage = null;
    this.onError = null;
  }

  // Initialize PeerJS
  init(customId = null) {
    return new Promise((resolve, reject) => {
      if (typeof Peer === 'undefined') {
        const err = "PeerJS library not loaded from CDN";
        console.warn(err);
        return reject(err);
      }

      // Generate a short 6-character room code prefix
      const prefix = 'daorong_';
      const randomCode = customId || Math.random().toString(36).substring(2, 8).toUpperCase();
      const fullId = prefix + randomCode;

      try {
        this.peer = new Peer(fullId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          this.myPeerId = id;
          this.roomCode = id.replace(prefix, '');
          console.log("[P2P] My Room Code:", this.roomCode);
          resolve(this.roomCode);
        });

        this.peer.on('connection', (conn) => {
          console.log("[P2P] Incoming connection from:", conn.peer);
          this.conn = conn;
          this.isHost = true;
          this.setupConnectionHandlers();
        });

        this.peer.on('error', (err) => {
          console.error("[P2P Error]:", err);
          if (this.onError) this.onError(err);
          // If ID taken, retry without fixed ID
          if (err.type === 'unavailable-id' && customId) {
            this.init(null).then(resolve).catch(reject);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // Create Room as Host
  async createRoom() {
    this.isHost = true;
    return await this.init();
  }

  // Join Friend's Room
  joinRoom(roomCode) {
    return new Promise(async (resolve, reject) => {
      if (!this.peer) {
        await this.init();
      }

      const cleanCode = roomCode.trim().toUpperCase();
      const targetPeerId = 'daorong_' + cleanCode;
      console.log("[P2P] Connecting to Host:", targetPeerId);

      this.conn = this.peer.connect(targetPeerId, { reliable: true });
      this.isHost = false;

      this.conn.on('open', () => {
        console.log("[P2P] Successfully connected to room:", cleanCode);
        this.isConnected = true;
        this.setupConnectionHandlers();

        // Send handshake profile & request island
        this.sendHandshake();
        resolve(cleanCode);
      });

      this.conn.on('error', (err) => {
        console.error("[P2P Connect Error]:", err);
        reject(err);
      });
    });
  }

  setupConnectionHandlers() {
    this.isConnected = true;

    this.conn.on('data', (packet) => {
      this.handleIncomingData(packet);
    });

    this.conn.on('close', () => {
      console.log("[P2P] Connection closed");
      this.isConnected = false;
      this.conn = null;
      if (this.onDisconnected) this.onDisconnected();
    });

    if (this.onConnected) {
      this.onConnected({ isHost: this.isHost });
    }
  }

  // Packet Sender
  send(type, payload = {}) {
    if (!this.conn || !this.isConnected) {
      console.warn("[P2P] Cannot send packet, not connected.");
      return false;
    }
    this.conn.send({ type, payload, timestamp: Date.now() });
    return true;
  }

  // --- High-Level Protocols ---

  sendHandshake() {
    const p = window.GameInstance.state;
    this.send('HANDSHAKE', {
      name: p.playerName,
      avatar: p.playerAvatar,
      level: p.level
    });
  }

  shareMyIsland() {
    const p = window.GameInstance.state;
    this.send('ISLAND_DATA', {
      ownerName: p.playerName,
      level: p.level,
      habitats: p.habitats,
      farms: p.farms
    });
  }

  sendBattleInvitation(mySelectedDragons) {
    this.send('BATTLE_INVITE', {
      team: mySelectedDragons,
      hostName: window.GameInstance.state.playerName
    });
  }

  acceptBattle(mySelectedDragons) {
    this.send('BATTLE_START', {
      team: mySelectedDragons
    });
  }

  sendBattleAction(attackerUid, targetUid, actionType) {
    this.send('BATTLE_ACTION', {
      attackerUid,
      targetUid,
      actionType
    });
  }

  sendChatMessage(message, emoji = null) {
    this.send('CHAT', {
      sender: window.GameInstance.state.playerName,
      text: message,
      emoji: emoji
    });
  }

  sendFriendGift() {
    this.send('FRIEND_GIFT', {
      gold: 200,
      food: 100
    });
  }

  // --- Packet Dispatcher ---
  handleIncomingData(packet) {
    if (!packet || !packet.type) return;
    const { type, payload } = packet;

    switch (type) {
      case 'HANDSHAKE':
        this.friendProfile = payload;
        // Host automatically shares island data back
        if (this.isHost) {
          this.shareMyIsland();
        }
        break;

      case 'ISLAND_DATA':
        this.friendIslandData = payload;
        if (this.onFriendIslandReceived) {
          this.onFriendIslandReceived(payload);
        }
        break;

      case 'BATTLE_INVITE':
        if (this.onBattleInit) {
          this.onBattleInit({
            isInvite: true,
            opponentTeam: payload.team,
            hostName: payload.hostName
          });
        }
        break;

      case 'BATTLE_START':
        if (this.onBattleInit) {
          this.onBattleInit({
            isInvite: false,
            opponentTeam: payload.team
          });
        }
        break;

      case 'BATTLE_ACTION':
        if (this.onBattleAction) {
          this.onBattleAction(payload);
        }
        break;

      case 'CHAT':
        if (this.onChatMessage) {
          this.onChatMessage(payload);
        }
        break;

      case 'FRIEND_GIFT':
        window.GameInstance.addGold(payload.gold || 100);
        window.GameInstance.addFood(payload.food || 50);
        if (window.DragonAudio) window.DragonAudio.playGold();
        if (window.showBannerNotification) {
          window.showBannerNotification(`BẠN BÈ VỪA TẶNG BẠN +${payload.gold} Vàng và +${payload.food} Thức Ăn! 🎁`, 'gold');
        }
        break;

      default:
        console.log("[P2P] Unhandled packet type:", type);
    }
  }

  disconnect() {
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
    this.isConnected = false;
  }
}

window.DragonNetworkManager = DragonNetworkManager;
window.NetworkInstance = new DragonNetworkManager();
