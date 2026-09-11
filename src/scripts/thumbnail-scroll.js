/**
 * Thumbnail Dynamic Mouse & Page Scroll Controller
 * Syncs inner website mockup scrolling with mouse wheel page scroll and direct hover scroll.
 */
export class ThumbnailScrollController {
  constructor() {
    this.viewports = [];
    this.isTicking = false;
  }

  init() {
    this.viewports = Array.from(document.querySelectorAll('.video-scroll-viewport'));
    if (!this.viewports.length) return;

    // Remove static CSS loop animation on all tracks so JS scroll controls it
    this.viewports.forEach(vp => {
      const track = vp.querySelector('.video-scroll-track');
      if (track) {
        track.style.animation = 'none';
      }
    });

    this.bindPageScroll();
    this.bindHoverWheel();
    this.updateScrollPositions();
  }

  updateScrollPositions() {
    const windowHeight = window.innerHeight;

    this.viewports.forEach(vp => {
      // If user is actively wheel-scrolling on this card, skip page-scroll sync
      if (vp.dataset.userScrolled === 'true') return;

      const track = vp.querySelector('.video-scroll-track');
      const img = vp.querySelector('img');
      if (!track || !img) return;

      const rect = vp.getBoundingClientRect();
      const totalDist = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;

      let progress = currentPos / totalDist;
      progress = Math.max(0, Math.min(1, progress));

      const maxScroll = Math.max(0, img.offsetHeight - vp.offsetHeight);
      const targetY = progress * maxScroll;

      track.style.transform = `translate3d(0, -${targetY.toFixed(1)}px, 0)`;
    });

    this.isTicking = false;
  }

  bindPageScroll() {
    const onScroll = () => {
      if (!this.isTicking) {
        requestAnimationFrame(() => this.updateScrollPositions());
        this.isTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  bindHoverWheel() {
    this.viewports.forEach(vp => {
      const track = vp.querySelector('.video-scroll-track');
      const img = vp.querySelector('img');
      if (!track || !img) return;

      let currentScrollY = 0;

      vp.addEventListener('wheel', (e) => {
        // Prevent default window scrolling when scrolling over the thumbnail
        e.preventDefault();

        const maxScroll = Math.max(0, img.offsetHeight - vp.offsetHeight);

        // Get current transform if switching from page-scroll sync
        if (vp.dataset.userScrolled !== 'true') {
          const style = window.getComputedStyle(track);
          const matrix = new WebKitCSSMatrix(style.transform);
          currentScrollY = Math.abs(matrix.m42) || 0;
          vp.dataset.userScrolled = 'true';
        }

        // Adjust scroll position with mouse wheel delta
        currentScrollY += e.deltaY * 0.8;
        currentScrollY = Math.max(0, Math.min(maxScroll, currentScrollY));

        track.style.transform = `translate3d(0, -${currentScrollY.toFixed(1)}px, 0)`;

        // Reset userScrolled flag after 2.5s of inactivity so page-scroll sync resumes
        clearTimeout(vp._resetTimer);
        vp._resetTimer = setTimeout(() => {
          delete vp.dataset.userScrolled;
          this.updateScrollPositions();
        }, 2500);
      }, { passive: false });
    });
  }
}
