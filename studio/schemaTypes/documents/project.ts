import { defineType, defineField } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',

    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'code',
            title: 'Project Code',
            type: 'number',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'publishedAt',
            title: 'Published At',
            description: 'Displayed in order: newest first',
            type: 'datetime',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'selected',
            title: 'Selected',
            type: 'boolean',
            initialValue: false,
            description: 'Mark to display this project in Selected.',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            //validation: (rule) => rule.required(),
        }),

        // defineField({
        //     name: 'seo',
        //     title: 'Project SEO',
        //     type: 'seo',
        //     description: 'If empty, global SEO will be used.',
        // }),
    ],

    preview: {
        select: {
            title: 'title',
            media: 'images.0',
            publishedAt: 'publishedAt',
            categories0: 'categories.0.title',
            categories1: 'categories.1.title',
            categories2: 'categories.2.title',
        },
        prepare({ title, media, publishedAt, categories0, categories1, categories2 }) {
            const subtitleCategories = [categories0, categories1, categories2].filter(Boolean).join(', ')
            const subtitleDate = publishedAt ? ` • ${new Date(publishedAt).toLocaleDateString()}` : ''
            const subtitle = `${subtitleCategories}${subtitleDate}`

            return { title, media, subtitle }
        }
    }
})