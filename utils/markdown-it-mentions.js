import regexp from 'markdown-it-regexp'

function parser(match) {
  const username = match[1]

  return [`<w-mention username="${username}">@${username}</w-mention>`].join('')
}

export default regexp(/@([\w.-]+)/, parser)
