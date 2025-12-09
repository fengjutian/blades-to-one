# ReAct TypeScript Example

## Configuration

This project is configured to use Kimi API by default. See `.env.example` for configuration.

### Setting up Kimi API (Required)

1. Obtain a Kimi API key from [Moonshot AI](https://www.moonshot.cn/)
2. Copy `.env.example` to `.env`
3. Replace `your_kimi_api_key_here` with your actual Kimi API key:

```env
PORT=3000
KIMI_API_KEY=your_actual_kimi_api_key_here
```

### Using OpenAI API (Alternative)

If you prefer to use OpenAI instead of Kimi:

1. Obtain an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Update your `.env` file:

```env
PORT=3000
OPENAI_API_KEY=your_actual_openai_api_key_here
```

Note: Kimi API is prioritized over OpenAI API when both keys are present.

## Running the Application

```bash
npm run dev
# or
pnpm dev
```

The server will start on `http://localhost:3000` by default.