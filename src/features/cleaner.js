const { finder } = require('../helpers/finder')
const { parseRulesFromString } = require('../helpers/parser')
const { retry } = require('../helpers/retry')

const cleaner = async (octokit, packageName, org, type, selector, excluder, dryRun) => {
    const includeRules = parseRulesFromString(selector)
    const excludeRules = parseRulesFromString(excluder)

    const packages = await finder(packageVersionIterator(octokit, type, packageName, org), includeRules, excludeRules)

    console.log(`${packages.length} packages found will be deleted`)
    if (+dryRun === 0) {
        const promises = packages.map(deletePackageVersion.bind(null, octokit, packageName, org, type))
        await Promise.all(promises)
    } else {
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
    await retry(
        () => github.rest.packages.deletePackageVersionForOrg(
            {
                package_type: type,
                package_name: repo,
                org: org,
                package_version_id: package.id,
            },
        ),
    )
}

module.exports =
{
    cleaner
}