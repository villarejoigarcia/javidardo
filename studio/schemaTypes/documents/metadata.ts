import { defineType, defineField } from 'sanity'

export const metadata = defineType({
  name: 'metadata',
  title: 'Metadata',
  type: 'document',

  fields: [

    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Metadata',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Title used for search engine results and social previews',
    }),

    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Description used for search engine results and social previews',
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image used when shared on Social Media platforms. Must have a 16:9 aspect ratio.',
      options: { hotspot: true },
    }),

    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Global icon for the website. Must be square PNG image.',
      options: { hotspot: false }
    }),

  ],
})