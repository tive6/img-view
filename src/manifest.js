import { defineManifest } from '@crxjs/vite-plugin'

import { description, displayName, name, version } from '../package.json'
import { fileProtocols, httpProtocols } from './common/config.js'
const isDev = process.env.NODE_ENV === 'development'
const projectName = displayName || name

export default defineManifest({
  name: `${projectName}${isDev ? ` ➡️ Dev` : ''}`,
  description: description,
  version: version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-32.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_title: projectName,
    default_icon: 'img/logo-48.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', 'file:///*/*'],
      js: ['src/contentScript/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        //
        '/icons/*',
        '/img/*',
      ],
      matches: ['<all_urls>'],
    },
  ],
  permissions: [
    //
    'scripting',
    'webRequest',
    'sidePanel',
    'storage',
  ],
  host_permissions: [
    //
    ...fileProtocols,
    ...httpProtocols,
  ],
})
