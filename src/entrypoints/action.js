const { cleaner } = require('../features/cleaner')

module.exports = async ({ github, context, core }) => {
  const { PACKAGE_NAME, ORG, SELECTOR = '', EXCLUDER = '', PACKAGE_TYPE = 'container', DRY_RUN = '1' } = process.env

  cleaner(github, PACKAGE_NAME, ORG, PACKAGE_TYPE, SELECTOR, EXCLUDER, DRY_RUN)
}