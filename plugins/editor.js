import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'

export default (context, inject) => {
  const defaultOptions = {
    id: '',
    data: {},
    onChange: () => {},
  }

  const editor = (options = defaultOptions) => {
    return new EditorJS({
      placeholder: 'Let`s write an awesome story!',
      /**
       * Id of Element that should contain Editor instance
       */
      holder: options.id,
      /**
       * Available Tools list.
       * Pass Tool's class or Settings object for each Tool you want to use
       */
      tools: {
        header: Header,
      },
      /**
       * Previously saved data that should be rendered
       */
      data: options.data || {},
      onChange(data) {
        // pass in function from component to run on change
        options.onChange(data)
      },
    })
  }

  inject('editor', (options) => editor(options))
}
