const base = {
  paths: ['features/**/*.feature'],
  require: ['features/support/**/*.js', 'features/step_definitions/**/*.js']
}

module.exports = {
  default: {
    ...base,
    format: ['progress', 'html:relatorios/cucumber-report.html']
  },
  verificacao: {
    ...base,
    format: ['progress']
  }
}
