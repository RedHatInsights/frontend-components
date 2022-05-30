import React from 'react';
import doT from 'dot';
import { marked } from 'marked';
import sanitize, { simpleTransform } from 'sanitize-html';

interface TemplateProcessorProps {
  template: string;
  definitions: Record<string, string | number>;
  onError?: (e: Error) => void;
}

const DOT_SETTINGS = {
  ...doT.templateSettings,
  varname: 'pydata',
  strip: false,
};

const TemplateProcessor: React.FC<TemplateProcessorProps> = ({ template, definitions, onError }) => {
  try {
    const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
    const compiledMd = marked(compiledDot);
    const sanitized = sanitize(compiledMd, {
      allowedAttributes: { '*': ['href', 'target', 'class', 'style', 'rel'] },
      allowedSchemes: ['https'], // links must lead only to https://access.redhat.com/
      transformTags: {
        ul: simpleTransform('ul', { class: 'pf-c-list', style: 'font-size: inherit' }),
        a: simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
      },
    });

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitized.replace(
            /<\/a>/gim,
            ` <i class="fas fa-external-link-alt"></i></a>` // add an icon to external links
          ),
        }}
      />
    );
  } catch (error) {
    console.warn(error, definitions, template);
    onError && onError(error as Error);
    return (
      <pre>
        <code>{template}</code>
      </pre>
    );
  }
};

export default TemplateProcessor;
