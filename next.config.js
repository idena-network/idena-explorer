const withSass = require('@zeit/next-sass')
const withFonts = require('nextjs-fonts')

module.exports = withSass(
  withFonts({
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            {key: 'Access-Control-Allow-Credentials', value: 'true'},
            {key: 'Access-Control-Allow-Origin', value: '*'},
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET,OPTIONS,POST',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value:
                'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
          ],
        },
      ]
    },
  })
)
