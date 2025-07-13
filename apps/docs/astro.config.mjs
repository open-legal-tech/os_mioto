import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Mioto",
      logo: {
        src: './src/assets/mioto_logo.png',
        alt: "Mioto Logo",
        replacesTitle: true
      },
      sidebar: [
        {
          label: 'Einführung',
          items: [
            {slug: 'introduction/grundkonzepte'},
            {slug: 'introduction/anwendungen-verwalten'},
          ],
        },
        {
          label: 'Anwendungen bauen',
          items: [
            {slug: 'build-tools/builder'},
            {slug: 'build-tools/bloecke'},
            {slug: 'build-tools/bloecke-verbinden'},
            {slug: 'build-tools/vorschau'},
            {slug: 'build-tools/variablen'},
            {slug: 'build-tools/theming'},

          ],
        },
        {
          label: 'Arten von Blöcken',
          autogenerate: { directory: 'block-types' },
        },
        {
          label: 'Dokumente generieren',
          items: [
            {slug: 'generate-documents/dokumente'},
            {slug: 'generate-documents/template-einbinden'},
            {slug: 'generate-documents/template-sprache'},
          ],
        },
        {
          label: 'Dokumente generieren',
          slug:'veroeffentlichen',
        },
      ],
    }),
  ],
});
