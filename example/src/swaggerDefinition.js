const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Swagger Petstore',
    version: ' 1.0.5',
    description:
      'This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'bourdakos1@gmail.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  tags: [
    {
      name: 'pet',
      description: 'Everything about your Pets',
      externalDocs: {
        description: 'Find out more',
        url: 'http://swagger.io',
      },
    },
    {
      name: 'store',
      description: 'Access to Petstore orders',
    },
    {
      name: 'user',
      description: 'Operations about user',
      externalDocs: {
        description: 'Find out more about our store',
        url: 'http://swagger.io',
      },
    },
  ],
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
};

module.exports = swaggerDefinition;
