// Sophisticated Scandinavian Ambient Canvas Background
export class TechnoVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    }, { passive: true });

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  animate() {
    // Ultra-smooth lerp physics
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Architectural Minimal Grid Pattern
    const gridSize = 90;
    this.ctx.lineWidth = 1;

    for (let x = 0; x < this.width; x += gridSize) {
      this.ctx.strokeStyle = 'rgba(203, 213, 225, 0.25)';
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.height; y += gridSize) {
      this.ctx.strokeStyle = 'rgba(203, 213, 225, 0.25)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Bespoke Soft Nordic Aura (Refined slate/charcoal ambient glow instead of generic blue spot)
    if (this.mouse.x > 0 && this.mouse.y > 0) {
      const gradient = this.ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, 0,
        this.mouse.x, this.mouse.y, 420
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.035)');
      gradient.addColorStop(0.5, 'rgba(71, 85, 105, 0.015)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    requestAnimationFrame(() => this.animate());
  }
}
