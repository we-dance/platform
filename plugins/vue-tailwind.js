import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import {
  TRichSelect,
  TRadioGroup,
  TCheckboxGroup,
  TCheckbox,
  TInput,
  TPagination,
} from 'vue-tailwind/dist/components'

const settings = {
  VtCheckbox: {
    component: TCheckbox,
    props: {
      classes: {
        label: '',
        input:
          'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600',
        inputWrapper: '',
        wrapper: '',
      },
    },
  },
  TPagination: {
    component: TPagination,
    props: {
      classes: {
        wrapper:
          'flex justify-center border-collapse text-center bg-white mx-auto shadow-sm',
        element:
          'w-8 h-8 border border-gray-200 table-cell hover:border-blue-100',
        activeElement:
          'w-8 h-8 border border-gray-200 border-blue-500 table-cell hover:border-blue-600',
        disabledElement: 'w-8 h-8 border border-gray-200 table-cell',
        ellipsisElement: 'w-8 h-8 border border-gray-200 hidden md:table-cell',
        activeButton:
          'bg-blue-500 w-full h-full text-white hover:bg-blue-600 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        disabledButton:
          'opacity-25 w-full h-full cursor-not-allowed transition duration-100 ease-in-out',
        button:
          'hover:bg-blue-100 w-full h-full transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        ellipsis: '',
      },
      variants: {
        rounded: {
          wrapper: 'bg-white mx-auto text-center flex space-x-2',
          element: 'w-8 h-8 rounded-full',
          activeElement: 'w-8 h-8 rounded-full',
          disabledElement: 'w-8 h-8 rounded-full',
          ellipsisElement: 'w-8 h-8 rounded-full hidden md:inline',
          activeButton:
            'border border-blue-500 bg-blue-500 w-full h-full rounded-full text-white hover:bg-blue-600 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          disabledButton:
            'border border-gray-200  opacity-25 w-full h-full rounded-full cursor-not-allowed transition duration-100 ease-in-out',
          button:
            'border border-gray-200 hover:bg-blue-100 hover:border-blue-100 rounded-full w-full h-full transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          ellipsis: '',
        },
      },
    },
  },
  VtInput: {
    component: TInput,
    props: {
      fixedClasses:
        'block text-sm w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes:
        'text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 ',
      variants: {
        danger: 'border-red-300 bg-red-50 placeholder-red-200 text-red-900',
        success:
          'border-green-300 bg-green-50 placeholder-gray-400 text-green-900',
      },
    },
  },
  TCheckboxGroup: {
    component: TCheckboxGroup,
    props: {
      classes: {
        groupWrapper: 'flex flex-col',
        label: 'ml-2 text-gray-700 text-sm',
        input:
          'transition duration-100 ease-in-out rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0  disabled:opacity-50 disabled:cursor-not-allowed text-blue-500 border-gray-300',
      },
      variants: {
        danger: {
          groupWrapper: 'flex flex-col',
          label: 'ml-2 text-red-500 text-sm',
          input:
            'transition duration-100 ease-in-out rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0  disabled:opacity-50 disabled:cursor-not-allowed text-red-500 border-red-500',
        },
        buttons: {
          groupWrapper: 'flex',
          label: '',
          labelChecked: '',
          wrapper:
            'mx-1 bg-white border border-gray-300 flex items-center px-4 py-2 rounded shadow-sm cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          wrapperChecked:
            'mx-1 bg-gray-100 border border-gray-300 flex items-center px-4 py-2 rounded shadow-inner cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          inputWrapper: '',
          inputWrapperChecked: '',
          input: 'absolute invisible',
        },
      },
    },
  },
  TRadioGroup: {
    component: TRadioGroup,
    props: {
      classes: {
        groupWrapper: 'flex flex-col',
        label: 'ml-2 text-gray-700 text-sm',
        input:
          'text-blue-500 transition duration-100 ease-in-out border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
      },
      variants: {
        danger: {
          groupWrapper: 'flex flex-col',
          label: 'ml-2 text-red-500 text-sm',
          input:
            'text-red-500 transition duration-100 ease-in-out border-red-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
        },
        buttons: {
          groupWrapper: 'flex',
          label: '',
          labelChecked: '',
          wrapper:
            'mx-1 bg-white border border-gray-300 flex items-center px-4 py-2 rounded shadow-sm cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          wrapperChecked:
            'mx-1 bg-gray-100 border border-gray-300 flex items-center px-4 py-2 rounded shadow-inner cursor-pointer focus:shadow-outline text-sm text-gray-700 hover:text-gray-500 leading-5 uppercase',
          inputWrapper: '',
          inputWrapperChecked: '',
          input: 'absolute invisible',
        },
      },
    },
  },
  TRichSelect: {
    name: 'TRichSelect',
    component: TRichSelect,
    props: {
      fixedClasses: {
        wrapper: 'relative text-sm leading-tight',
        buttonWrapper: 'inline-block relative w-full',
        selectButton: 'w-full flex text-left justify-between items-center',
        selectButtonLabel: 'block truncate',
        selectButtonTagWrapper: 'flex flex-wrap overflow-hidden',
        selectButtonTag:
          'bg-blue-500 block disabled:cursor-not-allowed disabled:opacity-50 duration-100 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded shadow-sm text-sm text-white transition white-space-no m-0.5 max-w-full overflow-hidden h-8 flex items-center',
        selectButtonTagText: 'px-3',
        selectButtonTagDeleteButton:
          '-ml-1.5 h-full hover:bg-blue-600 hover:shadow-sm inline-flex items-center px-2 transition',
        selectButtonTagDeleteButtonIcon: 'w-3 h-3',
        selectButtonPlaceholder: 'block truncate',
        selectButtonIcon: 'fill-current flex-shrink-0 ml-1 h-4 w-4',
        selectButtonClearButton:
          'flex flex-shrink-0 items-center justify-center absolute right-0 top-0 m-2 h-6 w-6',
        selectButtonClearIcon: 'fill-current h-3 w-3',
        dropdown: 'absolute w-full z-10',
        dropdownFeedback: '',
        loadingMoreResults: '',
        optionsList: 'overflow-auto',
        searchWrapper: 'inline-block w-full',
        searchBox: 'inline-block w-full',
        optgroup: '',
        option: 'cursor-pointer',
        disabledOption: 'opacity-50 cursor-not-allowed',
        highlightedOption: 'cursor-pointer',
        selectedOption: 'cursor-pointer',
        selectedHighlightedOption: 'cursor-pointer',
        optionContent: '',
        optionLabel: 'truncate block',
        selectedIcon: 'fill-current h-4 w-4',
        enterClass: '',
        enterActiveClass: '',
        enterToClass: '',
        leaveClass: '',
        leaveActiveClass: '',
        leaveToClass: '',
      },
      classes: {
        wrapper: '',
        buttonWrapper: '',
        selectButton:
          'px-3 py-2 text-black transition duration-100 ease-in-out bg-white border border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        selectButtonLabel: '',
        selectButtonTagWrapper: '-mx-2 -my-2.5 py-1 pr-8',
        selectButtonTag:
          'bg-blue-500 block disabled:cursor-not-allowed disabled:opacity-50 duration-100 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded shadow-sm text-sm text-white transition white-space-no m-0.5 max-w-full overflow-hidden h-8 flex items-center',
        selectButtonTagText: 'px-3',
        selectButtonTagDeleteButton:
          '-ml-1.5 h-full hover:bg-blue-600 hover:shadow-sm inline-flex items-center px-2 transition',
        selectButtonTagDeleteButtonIcon: '',
        selectButtonPlaceholder: 'text-gray-400',
        selectButtonIcon: 'text-gray-600',
        selectButtonClearButton:
          'hover:bg-blue-100 text-gray-600 rounded transition duration-100 ease-in-out',
        selectButtonClearIcon: '',
        dropdown:
          '-mt-1 bg-white border-b border-gray-300 border-l border-r rounded-b shadow-sm',
        dropdownFeedback: 'pb-2 px-3 text-gray-400 text-sm',
        loadingMoreResults: 'pb-2 px-3 text-gray-400 text-sm',
        optionsList: '',
        searchWrapper: 'p-2 placeholder-gray-400',
        searchBox:
          'px-3 py-2 bg-gray-50 text-sm rounded border focus:outline-none focus:shadow-outline border-gray-300',
        optgroup: 'text-gray-400 uppercase text-xs py-1 px-2 font-semibold',
        option: '',
        disabledOption: '',
        highlightedOption: 'bg-blue-100',
        selectedOption:
          'font-semibold bg-gray-500 bg-blue-500 font-semibold text-white',
        selectedHighlightedOption:
          'font-semibold bg-blue-300 bg-blue-600 font-semibold text-white',
        optionContent: 'flex justify-between items-center px-3 py-2',
        optionLabel: '',
        selectedIcon: '',
        enterClass: 'opacity-0',
        enterActiveClass: 'transition ease-out duration-100',
        enterToClass: 'opacity-100',
        leaveClass: 'opacity-100',
        leaveActiveClass: 'transition ease-in duration-75',
        leaveToClass: 'opacity-0',
      },
      variants: {
        danger: {
          selectButton: 'border-red-300 bg-red-50 text-red-900',
          selectButtonPlaceholder: 'text-red-200',
          selectButtonIcon: 'text-red-500',
          selectButtonClearButton: 'hover:bg-red-200 text-red-500',
          dropdown: 'bg-red-50 border-red-300',
        },
        success: {
          selectButton: 'border-green-300 bg-green-50 text-green-900',
          selectButtonIcon: 'text-green-500',
          selectButtonClearButton: 'hover:bg-green-200 text-green-500',
          dropdown: 'bg-green-50 border-green-300',
        },
      },
    },
  },
}

Vue.use(VueTailwind, settings)
