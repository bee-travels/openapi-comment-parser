const parseComments = require('comment-parser');

const tagToName = {
  operationId: 'operation id',
  summary: 'summary',
  description: 'description',
  tag: 'tag',
  bodyDescription: 'body description',
  externalDocs: 'url',
  server: 'url',
  cookieParam: 'parameter name',
  headerParam: 'parameter name',
  queryParam: 'parameter name',
  pathParam: 'parameter name',
  bodyContent: 'content-type',
  security: 'security scheme name',
};

const missing = (context, comment, tag, name) => {
  const commentLines = comment.value.split(/\r\n|\r|\n/);
  const start = commentLines[tag.line].indexOf(`@${tag.tag}`);
  const endOfLine = commentLines[tag.line].length;

  context.report({
    loc: {
      start: {
        line: comment.loc.start.line + tag.line,
        column: start,
      },
      end: {
        line: comment.loc.start.line + tag.line,
        column: endOfLine,
      },
    },
    message: `Missing ${name}`,
  });
};

const statusCodeUndefined = (context, comment, tag, status) => {
  const commentLines = comment.value.split(/\r\n|\r|\n/);
  const start = commentLines[tag.line].indexOf(`@${tag.tag}`);
  const end = start + tag.tag.length + 1;

  context.report({
    loc: {
      start: {
        line: comment.loc.start.line + tag.line,
        column: end + 1,
      },
      end: {
        line: comment.loc.start.line + tag.line,
        column: end + 1 + status.length,
      },
    },
    message: `Status code '${status}' is not defined`,
  });
};

function parseErrors(comment, context) {
  const seenResponses = [];

  const openAPIRegex = /^(GET|PUT|POST|DELETE|OPTIONS|HEAD|PATCH|TRACE) \/.*$/;

  const [jsDocComment] = parseComments(`/*${comment.value}*/`);

  if (openAPIRegex.test(jsDocComment.description)) {
    jsDocComment.tags.forEach((tag) => {
      // const commentLines = comment.value.split(/\r\n|\r|\n/);
      // const start = commentLines[tag.line].indexOf(`@${tag.tag}`);
      // const end = start + tag.tag.length + 1;
      // const endOfLine = commentLines[tag.line].length;

      switch (tag.tag) {
        // required: name
        case 'operationId':
        case 'summary':
        case 'description':
        case 'tag':
        case 'bodyDescription':
        case 'externalDocs':
        case 'server':
        case 'cookieParam':
        case 'headerParam':
        case 'queryParam':
        case 'pathParam':
        case 'bodyContent':
        case 'security':
          if (!tag.name) {
            missing(context, comment, tag, tagToName[tag.tag]);
          }
          break;

        // required: name
        // required: description
        case 'response':
          if (!tag.name) {
            missing(context, comment, tag, 'status code');
          } else {
            seenResponses.push(tag.name);
          }
          if (!tag.description) {
            missing(context, comment, tag, 'response description');
          }
          break;

        // required: name
        // required: schema
        case 'callback':
          if (!tag.name) {
            missing(context, comment, tag, 'callback name');
          }
          if (!tag.schema) {
            missing(context, comment, tag, 'callback component');
          }
          break;

        // required: name [status.content]
        case 'responseContent': {
          const [status, content] = tag.name.split('.');
          if (!status) {
            missing(context, comment, tag, 'status code');
          } else if (!seenResponses.includes(status)) {
            statusCodeUndefined(context, comment, tag, status);
          }
          if (!content) {
            missing(context, comment, tag, 'content-type');
          }
          break;
        }

        // required: name [status.header]
        case 'responseHeader': {
          const [status, header] = tag.name.split('.');
          if (!status) {
            missing(context, comment, tag, 'status code');
          } else if (!seenResponses.includes(status)) {
            statusCodeUndefined(context, comment, tag, status);
          }
          if (!header) {
            missing(context, comment, tag, 'header name');
          }
          break;
        }

        // required: name [status.header]
        // required: schema
        case 'responseHeaderComponent': {
          const [status, header] = tag.name.split('.');
          if (!status) {
            missing(context, comment, tag, 'status code');
          } else if (!seenResponses.includes(status)) {
            statusCodeUndefined(context, comment, tag, status);
          }
          if (!header) {
            missing(context, comment, tag, 'header name');
          }
          if (!tag.type) {
            missing(context, comment, tag, 'header component');
          }
          break;
        }

        // required: name [status.contentType.example]
        // required: schema
        case 'responseExample': {
          const [status, contentType, example] = tag.name.split('.');
          if (!status) {
            missing(context, comment, tag, 'status code');
          } else if (!seenResponses.includes(status)) {
            statusCodeUndefined(context, comment, tag, status);
          }
          if (!contentType) {
            missing(context, comment, tag, 'content-type');
          }
          if (!example) {
            missing(context, comment, tag, 'example name');
          }
          if (!tag.type) {
            missing(context, comment, tag, 'example component');
          }
          break;
        }

        // required: name [status.contentType.example]
        // required: schema
        case 'responseLink': {
          const [status, link] = tag.name.split('.');
          if (!status) {
            missing(context, comment, tag, 'status code');
          } else if (!seenResponses.includes(status)) {
            statusCodeUndefined(context, comment, tag, status);
          }
          if (!link) {
            missing(context, comment, tag, 'link component');
          }
          break;
        }

        case 'bodyComponent':
          if (!tag.type) {
            missing(context, comment, tag, 'body component');
          }
          break;

        case 'paramComponent':
          if (!tag.type) {
            missing(context, comment, tag, 'parameter component');
          }
          break;

        case 'responseComponent':
          if (!tag.name) {
            missing(context, comment, tag, 'status code');
          }
          if (!tag.type) {
            missing(context, comment, tag, 'response component');
          }
          break;

        case 'deprecated':
        case 'bodyRequired':
        default:
          break;
      }
    });
  }
}

function parse(comment, context) {
  const openAPIRegex = /^(GET|PUT|POST|DELETE|OPTIONS|HEAD|PATCH|TRACE) \/.*$/;

  const [jsDocComment] = parseComments(`/*${comment.value}*/`);

  if (openAPIRegex.test(jsDocComment.description)) {
    const [method, path] = jsDocComment.description.split(' ');

    if (
      !jsDocComment.tags.find(
        (tag) => tag.tag === 'response' || tag.tag === 'responseComponent'
      )
    ) {
      context.report({
        loc: comment.loc,
        message: `At least one response is required`,
      });
    }

    jsDocComment.tags.forEach((tag) => {
      const commentLines = comment.value.split(/\r\n|\r|\n/);
      const start = commentLines[tag.line].indexOf(`@${tag.tag}`);
      const end = start + tag.tag.length + 1;
      const endOfLine = commentLines[tag.line].length;

      if (
        tag.tag.includes('body') &&
        (method === 'GET' || method === 'DELETE')
      ) {
        context.report({
          loc: {
            start: {
              line: comment.loc.start.line + tag.line,
              column: start,
            },
            end: {
              line: comment.loc.start.line + tag.line,
              column: endOfLine,
            },
          },
          message: `${method.toLowerCase()} requests should not have a body`,
        });
      }

      switch (tag.tag) {
        // no: schema
        case 'operationId':
        case 'summary':
        case 'description':
        case 'tag':
        case 'bodyDescription':
        case 'externalDocs':
        case 'server':
        case 'response':
        case 'bodyComponent':
        case 'paramComponent':
          if (tag.type) {
            context.report({
              loc: {
                start: {
                  line: comment.loc.start.line + tag.line,
                  column: end + 1,
                },
                end: {
                  line: comment.loc.start.line + tag.line,
                  column: end + 1 + `{${tag.type}}`.length,
                },
              },
              message: `Unnecessary type declaration '{${tag.type}}'`,
            });
          }
          break;

        // no: name
        // no: description
        // no: schema
        case 'deprecated':
        case 'bodyRequired':
          if (tag.type || tag.name || tag.description) {
            context.report({
              loc: {
                start: {
                  line: comment.loc.start.line + tag.line,
                  column: end + 1,
                },
                end: {
                  line: comment.loc.start.line + tag.line,
                  column: endOfLine,
                },
              },
              message: `Unnecessary options`,
            });
          }
          break;

        // no: description
        case 'bodyContent':
        case 'callback':
        case 'responseContent':
        case 'responseHeaderComponent':
        case 'responseExample':
        case 'responseLink':
        case 'responseComponent':
          if (tag.description) {
            // TODO: update this to highlight right area.
            // context.report({
            //   loc: {
            //     start: {
            //       line: comment.loc.start.line + tag.line,
            //       column: end + 1,
            //     },
            //     end: {
            //       line: comment.loc.start.line + tag.line,
            //       column: end + 1 + `{${tag.type}}`.length,
            //     },
            //   },
            //   message: `Unnecessary description`,
            // });
          }
          break;

        // no:       description
        // no:       schema
        case 'security':
          // TODO: implement.
          break;

        case 'cookieParam':
        case 'headerParam':
        case 'queryParam':
        case 'pathParam':
        case 'responseHeader':
          break;

        default:
          // warn
          context.report({
            loc: {
              start: {
                line: comment.loc.start.line + tag.line,
                column: start,
              },
              end: {
                line: comment.loc.start.line + tag.line,
                column: endOfLine,
              },
            },
            message: `'@${tag.tag}' is an invalid tag`,
          });
          break;
      }
    });
  }
}

function getComments(cb) {
  return {
    Program(node) {
      node.comments
        .filter((comment) => comment.type === 'Block')
        .forEach((comment) => {
          cb(comment);
        });
    },
  };
}

module.exports = {
  rules: {
    errors: {
      create: function (context) {
        return getComments((comment) => {
          parseErrors(comment, context);
        });
      },
    },
    warnings: {
      create: (context) => {
        return getComments((comment) => {
          parse(comment, context);
        });
      },
    },
  },
  configs: {
    recommended: {
      plugins: ['openapi-jsdoc'],
      rules: {
        'openapi-jsdoc/warnings': 'warn',
        'openapi-jsdoc/errors': 'error',
      },
    },
  },
};
