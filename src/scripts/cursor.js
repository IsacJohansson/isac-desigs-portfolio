// High-Precision Scandinavian Studio Cursor Controller
export class CursorController {
  constructor() {
    this.follower = document.getElementById('cursor-follower');
    this.dot = document.getElementById('cursor-dot');
    
    this.mouse = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.isHovered = false;
    this.hoverElement = null;

    this.init();
  }

  init() {
    if (!this.follower || !this.dot) return;

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Direct hardware-accelerated transform for micro-dot
      this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    const interactables = 'a, button, input, textarea, select, [role="button"], .project-card, [data-quick-view]';
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactables);
      if (target) {
        this.isHovered = true;
        this.hoverElement = target;
        document.body.classList.add('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactables);
      if (target) {
        this.isHovered = false;
        this.hoverElement = null;
        document.body.classList.remove('cursor-hover');
      }
    }, { passive: true });

    this.render();
  }

  render() {
    if (this.isHovered && this.hoverElement && this.hoverElement.getAttribute('data-magnetic') === 'true') {
      const rect = this.hoverElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      this.target.x += (centerX - this.target.x) * 0.18;
      this.target.y += (centerY - this.target.y) * 0.18;
    } else {
      this.target.x += (this.mouse.x - this.target.x) * 0.24;
      this.target.y += (this.mouse.y - this.target.y) * 0.24;
    }

    this.follower.style.transform = `translate3d(${this.target.x.toFixed(1)}px, ${this.target.y.toFixed(1)}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(() => this.render());
  }
}
