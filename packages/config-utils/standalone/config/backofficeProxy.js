const realms = require('../default/keycloak/realm_export.json');
const users = realms.find(f => f.id === 'redhat-external').users;

// https://backoffice-proxy-insights-services.ext.us-east.aws.preprod.paas.redhat.com/docs/#/
// https://gitlab.cee.redhat.com/insights-platform/backoffice-proxy
module.exports = {
    context: '/api/insights-services',
    register({ req, res }) {
        if (req.url === '/') {
            res.json({ message: 'success' });
        } else if (req.url === '/v1/sendEmails') {
            if (!req.body.emails || !Array.isArray(req.body.emails) || req.body.emails.length === 0) {
                res.status(400).json('Missing emails field');
            }
            console.log('mocking sending', req.body.emails.length, 'emails');
            res.json({ message: 'success' });
        } else if (req.url === '/v1/users') {
          const queryBy = req.query.queryBy && req.query.queryBy === 'userId' ? 'userId' : 'principal';
          if (queryBy !== 'userId') {
            res.status(400).json({ message: 'idk how to query by principal' });
          }
          if (!(req.body && Array.isArray(req.body.users) && req.body.users.length > 0)) {
            res.status(400).json({ message: 'must include users to query' });
          }

          const filteredUsers = users
            .filter(u => req.body.users.includes(u.attributes.account_id[0]))
            .map(u => ({
              id: +u.attributes.account_id[0],
              username: u.username,
              email: u.email,
              first_name: u.firstName,
              last_name: u.lastName,
              account_number: u.attributes.account_number[0] + '',
              address_string: `${u.username}'s address that isn't in keycloak`,
              is_active: true,
              is_org_admin: u.attributes.is_org_admin[0] === 'true',
              is_internal: u.attributes.is_internal[0] === 'true',
              locale: "en_US",
              org_id: +u.attributes.org_id[0],
              display_name: "Display name?",
              type: "system"
            }));

          res.json(filteredUsers);
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404');
    }
};
