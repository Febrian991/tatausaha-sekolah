import React, { useEffect, useRef, useState, useCallback } from 'react';
import { haloAudio } from '../utils/audio';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Shield, 
  Crosshair, 
  Bomb, 
  Trophy, 
  Sparkles, 
  Flame, 
  Zap,
  Info
} from 'lucide-react';

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
  isPlasma: boolean;
  isEnemy: boolean;
  radius: number;
  rangeRemaining: number;
}

interface Grenade {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fuseTime: number; // ms remaining
  radius: number;
}

interface Enemy {
  id: number;
  type: 'grunt' | 'jackal' | 'elite';
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  speed: number;
  fireCooldown: number;
  angle: number;
  panicked: boolean;
  color: string;
}

interface Pickup {
  id: number;
  x: number;
  y: number;
  type: 'overshield' | 'camo' | 'ammo' | 'grenades';
  collected: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Medal {
  id: number;
  text: string;
  timestamp: number;
}

export const FirefightArena: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAMEOVER'>('MENU');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('halo_high_score') || '0', 10);
  });

  // Player Stats for HUD
  const [playerShield, setPlayerShield] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [hasOvershield, setHasOvershield] = useState(false);
  const [hasCamo, setHasCamo] = useState(false);
  const [activeWeapon, setActiveWeapon] = useState<'MA40' | 'BR75'>('MA40');
  const [currentMag, setCurrentMag] = useState(36);
  const [grenadeCount, setGrenadeCount] = useState(3);
  const [medals, setMedals] = useState<Medal[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Sound Mute Toggle
  const toggleMute = () => {
    haloAudio.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Game internal mutable state
  const stateRef = useRef({
    player: {
      x: 400,
      y: 300,
      vx: 0,
      vy: 0,
      speed: 3.4,
      shield: 100,
      maxShield: 100,
      health: 100,
      maxHealth: 100,
      lastDamageTime: 0,
      shieldRecharging: false,
      overshieldTime: 0,
      camoTime: 0,
      angle: 0,
      activeWeapon: 'MA40' as 'MA40' | 'BR75',
      magMA40: 36,
      magBR75: 36,
      grenades: 3,
      isReloading: false,
      fireTimer: 0,
    },
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
      mouseLeft: false,
      mouseX: 400,
      mouseY: 300,
    },
    bullets: [] as Bullet[],
    grenades: [] as Grenade[],
    enemies: [] as Enemy[],
    pickups: [] as Pickup[],
    particles: [] as Particle[],
    wave: 1,
    enemiesRemainingInWave: 8,
    waveSpawnTimer: 0,
    score: 0,
    multikillCount: 0,
    lastKillTime: 0,
    killsWithoutDying: 0,
    nextBulletId: 1,
    nextEnemyId: 1,
    nextGrenadeId: 1,
    nextPickupId: 1,
    screenShake: 0,
  });

  // Spawn New Wave of Covenant
  const startNewWave = (waveNum: number) => {
    const s = stateRef.current;
    s.wave = waveNum;
    setWave(waveNum);
    const gruntCount = 4 + waveNum * 2;
    const jackalCount = Math.min(6, Math.floor(waveNum * 1.5));
    const eliteCount = 1 + Math.floor(waveNum / 2);
    s.enemiesRemainingInWave = gruntCount + jackalCount + eliteCount;

    // Spawn pickups around arena
    if (Math.random() > 0.4) {
      s.pickups.push({
        id: s.nextPickupId++,
        x: 100 + Math.random() * 600,
        y: 100 + Math.random() * 400,
        type: Math.random() > 0.6 ? 'overshield' : Math.random() > 0.5 ? 'camo' : 'ammo',
        collected: false
      });
    }
  };

  const spawnEnemy = (type: 'grunt' | 'jackal' | 'elite') => {
    const s = stateRef.current;
    // Spawn around arena borders
    let x = 0;
    let y = 0;
    if (Math.random() > 0.5) {
      x = Math.random() > 0.5 ? -20 : 820;
      y = Math.random() * 600;
    } else {
      x = Math.random() * 800;
      y = Math.random() > 0.5 ? -20 : 620;
    }

    if (type === 'grunt') {
      s.enemies.push({
        id: s.nextEnemyId++,
        type: 'grunt',
        x,
        y,
        vx: 0,
        vy: 0,
        hp: 35,
        maxHp: 35,
        shield: 0,
        maxShield: 0,
        speed: 1.6 + Math.random() * 0.4,
        fireCooldown: 120 + Math.random() * 60,
        angle: 0,
        panicked: false,
        color: '#f59e0b', // Orange/Brown Grunt
      });
    } else if (type === 'jackal') {
      s.enemies.push({
        id: s.nextEnemyId++,
        type: 'jackal',
        x,
        y,
        vx: 0,
        vy: 0,
        hp: 45,
        maxHp: 45,
        shield: 25,
        maxShield: 25,
        speed: 1.3,
        fireCooldown: 150 + Math.random() * 80,
        angle: 0,
        panicked: false,
        color: '#06b6d4', // Cyan Shield Jackal
      });
    } else {
      // Elite
      s.enemies.push({
        id: s.nextEnemyId++,
        type: 'elite',
        x,
        y,
        vx: 0,
        vy: 0,
        hp: 90,
        maxHp: 90,
        shield: 80,
        maxShield: 80,
        speed: 2.2,
        fireCooldown: 60 + Math.random() * 40,
        angle: 0,
        panicked: false,
        color: '#3b82f6', // Cobalt Elite Armor
      });
    }
  };

  const addMedal = (text: string) => {
    haloAudio.playMedalEarned();
    const newMedal: Medal = { id: Date.now() + Math.random(), text, timestamp: Date.now() };
    setMedals((prev) => [...prev.slice(-3), newMedal]);
    setTimeout(() => {
      setMedals((prev) => prev.filter((m) => m.id !== newMedal.id));
    }, 2400);
  };

  // Start / Restart game
  const startGame = () => {
    haloAudio.playUiClick();
    haloAudio.playShieldRecharge();
    const s = stateRef.current;
    s.player.x = 400;
    s.player.y = 300;
    s.player.shield = 100;
    s.player.health = 100;
    s.player.magMA40 = 36;
    s.player.magBR75 = 36;
    s.player.grenades = 3;
    s.player.overshieldTime = 0;
    s.player.camoTime = 0;
    s.player.activeWeapon = 'MA40';
    s.bullets = [];
    s.grenades = [];
    s.enemies = [];
    s.pickups = [];
    s.particles = [];
    s.score = 0;
    s.multikillCount = 0;
    s.killsWithoutDying = 0;
    setScore(0);
    setGameState('PLAYING');
    startNewWave(1);
  };

  // Keyboard and Mouse Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') s.keys.w = true;
      if (k === 'a' || e.key === 'ArrowLeft') s.keys.a = true;
      if (k === 's' || e.key === 'ArrowDown') s.keys.s = true;
      if (k === 'd' || e.key === 'ArrowRight') s.keys.d = true;

      // Weapon Switch: Q or 1 or 2
      if (k === 'q' || k === '1' || k === '2') {
        const nextW = s.player.activeWeapon === 'MA40' ? 'BR75' : 'MA40';
        s.player.activeWeapon = nextW;
        setActiveWeapon(nextW);
        haloAudio.playUiClick();
      }

      // Reload
      if (k === 'r') {
        haloAudio.playUiClick();
        if (s.player.activeWeapon === 'MA40') s.player.magMA40 = 36;
        else s.player.magBR75 = 36;
        setCurrentMag(36);
      }

      // Frag Grenade throw with 'G'
      if (k === 'g' && s.player.grenades > 0) {
        s.player.grenades--;
        setGrenadeCount(s.player.grenades);
        const dx = s.keys.mouseX - s.player.x;
        const dy = s.keys.mouseY - s.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const throwSpeed = Math.min(9, dist * 0.04);
        const nx = dx / (dist || 1);
        const ny = dy / (dist || 1);

        s.grenades.push({
          id: s.nextGrenadeId++,
          x: s.player.x,
          y: s.player.y,
          vx: nx * throwSpeed,
          vy: ny * throwSpeed,
          fuseTime: 65, // ~1 second
          radius: 6,
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') s.keys.w = false;
      if (k === 'a' || e.key === 'ArrowLeft') s.keys.a = false;
      if (k === 's' || e.key === 'ArrowDown') s.keys.s = false;
      if (k === 'd' || e.key === 'ArrowRight') s.keys.d = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      stateRef.current.keys.mouseX = e.clientX - rect.left;
      stateRef.current.keys.mouseY = e.clientY - rect.top;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        stateRef.current.keys.mouseLeft = true;
      } else if (e.button === 2) {
        // Right click throws grenade
        e.preventDefault();
        const s = stateRef.current;
        if (s.player.grenades > 0) {
          s.player.grenades--;
          setGrenadeCount(s.player.grenades);
          const dx = s.keys.mouseX - s.player.x;
          const dy = s.keys.mouseY - s.player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const throwSpeed = Math.min(9, dist * 0.04);
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);

          s.grenades.push({
            id: s.nextGrenadeId++,
            x: s.player.x,
            y: s.player.y,
            vx: nx * throwSpeed,
            vy: ny * throwSpeed,
            fuseTime: 65,
            radius: 6,
          });
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) stateRef.current.keys.mouseLeft = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Main 60FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastShieldTick = 0;

    const gameLoop = () => {
      const s = stateRef.current;

      if (gameState === 'PLAYING') {
        const now = Date.now();

        // 1. Player Movement & Facing Angle
        let moveX = 0;
        let moveY = 0;
        if (s.keys.w) moveY -= 1;
        if (s.keys.s) moveY += 1;
        if (s.keys.a) moveX -= 1;
        if (s.keys.d) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        s.player.x = Math.max(20, Math.min(780, s.player.x + moveX * s.player.speed));
        s.player.y = Math.max(20, Math.min(580, s.player.y + moveY * s.player.speed));

        const pDx = s.keys.mouseX - s.player.x;
        const pDy = s.keys.mouseY - s.player.y;
        s.player.angle = Math.atan2(pDy, pDx);

        // 2. Shield Recharge Logic (Classic Halo 3.5s cooldown)
        if (now - s.player.lastDamageTime > 3500 && s.player.shield < s.player.maxShield) {
          if (!s.player.shieldRecharging) {
            haloAudio.playShieldRecharge();
            s.player.shieldRecharging = true;
          }
          s.player.shield = Math.min(s.player.maxShield, s.player.shield + 0.85);
          setPlayerShield(Math.round(s.player.shield));
        }

        // Low Shield Warning Beep
        if (s.player.shield > 0 && s.player.shield < 30 && now - lastShieldTick > 800) {
          haloAudio.playShieldLow();
          lastShieldTick = now;
        }

        // Active Powerups Timer
        if (s.player.overshieldTime > 0) {
          s.player.overshieldTime--;
          if (s.player.overshieldTime <= 0) setHasOvershield(false);
        }
        if (s.player.camoTime > 0) {
          s.player.camoTime--;
          if (s.player.camoTime <= 0) setHasCamo(false);
        }

        // 3. Player Firing
        s.player.fireTimer--;
        if (s.keys.mouseLeft && s.player.fireTimer <= 0) {
          const isMA40 = s.player.activeWeapon === 'MA40';
          const currentAmmo = isMA40 ? s.player.magMA40 : s.player.magBR75;

          if (currentAmmo > 0) {
            const spread = isMA40 ? (Math.random() - 0.5) * 0.12 : 0.02;
            const shootAngle = s.player.angle + spread;
            const speed = 14;

            if (isMA40) {
              s.player.magMA40--;
              setCurrentMag(s.player.magMA40);
              s.player.fireTimer = 6; // 10 rounds/sec
              haloAudio.playAssaultRifle();

              s.bullets.push({
                id: s.nextBulletId++,
                x: s.player.x + Math.cos(s.player.angle) * 18,
                y: s.player.y + Math.sin(s.player.angle) * 18,
                vx: Math.cos(shootAngle) * speed,
                vy: Math.sin(shootAngle) * speed,
                damage: 18,
                color: '#fef08a',
                isPlasma: false,
                isEnemy: false,
                radius: 2.5,
                rangeRemaining: 650,
              });
            } else {
              // BR75 Battle Rifle 3-round burst
              s.player.magBR75 = Math.max(0, s.player.magBR75 - 3);
              setCurrentMag(s.player.magBR75);
              s.player.fireTimer = 22; // burst delay

              for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                  haloAudio.playBattleRifleShot(i);
                  s.bullets.push({
                    id: s.nextBulletId++,
                    x: s.player.x + Math.cos(s.player.angle) * 20,
                    y: s.player.y + Math.sin(s.player.angle) * 20,
                    vx: Math.cos(s.player.angle + (Math.random() - 0.5) * 0.03) * 16,
                    vy: Math.sin(s.player.angle + (Math.random() - 0.5) * 0.03) * 16,
                    damage: 26,
                    color: '#60a5fa',
                    isPlasma: false,
                    isEnemy: false,
                    radius: 3,
                    rangeRemaining: 800,
                  });
                }, i * 65);
              }
            }
          }
        }

        // 4. Wave Spawning Progression
        if (s.enemies.length < 5 && s.enemiesRemainingInWave > 0) {
          s.waveSpawnTimer++;
          if (s.waveSpawnTimer > 35) {
            s.waveSpawnTimer = 0;
            s.enemiesRemainingInWave--;
            const roll = Math.random();
            if (roll > 0.65) spawnEnemy('elite');
            else if (roll > 0.35) spawnEnemy('jackal');
            else spawnEnemy('grunt');
          }
        }

        // Wave completed: advance to next wave
        if (s.enemiesRemainingInWave <= 0 && s.enemies.length === 0) {
          startNewWave(s.wave + 1);
          addMedal(`Wave ${s.wave + 1} Incoming`);
        }

        // 5. Update Bullets
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i];
          b.x += b.vx;
          b.y += b.vy;
          b.rangeRemaining -= Math.sqrt(b.vx * b.vx + b.vy * b.vy);

          // Remove out-of-bounds or expired bullets
          if (b.x < 0 || b.x > 800 || b.y < 0 || b.y > 600 || b.rangeRemaining <= 0) {
            s.bullets.splice(i, 1);
            continue;
          }

          // Bullet hits Player
          if (b.isEnemy) {
            const dist = Math.hypot(b.x - s.player.x, b.y - s.player.y);
            if (dist < 18) {
              s.bullets.splice(i, 1);
              s.screenShake = 6;
              s.player.lastDamageTime = Date.now();
              s.player.shieldRecharging = false;

              // Apply damage to shield first, then health
              if (s.player.shield > 0) {
                const shieldDmg = b.isPlasma ? b.damage * 1.5 : b.damage;
                s.player.shield = Math.max(0, s.player.shield - shieldDmg);
              } else {
                s.player.health = Math.max(0, s.player.health - b.damage);
              }

              setPlayerShield(Math.round(s.player.shield));
              setPlayerHealth(Math.round(s.player.health));

              if (s.player.health <= 0) {
                haloAudio.playExplosion();
                setGameState('GAMEOVER');
                if (s.score > highScore) {
                  setHighScore(s.score);
                  localStorage.setItem('halo_high_score', s.score.toString());
                }
              }
              continue;
            }
          } else {
            // Bullet hits Enemy
            for (let j = s.enemies.length - 1; j >= 0; j--) {
              const enemy = s.enemies[j];
              const dist = Math.hypot(b.x - enemy.x, b.y - enemy.y);
              if (dist < 20) {
                s.bullets.splice(i, 1);

                // Shield or Health damage
                if (enemy.shield > 0) {
                  enemy.shield = Math.max(0, enemy.shield - b.damage);
                } else {
                  enemy.hp -= b.damage;
                }

                // Sparks
                for (let k = 0; k < 4; k++) {
                  s.particles.push({
                    x: enemy.x,
                    y: enemy.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 15,
                    maxLife: 15,
                    color: enemy.shield > 0 ? '#38bdf8' : '#f97316',
                    size: 2,
                  });
                }

                // Enemy Eliminated
                if (enemy.hp <= 0) {
                  s.enemies.splice(j, 1);
                  s.score += enemy.type === 'elite' ? 150 : enemy.type === 'jackal' ? 80 : 40;
                  setScore(s.score);
                  s.killsWithoutDying++;

                  // Multi-kill logic
                  if (now - s.lastKillTime < 3000) {
                    s.multikillCount++;
                    if (s.multikillCount === 2) addMedal('Double Kill!');
                    else if (s.multikillCount === 3) addMedal('Triple Kill!');
                    else if (s.multikillCount >= 4) addMedal('Overkill!');
                  } else {
                    s.multikillCount = 1;
                  }
                  s.lastKillTime = now;

                  if (s.killsWithoutDying === 5) addMedal('Killing Spree!');
                  else if (s.killsWithoutDying === 10) addMedal('Running Riot!');

                  // Grunt panic if Elite dies
                  if (enemy.type === 'elite') {
                    s.enemies.forEach((e) => {
                      if (e.type === 'grunt') e.panicked = true;
                    });
                  }
                }
                break;
              }
            }
          }
        }

        // 6. Update Grenades
        for (let i = s.grenades.length - 1; i >= 0; i--) {
          const g = s.grenades[i];
          g.x += g.vx;
          g.y += g.vy;
          g.vx *= 0.94;
          g.vy *= 0.94;
          g.fuseTime--;

          if (g.fuseTime <= 0) {
            // Detonate
            s.grenades.splice(i, 1);
            haloAudio.playExplosion();
            s.screenShake = 12;

            // Explosion particles
            for (let p = 0; p < 25; p++) {
              s.particles.push({
                x: g.x,
                y: g.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                color: Math.random() > 0.5 ? '#f97316' : '#fef08a',
                size: 3 + Math.random() * 3,
              });
            }

            // Radial Splash Damage to Enemies
            for (let j = s.enemies.length - 1; j >= 0; j--) {
              const enemy = s.enemies[j];
              const dist = Math.hypot(g.x - enemy.x, g.y - enemy.y);
              if (dist < 120) {
                const splashDmg = Math.round(180 * (1 - dist / 120));
                if (enemy.shield > 0) enemy.shield = Math.max(0, enemy.shield - splashDmg);
                else enemy.hp -= splashDmg;

                if (enemy.hp <= 0) {
                  s.enemies.splice(j, 1);
                  s.score += 80;
                  setScore(s.score);
                  addMedal('Grenade Kill!');
                }
              }
            }

            // Splash damage to player if too close
            const pDist = Math.hypot(g.x - s.player.x, g.y - s.player.y);
            if (pDist < 80) {
              const pDmg = Math.round(60 * (1 - pDist / 80));
              s.player.shield = Math.max(0, s.player.shield - pDmg);
              setPlayerShield(Math.round(s.player.shield));
            }
          }
        }

        // 7. Update Enemies Behavior & AI
        s.enemies.forEach((enemy) => {
          const dx = s.player.x - enemy.x;
          const dy = s.player.y - enemy.y;
          const dist = Math.hypot(dx, dy);
          enemy.angle = Math.atan2(dy, dx);

          // AI: Move toward or flee if panicked
          if (enemy.panicked) {
            enemy.x -= Math.cos(enemy.angle) * (enemy.speed * 1.4);
            enemy.y -= Math.sin(enemy.angle) * (enemy.speed * 1.4);
          } else {
            // Keep optimum distance depending on unit
            const stopDist = enemy.type === 'jackal' ? 300 : enemy.type === 'grunt' ? 180 : 90;
            if (dist > stopDist) {
              enemy.x += Math.cos(enemy.angle) * enemy.speed;
              enemy.y += Math.sin(enemy.angle) * enemy.speed;
            } else if (dist < stopDist - 40) {
              // Back up slightly
              enemy.x -= Math.cos(enemy.angle) * (enemy.speed * 0.7);
              enemy.y -= Math.sin(enemy.angle) * (enemy.speed * 0.7);
            }
          }

          // Enemy Firing at Player
          enemy.fireCooldown--;
          if (enemy.fireCooldown <= 0 && !enemy.panicked && s.player.camoTime <= 0) {
            enemy.fireCooldown = enemy.type === 'elite' ? 55 : enemy.type === 'jackal' ? 110 : 85;
            haloAudio.playPlasmaShot();

            const isPlasma = true;
            const bulletColor = enemy.type === 'elite' ? '#38bdf8' : '#34d399';
            const bSpeed = enemy.type === 'jackal' ? 12 : 7.5;

            s.bullets.push({
              id: s.nextBulletId++,
              x: enemy.x + Math.cos(enemy.angle) * 16,
              y: enemy.y + Math.sin(enemy.angle) * 16,
              vx: Math.cos(enemy.angle) * bSpeed,
              vy: Math.sin(enemy.angle) * bSpeed,
              damage: enemy.type === 'elite' ? 24 : enemy.type === 'jackal' ? 34 : 14,
              color: bulletColor,
              isPlasma,
              isEnemy: true,
              radius: 3.5,
              rangeRemaining: 650,
            });
          }
        });

        // 8. Pickups Collision
        s.pickups.forEach((pickup) => {
          if (pickup.collected) return;
          const dist = Math.hypot(pickup.x - s.player.x, pickup.y - s.player.y);
          if (dist < 26) {
            pickup.collected = true;
            haloAudio.playPickup();

            if (pickup.type === 'overshield') {
              s.player.shield = 180;
              s.player.maxShield = 180;
              s.player.overshieldTime = 600;
              setPlayerShield(180);
              setHasOvershield(true);
              addMedal('Overshield Online!');
            } else if (pickup.type === 'camo') {
              s.player.camoTime = 500;
              setHasCamo(true);
              addMedal('Active Camo Online!');
            } else if (pickup.type === 'ammo') {
              s.player.magMA40 = 36;
              s.player.magBR75 = 36;
              s.player.grenades = Math.min(4, s.player.grenades + 2);
              setCurrentMag(36);
              setGrenadeCount(s.player.grenades);
              addMedal('Ammo Restocked');
            }
          }
        });
        s.pickups = s.pickups.filter((p) => !p.collected);

        // 9. Update Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const pt = s.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) s.particles.splice(i, 1);
        }
      }

      // SCREEN SHAKE
      ctx.save();
      if (s.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.screenShake;
        const shakeY = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(shakeX, shakeY);
        s.screenShake *= 0.85;
        if (s.screenShake < 0.2) s.screenShake = 0;
      }

      // RENDER CANVAS
      // Base Floor (Tactical Zeta Outpost Sand/Slate)
      ctx.fillStyle = '#0c131a';
      ctx.fillRect(0, 0, 800, 600);

      // Floor grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 800; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 600);
        ctx.stroke();
      }
      for (let y = 0; y < 600; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }

      // Render Pickups
      s.pickups.forEach((pk) => {
        ctx.save();
        ctx.translate(pk.x, pk.y);
        ctx.shadowBlur = 12;

        if (pk.type === 'overshield') {
          ctx.shadowColor = '#f59e0b';
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillText('OS', -6, 3);
        } else if (pk.type === 'camo') {
          ctx.shadowColor = '#06b6d4';
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillText('AC', -6, 3);
        } else {
          ctx.shadowColor = '#3b82f6';
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(-8, -6, 16, 12);
          ctx.fillStyle = '#60a5fa';
          ctx.font = '8px monospace';
          ctx.fillText('AMMO', -12, 16);
        }
        ctx.restore();
      });

      // Render Particles
      s.particles.forEach((pt) => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life / pt.maxLife;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Render Grenades
      s.grenades.forEach((g) => {
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#22c55e';
        ctx.stroke();
        // Blinking red fuse light
        if (Math.floor(Date.now() / 100) % 2 === 0) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(g.x, g.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render Bullets
      s.bullets.forEach((b) => {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.color;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Enemies
      s.enemies.forEach((enemy) => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.angle);

        // Covenant Shields glow
        if (enemy.shield > 0) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Enemy body shape
        ctx.fillStyle = enemy.color;
        if (enemy.type === 'elite') {
          // Sangheili warrior profile
          ctx.beginPath();
          ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Mandibles
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(8, -6, 7, 3);
          ctx.fillRect(8, 3, 7, 3);
          // Plasma Rifle
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(4, 4, 10, 4);
        } else if (enemy.type === 'jackal') {
          // Jackal with pointed beak
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          // Shield Gauntlet
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(10, 0, 12, -Math.PI / 3, Math.PI / 3);
          ctx.stroke();
        } else {
          // Grunt with methane tank on back
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          // Methane cone
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-12, -5, 6, 10);
        }

        ctx.restore();
      });

      // Render Master Chief Player
      ctx.save();
      ctx.translate(s.player.x, s.player.y);
      ctx.rotate(s.player.angle);

      // Active Camo Transparency
      ctx.globalAlpha = s.player.camoTime > 0 ? 0.25 : 1.0;

      // Overshield Golden Aura
      if (s.player.overshieldTime > 0) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.stroke();
      }

      // MJOLNIR Spartan Armor (Master Chief Green)
      ctx.fillStyle = '#3f6212'; // Spartan Olive Green
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();

      // Shoulder pauldrons
      ctx.fillStyle = '#365314';
      ctx.fillRect(-4, -15, 8, 5);
      ctx.fillRect(-4, 10, 8, 5);

      // Golden Orange Visor
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(6, -4, 6, 8);

      // Weapon Barrel
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(8, 2, 14, 4);

      ctx.restore();
      ctx.globalAlpha = 1.0;

      // RETICLE ON MOUSE
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(s.keys.mouseX, s.keys.mouseY, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.keys.mouseX - 12, s.keys.mouseY);
      ctx.lineTo(s.keys.mouseX + 12, s.keys.mouseY);
      ctx.moveTo(s.keys.mouseX, s.keys.mouseY - 12);
      ctx.lineTo(s.keys.mouseX, s.keys.mouseY + 12);
      ctx.stroke();

      // 10. Classic Halo Motion Tracker (Radar) - Bottom Left
      const radarX = 65;
      const radarY = 535;
      const radarR = 48;

      ctx.save();
      ctx.fillStyle = 'rgba(10, 20, 30, 0.85)';
      ctx.beginPath();
      ctx.arc(radarX, radarY, radarR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Radar Concentric Circles
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.arc(radarX, radarY, radarR * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Player Blip (Center Yellow/Green)
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(radarX, radarY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Enemy Blips on Radar
      s.enemies.forEach((enemy) => {
        const relX = (enemy.x - s.player.x) * 0.1;
        const relY = (enemy.y - s.player.y) * 0.1;
        const blipDist = Math.hypot(relX, relY);

        if (blipDist < radarR - 4) {
          ctx.fillStyle = '#ef4444'; // Red hostile blip
          ctx.beginPath();
          ctx.arc(radarX + relX, radarY + relY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      ctx.restore(); // Restore shake translation

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, highScore]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#070b10] p-2 sm:p-4 select-none">
      {/* Top HUD: Shield Bar & Health */}
      <div className="w-full max-w-4xl flex items-center justify-between px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-t-lg backdrop-blur-md">
        {/* Left: Spartan ID & Mute */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider">
            SPARTAN-117
          </div>
          <button
            onClick={toggleMute}
            className="p-1 rounded text-slate-400 hover:text-cyan-300 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Center: Iconic Halo Shield Meter */}
        <div className="flex flex-col items-center w-64 sm:w-80">
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-0.5">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {hasOvershield ? 'OVERSHIELD' : 'ENERGY SHIELDS'}
            </span>
            <span>{playerShield}%</span>
          </div>

          {/* Shield Progress Bar */}
          <div className="w-full h-2.5 bg-slate-900 border border-slate-700 rounded-sm overflow-hidden p-0.5">
            <div
              className={`h-full rounded-sm transition-all duration-75 ${
                hasOvershield
                  ? 'bg-amber-400 shadow-sm shadow-amber-500'
                  : playerShield < 30
                  ? 'bg-rose-500 animate-pulse'
                  : 'bg-cyan-400 shadow-sm shadow-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (playerShield / (hasOvershield ? 180 : 100)) * 100)}%` }}
            />
          </div>

          {/* Health Bar (Beneath shields) */}
          <div className="w-full flex gap-1 mt-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-xs transition-colors ${
                  playerHealth > i * 16.6 ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Weapon & Ammo Display */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <div className="text-cyan-300 font-bold">{activeWeapon}</div>
            <div className="text-slate-400 text-[11px] tabular-nums">
              {currentMag} <span className="text-slate-600">/ 36</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            <Bomb className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-bold">{grenadeCount}</span>
          </div>
        </div>
      </div>

      {/* Main Game Canvas Container */}
      <div className="relative w-full max-w-4xl h-[480px] sm:h-[540px] bg-black border-x border-b border-slate-800 rounded-b-lg overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-contain cursor-crosshair"
        />

        {/* Halo Medals Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-20">
          {medals.map((m) => (
            <div
              key={m.id}
              className="px-3 py-1 bg-slate-950/85 border border-amber-500/70 text-amber-300 text-xs font-mono font-bold tracking-wider rounded shadow-lg animate-bounce"
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Wave and Score Indicators */}
        <div className="absolute top-4 right-4 pointer-events-none z-10 flex flex-col items-end font-mono text-xs">
          <div className="text-cyan-400 font-bold">WAVE {wave}</div>
          <div className="text-slate-300 tabular-nums">SCORE: {score}</div>
          <div className="text-slate-500 text-[10px] tabular-nums">HIGH: {highScore}</div>
        </div>

        {/* Controls Kicker */}
        <div className="absolute bottom-3 right-4 pointer-events-none hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800">
          <span>[WASD] Move</span>
          <span>·</span>
          <span>[L-Click] Fire</span>
          <span>·</span>
          <span>[Q] Switch Gun</span>
          <span>·</span>
          <span>[G/R-Click] Grenade</span>
          <span>·</span>
          <span>[R] Reload</span>
        </div>

        {/* Title / Start Menu Overlay */}
        {gameState === 'MENU' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="text-xs font-mono text-cyan-400 mb-2 uppercase tracking-widest flex items-center gap-2">
              <Crosshair className="w-4 h-4" />
              <span>UNSC TACTICAL SIMULATION</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-wide mb-3">
              ZETA HALO: FIREFIGHT
            </h1>
            <p className="max-w-md text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              Step into the boots of Spartan-117. Repel waves of Covenant Drop Pods, manage your recharging MJOLNIR shields, and claim victory on the sacred ring.
            </p>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm rounded shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START SIMULATION</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in">
            <div className="text-xs font-mono text-rose-500 uppercase tracking-widest mb-1 font-semibold">
              MISSION FAILURE // SHIELDS CRITICAL
            </div>
            <h2 className="text-4xl font-extrabold font-display text-white tracking-wide mb-2">
              SPARTAN DOWN
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded p-4 mb-6 w-64 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Final Wave</span>
                <span className="text-white font-bold">{wave}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Combat Score</span>
                <span className="text-cyan-400 font-bold">{score}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5">
                <span>All-Time High</span>
                <span className="text-amber-400 font-bold">{highScore}</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm rounded shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESTART SIMULATION</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
