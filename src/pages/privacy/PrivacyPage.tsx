import { privacyPolicyIntro, privacyPolicySections, privacyPolicyTitle } from '../../shared/privacyPolicy';
import './privacy.css';

export function PrivacyPage() {
  return (
    <main className="privacy-page">
      <article className="privacy-document">
        <h1>{privacyPolicyTitle}</h1>
        <p>{privacyPolicyIntro}</p>
        {privacyPolicySections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}
