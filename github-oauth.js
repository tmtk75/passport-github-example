var githubOAuth = require('github-oauth')({
    githubClient: process.env['GITHUB_CLIENT_ID'],
    githubSecret: process.env['GITHUB_CLIENT_SECRET'],
    baseURL: 'http://localhost:3000',
    loginURI: '/auth/github',
    callbackURI: '/auth/github/callback',
    scope: 'user' // optional, default scope is set to user 
});
 
require('http').createServer(function(req, res) {
    if (req.url.match(/^\/auth\/github$/))
        return githubOAuth.login(req, res);
    if (req.url.match(/^\/auth\/github\/callback/))
        return githubOAuth.callback(req, res);
}).listen(3000)
 
githubOAuth.on('error', function(err) {
    console.error('there was a login error', err);
});
 
githubOAuth.on('token', function(token, serverResponse) {
    console.log('here is your shiny new github oauth token', token);
    serverResponse.end(JSON.stringify(token));
})
