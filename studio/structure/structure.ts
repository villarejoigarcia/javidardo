import { CaseIcon, CogIcon, TagIcon, RocketIcon, UserIcon } from '@sanity/icons'

export const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([

      S.listItem()
        .title('Projects')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('All Projects')
                .child(S.documentTypeList('project')),
              S.divider(),
              S.listItem()
                .title('Selected')
                .icon(RocketIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Selected Projects')
                    .filter('_type == "project" && selected == true')
                ),
            ])
        ),

      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category')),

      S.listItem()
        .title('About')
        .icon(UserIcon)
        .child(
          S.editor()
            .schemaType('about')
            .documentId('about')
        ),

      S.divider(),

      S.listItem()
        .title('Metadata')
        .icon(CogIcon)
        .child(
          S.editor()
            .schemaType('metadata')
            .documentId('metadata')
        ),
    ])