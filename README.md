# Action-ghcr-batch-delete-versions

This action can delete batch of ghcr or npm package versions

## Usage

See [action.yml](action.yml)

Basic:

```yaml
steps:
- name: Clean GHCR packages
  uses: cresh-io/action-ghcr-batch-delete-versions@v1
  with:
    github-access-token: "${{ secrets.GITHUB_TOKEN }}"
    org: "${{ github.repository_owner }}"
    package_name: "${{ github.repository }}"
    package_type: "container"   # Default is container because the action was design only for containers at first
    selector: |
        type=tagCount;operator=greaterThan;value=0
        type=tags;operator=startsWith;value=pr-1-
    excluder: |
        type=tags;operator=equals;value=pr-1-ee20adc
    dry-run: "0"
- name: Clean NPM packages
  uses: cresh-io/action-ghcr-batch-delete-versions@v1
  with:
    github-access-token: "${{ secrets.GITHUB_TOKEN }}"
    org: "${{ github.repository_owner }}"
    package_name: "${{ github.repository }}"
    package_type: "npm"
    selector: |
        type=name;operator=contains;value=-rc.
    excluder: |
        type=name;operator=contains;value=-rc.ee20adc
    dry-run: "0"
```

In this example above we will delete :

- GHCR package versions with at least 1 tag **AND** at least 1 tag starting with `pr-1-` **BUT** we exclude the version with a tag equals to `pr-1-ee20adc`
- NPM package versions with at name containing `-rc.` **BUT** we exclude the versions with a name containing `-rc.ee20adc`

### Parameters

- **github-access-token** * required

  Token with permission to access and delete packages.

- **org** * required

  Name of the organization that owns the packages.

- **package_name** * required

  Name of the package.

- **package_type** * optional - default: container

  Type of the package (npm or container)?

- **selector** * required

  Multi line string use to select which packages versions should be deleted. see [selector/excluder](#selector-includer-inputs)

- **excluder** * optional

  Multi line string use to exclude some versions to avoid deletion. see [selector/excluder](#selector-and-includer-inputs)

- **dry-run** * optional

  Set the value to 0 to delete the package versions. By default there is only logs to prevent data loss.

## Selector and Includer inputs

Selector and Includer are in the form of a key-value pair list in CSV format to remove limitations intrinsically linked to GitHub Actions (only string format is handled in the input fields). Here is an example:

```yaml
selector: |
  type=tagCount;operator=greaterThan;value=0
  type=tags;operator=startsWith;value=pr-1-
  type=age;operator=olderThan;value=5d
  type=name;operator=equal;value=1.1.1-rc.1
```

Each entry (rule) is defined by a `type`, which are:

- [`type=tagCount`](#tagcount)
- [`type=tags`](#tags)
- [`type=age`](#age)
- [`type=name`](#name)

An `operator` see each type for available operators.

A `value` see each type for available values.

### tagCount

Can be used with types:

- container

Use to select/exclude versions regarding the number of tags associated.

`operator` attribute supports :

- `equals`
- `greaterThan`
- `greaterThanOrEqual`
- `lessThan`
- `lessThanOrEqual`

If not specified, the default value is `equals`.

`value` attribute supports numeric values representing the number of tags.

### tags

Can be used with types:

- container

Use to select/exclude versions regarding the value of associated tags.

`operator` attribute supports :

- `equals`
- `startsWith`
- `endsWith`
- `contains`

If not specified, the default value is `equals`.

`value` attribute supports string values representing the prefix, suffix, part or complete tag value.

### age

Can be used with types:

- container

Use to select/exclude versions regarding age of the version.

`operator` attribute supports :

- `olderThan`
- `youngerThan`

If not specified, the default value is `olderThan`.

`value` attribute supports string values representing the offset from now, for instance:

- `1Y` 1 year
- `1M` 1 month
- `1d` 1 day
- `1h` 1 hour
- `1m` 1 minutes
- `1s` 1 seconds

You can combine multiple values if you order the values, for instance:

- `1Y1M1d1h1m1s` 1 year 1 Month 1 Day 1 Hour 1 Minute 1 Second
- `7d15h` 7 days 15 hours

### name

Can be used with types:

- npm

Use to select/exclude versions regarding name of the version.

`operator` attribute supports :

- `isEqual`
- `contains`
- `startsWith`
- `endsWith`

If not specified, the default value is `isEqual`.

`value` attribute supports string values representing the prefix, suffix, part or complete name value.

## CLI

For specific needs (eg. delete specific version) you can use is as a CLI tool :

- Clone  the repository
- Install dependencies: `npm i`
- Link bin: `npm link`

Include and exclude rules are separated with '#' when you use the cli. For instance :

`clean-packages --org "org" --packageName "packageName" --selector "type=tagCount;value=1#type=tags;operator=startsWith;value=pr-" --token 'github_token' --dryRun 1`

Arguments :

- org: organization that owns the package
- packageName: name of the package
- packageType: type of the package (npm or container)
- selector: select rules separated with '#'
- excluder: select rules separated with '#'
- token: Github Token
- dryRun: dry run option (default is 1)

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
