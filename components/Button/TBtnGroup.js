import TButton from '../TButton.vue'

export default {
  components: {
    TButton,
  },
  render(h) {
    const childs = []
    const items = this.$slots.default.filter((c) => c.tag)

    for (const item of items) {
      const divChilds = []

      divChilds.push(
        h(
          item.componentOptions.tag,
          {
            ...item.componentOptions.props,
            staticClass: 'border-none',
          },
          item.componentOptions.children
        )
      )

      childs.push(h('div', divChilds))
    }

    return h(
      'div',
      {
        staticClass: 'inline-flex border rounded divide-x',
      },
      childs
    )
  },
}
