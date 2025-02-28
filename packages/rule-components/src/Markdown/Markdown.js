import React from 'react';
import propTypes from 'prop-types';

import doT from 'dot';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

marked.Renderer.prototype.link = ({ href, text }) => {
  return `<a href="${href}" rel="noopener noreferrer" target="_blank" class="ins-c-rule__link-in-description">${text}</a>`;
};

marked.setOptions({
  renderer: new marked.Renderer(),
});

const Markdown = ({ template, definitions }) => {
  const DOT_SETTINGS = { ...doT.templateSettings, varname: ['pydata'], strip: false };
  const sanitizeOptions = {
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['style'] },
    transformTags: {
      ul() {
        return {
          tagName: 'ul',
          attribs: { class: 'pf-v6-c-list' },
        };
      },
    },
    textFilter(text) {
      return text.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
    },
  };
  const externalLinkIcon = '<i class="fas fa-external-link-alt"></i>';

  try {
    const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
    const compiledMd = marked(sanitizeHtml(compiledDot, sanitizeOptions), { async: false });

    return (
      <div
        className="ins-c-rule__markdown"
        dangerouslySetInnerHTML={{
          __html: compiledMd
            .replace(/<ul>/gim, `<ul class="pf-v6-c-list" style="font-size: inherit">`)
            .replace(/<a>/gim, `<a rel="noopener noreferrer" target="_blank">`)
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

Markdown.propTypes = {
  template: propTypes.string.isRequired,
  definitions: propTypes.object,
};

export default Markdown;
