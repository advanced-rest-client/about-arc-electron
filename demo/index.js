
import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js';
import '../about-arc-electron.js';

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'updateState'
    ]);
    this._componentName = 'about-arc-electron';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];

    this.errorMessage = 'Update error';
    this.errorCode = 'ERR_UPDATER_CHANNEL_FILE_NOT_FOUND';

    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._updateStateHandler = this._updateStateHandler.bind(this);
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
  }

  _updateStateHandler(e) {
    const { name, value, checked } = e.target;
    if (!checked) {
      return;
    }
    this[name] = Number(value);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      updateState,
      errorMessage,
      errorCode
    } = this;

    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the ARC settings panel element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <about-arc-electron
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            appVersion="0.1.0-demo"
            .updateStatePage="${updateState}"
            .errorMessage="${errorMessage}"
            .errorCode="${errorCode}"
            slot="content"
          ></about-arc-electron>

          <label slot="options" id="mainAssistiveLabel">Update state</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
            aria-labelledby="mainAssistiveLabel"
          >
            <anypoint-radio-button
              @change="${this._updateStateHandler}"
              checked
              name="updateState"
              value="0"
            >Up to date</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._updateStateHandler}"
              name="updateState"
              value="1"
            >Checking</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._updateStateHandler}"
              name="updateState"
              value="2"
            >Downloading</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._updateStateHandler}"
              name="updateState"
              value="3"
            >Update ready</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._updateStateHandler}"
              name="updateState"
              value="4"
            >Update error</anypoint-radio-button>
          </anypoint-radio-group>
        </arc-interactive-demo>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <arc-local-store-preferences></arc-local-store-preferences>

      <h2>About ARC electron</h2>
      ${this._demoTemplate()}
    `;
  }
}

window.ipc = {
  on: function() {},
  send: function(cmd) {
    console.log(cmd);
  },
  removeListener: function() {}
};

const instance = new DemoPage();
instance.render();
window._demo = instance;
