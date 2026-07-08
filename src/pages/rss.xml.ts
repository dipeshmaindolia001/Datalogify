import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const lessons = await getCollection('lessons');

  return rss({
    title: 'Datalogify — Learn Data Analytics by Doing',
    description: 'Practical, hands-on data analytics lessons covering Python, SQL, Excel, EDA, Statistics, and Interview Prep.',
    site: context.site!.toString(),
    items: lessons
      .sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime())
      .map((lesson) => ({
        title: lesson.data.title,
        pubDate: lesson.data.publishedDate,
        description: lesson.data.description,
        link: `/${lesson.data.category}/${lesson.id.replace(/^[^/]+\//, '')}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
