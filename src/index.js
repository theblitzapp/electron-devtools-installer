import electron, { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import semver from 'semver';

import downloadChromeExtension from './downloadChromeExtension';
import { getPath } from './utils';

const { BrowserWindow } = remote || electron;

let IDMap = {};
const getIDMapPath = () => path.resolve(getPath(), 'IDMap.json');
if (fs.existsSync(getIDMapPath())) {
  try {
    IDMap = JSON.parse(fs.readFileSync(getIDMapPath(), 'utf8'));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('electron-devtools-installer: Invalid JSON present in the IDMap file');
  }
}

const install = (extensionReference, forceDownload = false) => {
  if (Array.isArray(extensionReference)) {
    return Promise.all(extensionReference.map(extension => install(extension, forceDownload)));
  }
  let chromeStoreID;
  if (typeof extensionReference === 'object' && extensionReference.id) {
    chromeStoreID = extensionReference.id;
    const electronVersion = process.versions.electron.split('-')[0];
    if (!semver.satisfies(electronVersion, extensionReference.electron)) {
      return Promise.reject(
        new Error(`Version of Electron: ${electronVersion} does not match required range ${extensionReference.electron} for extension ${chromeStoreID}`),
      );
    }
  } else if (typeof extensionReference === 'string') {
    chromeStoreID = extensionReference;
  } else {
    return Promise.reject(new Error(`Invalid extensionReference passed in: "${extensionReference}"`));
  }
  const extensionName = IDMap[chromeStoreID];
  const extensionInstalled = extensionName &&
    BrowserWindow.getDevToolsExtensions &&
    BrowserWindow.getDevToolsExtensions()[extensionName];
  if (!forceDownload && extensionInstalled) {
    return Promise.resolve(IDMap[chromeStoreID]);
  }
  return downloadChromeExtension(chromeStoreID, forceDownload)
    .then((extensionFolder) => {
      // Use forceDownload, but already installed
      if (extensionInstalled) {
        BrowserWindow.removeDevToolsExtension(extensionName);
      }
      const name = BrowserWindow.addDevToolsExtension(extensionFolder);
      fs.writeFileSync(
        getIDMapPath(),
        JSON.stringify(Object.assign(IDMap, {
          [chromeStoreID]: name,
        })),
      );
      return Promise.resolve(name);
    });
};

export default install;
export const EMBER_INSPECTOR = {
  id: 'bmdblncegkenkacieihfhpjfppoconhi',
  electron: '>=1.2.1',
};
export const REACT_DEVELOPER_TOOLS = {
  id: 'fmkadmapgofadopljbjfkapdkoienihi',
  electron: '>=1.2.1',
};
export const BACKBONE_DEBUGGER = {
  id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',
  electron: '>=1.2.1',
};
export const JQUERY_DEBUGGER = {
  id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',
  electron: '>=1.2.1',
};
export const ANGULARJS_BATARANG = {
  id: 'ighdmehidhipcmcojjgiloacoafjmpfk',
  electron: '>=1.2.1',
};
export const VUEJS_DEVTOOLS = {
  id: 'nhdogjmejiglipccpnnnanhbledajbpd',
  electron: '>=1.2.1',
};
export const REDUX_DEVTOOLS = {
  id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',
  electron: '>=1.2.1',
};
export const REACT_PERF = {
  id: 'hacmcodfllhbnekmghgdlplbdnahmhmm',
  electron: '>=1.2.6',
};
export const CYCLEJS_DEVTOOL = {
  id: 'dfgplfmhhmdekalbpejekgfegkonjpfp',
  electron: '>=1.2.1',
};
export const APOLLO_DEVELOPER_TOOLS = {
  id: 'jdkknkkbebbapilgoeccciglkfbmbnfm',
  electron: '>=1.2.1',
};
export const MOBX_DEVTOOLS = {
  id: 'pfgnfdagidkfgccljigdamigbcnndkod',
  electron: '>=1.2.1',
};
