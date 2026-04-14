import { Link, useParams } from 'react-router-dom';
import { SubpageLayout } from '../components/SubpageLayout';
import { HELP_ARTICLES } from '../help/helpArticles';

export function HelpArticlePage() {
  const { topicId } = useParams<{ topicId: string }>();
  const article = topicId ? HELP_ARTICLES[topicId] : undefined;

  if (!article) {
    return (
      <SubpageLayout title="Help">
        <p className="help-missing">Topic not found.</p>
        <Link to="/help">← Back to help</Link>
      </SubpageLayout>
    );
  }

  return (
    <SubpageLayout title={article.title}>
      <article className="help-article">
        <p className="help-article__summary">{article.summary}</p>
        {article.sections.map((s) => (
          <section key={s.heading} className="help-article__section">
            <h2 className="help-article__h">{s.heading}</h2>
            <p className="help-article__p">{s.body}</p>
          </section>
        ))}
        <Link to="/help" className="help-article__back">
          ← All topics
        </Link>
      </article>
    </SubpageLayout>
  );
}
