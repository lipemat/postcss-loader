const path = require('path')
const { webpack } = require('@webpack-utilities/test')

describe('Options', () => {
  test('Sourcemap - {Boolean}', () => {
    const config = {
      devtool: 'sourcemap',
      loader: {
        test: /\.css$/,
        options: {
          sourceMap: true
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual(
        'module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"'
      )

      expect(source).toMatchSnapshot()

      const map = stats.compilation.modules[1]._source._sourceMap

      map.file = path.posix.relative(__dirname, map.file)
      map.sources = map.sources.map(
        (src) => path.posix.relative(__dirname, src)
      )

      expect(map).toMatchSnapshot()
    })
  })

  test('Sourcemap - {String}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          sourceMap: 'inline'
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual(
        'module.exports = "a { color: rgba(' +
        '255, 0, 0, 1.0) }\\n\\n/*# sourceMappingUR' +
        'L=data:application/json;base64,eyJ2ZXJzaW9' +
        'uIjozLCJzb3VyY2VzIjpbInRlc3QvZml4dHVyZXMvY' +
        '3NzL3N0eWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHB' +
        'pbmdzIjoiQUFBQSxJQUFJLDRCQUFhIiwiZmlsZSI6I' +
        'nRlc3QvZml4dHVyZXMvY3NzL3N0eWxlLmNzcyIsInN' +
        'vdXJjZXNDb250ZW50IjpbImEgeyBjb2xvcjogYmxhY' +
        '2sgfVxuIl19 */"'
      )

      expect(source).toMatchSnapshot()
    })
  })
})
