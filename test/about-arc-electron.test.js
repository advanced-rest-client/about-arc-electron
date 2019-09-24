import { fixture, assert } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
// import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '../about-arc-electron.js';
window.ipc = {
  on: function() {},
  send: function() {},
  removeListener: function() {}
};

describe('<about-arc-electron>', function() {
  async function basicFixture() {
    const region = await fixture(`
      <div>
        <arc-local-store-preferences></arc-local-store-preferences>
        <about-arc-electron manual></about-arc-electron>
      </div>
    `);
    return region.querySelector('about-arc-electron');
  }

  async function autoFixture() {
    const region = await fixture(`
      <div>
        <arc-local-store-preferences></arc-local-store-preferences>
        <about-arc-electron></about-arc-electron>
      </div>
    `);
    const node = region.querySelector('arc-local-store-preferences');
    node.clear();
    return region.querySelector('about-arc-electron');
  }

  describe('about-arc-electron', () => {
    describe('Auto reading settings', () => {
      it('Dispatches settings-read', (done) => {
        window.addEventListener('settings-read', function f() {
          window.removeEventListener('settings-read', f);
          done();
        });
        autoFixture();
      });
    });

    describe('_settingsChanged()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });
      function fire(name, value) {
        const ev = new CustomEvent('settings-changed', {
          cancelable: false,
          composed: true,
          bubbles: true,
          detail: {
            name,
            value
          }
        });
        document.body.dispatchEvent(ev);
      }
      [
        ['autoUpdate', true],
        ['releaseChannel', 'beta']
      ].forEach((item) => {
        it(`Updates value for ${item[0]}`, function() {
          fire(item[0], item[1]);
          assert.strictEqual(element[item[0]], item[1]);
        });
      });
    });

    describe('isValidChannel()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns true for "alpha"', () => {
        const result = element.isValidChannel('alpha');
        assert.isTrue(result);
      });

      it('Returns true for "beta"', () => {
        const result = element.isValidChannel('beta');
        assert.isTrue(result);
      });

      it('Returns true for "latest"', () => {
        const result = element.isValidChannel('latest');
        assert.isTrue(result);
      });

      it('Returns false for anything else', () => {
        const result = element.isValidChannel('else');
        assert.isFalse(result);
      });
    });

    describe('_processValues()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      [
        ['autoUpdate', undefined, true],
        ['autoUpdate', true, true],
        ['autoUpdate', 'false', false],
        ['releaseChannel', undefined, 'latest'],
        ['releaseChannel', 'beta', 'beta'],
        ['releaseChannel', 'other', 'latest']
      ].forEach((item) => {
        it(`Sets value of ${item[0]} when ${item[1]}`, () => {
          const values = {};
          values[item[0]] = item[1];
          element._processValues(values);
          assert.equal(values[item[0]], item[2]);
        });
      });
    });

    describe('_setSettings()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });
      [
        ['autoUpdate', true],
        ['autoUpdate', false],
        ['releaseChannel', 'latest']
      ].forEach((item) => {
        it(`Sets value of ${item[0]}`, () => {
          const values = {};
          values[item[0]] = item[1];
          element._setSettings(values);
          assert.equal(element[item[0]], item[1]);
        });
      });
    });
  });

  describe('_checkingUpdateHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets updateStatePage', () => {
      element.updateStatePage = 0;
      element._checkingUpdateHandler();
      assert.equal(element.updateStatePage, 1);
    });

    it('Sets updateProgress', () => {
      element._checkingUpdateHandler();
      assert.isTrue(element.updateProgress);
    });
  });

  describe('_updateAvailableHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets updateStatePage', () => {
      element.updateStatePage = 0;
      element._updateAvailableHandler();
      assert.equal(element.updateStatePage, 2);
    });

    it('Does nothing when updateStatePage is already set', () => {
      element.updateStatePage = 2;
      element._updateAvailableHandler();
      assert.equal(element.updateStatePage, 2);
      // coverge
    });
  });

  describe('_downloadingHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets updateStatePage', () => {
      element.updateStatePage = 0;
      element._downloadingHandler();
      assert.equal(element.updateStatePage, 2);
    });

    it('Does nothing when updateStatePage is already set', () => {
      element.updateStatePage = 2;
      element._downloadingHandler();
      assert.equal(element.updateStatePage, 2);
      // coverge
    });
  });

  describe('_updateNotAvailableHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Resets updateStatePage', () => {
      element.updateStatePage = 1;
      element._updateNotAvailableHandler();
      assert.equal(element.updateStatePage, 0);
    });

    it('Resets updateProgress', () => {
      element._updateNotAvailableHandler();
      assert.isFalse(element.updateProgress);
    });
  });

  describe('_updateErrorHandler()', () => {
    let element;
    let err;
    beforeEach(async () => {
      element = await basicFixture();
      err = {
        code: 'unknown-test-code',
        message: 'test-message'
      };
    });

    it('Sets updateStatePage', () => {
      element._updateErrorHandler(null, err);
      assert.equal(element.updateStatePage, 4);
    });

    it('Resets updateProgress', () => {
      element._updateErrorHandler(null, err);
      assert.isFalse(element.updateProgress);
    });

    it('Sets isError', () => {
      element._updateErrorHandler(null, err);
      assert.isTrue(element.isError);
    });

    it('Sets errorCode', () => {
      element._updateErrorHandler(null, err);
      assert.equal(element.errorCode, 'unknown-test-code');
    });

    it('errorCode is undefined when missing', () => {
      delete err.code;
      element._updateErrorHandler(null, err);
      assert.isUndefined(element.errorCode);
    });

    it('Calls _createErrorMessage() with arguments', () => {
      const spy = sinon.spy(element, '_createErrorMessage');
      element._updateErrorHandler(null, err);
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'unknown-test-code');
      assert.equal(spy.args[0][1], 'test-message');
    });
  });

  describe('_downloadedHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets updateStatePage', () => {
      element.updateStatePage = 0;
      element._downloadedHandler();
      assert.equal(element.updateStatePage, 3);
    });

    it('Sets updateDownloaded', () => {
      element._downloadedHandler();
      assert.isTrue(element.updateDownloaded);
    });
  });

  describe('_createErrorMessage()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    [
      ['ERR_UPDATER_INVALID_RELEASE_FEED', 'Unable to parse releases feed.'],
      ['ERR_UPDATER_NO_PUBLISHED_VERSIONS', 'Unable to find published version.'],
      ['ERR_UPDATER_CHANNEL_FILE_NOT_FOUND', 'Cannot find latest release information for this platform.'],
      ['ERR_UPDATER_LATEST_VERSION_NOT_FOUND', 'Unable to find latest version on GitHub.'],
      ['unknown-test-code', 'Unknown error ocurred.']
    ].forEach((item) => {
      it(`Returns message for ${item[0]}`, () => {
        element._createErrorMessage(item[0]);
        assert.equal(element.errorMessage, item[1]);
      });
    });

    it('Returns passed message', () => {
      element._createErrorMessage('unknown', 'my-message');
      assert.equal(element.errorMessage, 'my-message');
    });
  });

  describe('updateCheck()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls ipc.send with argument', () => {
      const spy = sinon.spy(window.ipc, 'send');
      element.updateCheck();
      window.ipc.send.restore();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'check-for-update');
    });
  });

  describe('updateInstall()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls ipc.send with argument', () => {
      const spy = sinon.spy(window.ipc, 'send');
      element.updateInstall();
      window.ipc.send.restore();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'install-update');
    });
  });

  describe('openNotes()', () => {
    let element;
    let ev;
    beforeEach(async () => {
      element = await basicFixture();
      ev = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: { href: 'test-url' }
      };
    });

    it('Cancels the event', () => {
      const spy = sinon.spy(ev, 'preventDefault');
      element.openNotes(ev);
      assert.isTrue(spy.called);
    });

    it('Stopping the event', () => {
      const spy = sinon.spy(ev, 'stopPropagation');
      element.openNotes(ev);
      assert.isTrue(spy.called);
    });

    it('Calls ipc.send with arguments', () => {
      const spy = sinon.spy(window.ipc, 'send');
      element.openNotes(ev);
      window.ipc.send.restore();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'open-external-url');
      assert.equal(spy.args[0][1], 'test-url');
    });
  });

  describe('_releaseChannelChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when not __settingsRestored', () => {
      element.__settingsRestored = false;
      const spy = sinon.spy(element, 'updateSetting');
      element._releaseChannelChanged({
        detail: {
          value: 'alpha'
        }
      });
      assert.isFalse(spy.called);
    });

    it('Does nothing when cannel is invalid', () => {
      element.__settingsRestored = true;
      const spy = sinon.spy(element, 'updateSetting');
      element._releaseChannelChanged({
        detail: {
          value: 'alpha-centauri'
        }
      });
      assert.isFalse(spy.called);
    });

    it('Calls updateSetting with arguments', () => {
      element.__settingsRestored = true;
      const spy = sinon.spy(element, 'updateSetting');
      element._releaseChannelChanged({
        detail: {
          value: 'alpha'
        }
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'releaseChannel');
      assert.equal(spy.args[0][1], 'alpha');
    });
  });
});
