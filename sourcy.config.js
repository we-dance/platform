module.exports = {
  sources: [
    {
      spreadsheetId: '1oCLW_c_Jr021AT6_gGngtFB94P_5ftSCJGp-XqdvRaM',
      range: 'Styles',
      output: './content/styles',
      format: 'yaml',
    },
    {
      spreadsheetId: '1bYfvOamLMvJH461xYYXoBYKqqFpPsAHVXF90kzy3CFg',
      range: 'Langs',
      output: './locales',
      format: 'yaml',
      transformer: 'i18n',
    },
  ],
}
