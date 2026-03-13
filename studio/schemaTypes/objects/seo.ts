import {defineType, defineField} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',

  fields: [

    defineField({
      name: 'title',
      title: 'SEO Title',
      type: 'string',
      description: 'Title used for search engines and browser tabs',
    }),

    defineField({
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Description used for search engine results and social previews',
    }),

    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'string',
      description: 'Separate keywords with comma and space. Ex: design, creative studio, branding',
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image used when shared on Social Media platforms.',
      options: { hotspot: true },
    }),

  ]
})