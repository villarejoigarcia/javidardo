import { defineType, defineField } from 'sanity'
import { CaseIcon } from '@sanity/icons'

export const project = defineType({
    name: 'project',
    title: 'Project',
    icon: CaseIcon,
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
            title: 'Category',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            validation: (rule) => rule.required(),
        }),

    ],

    preview: {
        select: {
            title: 'title',
            images: 'images',
            category: 'categories.0.title',
            publishedAt: 'publishedAt',
        },
        prepare({ title, images, category, publishedAt }) {
            const subtitleDate = publishedAt ? ` • ${new Date(publishedAt).toLocaleDateString()}` : ''
            const subtitle = `${category || ''}${subtitleDate}`

            return {
                title,
                media: images?.[0],
                subtitle
            }
        }
    }
})