const finder = async (versionsIterator, includeRules, excludeRules) => {
  const tempSelected = []
  const selected = []
  for await (const { data: packages } of versionsIterator) {
    for (const pkg of packages) {
      let isCandidate = true
      for (const rule of includeRules) {
        isCandidate = isCandidate && rule.execute(pkg)
      }
      if (isCandidate) {
        tempSelected.push(pkg)
      }
    }
  }
  for (const pkg of tempSelected) {
    let isExcluded = excludeRules.length === 0 ? false : true
    for (const rule of excludeRules) {
      isExcluded = isExcluded && rule.execute(pkg)
    }
    if (!isExcluded) {
      selected.push(pkg)
    }
  }
  return selected
}

module.exports =
{
  finder
}