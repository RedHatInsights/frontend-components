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

// codespan and code tags escape child text by default, therefore we have to remove all escapes from there
const walkTokens = (token: marked.Token) => {
  if (token.type === 'codespan' || token.type === 'code') {
    token.text = token.text.replace(/\\\*/g, '*').replace(/\\_/g, '_').replace(/\\~/g, '~');
  }
};

marked.use({ walkTokens });

const TemplateProcessor: React.FC<TemplateProcessorProps> = ({ template, definitions, onError }) => {
  // we don't want to apply html styling to data so it is necessary to eacape all special characters ('*', '_', '~')
  definitions = JSON.parse(
    JSON.stringify(definitions ?? {})
      .replace(/\*/g, '\\\\*')
      .replace(/~/g, '\\\\~')
      .replace(/\b_|_\b/g, '\\\\_') // we don't want to escape python variables (e.g. `pydata.bad_rpms`) so match only border '_'
  );

  try {
    const compiledDot = Object.keys(definitions).length !== 0 ? doT.template(template, DOT_SETTINGS)(definitions) : template;
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
