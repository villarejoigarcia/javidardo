import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure/structure'

export default defineConfig({
  name: 'default',
  title: 'Javi Dardo',

  projectId: '0b5bcvnl',
  dataset: 'production',
  deployment: {
    appId: 'w3z7dxscxu2v7g30azextfcj',
  },

  plugins: [
    structureTool({ structure }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
