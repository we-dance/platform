// import { userEvent, within } from '@storybook/testing-library'
import { action } from '@storybook/addon-actions'
import TButtonTest from './TButtonTest.vue'
export default {
  title: 'TButtonTest',
  component: TButtonTest,
  argTypes: {
    onClick: { action: true },
    background: { control: 'color'},
    disabled: { control: 'boolean'},
  },
}

const Template = (args) => ({
  components: { TButtonTest },
  setup() {
    return { args, action: action('onClick')}
  },
  template: '<TButtonTest @onClick="action" v-bind="args" />',
})

export const ButtonTitle = Template.bind({})

ButtonTitle.args = {
  label: 'Press',
  background: 'blue',
  padding: 5,
  disabled: false,
}
