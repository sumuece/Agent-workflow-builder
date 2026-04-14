import { Link } from 'react-router-dom';
import { SubpageLayout } from '../components/SubpageLayout';
import { HELP_INDEX } from '../help/helpArticles';

export function HelpHomePage() {
  return (
    <SubpageLayout title="Help">
      <div className="help-home">
        <p className="help-home__lead">
          Guides for workflows, MCP, settings, and sync. Matches the options in the step
          library and Settings app.
        </p>
        <ul className="help-card-list">
          {HELP_INDEX.map((item) => (
            <li key={item.id}>
              <Link to={`/help/${item.id}`} className="help-card">
                <span className="help-card__title">{item.title}</span>
                <span className="help-card__summary">{item.summary}</span>
                <span className="help-card__cta">Read →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SubpageLayout>
  );
}
