const { expect } = require('chai')

describe('String', function () {
  it('should give me at least 0.25 points for the effort', function () {
    const name = 'gigon'.replace('n', 't') + ' d agneau c est delicieux avec de la polenta'
    expect(name).to.equal('gigot d agneau c est delicieux avec de la polenta')
  })
})