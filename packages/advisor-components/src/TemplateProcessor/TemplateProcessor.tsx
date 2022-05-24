import React from 'react';
import doT from 'dot';
import { marked } from 'marked';
import sanitize, { simpleTransform } from 'sanitize-html';

interface TemplateProcessorProps {
  template: string;
  definitions: Record<string, string | number>;
}

const DOT_SETTINGS = {
  ...doT.templateSettings,
  varname: 'pydata',
  strip: false,
};

const TemplateProcessor: React.FC<TemplateProcessorProps> = ({ template, definitions }) => {
  try {
    const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
    const compiledMd = marked(compiledDot);
    const sanitized = sanitize(compiledMd, {
      allowedAttributes: { '*': ['href', 'target', 'class', 'style', 'rel'] },
      allowedSchemes: ['https'],
      transformTags: {
        ul: simpleTransform('ul', { class: 'pf-c-list', style: 'font-size: inherit' }),
        a: simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
      },
    });

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitized.replace(/<\/a>/gim, ` <i class="fas fa-external-link-alt"></i></a>`),
        }}
      />
    );
  } catch (error) {
    console.warn(error, definitions, template); // eslint-disable-line no-console
    return (
      <React.Fragment>
        {' '}
        Ouch. We were unable to correctly render this text, instead please enjoy the raw data.
        <pre>
          <code>{template}</code>
        </pre>
      </React.Fragment>
    );
  }
};

export default TemplateProcessor;
