class Operation {
  constructor({ type, operator, value }) {
    this.type = type
    this.operator = operator
    this.value = value
  }

  execute(version) {
    switch (this.type) {
      case 'tags':
        return this.operator(this.value)(version.metadata.container.tags)
      case 'tagCount':
        return this.operator(this.value)(version.metadata.container.tags)
      case 'age':
        return this.operator(this.value)(version.updated_at)
    }
  }
}

module.exports = Operation