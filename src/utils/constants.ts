// Domain constants
export const DOMAINS = {
  MANABO: 'manabo.cnc.chukyo-u.ac.jp',
  SHIBBOLETH: 'shib.chukyo-u.ac.jp', 
  ALBO_PT: 'cubics-pt-out.mng.chukyo-u.ac.jp',
  ALBO_AS: 'cubics-as-out.mng.chukyo-u.ac.jp',
} as const;

// URL constants
export const URLS = {
  MANABO_AUTH: 'https://manabo.cnc.chukyo-u.ac.jp/auth/shibboleth/',
  MANABO_ICON: 'https://manabo.cnc.chukyo-u.ac.jp/common/images/manabo_sm.png?2021071501',
  ALBO_LOGIN: 'https://cubics-pt-out.mng.chukyo-u.ac.jp/uniprove_pt/UnLoginControl',
} as const;

// Common selectors
export const SELECTORS = {
  // Shibboleth login
  SHIBBOLETH: {
    USERNAME: '#username',
    PASSWORD: '#password',
    LOGIN_BUTTON: '#login',
    ERROR_MESSAGE: '.c-message',
  },
  
  // Manabo selectors
  MANABO: {
    PASSWORD_INPUT: '#input-password',
  },
  
  // Albo selectors
  ALBO: {
    ERROR_TITLE: 'h1',
    LOGOUT_MESSAGE: '#contents_main .message.information .message_bg p',
  },
  
  // Video controller
  VIDEO: {
    FOCUSED_CONTROLS: '.v-ctrl-wrap.v-ctrl-focused',
    FEEDBACK_DISPLAY: '.v-ctrl-feedback',
    INITIALIZED_ATTR: 'data-video-controller-initialized',
  },
  
  // Common
  BODY: 'body',
} as const;

// Messages
export const MESSAGES = {
  ALBO: {
    LOGOUT_TEXT: 'ログアウトしました。',
    ERROR_TEXT: 'Internal Server Error',
  },
} as const;

// UI constants
export const UI = {
  DARK_MODE_TOGGLE_ID: 'dark-mode-toggle',
  DARK_MODE_TEXT_ID: 'dark-mode-toggle-text',
} as const;