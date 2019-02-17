import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {ArcSettingsPanelMixin} from '../../@advanced-rest-client/arc-settings-panel-mixin/arc-settings-panel-mixin.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@polymer/iron-pages/iron-pages.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-styles/shadow.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-item/paper-item.js';
import '../../@polymer/paper-item/paper-item-body.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * `about-arc-electron`
 *
 * About screen for ARC electron
 *
 * ## Styling
 *
 * `<about-arc-electron>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--about-arc-electron` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ArcSettingsPanelMixin
 */
class AboutArcElectron extends ArcSettingsPanelMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --arc-font-body1;
      @apply --about-arc;
    }

    h1 {
      @apply --arc-font-display1;
      @apply --about-arc-title;
    }

    .title-section {
      @apply --layout-vertical;
      @apply --layout-center-center;
      @apply --about-arc-title-containe;
    }

    .hero {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .logo-container {
      @apply --about-arc-logo-container;
    }

    .logo {
      width: 128px;
      height: 128px;
      @apply --about-arc-logo-image;
    }

    .app-title {
      margin-left: 24px;
      @apply --about-arc-title-container;
    }

    .version-meta {
      @apply --layout-horizontal;
      @apply --layout-center;
      @apply --arc-font-body2;
      font-size: 18px;
      color: var(--about-arc-version-label-color, rgba(0, 0, 0, 0.74));
      @apply --about-arc-version-container;
    }

    .version {
      margin-right: 12px;
      display: inline-block;
      padding-right: 12px;
      border-right: 1px var(--about-arc-version-section-border-right-color, rgba(0, 0, 0, 0.14)) solid;
      @apply --about-arc-version-label;
    }

    .version-meta a {
      color: inherit;
      text-decoration: inherit;
      @apply --about-arc-release-notes-label;
    }

    .version-meta a:hover {
      text-decoration: underline;
      @apply --about-arc-release-notes-label-hovered;
    }

    .open-external-icon {
      width: 16px;
      height: 16px;
      @apply --about-arc-open-external-icon;
    }

    .updates-section {
      @apply --shadow-elevation-3dp;
      max-width: 360px;
      margin: 40px auto;
      background-color: var(--about-arc-updates-section-background-color, #fff);
      padding: 24px;
      @apply --about-arc-update-status-section;
    }

    .update-status {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .state-selector {
      display: inline-block;
      @apply --layout-flex;
    }

    .update-message {
      @apply --arc-font-body1;
    }

    .heart {
      color: var(--about-arc-updated-heart-color, #FF5722);
      margin-left: 8px;
    }

    .update-settings {
      margin: 24px auto;
    }

    .author-line {
      @apply --layout-vertical;
      @apply --layout-center-center;
      margin: 40px auto;
    }

    .powered {
      display: block;
      width: 180px;
      height: 39px;
    }

    .error-code {
      max-width: 360px;
      margin: 20px auto;
      background-color: var(--about-arc-error-code-background-color, #EF9A9A);
      padding: 20px;
      @apply --select-text;
    }
    </style>
    <section class="title-section">
      <div class="hero">
        <div class="logo-container">
          <iron-icon class="logo" icon="arc:arc-icon-arrows"></iron-icon>
        </div>
        <div class="app-title">
          <h1>Advanced REST Client</h1>
        </div>
      </div>

      <div class="version-meta">
        <p class="version">Version: [[appVersion]]</p>
        <a href\$="https://github.com/advanced-rest-client/arc-electron/releases/tag/v[[appVersion]]" on-click="openNotes">
          Release notes
          <iron-icon icon="arc:open-in-new" class="open-external-icon" alt="Open external window"></iron-icon>
        </a>
      </div>
    </section>

    <section class="updates-section">
      <div class="update-status">
        <iron-pages selected="[[updateStatePage]]" class="state-selector">
          <span class="update-message">ARC is up to date <span class="heart">❤</span></span>
          <span class="update-message">Checking for update...</span>
          <span class="update-message">Downloading update...</span>
          <span class="update-message">Ready to install</span>
          <span class="update-message">Update error</span>
        </iron-pages>
        <paper-button raised="" disabled="[[updateProgress]]" hidden\$="[[updateDownloaded]]" on-tap="updateCheck">Check for updates</paper-button>
        <template is="dom-if" if="[[updateDownloaded]]">
          <paper-button raised="" on-tap="updateInstall">Restart and install</paper-button>
        </template>
      </div>
      <div class="update-settings">
        <paper-toggle-button checked="{{autoUpdate}}">Automatically download and install updates</paper-toggle-button>
      </div>

      <div class="release-channel">
        <paper-dropdown-menu label="Release channel" dynamic-align="" horizontal-align="left">
          <paper-listbox slot="dropdown-content" attr-for-item-title="label" attr-for-selected="data-channel" selected="[[releaseChannel]]" on-selected-changed="_releaseChannelChanged">
            <paper-item data-channel="latest" label="Stable">
              <paper-item-body two-line="">
                <div>Stable</div>
                <div secondary="">Default channel. Use this if you are not sure what to do.</div>
              </paper-item-body>
            </paper-item>
            <paper-item data-channel="beta" label="Beta">
              <paper-item-body two-line="">
                <div>Beta</div>
                <div secondary="">Next release. Tested but may contain bugs.</div>
              </paper-item-body>
            </paper-item>
            <paper-item data-channel="alpha" label="Unstable">
              <paper-item-body two-line="">
                <div>Unstable</div>
                <div secondary="">Development version. May not be fully tested and contain bugs!</div>
              </paper-item-body>
            </paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
      </div>

    </section>

    <template is="dom-if" if="[[isError]]">
      <section class="error-code">
        <p>[[errorMessage]]</p>
        <template is="dom-if" if="[[errorCode]]">
          <p>[[errorCode]]</p>
        </template>
      </section>
    </template>

    <section class="author-line">
      <p>Coded by Pawel Psztyc</p>
      <div class="branding">
        With great support of MuleSoft, a Salesforce company.
      </div>
    </section>
`;
  }

  static get is() {
    return 'about-arc-electron';
  }
  static get properties() {
    return {
      /**
       * Current version of the application
       */
      appVersion: String,
      // page of the update status label
      updateStatePage: {
        type: Number,
        value: 0
      },
      // State of auto update setting.
      autoUpdate: {type: Boolean, observer: '_autoUpdateChanged'},
      // True to indicate that update is being checked or downloaded
      updateProgress: Boolean,
      // True to indicate that the update is ready to install
      updateDownloaded: Boolean,
      // Indicates that error has been reported.
      isError: Boolean,
      // Associated message with current error code.
      errorMessage: String,
      errorCode: String,
      /**
       * Current release channel.
       */
      releaseChannel: String
    };
  }

  constructor() {
    super();
    this._checkingUpdateHandler = this._checkingUpdateHandler.bind(this);
    this._updateAvailableHandler = this._updateAvailableHandler.bind(this);
    this._updateNotAvailableHandler = this._updateNotAvailableHandler.bind(this);
    this._updateErrorHandler = this._updateErrorHandler.bind(this);
    this._downloadingHandler = this._downloadingHandler.bind(this);
    this._downloadedHandler = this._downloadedHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    /* global ipc */
    ipc.on('checking-for-update', this._checkingUpdateHandler);
    ipc.on('update-available', this._updateAvailableHandler);
    ipc.on('update-not-available', this._updateNotAvailableHandler);
    ipc.on('autoupdate-error', this._updateErrorHandler);
    ipc.on('download-progress', this._downloadingHandler);
    ipc.on('update-downloaded', this._downloadedHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ipc.removeListener('checking-for-update', this._checkingUpdateHandler);
    ipc.removeListener('update-available', this._updateAvailableHandler);
    ipc.removeListener('update-not-available', this._updateNotAvailableHandler);
    ipc.removeListener('autoupdate-error', this._updateErrorHandler);
    ipc.removeListener('download-progress', this._downloadingHandler);
    ipc.removeListener('update-downloaded', this._downloadedHandler);
  }

  _processValues(values) {
    if (typeof values.autoUpdate === 'undefined') {
      values.autoUpdate = true;
    } else {
      values.autoUpdate = this._boolValue(values.autoUpdate);
    }
    const defaultReleaseChannel = 'latest';
    if (typeof values.releaseChannel === 'undefined') {
      values.releaseChannel = defaultReleaseChannel;
    } else {
      values.releaseChannel = String(values.releaseChannel);
      if (!this.isValidChannel(values.releaseChannel)) {
        values.releaseChannel = defaultReleaseChannel;
      }
    }
    return values;
  }

  _setSettings(values) {
    this.__settingsRestored = false;
    this.autoUpdate = values.autoUpdate;
    this.releaseChannel = values.releaseChannel;
    this.__settingsRestored = true;
  }

  _autoUpdateChanged(value) {
    this.updateSetting('autoUpdate', value);
  }

  _settingsChanged(key, value) {
    this.__settingsRestored = false;
    switch (key) {
      case 'autoUpdate':
      case 'releaseChannel':
        this[key] = value;
        break;
    }
    this.__settingsRestored = true;
  }

  _checkingUpdateHandler() {
    this.updateStatePage = 1;
    if (!this.updateProgress) {
      this.updateProgress = true;
    }
  }

  _updateAvailableHandler() {
    if (this.updateStatePage !== 2) {
      this.updateStatePage = 2;
    }
  }

  _downloadingHandler() {
    if (!this.updateProgress) {
      this.updateProgress = true;
    }
  }

  _updateNotAvailableHandler() {
    this.updateStatePage = 0;
    this.updateProgress = false;
  }

  _updateErrorHandler(e, err) {
    this.updateStatePage = 4;
    this.updateProgress = false;
    this._createErrorMessage(err.code, err.message);
    this.errorCode = err.code || undefined;
    this.isError = true;
  }

  _downloadedHandler() {
    this.updateStatePage = 3;
    this.updateDownloaded = true;
  }

  _createErrorMessage(code, message) {
    switch (code) {
      case 'ERR_UPDATER_INVALID_RELEASE_FEED':
        message = 'Unable to parse releases feed.';
        break;
      case 'ERR_UPDATER_NO_PUBLISHED_VERSIONS':
        message = 'Unable to find published version.';
        break;
      case 'ERR_UPDATER_CHANNEL_FILE_NOT_FOUND':
        message = 'Cannot find latest release information for this platform.';
        break;
      case 'ERR_UPDATER_LATEST_VERSION_NOT_FOUND':
        message = 'Unable to find latest version on GitHub.';
        break;
      default:
        message = message || 'Unknown error ocurred.';
    }
    this.errorMessage = message;
  }

  updateCheck() {
    ipc.send('check-for-update');
  }

  updateInstall() {
    ipc.send('install-update');
  }

  openNotes(e) {
    e.preventDefault();
    e.stopPropagation();
    ipc.send('open-external-url', e.target.href);
  }

  /**
   * Checks if `channel` is a valid channel signature.
   * @param {String} channel
   * @return {Boolean}
   */
  isValidChannel(channel) {
    return ['beta', 'alpha', 'latest'].indexOf(channel) !== -1;
  }

  _releaseChannelChanged(e) {
    if (!this.__settingsRestored) {
      return;
    }
    const channel = e.detail.value;
    if (!this.isValidChannel(channel)) {
      return;
    }
    this.updateSetting('releaseChannel', channel);
  }
}
window.customElements.define(AboutArcElectron.is, AboutArcElectron);