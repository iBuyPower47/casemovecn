import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    fill: {
      current: 'currentColor',
    },
    extend: {
      colors: {
        /* ── 背景层级（CSS 变量驱动，方便全局切换） ── */
        'dark-level-one': 'var(--bg-level-one)',
        'dark-level-two': 'var(--bg-level-two)',
        'dark-level-three': 'var(--bg-level-three)',
        'dark-level-four': 'var(--bg-level-four)',
        'dark-level-five': '#2A2A2A',

        /* ── 旧版兼容色 ── */
        'dark-white': 'var(--text-primary)',
        'regal-blue': '#243c5a',
        gray: colors.gray,

        /* ── 强调色 ── */
        'accent-primary': 'var(--accent-primary)',
        'accent-hover': 'var(--accent-hover)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* ── 箔面边框（渐变描边） ── */
        '.foil-border': {
          border: '1px solid transparent',
          'background-image':
            'linear-gradient(var(--bg-level-two), var(--bg-level-two)), var(--foil-linear)',
          'background-origin': 'border-box',
          'background-clip': 'padding-box, border-box',
        },
        '.foil-border-l3': {
          border: '1px solid transparent',
          'background-image':
            'linear-gradient(var(--bg-level-three), var(--bg-level-three)), var(--foil-linear)',
          'background-origin': 'border-box',
          'background-clip': 'padding-box, border-box',
        },

        /* ── 箔面文字 ── */
        '.foil-text': {
          background: 'var(--foil-linear)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },

        /* ── 光扫（Hover sweep）── */
        '.foil-sweep': {
          overflow: 'hidden',
          position: 'relative',
        },
        '.foil-sweep::after': {
          content: '""',
          position: 'absolute',
          inset: '0',
          background:
            'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.10) 44%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.10) 56%, transparent 62%)',
          transform: 'translateX(-150%)',
          transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          'pointer-events': 'none',
        },
        '.foil-sweep:hover::after': {
          transform: 'translateX(200%)',
        },

        /* ── 箔面 Glow 阴影 ── */
        '.foil-glow': {
          'box-shadow': 'var(--shadow-foil-glow)',
        },

        /* ── 具名 shadow 工具类（替代任意 shadow-[var(--...)] 不生效问题） ── */
        '.shadow-emboss': {
          'box-shadow': 'var(--shadow-emboss-outer)',
        },
        '.shadow-foil': {
          'box-shadow': 'var(--shadow-foil-glow)',
        },
        '.shadow-emboss-foil': {
          'box-shadow': 'var(--shadow-emboss-outer), var(--shadow-foil-glow)',
        },
        '.shadow-modal-foil': {
          'box-shadow':
            '0 25px 60px rgba(0, 0, 0, 0.85), var(--shadow-foil-glow)',
        },
        '.shadow-login-card': {
          'box-shadow':
            'var(--shadow-emboss-outer), var(--shadow-foil-glow), 0 30px 80px rgba(0, 0, 0, 0.7)',
        },
        '.shadow-dropdown-panel': {
          'box-shadow':
            '0 8px 24px rgba(0, 0, 0, 0.6), var(--shadow-emboss-outer)',
        },

        /* ── 导航箔面活跃指示条 ── */
        '.foil-active-bar': {
          position: 'relative',
        },
        '.foil-active-bar::before': {
          content: '""',
          position: 'absolute',
          left: '0',
          top: '6px',
          bottom: '6px',
          width: '3px',
          'border-radius': '0 2px 2px 0',
          background: 'var(--foil-linear)',
        },

        /* ── 压纹效果 ── */
        '.embossed': {
          'box-shadow': 'var(--shadow-emboss-outer)',
          border: '1px solid var(--border-default)',
        },
        '.embossed-inner': {
          'box-shadow': 'var(--shadow-emboss-inner)',
        },

        /* ── 金属噪点纹理（inline SVG，零外部依赖） ── */
        '.noise-texture': {
          position: 'relative',
        },
        '.noise-texture::before': {
          content: '""',
          position: 'absolute',
          inset: '0',
          'background-image':
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          'mix-blend-mode': 'overlay',
          'pointer-events': 'none',
          'border-radius': 'inherit',
          'z-index': '0',
        },
        '.noise-texture > *': {
          position: 'relative',
          'z-index': '1',
        },

        /* ── 旧版兼容（保留供存量代码使用） ── */
        '.backdrop-blur-glass': {
          'backdrop-filter': 'blur(15px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(15px) saturate(180%)',
        },
        '.card-glass-holographic': {
          background: 'rgba(255, 255, 255, 0.04)',
          'backdrop-filter': 'blur(15px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(15px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          'border-radius': '0.75rem',
          position: 'relative',
          overflow: 'hidden',
        },
        '.holo-shimmer::before': {
          content: '""',
          position: 'absolute',
          inset: '0',
          background:
            'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 60%, transparent 80%)',
          animation: 'shimmer-slide 8s ease-in-out infinite',
          'pointer-events': 'none',
          'border-radius': 'inherit',
          'will-change': 'transform',
        },
        '.table-row-holographic': {
          transition: 'background-color 150ms',
          '&:hover': {
            background: 'var(--bg-level-four)',
          },
        },
        '.text-primary-holographic': {
          color: 'var(--text-primary)',
        },
        '.text-secondary-holographic': {
          color: 'var(--text-secondary)',
        },
      });
    }),
  ],
};
