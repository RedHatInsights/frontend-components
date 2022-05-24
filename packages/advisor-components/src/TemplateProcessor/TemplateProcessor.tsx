import React from 'react';
import doT from 'dot';
import { marked } from 'marked';

interface TemplateProcessorProps {
  template: string;
  definitions: Record<string, string | number>;
}

const TemplateProcessor: React.FC<TemplateProcessorProps> = ({ template, definitions }) => {
  const DOT_SETTINGS = {
    ...doT.templateSettings,
    varname: 'pydata',
    strip: false,
  };
  const externalLinkIcon = '';

  try {
    const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
    const compiledMd = marked(compiledDot);

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: compiledMd
            .replace(/<ul>/gim, `<ul class="pf-c-list" style="font-size: inherit">`)
            .replace(/<a>/gim, `<a> rel="noopener noreferrer" target="_blank"`)
            .replace(/<\/a>/gim, ` ${externalLinkIcon}</a>`),
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
