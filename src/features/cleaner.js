const { finder } = require('../helpers/finder')
const { parseRulesFromString } = require('../helpers/parser')

const cleaner = async (octokit, packageName, org, type, selector, excluder, dryRun) => {
    const includeRules = parseRulesFromString(selector)
    const excludeRules = parseRulesFromString(excluder)

    const packages = await finder(packageVersionIterator(octokit, type, packageName, org), includeRules, excludeRules)

    if (+dryRun === 0) {
        packages.map(deletePackageVersion.bind(null, octokit, packageName, org, type))
    } else {
        console.log(`${packages.length} packages found`)
        console.log(JSON.stringify(packages, null, 2))
    }
}

const packageVersionIterator = (github, packageType, packageName, org) => {
    return github.paginate.iterator(github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg, {
        package_type: packageType,
        package_name: packageName,
        org: org
    })
}

const deletePackageVersion = async (github, repo, org, type, package) => {
    await github.rest.packages.deletePackageVersionForOrg({
        package_type: type,
        package_name: repo,
        org: org,
        package_version_id: package.id,
    })
}

module.exports =
{
    cleaner
}