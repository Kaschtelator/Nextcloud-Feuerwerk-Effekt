/**
 * Nextcloud Feuerwerk Effekt mit Raketen für Silvester
 * Einfach in JSLoader oder als Script-Tag einfügen
 */

class Fireworks {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.rockets = [];
    this.animationId = null;
    this.init();
  }

  init() {
    // Canvas erstellen
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fireworks-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Auto-Resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    // Click zum Rakete starten
    document.addEventListener('click', (e) => {
      this.launchRocket(e.clientX, e.clientY);
    });

    // Auto-Raketen alle 1.5 Sekunden
    setInterval(() => {
      const x = Math.random() * this.canvas.width;
      this.launchRocket(x, this.canvas.height);
    }, 1500);

    this.animate();
  }

  launchRocket(startX, startY) {
    const targetY = Math.random() * (this.canvas.height * 0.3); // 0-30% von oben
    const targetX = startX + (Math.random() - 0.5) * 200; // Zufällige Abweichung
    
    this.rockets.push({
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      progress: 0,
      color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff6600', '#ff0066'][Math.floor(Math.random() * 8)]
    });
  }

  createExplosion(x, y, color) {
    const particleCount = 60 + Math.random() * 40;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 3 + Math.random() * 8;
      
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        maxLife: 1,
        color: color,
        size: 2 + Math.random() * 4,
        gravity: 0.15
      });
    }
  }

  animate() {
    // Canvas löschen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Raketen updaten
    this.rockets = this.rockets.filter(rocket => {
      rocket.progress += 0.03; // Geschwindigkeit der Rakete
      
      if (rocket.progress >= 1) {
        // Rakete erreicht Ziel - Explosion!
        this.createExplosion(rocket.targetX, rocket.targetY, rocket.color);
        return false;
      }

      // Rakete zeichnen (kleine Punkte die hochfliegen)
      const currentX = rocket.x + (rocket.targetX - rocket.x) * rocket.progress;
      const currentY = rocket.y + (rocket.targetY - rocket.y) * rocket.progress;

      // Rakete als Punkt
      this.ctx.fillStyle = rocket.color;
      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Trail hinter der Rakete
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillStyle = rocket.color;
      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY + 10, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;

      return true;
    });

    // Particles updaten
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= 0.02;
      
      if (p.life > 0) {
        // Mit Fade-Out zeichnen
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.canvas) {
      this.canvas.remove();
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Starten wenn DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Fireworks();
  });
} else {
  new Fireworks();
}
