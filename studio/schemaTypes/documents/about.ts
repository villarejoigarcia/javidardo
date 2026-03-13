import { defineType, defineField } from 'sanity'
import { LinkIcon, PinIcon } from '@sanity/icons'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',

  fields: [

    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'About',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'listening',
      title: 'Listening',
      type: 'array',
      of: [
        {
          type: 'object',
          icon: LinkIcon,
          fields: [

            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),

            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],

          preview: {
            select: {
              title: 'label',
              subtitle: 'url'
            }
          }

        }
      ]
    }),

    defineField({
      name: 'clients',
      title: 'Clients',
      description: 'Write, drag and drop to reorder or add new clients.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { sortable: true }
    }),

    defineField({
      name: 'contactLinks',
      title: 'Contact Links',
      description: 'Instagram, Phone & Email',
      type: 'array',
      of: [
        {
          type: 'object',
          icon: PinIcon,
          fields: [

            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),

            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.uri({
                scheme: ['https', 'mailto', 'tel']
              })
            }),

          ],

          preview: {
            select: {
              title: 'label',
              subtitle: 'url'
            }
          }

        }
      ]
    }),

  ],
})