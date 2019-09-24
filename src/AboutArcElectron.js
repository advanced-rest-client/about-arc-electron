import { html } from 'lit-element';
import { ArcSettingsBase } from '@advanced-rest-client/arc-settings-panel/src/ArcSettingsBase.js';
import { arcIconArrows, openInNew } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import styles from './styles.js';
/**
 * `about-arc-electron`
 *
 * About screen for ARC electron
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 */
export class AboutArcElectron extends ArcSettingsBase {
  static get styles() {
    return styles;
  }

  render() {
    return html`
    ${this._titleTemplate()}
    ${this._updatesSettingsTemplate()}
    ${this._errorTemplate()}
    <section class="author-line">
      <p>Coded by Pawel Psztyc</p>
      <div class="branding">
        With great support of MuleSoft, a Salesforce company.
      </div>
    </section>`;
  }

  _titleTemplate() {
    const { appVersion } = this;
    return html`<section class="title-section">
      <div class="hero">
        <div class="logo-container">
          <span class="logo">${arcIconArrows}</span>
        </div>
        <div class="app-title">
          <h1>Advanced REST Client</h1>
        </div>
      </div>

      <div class="version-meta">
        <p class="version">Version: ${appVersion}</p>
        <a
          href="https://github.com/advanced-rest-client/arc-electron/releases/tag/v${appVersion}"
          @click="${this.openNotes}"
        >
          Release notes
          <span class="icon" class="open-external-icon" alt="Open external window">${openInNew}</span>
        </a>
      </div>
    </section>`;
  }

  _updateLabel() {
    switch (this.updateStatePage) {
      case 1: return `Checking for update...`;
      case 2: return `Downloading update...`;
      case 3: return `Ready to install`;
      case 4: return `Update error`;
      default: return html`ARC is up to date <span class="heart">❤</span>`;
    }
  }

  _channelsTemplate() {
    const {
      outlined,
      compatibility,
      releaseChannel
    } = this;
    return html`<div class="release-channel">
      <anypoint-dropdown-menu
        dynamicalign
        horizontalalign="left"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
      >
        <label slot="label">Release channel</label>
        <anypoint-listbox
          slot="dropdown-content"
          attrforitemtitle="label"
          attrforselected="data-channel"
          .selected="${releaseChannel}"
          @selected-changed="${this._releaseChannelChanged}"
          ?compatibility="${compatibility}"
        >
          <anypoint-item data-channel="latest" label="Stable">
            <anypoint-item-body twoline>
              <div>Stable</div>
              <div secondary>Default channel. Use this if you are not sure what to do.</div>
            </anypoint-item-body>
          </anypoint-item>
          <anypoint-item data-channel="beta" label="Beta">
            <anypoint-item-body twoline>
              <div>Beta</div>
              <div secondary>Next release. Tested but may contain bugs.</div>
            </anypoint-item-body>
          </anypoint-item>
          <anypoint-item data-channel="alpha" label="Unstable">
            <anypoint-item-body twoline>
              <div>Unstable</div>
              <div secondary>Development version. May not be fully tested and contain bugs!</div>
            </anypoint-item-body>
          </anypoint-item>
        </anypoint-listbox>
      </anypoint-dropdown-menu>
    </div>`;
  }

  _updatesSettingsTemplate() {
    const {
      updateProgress,
      updateDownloaded,
      compatibility,
      autoUpdate
    } = this;
    return html`<section class="updates-section">
      <div class="update-status">
        <span class="update-message">${this._updateLabel()}</span>
        ${updateDownloaded ?
          html`<anypoint-button
            emphasis="high"
            ?compatibility="${compatibility}"
            @click="${this.updateInstall}"
          >Restart and install</anypoint-button>` :
          html`<anypoint-button
            emphasis="high"
            ?disabled="${updateProgress}"
            ?compatibility="${compatibility}"
            @click="${this.updateCheck}"
          >Check for updates</anypoint-button>`}
      </div>
      <div class="update-settings">
        <anypoint-switch
          ?compatibility="${compatibility}"
          .checked="${autoUpdate}"
          @checked-changed="${this._autoHandler}"
        >Automatically download and install updates</anypoint-switch>
      </div>
      ${this._channelsTemplate()}
    </section>`;
  }

  _errorTemplate() {
    if (!this.isError) {
      return '';
    }
    const { errorMessage, errorCode } = this;
    return html`
    <section class="error-code">
      <p>${errorMessage}</p>
      ${errorCode ? html`<p>${errorCode}</p>` : ''}
    </section>`;
  }

  get updateDownloaded() {
    return this.updateStatePage === 3;
  }

  get updateProgress() {
    return [1, 2, 3].indexOf(this.updateStatePage) !== -1;
  }

  get isError() {
    return this.updateStatePage === 4;
  }

  static get properties() {
    return {
      /**
       * Current version of the application
       */
      appVersion: { type: String },
      // page of the update status label
      updateStatePage: { type: Number },
      // State of auto update setting.
      autoUpdate: { type: Boolean, observer: '_autoUpdateChanged' },
      // Associated message with current error code.
      errorMessage: { type: String },
      errorCode: { type: String },
      /**
       * Current release channel.
       */
      releaseChannel: { type: String },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables Material Design Outlined inputs
       */
      outlined: { type: Boolean },
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

    this.updateStatePage = 0;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    /* global ipc */
    ipc.on('checking-for-update', this._checkingUpdateHandler);
    ipc.on('update-available', this._updateAvailableHandler);
    ipc.on('update-not-available', this._updateNotAvailableHandler);
    ipc.on('autoupdate-error', this._updateErrorHandler);
    ipc.on('download-progress', this._downloadingHandler);
    ipc.on('update-downloaded', this._downloadedHandler);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    ipc.removeListener('checking-for-update', this._checkingUpdateHandler);
    ipc.removeListener('update-available', this._updateAvailableHandler);
    ipc.removeListener('update-not-available', this._updateNotAvailableHandler);
    ipc.removeListener('autoupdate-error', this._updateErrorHandler);
    ipc.removeListener('download-progress', this._downloadingHandler);
    ipc.removeListener('update-downloaded', this._downloadedHandler);
  }

  _autoHandler(e) {
    this.autoUpdate = e.detail.value;
    this._autoUpdateChanged(e.detail.value);
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
  }

  _updateAvailableHandler() {
    if (this.updateStatePage !== 2) {
      this.updateStatePage = 2;
    }
  }

  _downloadingHandler() {
    if (this.updateStatePage !== 2) {
      this.updateStatePage = 2;
    }
  }

  _updateNotAvailableHandler() {
    this.updateStatePage = 0;
  }

  _updateErrorHandler(e, err) {
    this.updateStatePage = 4;
    this._createErrorMessage(err.code, err.message);
    this.errorCode = err.code || undefined;
  }

  _downloadedHandler() {
    this.updateStatePage = 3;
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
