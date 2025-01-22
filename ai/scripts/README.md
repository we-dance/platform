# Scripts

## Todoist Integration

The `todoist.ts` script allows you to manage your Todoist tasks from the terminal.

### Setup

1. Install dependencies:

```bash
npm install
```

2. Get your Todoist API token:

   - Go to [Todoist Settings](https://app.todoist.com/app/settings/integrations/developer)
   - Scroll down to "API token" section
   - Copy your API token

3. Set up environment variables:

```bash
cp .env.example .env
```

Then edit `.env` and replace `your_api_token_here` with your actual Todoist API token.

### Usage

#### List Tasks

View all your tasks:

```bash
npm run todos:list
```

The output shows:

- All active tasks
- Task priorities (shown as `!` marks, more marks = higher priority)
- Due dates (if set)

Example output:

```
Active Tasks:
------------
[!!!] High priority task (Due: 2024-01-08)
[!!] Medium priority task
[!] Low priority task
[-] No priority task
```

#### Add Tasks

Add a new task:

```bash
npm run todos:add "Task content" ["due date"] [priority]
```

Parameters:

- `"Task content"`: Required. The task description (use quotes if it contains spaces)
- `"due date"`: Optional. Natural language date (e.g., "today", "tomorrow", "next monday")
- `priority`: Optional. Number 1-4 (4 = highest priority)

Examples:

```bash
# Add a simple task
npm run todos:add "Buy groceries"

# Add task with due date
npm run todos:add "Call mom" "tomorrow"

# Add high priority task with due date
npm run todos:add "Finish report" "today" 4
```

### Error Handling

- If the API token is not set, you'll get an error message asking you to set it in the `.env` file
- Network errors and API issues will be caught and displayed with appropriate error messages
